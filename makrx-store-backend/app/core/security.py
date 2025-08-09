"""
Authentication and authorization using Keycloak JWT tokens
JWT validation, role-based access control, and security utilities
"""

import jwt
import httpx
import json
from typing import List, Optional, Dict, Any
from fastapi import HTTPException, status, Depends, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from functools import wraps
import logging
from datetime import datetime, timedelta
import asyncio

from app.core.config import settings

logger = logging.getLogger(__name__)

# JWT token validation
security = HTTPBearer(auto_error=False)

# Cache for JWKS (JSON Web Key Set)
_jwks_cache = {}
_jwks_cache_expiry = None
JWKS_CACHE_DURATION = timedelta(hours=1)

class AuthUser:
    """User information extracted from JWT token"""
    
    def __init__(self, token_payload: Dict[str, Any]):
        self.sub = token_payload.get("sub")  # User ID
        self.email = token_payload.get("email")
        self.name = token_payload.get("name")
        self.preferred_username = token_payload.get("preferred_username")
        self.email_verified = token_payload.get("email_verified", False)
        
        # Extract roles from realm_access
        realm_access = token_payload.get("realm_access", {})
        self.roles = realm_access.get("roles", [])
        
        # Extract scopes
        self.scopes = token_payload.get("scope", "").split()
        
        # Full token payload for additional claims
        self.token_payload = token_payload
    
    def has_role(self, role: str) -> bool:
        """Check if user has a specific role"""
        return role in self.roles
    
    def has_any_role(self, roles: List[str]) -> bool:
        """Check if user has any of the specified roles"""
        return any(role in self.roles for role in roles)
    
    def has_all_roles(self, roles: List[str]) -> bool:
        """Check if user has all of the specified roles"""
        return all(role in self.roles for role in roles)
    
    def has_scope(self, scope: str) -> bool:
        """Check if user has a specific scope"""
        return scope in self.scopes

async def get_jwks() -> Dict[str, Any]:
    """Fetch and cache JWKS from Keycloak"""
    global _jwks_cache, _jwks_cache_expiry
    
    now = datetime.utcnow()
    
    # Return cached JWKS if still valid
    if _jwks_cache and _jwks_cache_expiry and now < _jwks_cache_expiry:
        return _jwks_cache
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(settings.KEYCLOAK_JWKS_URL, timeout=10.0)
            response.raise_for_status()
            
            jwks = response.json()
            
            # Cache the JWKS
            _jwks_cache = jwks
            _jwks_cache_expiry = now + JWKS_CACHE_DURATION
            
            logger.info("JWKS refreshed from Keycloak")
            return jwks
            
    except Exception as e:
        logger.error(f"Failed to fetch JWKS: {e}")
        
        # Return cached JWKS if available, even if expired
        if _jwks_cache:
            logger.warning("Using expired JWKS cache due to fetch failure")
            return _jwks_cache
        
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Unable to verify token: Authentication service unavailable"
        )

async def verify_jwt_token(token: str) -> Dict[str, Any]:
    """Verify and decode JWT token"""
    try:
        # Get JWKS for token verification
        jwks = await get_jwks()
        
        # Decode token header to get kid (key ID)
        unverified_header = jwt.get_unverified_header(token)
        kid = unverified_header.get("kid")
        
        if not kid:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token missing key ID"
            )
        
        # Find the correct key from JWKS
        key = None
        for jwk in jwks.get("keys", []):
            if jwk.get("kid") == kid:
                key = jwt.algorithms.RSAAlgorithm.from_jwk(json.dumps(jwk))
                break
        
        if not key:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token signed with unknown key"
            )
        
        # Verify and decode token
        payload = jwt.decode(
            token,
            key,
            algorithms=["RS256"],
            audience=settings.KEYCLOAK_AUDIENCE,
            issuer=settings.KEYCLOAK_ISSUER,
            options={
                "verify_exp": True,
                "verify_iat": True,
                "verify_aud": True,
                "verify_iss": True
            }
        )
        
        return payload
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired"
        )
    except jwt.InvalidTokenError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {str(e)}"
        )
    except Exception as e:
        logger.error(f"Token verification error: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token verification failed"
        )

async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
) -> Optional[AuthUser]:
    """Get current authenticated user from JWT token (optional)"""
    if not credentials:
        return None
    
    try:
        payload = await verify_jwt_token(credentials.credentials)
        return AuthUser(payload)
    except HTTPException:
        return None

async def get_current_user_required(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> AuthUser:
    """Get current authenticated user from JWT token (required)"""
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required"
        )
    
    payload = await verify_jwt_token(credentials.credentials)
    return AuthUser(payload)

def require_roles(*roles: str):
    """Decorator to require specific roles"""
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Find the current_user parameter
            current_user = None
            for arg in args:
                if isinstance(arg, AuthUser):
                    current_user = arg
                    break
            
            if not current_user:
                for value in kwargs.values():
                    if isinstance(value, AuthUser):
                        current_user = value
                        break
            
            if not current_user:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Authentication required"
                )
            
            if not current_user.has_any_role(list(roles)):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Insufficient permissions. Required roles: {', '.join(roles)}"
                )
            
            return await func(*args, **kwargs)
        return wrapper
    return decorator

def require_all_roles(*roles: str):
    """Decorator to require ALL specified roles"""
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Find the current_user parameter
            current_user = None
            for arg in args:
                if isinstance(arg, AuthUser):
                    current_user = arg
                    break
            
            if not current_user:
                for value in kwargs.values():
                    if isinstance(value, AuthUser):
                        current_user = value
                        break
            
            if not current_user:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Authentication required"
                )
            
            if not current_user.has_all_roles(list(roles)):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Insufficient permissions. Required roles: {', '.join(roles)}"
                )
            
            return await func(*args, **kwargs)
        return wrapper
    return decorator

# Role-based dependency factories
def require_role(role: str):
    """Factory for role-based dependency injection"""
    async def check_role(current_user: AuthUser = Depends(get_current_user_required)):
        if not current_user.has_role(role):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Insufficient permissions. Required role: {role}"
            )
        return current_user
    return check_role

def require_any_role(*roles: str):
    """Factory for multiple role-based dependency injection"""
    async def check_roles(current_user: AuthUser = Depends(get_current_user_required)):
        if not current_user.has_any_role(list(roles)):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Insufficient permissions. Required roles: {', '.join(roles)}"
            )
        return current_user
    return check_roles

# Pre-defined role dependencies
require_admin = require_role("admin")
require_provider = require_role("provider") 
require_superadmin = require_role("superadmin")
require_admin_or_provider = require_any_role("admin", "provider")

async def log_security_event(
    request: Request,
    event_type: str,
    user: Optional[AuthUser] = None,
    details: Optional[Dict[str, Any]] = None
):
    """Log security-related events for audit purposes"""
    event_data = {
        "timestamp": datetime.utcnow().isoformat(),
        "event_type": event_type,
        "ip_address": request.client.host if request.client else "unknown",
        "user_agent": request.headers.get("user-agent", "unknown"),
        "endpoint": str(request.url),
        "method": request.method,
        "user_id": user.sub if user else None,
        "user_email": user.email if user else None,
        "user_roles": user.roles if user else None,
        "details": details or {}
    }
    
    # In production, this would write to a security log or SIEM
    logger.warning(f"Security event: {json.dumps(event_data)}")

# API Key authentication (for service-to-service communication)
async def verify_api_key(api_key: str) -> bool:
    """Verify API key for service-to-service authentication"""
    # This would typically check against a database of API keys
    # For now, we'll use the service token from settings
    return api_key == settings.SERVICE_TOKEN

async def get_api_key_user(
    request: Request,
    api_key: Optional[str] = None
) -> Optional[AuthUser]:
    """Get user from API key authentication"""
    if not api_key:
        # Try to get from header
        api_key = request.headers.get("X-API-Key")
    
    if not api_key:
        return None
    
    if await verify_api_key(api_key):
        # Create a service user
        service_payload = {
            "sub": "service",
            "email": "service@makrx.store", 
            "name": "Service Account",
            "realm_access": {"roles": ["service", "admin"]}
        }
        return AuthUser(service_payload)
    
    return None

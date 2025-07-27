from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import Optional
import jwt
from datetime import datetime

from .database import get_db

security = HTTPBearer()

class CurrentUser:
    def __init__(self, id: str, name: str, email: str, role: str, makerspace_id: str):
        self.id = id
        self.name = name
        self.email = email
        self.role = role
        self.makerspace_id = makerspace_id

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> CurrentUser:
    """Extract and validate current user from JWT token"""
    try:
        # In a real implementation, you would:
        # 1. Decode the JWT token
        # 2. Validate the token signature
        # 3. Check token expiration
        # 4. Fetch user details from database
        
        token = credentials.credentials
        
        # Mock token validation for now
        # payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        # user_id = payload.get("sub")
        
        # Mock user for demonstration
        return CurrentUser(
            id="user123",
            name="John Doe",
            email="john@example.com",
            role="makerspace_admin",
            makerspace_id="makrspace123"
        )
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication failed",
            headers={"WWW-Authenticate": "Bearer"},
        )

def check_permission(user_role: str, permission: str) -> bool:
    """Check if user role has specific permission"""
    
    # Role-based permission matrix based on the user specification
    permissions = {
        "super_admin": {
            "view_inventory": True,
            "add_edit_items": True,
            "issue_items": True,
            "reorder_from_store": True,
            "view_usage_logs": True,
            "link_to_boms": True,
            "delete_items": True,
            # Equipment permissions
            "view_equipment": True,
            "reserve": True,
            "create_equipment": True,
            "maintenance_logs": True,
            "access_control": True,
            "delete_equipment": True
        },
        "makerspace_admin": {
            "view_inventory": True,  # own cave only
            "add_edit_items": True,
            "issue_items": True,
            "reorder_from_store": True,
            "view_usage_logs": True,
            "link_to_boms": True,
            "delete_items": True,
            # Equipment permissions
            "view_equipment": True,  # own cave only
            "reserve": True,
            "create_equipment": True,
            "maintenance_logs": True,
            "access_control": True,
            "delete_equipment": True
        },
        "admin": {
            "view_inventory": True,
            "add_edit_items": False,
            "issue_items": False,
            "reorder_from_store": False,
            "view_usage_logs": False,
            "link_to_boms": False,
            "delete_items": False,
            # Equipment permissions
            "view_equipment": True,
            "reserve": False,
            "create_equipment": False,
            "maintenance_logs": False,
            "access_control": False,
            "delete_equipment": False
        },
        "user": {
            "view_inventory": True,  # read-only
            "add_edit_items": False,
            "issue_items": False,
            "reorder_from_store": False,
            "view_usage_logs": False,
            "link_to_boms": True,  # view-only
            "delete_items": False,
            # Equipment permissions
            "view_equipment": True,
            "reserve": True,
            "create_equipment": False,
            "maintenance_logs": False,
            "access_control": False,
            "delete_equipment": False
        },
        "service_provider": {
            "view_inventory": True,  # own inventory only
            "add_edit_items": True,  # only own items
            "issue_items": True,
            "reorder_from_store": True,
            "view_usage_logs": True,
            "link_to_boms": True,  # for jobs
            "delete_items": True,  # own only
            # Equipment permissions
            "view_equipment": True,  # own only
            "reserve": True,
            "create_equipment": True,  # own only
            "maintenance_logs": True,
            "access_control": True,
            "delete_equipment": True  # own only
        }
    }
    
    role_permissions = permissions.get(user_role, {})
    return role_permissions.get(permission, False)

def require_permission(permission: str):
    """Dependency to require specific permission"""
    def permission_checker(current_user: CurrentUser = Depends(get_current_user)):
        if not check_permission(current_user.role, permission):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Insufficient permissions. Required: {permission}"
            )
        return current_user
    return permission_checker

def require_role(required_roles: list):
    """Dependency to require specific roles"""
    def role_checker(current_user: CurrentUser = Depends(get_current_user)):
        if current_user.role not in required_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Required roles: {', '.join(required_roles)}"
            )
        return current_user
    return role_checker

def require_makerspace_access(item_makerspace_id: str, current_user: CurrentUser) -> bool:
    """Check if user has access to specific makerspace items"""
    # Super admin has access to all makerspaces
    if current_user.role == "super_admin":
        return True
    
    # Other users can only access their own makerspace
    return current_user.makerspace_id == item_makerspace_id

class PermissionChecker:
    """Class for complex permission checking logic"""
    
    def __init__(self, user: CurrentUser):
        self.user = user
    
    def can_modify_item(self, item) -> bool:
        """Check if user can modify a specific item"""
        # Check basic permission
        if not check_permission(self.user.role, "add_edit_items"):
            return False
        
        # Check makerspace access
        if not require_makerspace_access(item.linked_makerspace_id, self.user):
            return False
        
        # Service providers can only modify their own items
        if self.user.role == "service_provider":
            return item.owner_user_id == self.user.id
        
        return True
    
    def can_issue_item(self, item) -> bool:
        """Check if user can issue a specific item"""
        # Check basic permission
        if not check_permission(self.user.role, "issue_items"):
            return False
        
        # Check makerspace access
        if not require_makerspace_access(item.linked_makerspace_id, self.user):
            return False
        
        # Check item access level restriction
        if hasattr(item, 'restricted_access_level') and item.restricted_access_level:
            from .utils.inventory_tools import validate_item_access_level
            return validate_item_access_level(self.user.role, item.restricted_access_level)
        
        return True
    
    def can_delete_item(self, item) -> bool:
        """Check if user can delete a specific item"""
        # Check basic permission
        if not check_permission(self.user.role, "delete_items"):
            return False
        
        # Check makerspace access
        if not require_makerspace_access(item.linked_makerspace_id, self.user):
            return False
        
        # Service providers can only delete their own items
        if self.user.role == "service_provider":
            return item.owner_user_id == self.user.id
        
        return True
    
    def can_view_usage_logs(self, item=None) -> bool:
        """Check if user can view usage logs"""
        # Check basic permission
        if not check_permission(self.user.role, "view_usage_logs"):
            return False
        
        # If checking for specific item, verify makerspace access
        if item and not require_makerspace_access(item.linked_makerspace_id, self.user):
            return False
        
        return True

# Utility function to get permission checker
def get_permission_checker(current_user: CurrentUser = Depends(get_current_user)) -> PermissionChecker:
    """Get permission checker instance for current user"""
    return PermissionChecker(current_user)

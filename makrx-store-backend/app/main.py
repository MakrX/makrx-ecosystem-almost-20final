"""
MakrX Store Backend - FastAPI Application
Main application entry point with comprehensive security middleware and router setup
Implements full security specification with DPDP Act compliance
"""

from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
import time
import uuid
import logging
import asyncio

from app.core.config import settings
from app.core.db import engine, create_tables
from app.routes import auth, catalog, cart, orders, uploads, quotes, admin, webhooks, health, bridge

# Import comprehensive security modules
from app.middleware.api_security import setup_api_security
from app.middleware.observability import ObservabilityMiddleware
from app.core.enhanced_security_auth import enhanced_auth
from app.core.file_security import file_validator, storage_manager
from app.core.payment_security import webhook_verifier, payment_processor
from app.core.data_protection import consent_manager, retention_manager, user_rights_manager
from app.core.security_monitoring import security_logger, security_monitor, performance_monitor
from app.core.operational_security import secrets_manager, mfa_manager, access_control

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='{"timestamp": "%(asctime)s", "level": "%(levelname)s", "message": "%(message)s", "module": "%(name)s"}',
    handlers=[logging.StreamHandler()]
)

logger = logging.getLogger(__name__)

# Create FastAPI app with security configuration
app = FastAPI(
    title="MakrX Store API",
    description="E-commerce and 3D printing services platform with comprehensive security",
    version="1.0.0",
    docs_url="/docs" if settings.ENVIRONMENT != "production" else None,  # Disable docs in production
    redoc_url="/redoc" if settings.ENVIRONMENT != "production" else None,
    openapi_url="/openapi.json" if settings.ENVIRONMENT != "production" else None,
    # Security headers
    swagger_ui_parameters={"defaultModelsExpandDepth": -1} if settings.ENVIRONMENT != "production" else None
)

# Setup comprehensive security middleware
setup_api_security(app)

# Add observability middleware for request tracing and monitoring
app.add_middleware(ObservabilityMiddleware)

# Security-enhanced request processing
@app.middleware("http")
async def security_request_middleware(request: Request, call_next):
    """Enhanced request middleware with security monitoring"""
    request_id = str(uuid.uuid4())
    request.state.request_id = request_id

    # Extract client information for security context
    ip_address = request.client.host if request.client else "unknown"
    user_agent = request.headers.get("User-Agent", "Unknown")

    start_time = time.time()

    try:
        # Log request for security monitoring
        await security_logger.log_security_event(
            event_type="api_request",
            action=f"{request.method} {request.url.path}",
            success=True,
            context={
                "request_id": request_id,
                "ip_address": ip_address,
                "user_agent": user_agent,
                "method": request.method,
                "path": request.url.path
            }
        )

        response = await call_next(request)
        process_time = (time.time() - start_time) * 1000  # Convert to milliseconds

        # Record performance metrics
        await performance_monitor.record_api_metric(
            endpoint=request.url.path,
            method=request.method,
            duration_ms=process_time,
            status_code=response.status_code
        )

        # Add security headers
        response.headers["X-Request-ID"] = request_id
        response.headers["X-Response-Time"] = f"{process_time:.2f}ms"

        return response

    except Exception as e:
        process_time = (time.time() - start_time) * 1000

        # Log security event for failed requests
        await security_logger.log_security_event(
            event_type="api_request",
            action=f"{request.method} {request.url.path}",
            success=False,
            context={
                "request_id": request_id,
                "ip_address": ip_address,
                "user_agent": user_agent,
                "error": str(e)
            }
        )

        # Record failed request metrics
        await performance_monitor.record_api_metric(
            endpoint=request.url.path,
            method=request.method,
            duration_ms=process_time,
            status_code=500
        )

        raise

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    request_id = getattr(request.state, "request_id", "unknown")
    logger.error(
        f'{{"request_id": "{request_id}", "error": "{str(exc)}", '
        f'"error_type": "{type(exc).__name__}", "url": "{request.url}"}}'
    )
    
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "request_id": request_id,
            "message": "An unexpected error occurred"
        }
    )

# Include routers
app.include_router(health.router, prefix="/health", tags=["Health"])
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(catalog.router, prefix="/catalog", tags=["Catalog"])
app.include_router(cart.router, prefix="/cart", tags=["Cart"])
app.include_router(orders.router, prefix="/orders", tags=["Orders"])
app.include_router(uploads.router, prefix="/uploads", tags=["Uploads"])
app.include_router(quotes.router, prefix="/quotes", tags=["Quotes"])
app.include_router(admin.router, prefix="/admin", tags=["Admin"])
app.include_router(webhooks.router, prefix="/webhooks", tags=["Webhooks"])
app.include_router(bridge.router, prefix="/bridge", tags=["Bridge"])

@app.on_event("startup")
async def startup_event():
    """Initialize database and other startup tasks"""
    logger.info("Starting MakrX Store API...")
    
    # Create database tables
    await create_tables()
    
    logger.info("MakrX Store API started successfully")

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup tasks on shutdown"""
    logger.info("Shutting down MakrX Store API...")

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "name": "MakrX Store API",
        "version": "1.0.0",
        "environment": settings.ENVIRONMENT,
        "docs": "/docs",
        "health": "/health"
    }

# Development hot reload
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_config={
            "version": 1,
            "disable_existing_loggers": False,
            "formatters": {
                "default": {
                    "format": '{"timestamp": "%(asctime)s", "level": "%(levelname)s", "message": "%(message)s"}',
                },
            },
            "handlers": {
                "default": {
                    "formatter": "default",
                    "class": "logging.StreamHandler",
                    "stream": "ext://sys.stdout",
                },
            },
            "root": {
                "level": "INFO",
                "handlers": ["default"],
            },
        }
    )

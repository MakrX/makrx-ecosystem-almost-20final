"""
MakrX Store Backend - FastAPI Application
Main application entry point with middleware and router setup
"""

from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
import time
import uuid
import logging

from app.core.config import settings
from app.core.db import engine, create_tables
from app.routes import auth, catalog, cart, orders, uploads, quotes, admin, webhooks, health, bridge

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='{"timestamp": "%(asctime)s", "level": "%(levelname)s", "message": "%(message)s", "module": "%(name)s"}',
    handlers=[logging.StreamHandler()]
)

logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="MakrX Store API",
    description="E-commerce and 3D printing services platform",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# Request ID middleware
@app.middleware("http")
async def add_request_id(request: Request, call_next):
    request_id = str(uuid.uuid4())
    request.state.request_id = request_id
    
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    
    response.headers["X-Request-ID"] = request_id
    response.headers["X-Process-Time"] = str(process_time)
    
    logger.info(
        f'{{"request_id": "{request_id}", "method": "{request.method}", '
        f'"url": "{request.url}", "status_code": {response.status_code}, '
        f'"process_time": {process_time:.4f}}}'
    )
    
    return response

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Trust only specific hosts in production
if settings.ENVIRONMENT == "production":
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=settings.ALLOWED_HOSTS
    )

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

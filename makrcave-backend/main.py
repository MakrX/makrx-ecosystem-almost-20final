from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn

from routes.inventory import router as inventory_router
from routes.equipment import router as equipment_router
from routes.project import router as project_router
from routes.member import router as member_router
from routes.billing import router as billing_router
from routes.analytics import router as analytics_router
from routes.makerspace_settings import router as settings_router
from routes.skill import router as skill_router

# Create FastAPI application
app = FastAPI(
    title="MakrCave Backend API",
    description="Backend API for MakrCave Inventory Management System",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this properly for production
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "type": "server_error"}
    )

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "makrcave-backend"}

# Include routers
app.include_router(inventory_router, prefix="/api/v1")
app.include_router(equipment_router, prefix="/api/v1")
app.include_router(project_router, prefix="/api/v1/projects", tags=["projects"])
app.include_router(member_router, prefix="/api/v1/members", tags=["members"])
app.include_router(billing_router, prefix="/api/v1/billing", tags=["billing"])
app.include_router(analytics_router, prefix="/api/v1")
app.include_router(settings_router, prefix="/api/v1/makerspace")

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "MakrCave Backend API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )

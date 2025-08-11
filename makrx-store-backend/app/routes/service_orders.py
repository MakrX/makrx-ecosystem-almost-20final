#!/usr/bin/env python3
"""
Service Orders Routes - Handle 3D printing service orders and job routing
"""

from fastapi import (
    APIRouter,
    HTTPException,
    Depends,
    BackgroundTasks,
    UploadFile,
    File,
    Request,
    status,
)
from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, or_
from typing import List, Dict, Any, Optional
import httpx
import logging
import os
import json
import io
import trimesh
from uuid import UUID, uuid4
from datetime import datetime, timedelta
from pydantic import BaseModel, Field, EmailStr
from enum import Enum
import redis.asyncio as redis

from ..core.config import settings

from ..core.db import get_db, AsyncSessionLocal
from ..core.storage import upload_file_to_storage, generate_presigned_url
from ..core.payments import PaymentProcessor
from ..models.commerce import Order, OrderItem, Product
from ..schemas import MessageResponse
from ..schemas.commerce import OrderResponse

logger = logging.getLogger(__name__)

# Configuration
MAKRCAVE_API_URL = os.getenv("MAKRCAVE_API_URL", "http://makrcave-backend:8000")
AUTH_SERVICE_URL = os.getenv("AUTH_SERVICE_URL", "http://auth-service:8000")

router = APIRouter(prefix="/service-orders", tags=["3D Printing Service Orders"])

# Redis client for temporary quote storage
redis_client = (
    redis.Redis.from_url(settings.REDIS_URL, decode_responses=True)
    if getattr(settings, "REDIS_URL", None)
    else None
)

# Enums
class ServiceOrderStatus(str, Enum):
    PENDING_QUOTE = "pending_quote"
    QUOTED = "quoted" 
    PAYMENT_PENDING = "payment_pending"
    PAID = "paid"
    DISPATCHED = "dispatched"
    IN_PRODUCTION = "in_production"
    COMPLETED = "completed"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"
    FAILED = "failed"

class JobPriority(str, Enum):
    LOW = "low"
    NORMAL = "normal"
    HIGH = "high"
    URGENT = "urgent"

class PrintMaterial(str, Enum):
    PLA = "pla"
    ABS = "abs"
    PETG = "petg"
    TPU = "tpu"
    WOOD_PLA = "wood_pla"
    CARBON_FIBER = "carbon_fiber"

class PrintQuality(str, Enum):
    DRAFT = "draft"      # 0.3mm
    STANDARD = "standard"  # 0.2mm
    HIGH = "high"        # 0.15mm
    ULTRA = "ultra"      # 0.1mm

# Pydantic Models
class FileAnalysis(BaseModel):
    filename: str
    file_size: int
    dimensions: Dict[str, float]  # {x, y, z} in mm
    volume: float  # cubic cm
    surface_area: float  # square cm
    estimated_print_time: int  # minutes
    estimated_material_weight: float  # grams
    complexity_score: float  # 0-1 scale
    supports_required: bool
    issues: List[str] = []

class ServiceQuoteRequest(BaseModel):
    file_urls: List[str] = Field(..., description="URLs of uploaded 3D files")
    material: PrintMaterial = Field(default=PrintMaterial.PLA)
    quality: PrintQuality = Field(default=PrintQuality.STANDARD)
    quantity: int = Field(default=1, ge=1, le=100)
    priority: JobPriority = Field(default=JobPriority.NORMAL)
    notes: Optional[str] = None
    user_email: EmailStr
    delivery_address: Optional[Dict[str, str]] = None
    preferred_provider: Optional[str] = None

class ServiceQuoteResponse(BaseModel):
    quote_id: str
    total_price: float
    currency: str = "INR"
    estimated_delivery: datetime
    breakdown: Dict[str, Any]
    file_analyses: List[FileAnalysis]
    available_providers: List[Dict[str, Any]]
    expires_at: datetime

class ServiceOrderRequest(BaseModel):
    quote_id: str
    payment_method: str = "stripe"
    billing_address: Dict[str, str]
    shipping_address: Dict[str, str]
    special_instructions: Optional[str] = None

class ServiceOrderResponse(BaseModel):
    order_id: str
    service_order_id: str
    status: ServiceOrderStatus
    total_amount: float
    estimated_delivery: datetime
    tracking_info: Optional[Dict[str, Any]] = None
    provider_info: Optional[Dict[str, Any]] = None
    job_details: Optional[Dict[str, Any]] = None

class ProviderJobRequest(BaseModel):
    job_id: str
    service_order_id: str
    customer_email: str
    files: List[Dict[str, Any]]
    specifications: Dict[str, Any]
    quantity: int
    priority: JobPriority
    estimated_value: float
    deadline: datetime
    special_instructions: Optional[str] = None

# HTTP Client for MakrCave API
async def get_makrcave_client() -> httpx.AsyncClient:
    """Get HTTP client for MakrCave API calls"""
    return httpx.AsyncClient(
        base_url=MAKRCAVE_API_URL,
        timeout=30.0,
        headers={"Content-Type": "application/json"}
    )

@router.post("/upload", response_model=Dict[str, Any])
async def upload_3d_files(
    background_tasks: BackgroundTasks,
    files: List[UploadFile] = File(...),
    db: Session = Depends(get_db)
):
    """
    Upload 3D files for service quote
    
    Handles STL, OBJ, 3MF files and performs basic analysis
    """
    try:
        uploaded_files = []
        
        for file in files:
            # Validate file type
            allowed_extensions = ['.stl', '.obj', '.3mf', '.ply']
            file_extension = os.path.splitext(file.filename)[1].lower()
            
            if file_extension not in allowed_extensions:
                raise HTTPException(
                    status_code=400,
                    detail=f"Unsupported file type: {file_extension}. Allowed: {', '.join(allowed_extensions)}"
                )
            
            # Upload to storage
            file_url = await upload_file_to_storage(
                file.file,
                file.filename,
                "3d-uploads"
            )
            
            # Schedule file analysis
            background_tasks.add_task(
                analyze_3d_file,
                file_url,
                file.filename,
                file.size
            )
            
            uploaded_files.append({
                "filename": file.filename,
                "url": file_url,
                "size": file.size,
                "status": "uploaded"
            })
        
        return {
            "success": True,
            "message": f"Uploaded {len(uploaded_files)} files",
            "files": uploaded_files
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"File upload error: {e}")
        raise HTTPException(status_code=500, detail="File upload failed")

@router.post("/quote", response_model=ServiceQuoteResponse)
async def generate_service_quote(
    quote_request: ServiceQuoteRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """
    Generate quote for 3D printing service
    
    Analyzes files, calculates pricing, and finds available providers
    """
    try:
        quote_id = str(uuid4())
        
        # Analyze uploaded files
        file_analyses = []
        total_volume = 0
        total_print_time = 0
        supports_required = False
        
        for file_url in quote_request.file_urls:
            analysis = await analyze_3d_file_from_url(file_url)
            if analysis:
                file_analyses.append(analysis)
                total_volume += analysis.volume
                total_print_time += analysis.estimated_print_time
                supports_required = supports_required or analysis.supports_required
        
        if not file_analyses:
            raise HTTPException(status_code=400, detail="No valid 3D files found")
        
        # Calculate pricing
        pricing = calculate_service_pricing(
            total_volume,
            total_print_time,
            quote_request.material,
            quote_request.quality,
            quote_request.quantity,
            quote_request.priority,
            supports_required
        )
        
        # Find available providers
        providers = await find_available_providers(
            total_volume,
            quote_request.material,
            quote_request.quality,
            quote_request.quantity,
            quote_request.preferred_provider
        )
        
        if not providers:
            raise HTTPException(
                status_code=404,
                detail="No available providers found for this job"
            )
        
        # Calculate delivery estimate
        base_delivery_days = 3 if quote_request.priority == JobPriority.URGENT else 7
        estimated_delivery = datetime.utcnow() + timedelta(days=base_delivery_days)
        
        # Store quote in cache/database
        quote_data = {
            "quote_id": quote_id,
            "request": quote_request.dict(),
            "file_analyses": [fa.dict() for fa in file_analyses],
            "pricing": pricing,
            "providers": providers,
            "created_at": datetime.utcnow().isoformat(),
            "expires_at": (datetime.utcnow() + timedelta(hours=24)).isoformat()
        }
        
        # TODO: Store in Redis or database
        await store_quote(quote_id, quote_data)
        
        return ServiceQuoteResponse(
            quote_id=quote_id,
            total_price=pricing["total"],
            estimated_delivery=estimated_delivery,
            breakdown=pricing,
            file_analyses=file_analyses,
            available_providers=providers,
            expires_at=datetime.utcnow() + timedelta(hours=24)
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Quote generation error: {e}")
        raise HTTPException(status_code=500, detail="Quote generation failed")

@router.post("/order", response_model=ServiceOrderResponse)
async def create_service_order(
    order_request: ServiceOrderRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """
    Create service order from quote and dispatch to provider
    """
    try:
        # Retrieve quote
        quote_data = await get_quote(order_request.quote_id)
        if not quote_data:
            raise HTTPException(status_code=404, detail="Quote not found or expired")
        
        # Create main order record
        order_id = str(uuid4())
        service_order_id = str(uuid4())
        
        order = Order(
            id=order_id,
            user_email=quote_data["request"]["user_email"],
            status="pending_payment",
            currency="INR",
            subtotal=quote_data["pricing"]["subtotal"],
            tax_amount=quote_data["pricing"]["tax"],
            shipping_amount=quote_data["pricing"]["shipping"],
            total_amount=quote_data["pricing"]["total"],
            billing_address=json.dumps(order_request.billing_address),
            shipping_address=json.dumps(order_request.shipping_address),
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        
        db.add(order)
        
        # Create order item for the service
        order_item = OrderItem(
            id=str(uuid4()),
            order_id=order_id,
            product_name="3D Printing Service",
            quantity=quote_data["request"]["quantity"],
            unit_price=quote_data["pricing"]["base_price"],
            line_total=quote_data["pricing"]["total"],
            metadata=json.dumps({
                "service_order_id": service_order_id,
                "quote_id": order_request.quote_id,
                "material": quote_data["request"]["material"],
                "quality": quote_data["request"]["quality"],
                "files": quote_data["request"]["file_urls"]
            }),
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        
        db.add(order_item)
        db.commit()
        
        # Dispatch job to MakrCave providers
        job_dispatch_result = await dispatch_job_to_providers(
            service_order_id,
            quote_data,
            order_request
        )
        
        if not job_dispatch_result["success"]:
            # Rollback order if job dispatch fails
            db.delete(order_item)
            db.delete(order)
            db.commit()
            raise HTTPException(
                status_code=500,
                detail="Failed to dispatch job to providers"
            )
        
        # Schedule order processing
        background_tasks.add_task(
            process_service_order_payment,
            service_order_id,
            order_id,
            quote_data["pricing"]["total"]
        )
        
        return ServiceOrderResponse(
            order_id=order_id,
            service_order_id=service_order_id,
            status=ServiceOrderStatus.PAYMENT_PENDING,
            total_amount=quote_data["pricing"]["total"],
            estimated_delivery=datetime.fromisoformat(quote_data["request"]["estimated_delivery"]) if "estimated_delivery" in quote_data["request"] else datetime.utcnow() + timedelta(days=7),
            provider_info=job_dispatch_result.get("provider"),
            job_details=job_dispatch_result.get("job_details")
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Service order creation error: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Service order creation failed")

@router.get("/order/{service_order_id}", response_model=ServiceOrderResponse)
async def get_service_order(
    service_order_id: str,
    db: Session = Depends(get_db)
):
    """Get service order status and details"""
    try:
        # Find order by service_order_id in metadata
        order_item = db.query(OrderItem).filter(
            OrderItem.metadata.contains(f'"service_order_id": "{service_order_id}"')
        ).first()
        
        if not order_item:
            raise HTTPException(status_code=404, detail="Service order not found")
        
        order = db.query(Order).filter(Order.id == order_item.order_id).first()
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        metadata = json.loads(order_item.metadata)
        
        # Get job status from MakrCave
        job_status = await get_job_status_from_makrcave(service_order_id)

        estimated_completion = (
            job_status.get("job_details", {}).get("estimated_completion")
            or job_status.get("estimated_completion")
        )
        estimated_delivery = (
            datetime.fromisoformat(estimated_completion)
            if estimated_completion
            else order.created_at + timedelta(days=7)
        )

        return ServiceOrderResponse(
            order_id=str(order.id),
            service_order_id=service_order_id,
            status=ServiceOrderStatus(order.status),
            total_amount=float(order.total_amount),
            estimated_delivery=estimated_delivery,
            tracking_info=job_status.get("tracking_info"),
            provider_info=job_status.get("provider_info"),
            job_details=job_status.get("job_details")
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Service order retrieval error: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve service order")

# Helper Functions

async def analyze_3d_file(file_url: str, filename: str, file_size: int) -> Optional[FileAnalysis]:
    """Analyze a 3D file and return geometry statistics."""
    try:
        # Download the file
        async with httpx.AsyncClient() as client:
            response = await client.get(file_url)
            response.raise_for_status()
            file_bytes = response.content

        file_size = len(file_bytes)
        extension = os.path.splitext(filename)[1].lower().lstrip(".")

        # Load mesh using trimesh
        mesh = trimesh.load(io.BytesIO(file_bytes), file_type=extension)

        # Dimensions in millimeters
        dimensions = {"x": float(mesh.extents[0]),
                      "y": float(mesh.extents[1]),
                      "z": float(mesh.extents[2])}

        # Convert units to cubic/square centimeters
        volume_cm3 = float(mesh.volume) / 1000.0
        surface_area_cm2 = float(mesh.area) / 100.0

        # Simple print time estimation (15 cm^3 per hour)
        print_speed = 15.0  # cm^3/hour
        estimated_print_time = max(1, int((volume_cm3 / print_speed) * 60))

        # Material weight assuming PLA density 1.24 g/cm^3
        density = 1.24
        estimated_weight = volume_cm3 * density

        # Determine support requirements using face normals
        overhang_faces = mesh.face_normals[:, 2] < -0.3
        supports_required = bool(overhang_faces.sum() / len(mesh.face_normals) > 0.1)

        complexity_score = min(1.0, mesh.faces.shape[0] / 10000)

        return FileAnalysis(
            filename=filename,
            file_size=file_size,
            dimensions=dimensions,
            volume=round(volume_cm3, 2),
            surface_area=round(surface_area_cm2, 2),
            estimated_print_time=estimated_print_time,
            estimated_material_weight=round(estimated_weight, 2),
            complexity_score=round(complexity_score, 2),
            supports_required=supports_required,
            issues=[],
        )
    except Exception as e:
        logger.error(f"3D file analysis error: {e}")
        return None

async def analyze_3d_file_from_url(file_url: str) -> Optional[FileAnalysis]:
    """Analyze a 3D file using its URL."""
    try:
        filename = file_url.split('/')[-1]
        return await analyze_3d_file(file_url, filename, 0)
    except Exception as e:
        logger.error(f"File analysis from URL error: {e}")
        return None

def calculate_service_pricing(
    volume: float,
    print_time: int,
    material: PrintMaterial,
    quality: PrintQuality,
    quantity: int,
    priority: JobPriority,
    supports_required: bool
) -> Dict[str, float]:
    """Calculate 3D printing service pricing"""
    
    # Base pricing per cubic cm
    material_rates = {
        PrintMaterial.PLA: 0.50,
        PrintMaterial.ABS: 0.60,
        PrintMaterial.PETG: 0.70,
        PrintMaterial.TPU: 1.20,
        PrintMaterial.WOOD_PLA: 0.80,
        PrintMaterial.CARBON_FIBER: 2.00
    }
    
    # Quality multipliers
    quality_multipliers = {
        PrintQuality.DRAFT: 0.8,
        PrintQuality.STANDARD: 1.0,
        PrintQuality.HIGH: 1.3,
        PrintQuality.ULTRA: 1.6
    }
    
    # Priority multipliers
    priority_multipliers = {
        JobPriority.LOW: 0.9,
        JobPriority.NORMAL: 1.0,
        JobPriority.HIGH: 1.3,
        JobPriority.URGENT: 1.8
    }
    
    # Base calculations
    material_cost = volume * material_rates[material] * quantity
    quality_adjustment = material_cost * (quality_multipliers[quality] - 1)
    priority_adjustment = material_cost * (priority_multipliers[priority] - 1)
    
    # Time-based pricing (per hour)
    time_cost = (print_time / 60) * 15.0 * quantity  # $15/hour
    
    # Support cost
    support_cost = volume * 0.20 * quantity if supports_required else 0
    
    # Setup fee
    setup_fee = 5.0 if quantity == 1 else 5.0 + (quantity - 1) * 1.0
    
    subtotal = material_cost + quality_adjustment + priority_adjustment + time_cost + support_cost + setup_fee
    
    # Quantity discounts
    if quantity >= 10:
        subtotal *= 0.9  # 10% discount
    elif quantity >= 5:
        subtotal *= 0.95  # 5% discount
    
    # Calculate tax and shipping
    tax_rate = 0.08  # 8% tax
    tax = subtotal * tax_rate
    
    shipping = 10.0 if priority != JobPriority.URGENT else 25.0
    
    total = subtotal + tax + shipping
    
    return {
        "base_price": round(material_cost, 2),
        "material_cost": round(material_cost, 2),
        "quality_adjustment": round(quality_adjustment, 2),
        "priority_adjustment": round(priority_adjustment, 2),
        "time_cost": round(time_cost, 2),
        "support_cost": round(support_cost, 2),
        "setup_fee": round(setup_fee, 2),
        "subtotal": round(subtotal, 2),
        "tax": round(tax, 2),
        "shipping": round(shipping, 2),
        "total": round(total, 2)
    }

async def find_available_providers(
    volume: float,
    material: PrintMaterial,
    quality: PrintQuality,
    quantity: int,
    preferred_provider: Optional[str] = None
) -> List[Dict[str, Any]]:
    """Find available providers from MakrCave network"""
    try:
        async with get_makrcave_client() as client:
            search_params = {
                "material": material.value,
                "quality": quality.value,
                "volume": volume,
                "quantity": quantity
            }
            
            if preferred_provider:
                search_params["provider_id"] = preferred_provider
            
            response = await client.get("/api/v1/providers/search", params=search_params)
            
            if response.status_code == 200:
                return response.json().get("providers", [])
            else:
                # Return mock providers for development
                return [
                    {
                        "id": "provider_1",
                        "name": "TechMaker Hub",
                        "location": "San Francisco, CA",
                        "rating": 4.8,
                        "estimated_delivery": 3,
                        "capabilities": [material.value],
                        "queue_length": 2
                    },
                    {
                        "id": "provider_2", 
                        "name": "Rapid Prototypes Inc",
                        "location": "Austin, TX",
                        "rating": 4.6,
                        "estimated_delivery": 5,
                        "capabilities": [material.value],
                        "queue_length": 5
                    }
                ]
                
    except Exception as e:
        logger.error(f"Provider search error: {e}")
        return []

async def dispatch_job_to_providers(
    service_order_id: str,
    quote_data: Dict[str, Any],
    order_request: ServiceOrderRequest
) -> Dict[str, Any]:
    """Dispatch job to MakrCave provider network"""
    try:
        job_id = str(uuid4())
        
        # Prepare job request
        job_request = ProviderJobRequest(
            job_id=job_id,
            service_order_id=service_order_id,
            customer_email=quote_data["request"]["user_email"],
            files=quote_data["request"]["file_urls"],
            specifications={
                "material": quote_data["request"]["material"],
                "quality": quote_data["request"]["quality"],
                "priority": quote_data["request"]["priority"],
                "supports_required": any(fa["supports_required"] for fa in quote_data["file_analyses"]),
                "special_instructions": order_request.special_instructions
            },
            quantity=quote_data["request"]["quantity"],
            priority=JobPriority(quote_data["request"]["priority"]),
            estimated_value=quote_data["pricing"]["total"],
            deadline=datetime.utcnow() + timedelta(days=7)
        )
        
        async with get_makrcave_client() as client:
            response = await client.post(
                "/api/v1/jobs/dispatch",
                json=job_request.dict()
            )
            
            if response.status_code in [200, 201]:
                job_data = response.json()
                return {
                    "success": True,
                    "job_id": job_id,
                    "provider": job_data.get("assigned_provider"),
                    "job_details": job_data
                }
            else:
                logger.error(f"Job dispatch failed: {response.status_code} - {response.text}")
                return {"success": False, "error": "Job dispatch failed"}
                
    except Exception as e:
        logger.error(f"Job dispatch error: {e}")
        return {"success": False, "error": str(e)}

async def get_job_status_from_makrcave(service_order_id: str) -> Dict[str, Any]:
    """Get job status from MakrCave"""
    try:
        async with get_makrcave_client() as client:
            response = await client.get(f"/api/v1/jobs/by-service-order/{service_order_id}")
            
            if response.status_code == 200:
                return response.json()
            else:
                return {"status": "unknown"}
                
    except Exception as e:
        logger.error(f"Job status retrieval error: {e}")
        return {"status": "error", "error": str(e)}

async def store_quote(quote_id: str, quote_data: Dict[str, Any]):
    """Store quote data (Redis/database)"""
    if not redis_client:
        return
    try:
        key = f"service_quote:{quote_id}"
        ttl = 24 * 60 * 60  # 24 hours
        await redis_client.setex(key, ttl, json.dumps(quote_data))
    except Exception as e:
        logger.error(f"Failed to store quote {quote_id}: {e}")

async def get_quote(quote_id: str) -> Optional[Dict[str, Any]]:
    """Retrieve quote data"""
    if not redis_client:
        return None
    try:
        key = f"service_quote:{quote_id}"
        data = await redis_client.get(key)
        if not data:
            return None

        quote_data = json.loads(data)
        expires_at = quote_data.get("expires_at")
        if expires_at:
            try:
                if datetime.utcnow() > datetime.fromisoformat(expires_at):
                    await redis_client.delete(key)
                    return None
            except Exception:
                pass

        return quote_data
    except Exception as e:
        logger.error(f"Failed to get quote {quote_id}: {e}")
        return None

async def process_service_order_payment(
    service_order_id: str,
    order_id: str,
    amount: float
):
    """Process payment for service order"""
    logger.info(
        f"Processing payment for service order {service_order_id}: Rs.{amount}"
    )

    async with AsyncSessionLocal() as db:
        try:
            order = await db.get(Order, order_id)
            if not order:
                logger.error(f"Order {order_id} not found for payment")
                return

            # Determine payment provider
            provider = getattr(order, "payment_method", None) or "stripe"
            metadata = {"order_id": str(order_id), "service_order_id": service_order_id}

            if provider == "stripe":
                payment = await PaymentProcessor.create_stripe_payment_intent(
                    amount=amount,
                    currency=getattr(order, "currency", "INR"),
                    customer_email=getattr(order, "email", None),
                    metadata=metadata,
                )

                order.payment_id = payment["payment_intent_id"]
                order.payment_status = payment.get("status", "pending")
                order.payment_method = "stripe"
                if payment.get("status") == "succeeded":
                    order.status = "paid"
                    order.paid_at = datetime.utcnow()
                else:
                    order.status = "payment_pending"

            elif provider == "razorpay":
                payment = await PaymentProcessor.create_razorpay_order(
                    amount=amount,
                    currency=getattr(order, "currency", "INR"),
                    customer_email=getattr(order, "email", None),
                    metadata=metadata,
                )

                order.payment_id = payment["order_id"]
                order.payment_status = payment.get("status", "created")
                order.payment_method = "razorpay"
                if payment.get("status") == "paid":
                    order.status = "paid"
                    order.paid_at = datetime.utcnow()
                else:
                    order.status = "payment_pending"
            else:
                logger.error(f"Unsupported payment provider: {provider}")
                order.payment_status = "failed"
                order.status = "failed"

            await db.commit()
        except Exception as e:
            logger.error(f"Payment processing failed for order {order_id}: {e}")
            await db.rollback()
            try:
                order = await db.get(Order, order_id)
                if order:
                    order.payment_status = "failed"
                    order.status = "failed"
                    await db.commit()
            except Exception:
                pass


@router.post("/webhook/stripe", response_model=MessageResponse)
async def service_order_stripe_webhook(
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    """Handle Stripe webhook events for service orders"""
    payload = await request.body()
    signature = request.headers.get("stripe-signature", "")

    event = await PaymentProcessor.verify_stripe_webhook(
        payload, signature, settings.STRIPE_WEBHOOK_SECRET
    )
    if not event:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid signature"
        )

    event_type = event.get("type", "")
    logger.info(f"Processing Stripe webhook: {event_type}")

    if event_type == "payment_intent.succeeded":
        payment_intent = event["data"]["object"]
        order_id = payment_intent.get("metadata", {}).get("order_id")
        if order_id:
            order = await db.get(Order, order_id)
            if order:
                order.status = "paid"
                order.payment_status = "completed"
                order.paid_at = datetime.utcnow()
                order.payment_id = payment_intent["id"]
                await db.commit()
    elif event_type == "payment_intent.payment_failed":
        payment_intent = event["data"]["object"]
        order_id = payment_intent.get("metadata", {}).get("order_id")
        if order_id:
            order = await db.get(Order, order_id)
            if order:
                order.payment_status = "failed"
                order.status = "failed"
                await db.commit()

    return MessageResponse(message=f"Stripe webhook {event_type} processed successfully")


@router.post("/webhook/razorpay", response_model=MessageResponse)
async def service_order_razorpay_webhook(
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    """Handle Razorpay webhook events for service orders"""
    payload = await request.body()
    signature = request.headers.get("x-razorpay-signature", "")

    event = await PaymentProcessor.verify_razorpay_webhook(
        payload, signature, settings.RAZORPAY_WEBHOOK_SECRET
    )
    if not event:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid signature"
        )

    event_type = event.get("event", "")
    logger.info(f"Processing Razorpay webhook: {event_type}")

    if event_type == "payment.captured":
        payment = event["payload"]["payment"]["entity"]
        order_id = payment.get("notes", {}).get("order_id")
        if order_id:
            order = await db.get(Order, order_id)
            if order:
                order.status = "paid"
                order.payment_status = "completed"
                order.paid_at = datetime.utcnow()
                order.payment_id = payment["id"]
                await db.commit()
    elif event_type == "payment.failed":
        payment = event["payload"]["payment"]["entity"]
        order_id = payment.get("notes", {}).get("order_id")
        if order_id:
            order = await db.get(Order, order_id)
            if order:
                order.payment_status = "failed"
                order.status = "failed"
                await db.commit()

    return MessageResponse(
        message=f"Razorpay webhook {event_type} processed successfully"
    )

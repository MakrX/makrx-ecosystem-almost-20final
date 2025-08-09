"""Webhook API routes"""
from fastapi import APIRouter
from app.schemas import MessageResponse

router = APIRouter()

@router.post("/stripe", response_model=MessageResponse)
async def stripe_webhook():
    return MessageResponse(message="Stripe webhook - implementation needed")

@router.post("/razorpay", response_model=MessageResponse) 
async def razorpay_webhook():
    return MessageResponse(message="Razorpay webhook - implementation needed")

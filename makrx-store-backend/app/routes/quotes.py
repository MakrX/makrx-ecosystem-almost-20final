"""Quote API routes"""
from fastapi import APIRouter
from app.schemas import MessageResponse

router = APIRouter()

@router.post("/", response_model=MessageResponse)
async def create_quote():
    return MessageResponse(message="Quote endpoint - implementation needed")

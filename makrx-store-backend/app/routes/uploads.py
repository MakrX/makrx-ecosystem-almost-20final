"""Upload API routes"""
from fastapi import APIRouter
from app.schemas import MessageResponse

router = APIRouter()

@router.post("/sign", response_model=MessageResponse)
async def create_upload_url():
    return MessageResponse(message="Upload endpoint - implementation needed")

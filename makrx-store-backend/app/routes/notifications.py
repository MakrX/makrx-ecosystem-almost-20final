"""Notification settings API routes"""

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Dict
from pathlib import Path
import json

from app.core.security import get_current_user
from app.schemas import MessageResponse

router = APIRouter()

DATA_FILE = Path(__file__).parent.parent / "data" / "notification_settings.json"

class NotificationSettings(BaseModel):
    email_notifications: bool = True
    push_notifications: bool = False
    sms_notifications: bool = False
    marketing_emails: bool = False
    order_updates: bool = True
    product_updates: bool = True


def _load_store() -> Dict[str, Dict]:
    if DATA_FILE.exists():
        try:
            return json.loads(DATA_FILE.read_text())
        except json.JSONDecodeError:
            return {}
    return {}


def _save_store(store: Dict[str, Dict]) -> None:
    DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
    DATA_FILE.write_text(json.dumps(store))


@router.get("/notifications", response_model=NotificationSettings)
async def get_settings(user_id: str = Depends(get_current_user)):
    store = _load_store()
    data = store.get(user_id)
    if not data:
        return NotificationSettings()
    return NotificationSettings(**data)


@router.put("/notifications", response_model=MessageResponse)
async def update_settings(
    settings: NotificationSettings,
    user_id: str = Depends(get_current_user),
):
    store = _load_store()
    store[user_id] = settings.dict()
    _save_store(store)
    return MessageResponse(message="Settings updated")

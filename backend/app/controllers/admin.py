from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models import User, UserSettings

router = APIRouter(prefix="/admin", tags=["Admin"])

#What data to send to frontend
from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional

class UserResponse(BaseModel):
    id: UUID
    email: str
    display_name: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True

class UserSettingsResponse(BaseModel):
    user_id: UUID
    theme: str
    units: str
    notifications: bool
    
    class Config:
        from_attributes = True

@router.get("/users", response_model=list[UserResponse])
def get_all_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return users

@router.get("/user-settings", response_model=list[UserSettingsResponse])
def get_all_user_settings(db: Session = Depends(get_db)):
    settings = db.query(UserSettings).all()
    return settings
#Schema setup and definition for JSON

from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserRegister(BaseModel):
    email: EmailStr
    password: str
    display_name: str


class OAuthLogin(BaseModel):
    email: EmailStr
    display_name: str
    avatar_url: Optional[str] = None
    provider: str = "google"
    provider_id: Optional[str] = None


class UserResponse(BaseModel):
    id: str
    email: str
    display_name: Optional[str] = None
    avatar_url: Optional[str] = None

    class Config:
        from_attributes = True

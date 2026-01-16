#Schemas for the database
#Takes the validated data from schemas.py and converts to SQL to send to db

from sqlalchemy import Column, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.core.database import Base

class User(Base):
    __tablename__ = "users"
    __table_args__ = {"schema": "public"}

    #Match the Supabase Auth ID
    id = Column(UUID(as_uuid=True), primary_key=True)
    email = Column(String)
    display_name = Column(String)
    avatar_url = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    #Relationship
    settings = relationship("UserSettings", back_populates="user", uselist=False)

class UserSettings(Base):
    __tablename__ = "user_settings"
    __table_args__  = {"schema": "public"}

    user_id = Column(UUID(as_uuid=True), ForeignKey("public.users.id"), primary_key=True)
    theme = Column(String, default="dark")
    units = Column(String, default="metric")
    notifications = Column(Boolean, default=True)

    user = relationship("User", back_populates="settings")
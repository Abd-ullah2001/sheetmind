from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    name: Optional[str] = None
    avatar_url: Optional[str] = None
    provider: str

class UserCreate(UserBase):
    pass

class User(UserBase):
    id: str
    created_at: datetime
    last_login: datetime

    class Config:
        from_attributes = True

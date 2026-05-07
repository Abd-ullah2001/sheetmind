from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime
from enum import Enum

class FileType(str, Enum):
    EXCEL_LOCAL = "excel_local"
    EXCEL_ONLINE = "excel_online"
    GOOGLE_SHEETS = "google_sheets"

class FileBase(BaseModel):
    display_name: str
    file_type: FileType
    external_id: Optional[str] = None
    metadata: Dict[str, Any] = {}

class FileCreate(FileBase):
    user_id: str
    s3_key: Optional[str] = None

class File(FileBase):
    id: str
    user_id: str
    s3_key: Optional[str] = None
    last_synced_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True

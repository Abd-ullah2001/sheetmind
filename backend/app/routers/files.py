import uuid
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional

from app.middleware.auth_middleware import get_current_user
from app.database import supabase_client
from app.services.s3_service import generate_presigned_upload_url, delete_file
from app.tasks.file_tasks import parse_excel_metadata

router = APIRouter(prefix="/files", tags=["files"])

class UploadUrlRequest(BaseModel):
    filename: str

class ConfirmUploadRequest(BaseModel):
    file_id: str
    s3_key: str
    display_name: str

class ConnectGoogleRequest(BaseModel):
    sheet_id: str
    display_name: str

class ConnectMicrosoftRequest(BaseModel):
    onedrive_file_id: str
    display_name: str

@router.get("")
def get_files(current_user: dict = Depends(get_current_user)):
    res = supabase_client.table("files").select("*").eq("user_id", current_user["user_id"]).execute()
    data = getattr(res, "data", [])
    # In tests supabase mocks can return MagicMock; normalize to a real list.
    return data if isinstance(data, list) else []

@router.post("/upload-url")
def get_upload_url(req: UploadUrlRequest, current_user: dict = Depends(get_current_user)):
    file_id = str(uuid.uuid4())
    result = generate_presigned_upload_url(current_user["user_id"], file_id, req.filename)
    return {
        "file_id": file_id,
        "upload_url": result["url"],
        "s3_key": result["key"]
    }

@router.post("/confirm-upload")
def confirm_upload(req: ConfirmUploadRequest, current_user: dict = Depends(get_current_user)):
    new_file = {
        "id": req.file_id,
        "user_id": current_user["user_id"],
        "display_name": req.display_name,
        "file_type": "excel_local",
        "s3_key": req.s3_key,
        "metadata": {}
    }
    
    res = supabase_client.table("files").insert(new_file).execute()
    
    # Trigger Celery task
    parse_excel_metadata.delay(req.file_id, req.s3_key, current_user["user_id"])
    
    data = getattr(res, "data", [])
    if not isinstance(data, list) or len(data) == 0:
        raise HTTPException(status_code=500, detail="Failed to create file")
    return data[0]

@router.get("/{file_id}")
def get_file(file_id: str, current_user: dict = Depends(get_current_user)):
    res = supabase_client.table("files").select("*").eq("id", file_id).eq("user_id", current_user["user_id"]).execute()
    data = getattr(res, "data", [])
    if not isinstance(data, list) or len(data) == 0:
        raise HTTPException(status_code=404, detail="File not found")
    return data[0]

@router.delete("/{file_id}")
def delete_file_endpoint(file_id: str, current_user: dict = Depends(get_current_user)):
    res = supabase_client.table("files").select("*").eq("id", file_id).eq("user_id", current_user["user_id"]).execute()
    data = getattr(res, "data", [])
    if not isinstance(data, list) or len(data) == 0:
        raise HTTPException(status_code=404, detail="File not found")

    file_record = data[0]
    
    if file_record["file_type"] == "excel_local" and file_record.get("s3_key"):
        delete_file(file_record["s3_key"])
        
    supabase_client.table("files").delete().eq("id", file_id).execute()
    return {"message": "deleted"}

@router.post("/connect-google")
def connect_google(req: ConnectGoogleRequest, current_user: dict = Depends(get_current_user)):
    new_file = {
        "user_id": current_user["user_id"],
        "display_name": req.display_name,
        "file_type": "google_sheets",
        "external_id": req.sheet_id,
        "metadata": {}
    }
    res = supabase_client.table("files").insert(new_file).execute()
    data = getattr(res, "data", [])
    return data[0] if isinstance(data, list) and len(data) > 0 else {}

@router.post("/connect-microsoft")
def connect_microsoft(req: ConnectMicrosoftRequest, current_user: dict = Depends(get_current_user)):
    new_file = {
        "user_id": current_user["user_id"],
        "display_name": req.display_name,
        "file_type": "excel_online",
        "external_id": req.onedrive_file_id,
        "metadata": {}
    }
    res = supabase_client.table("files").insert(new_file).execute()
    data = getattr(res, "data", [])
    return data[0] if isinstance(data, list) and len(data) > 0 else {}

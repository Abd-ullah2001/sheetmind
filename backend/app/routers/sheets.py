from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Dict, Any

from app.middleware.auth_middleware import get_current_user
import app.database
from app.services import excel_service
from app.services import sheets_service
from app.services.auth_service import get_oauth_tokens

router = APIRouter(prefix="/sheets", tags=["sheets"])


class OperationRequest(BaseModel):
    operation_type: str
    parameters: Dict[str, Any]


def _get_file_and_routing_context(file_id: str, user_id: str):
    res = (
        app.database.supabase_client.table("files")
        .select("*")
        .eq("id", file_id)
        .eq("user_id", user_id)
        .execute()
    )
    if not res.data:
        raise HTTPException(status_code=404, detail="File not found")

    file_record = res.data[0]

    if file_record["file_type"] == "google_sheets":
        try:
            access_token = get_oauth_tokens(user_id, "google")
        except Exception:
            raise HTTPException(
                status_code=401, detail="Google account not connected or token expired"
            )
        return {
            "type": "google",
            "identifier": file_record["external_id"],
            "access_token": access_token,
        }
    elif file_record["file_type"] == "excel_local":
        return {"type": "excel", "identifier": file_record["s3_key"]}
    else:
        raise HTTPException(status_code=400, detail="Unsupported file type")


@router.get("/{file_id}/info")
def get_sheet_info(file_id: str, current_user: dict = Depends(get_current_user)):
    ctx = _get_file_and_routing_context(file_id, current_user["user_id"])
    if ctx["type"] == "google":
        res = sheets_service.get_workbook_info(ctx["identifier"], ctx["access_token"])
    else:
        res = excel_service.get_workbook_info(ctx["identifier"])

    if not res["success"]:
        raise HTTPException(status_code=400, detail=res["error"])
    return res["result"]


@router.get("/{file_id}/range")
def get_sheet_range(
    file_id: str,
    sheet_name: str,
    range: str,
    current_user: dict = Depends(get_current_user),
):
    ctx = _get_file_and_routing_context(file_id, current_user["user_id"])
    if ctx["type"] == "google":
        res = sheets_service.read_range(
            ctx["identifier"], ctx["access_token"], sheet_name, range
        )
    else:
        res = excel_service.read_range(ctx["identifier"], sheet_name, range)

    if not res["success"]:
        raise HTTPException(status_code=400, detail=res["error"])
    return res["result"]


@router.post("/{file_id}/operation")
def run_operation(
    file_id: str, req: OperationRequest, current_user: dict = Depends(get_current_user)
):
    ctx = _get_file_and_routing_context(file_id, current_user["user_id"])

    op_name = req.operation_type
    params = req.parameters

    # Simple dispatcher
    if ctx["type"] == "google":
        func = getattr(sheets_service, op_name, None)
        if func:
            res = func(ctx["identifier"], ctx["access_token"], **params)
        else:
            raise HTTPException(
                status_code=400, detail="Operation not supported for Google Sheets"
            )
    else:
        func = getattr(excel_service, op_name, None)
        if func:
            res = func(ctx["identifier"], **params)
        else:
            raise HTTPException(
                status_code=400, detail="Operation not supported for Excel"
            )

    if not res["success"]:
        raise HTTPException(status_code=400, detail=res["error"])
    return res["result"]

from fastapi import APIRouter, Depends, Query
from app.middleware.auth_middleware import get_current_user
from app.services.log_service import get_logs, get_log_by_id

router = APIRouter(prefix="/logs", tags=["logs"])

@router.get("/")
async def list_logs(
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_user: dict = Depends(get_current_user)
):
    """
    Returns paginated query logs for the current user.
    """
    res = get_logs(user_id=current_user["user_id"], limit=limit, offset=offset)
    return res.data

@router.get("/{log_id}")
async def get_log(log_id: str, current_user: dict = Depends(get_current_user)):
    """
    Returns full details for a single log entry.
    """
    res = get_log_by_id(log_id=log_id, user_id=current_user["user_id"])
    return res.data

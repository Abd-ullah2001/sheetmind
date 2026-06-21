from fastapi import APIRouter, Depends, HTTPException
from typing import Optional
from app.middleware.auth_middleware import get_current_user
from app.services.agent_service import run_agent_query
from app.models.query import QueryRequest, QueryResponse
import app.database

router = APIRouter(prefix="/agent", tags=["agent"])

@router.post("/query", response_model=QueryResponse)
async def query_agent(request: QueryRequest, current_user: dict = Depends(get_current_user)):
    """
    Runs a natural language query against a spreadsheet file.
    """
    try:
        result = run_agent_query(
            user_id=current_user["user_id"],
            file_id=request.file_id,
            query=request.query,
            session_id=request.session_id if request.session_id else None,
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/sessions/{file_id}")
async def get_sessions(file_id: str, current_user: dict = Depends(get_current_user)):
    """
    Returns the conversation history for a specific file.
    """
    res = app.database.supabase_client.table("agent_sessions") \
        .select("*") \
        .eq("user_id", current_user["user_id"]) \
        .eq("file_id", file_id) \
        .order("updated_at", desc=True) \
        .execute()
    data = getattr(res, "data", [])
    return data if isinstance(data, list) else []

@router.delete("/sessions/{file_id}")
async def clear_sessions(file_id: str, current_user: dict = Depends(get_current_user)):
    """
    Clears the conversation history for a specific file.
    """
    app.database.supabase_client.table("agent_sessions") \
        .delete() \
        .eq("user_id", current_user["user_id"]) \
        .eq("file_id", file_id) \
        .execute()
    return {"message": "Session history cleared"}

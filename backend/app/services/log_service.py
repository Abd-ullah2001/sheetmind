from typing import List, Optional
from datetime import datetime
import app.database

def log_query(
    user_id: str,
    file_id: Optional[str],
    raw_query: str,
    tools_called: List[str],
    llm_response: str,
    tokens_used: int = 0,
    latency_ms: int = 0,
    status: str = "success",
    error_message: Optional[str] = None
):
    """
    Inserts a row into the query_logs table.
    """
    log_data = {
        "user_id": user_id,
        "file_id": file_id,
        "raw_query": raw_query,
        "tools_called": tools_called,
        "llm_response": llm_response,
        "tokens_used": tokens_used,
        "latency_ms": latency_ms,
        "status": status,
        "error_message": error_message,
        "created_at": datetime.now().isoformat()
    }
    
    return app.database.supabase_client.table("query_logs").insert(log_data).execute()

def get_logs(user_id: str, limit: int = 20, offset: int = 0):
    """
    Returns paginated query logs for a user.
    """
    return app.database.supabase_client.table("query_logs") \
        .select("*, files(display_name)") \
        .eq("user_id", user_id) \
        .order("created_at", desc=True) \
        .range(offset, offset + limit - 1) \
        .execute()

def get_log_by_id(log_id: str, user_id: str):
    """
    Returns a single log entry.
    """
    return app.database.supabase_client.table("query_logs") \
        .select("*, files(*)") \
        .eq("id", log_id) \
        .eq("user_id", user_id) \
        .single() \
        .execute()

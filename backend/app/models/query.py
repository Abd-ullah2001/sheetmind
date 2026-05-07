from pydantic import BaseModel
from typing import Optional, List, Any, Dict

class QueryRequest(BaseModel):
    file_id: str
    query: str
    session_id: Optional[str] = None

class QueryResponse(BaseModel):
    response: str
    tools_called: List[str]
    session_id: str
    tokens_used: int
    cached: bool = False
    status: str = "success"
    error: Optional[str] = None

class SessionResponse(BaseModel):
    id: str
    user_id: str
    file_id: str
    conversation: List[Dict[str, Any]]
    created_at: Any
    updated_at: Any

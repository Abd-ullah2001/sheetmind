import hashlib
import json
import uuid
import time
import datetime
from langchain_openai import ChatOpenAI
from langgraph.prebuilt import create_react_agent

from app.config import get_settings
from app.database import supabase_client
from app.redis_client import redis_client
from app.tools import ALL_TOOLS
from app.services.log_service import log_query

settings = get_settings()

def get_llm():
    return ChatOpenAI(
        base_url=settings.nvidia_base_url,
        api_key=settings.nvidia_api_key,
        model=settings.nvidia_model,
        temperature=0
    )

def _invalidate_file_cache(user_id: str, file_id: str):
    # Invalidate all keys matching agent:{user_id}:{file_id}:*
    pattern = f"agent:{user_id}:{file_id}:*"
    cursor = 0
    while True:
        cursor, keys = redis_client.scan(cursor=cursor, match=pattern, count=100)
        if keys:
            redis_client.delete(*keys)
        if cursor == 0:
            break

def run_agent_query(user_id: str, file_id: str, query: str, session_id: str = None):
    start_time = time.time()
    
    # 1. Fetch conversation history
    if not session_id:
        session_id = str(uuid.uuid4())
        
    res = supabase_client.table("agent_sessions").select("*").eq("id", session_id).execute()
    
    if res.data:
        history = res.data[0].get("conversation", [])
    else:
        history = []
        new_session = {
            "id": session_id,
            "user_id": user_id,
            "file_id": file_id,
            "conversation": []
        }
        supabase_client.table("agent_sessions").insert(new_session).execute()
        
    # Check cache
    query_hash = hashlib.sha256(query.encode()).hexdigest()
    cache_key = f"agent:{user_id}:{file_id}:{query_hash}"
    
    cached_val = redis_client.get(cache_key)
    if cached_val:
        data = json.loads(cached_val)
        data["cached"] = True
        return data

    # 3. Inject file context
    file_res = supabase_client.table("files").select("*").eq("id", file_id).execute()
    if not file_res.data:
        raise ValueError("File not found")
        
    file_record = file_res.data[0]
    file_type = file_record.get("file_type")
    metadata = file_record.get("metadata", {})
    sheet_names = metadata.get("sheet_names", [])
    
    system_prompt = f"""You are a spreadsheet assistant. The user is working on a file called {file_record.get('display_name')}.
It is a {file_type} file with the following sheets: {sheet_names}.
Use the available tools to fulfill the user's request.
Always confirm what you did after completing each operation.
When calling tools, always provide user_id='{user_id}' and file_id='{file_id}'."""

    # 2. Build LangGraph agent
    llm = get_llm()
    agent = create_react_agent(llm, tools=ALL_TOOLS, state_modifier=system_prompt)
    
    # 4. Run agent
    try:
        response = agent.invoke({"messages": [("human", query)]})
    except Exception as e:
        latency = int((time.time() - start_time) * 1000)
        log_query(
            user_id=user_id,
            file_id=file_id,
            raw_query=query,
            tools_called=[],
            llm_response="",
            latency_ms=latency,
            status="error",
            error_message=str(e)
        )
        return {
            "response": f"Failed to execute query: {str(e)}",
            "tools_called": [],
            "session_id": session_id,
            "tokens_used": 0,
            "status": "error",
            "error": str(e)
        }
        
    output_text = response["messages"][-1].content
    tools_called = []
    for m in response["messages"]:
        if m.type == "tool":
            tools_called.append(m.name)
    
    latency = int((time.time() - start_time) * 1000)
    
    # 6. Update session
    history.append({"role": "user", "content": query})
    history.append({"role": "assistant", "content": output_text})
    supabase_client.table("agent_sessions").update({
        "conversation": history,
        "updated_at": "now()"
    }).eq("id", session_id).execute()
    
    # Log the query
    log_query(
        user_id=user_id,
        file_id=file_id,
        raw_query=query,
        tools_called=tools_called,
        llm_response=output_text,
        latency_ms=latency,
        status="success"
    )
    
    result_data = {
        "response": output_text,
        "tools_called": tools_called,
        "session_id": session_id,
        "tokens_used": 0, # Placeholder
        "status": "success",
        "error": None
    }
    
    # Store in cache
    redis_client.set(cache_key, json.dumps(result_data), ex=300)
    
    # If tools were called that might modify the file, invalidate cache
    # For now, invalidate on every non-cached query to be safe
    _invalidate_file_cache(user_id, file_id)
    
    return result_data

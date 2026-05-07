from typing import Callable, Any, Type, Optional
from langchain_core.tools import StructuredTool
from pydantic.v1 import BaseModel, Field

from app.routers.sheets import _get_file_and_routing_context
from app.services import excel_service
from app.services import sheets_service

def execute_tool_operation(user_id: str, file_id: str, op_name: str, **kwargs):
    ctx = _get_file_and_routing_context(file_id, user_id)
    
    if ctx["type"] == "google":
        func = getattr(sheets_service, op_name, None)
        if func:
            res = func(ctx["identifier"], ctx["access_token"], **kwargs)
        else:
            return f"Operation {op_name} not supported for Google Sheets"
    else:
        func = getattr(excel_service, op_name, None)
        if func:
            res = func(ctx["identifier"], **kwargs)
        else:
            return f"Operation {op_name} not supported for Excel"
            
    if not res["success"]:
        return f"Error executing {op_name}: {res['error']}"
    return f"Successfully executed {op_name}. Result: {res['result']}"

def create_tool(name: str, description: str, args_schema: Type[BaseModel], op_name: Optional[str] = None) -> StructuredTool:
    actual_op = op_name or name
    
    def tool_func(user_id: str, file_id: str, **kwargs) -> str:
        return execute_tool_operation(user_id, file_id, actual_op, **kwargs)
        
    return StructuredTool.from_function(
        func=tool_func,
        name=name,
        description=description,
        args_schema=args_schema,
    )

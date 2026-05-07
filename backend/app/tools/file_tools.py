from pydantic.v1 import BaseModel, Field
from app.tools.helper import create_tool

class FileToolSchema(BaseModel):
    user_id: str = Field(description="The user ID")
    file_id: str = Field(description="The file ID")

class ExportCSVToolSchema(BaseModel):
    user_id: str = Field(description="The user ID")
    file_id: str = Field(description="The file ID")
    sheet_name: str = Field(description="The name of the sheet to export")

list_sheets_tool = create_tool(
    name="list_sheets",
    description="List all the sheets in the workbook.",
    args_schema=FileToolSchema
)

export_to_csv_tool = create_tool(
    name="export_to_csv",
    description="Export a specific sheet to CSV format.",
    args_schema=ExportCSVToolSchema
)

TOOLS = [list_sheets_tool, export_to_csv_tool]

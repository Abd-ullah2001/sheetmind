from pydantic import BaseModel, Field
from app.tools.helper import create_tool

class SheetToolSchema(BaseModel):
    user_id: str = Field(description="The user ID")
    file_id: str = Field(description="The file ID")
    sheet_name: str = Field(description="The name of the sheet")

class RenameSheetToolSchema(BaseModel):
    user_id: str = Field(description="The user ID")
    file_id: str = Field(description="The file ID")
    old_name: str = Field(description="The current name of the sheet")
    new_name: str = Field(description="The new name for the sheet")

class CopySheetToolSchema(BaseModel):
    user_id: str = Field(description="The user ID")
    file_id: str = Field(description="The file ID")
    sheet_name: str = Field(description="The name of the sheet to copy")
    new_name: str = Field(description="The name for the copied sheet")

add_sheet_tool = create_tool("add_sheet", "Add a new sheet to the workbook.", SheetToolSchema)
delete_sheet_tool = create_tool("delete_sheet", "Delete a sheet from the workbook.", SheetToolSchema)
rename_sheet_tool = create_tool("rename_sheet", "Rename a sheet in the workbook.", RenameSheetToolSchema)
copy_sheet_tool = create_tool("copy_sheet", "Copy a sheet in the workbook to a new sheet.", CopySheetToolSchema)

TOOLS = [add_sheet_tool, delete_sheet_tool, rename_sheet_tool, copy_sheet_tool]

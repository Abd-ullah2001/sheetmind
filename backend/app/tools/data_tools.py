from pydantic import BaseModel, Field
from app.tools.helper import create_tool

class SortRangeToolSchema(BaseModel):
    user_id: str = Field(description="The user ID")
    file_id: str = Field(description="The file ID")
    sheet_name: str = Field(description="The name of the sheet")
    cell_range: str = Field(description="The cell range e.g. A1:B10")
    sort_column: int = Field(description="The index of the column to sort by (0-indexed within the range)")
    ascending: bool = Field(description="True for ascending, False for descending")

class FindReplaceToolSchema(BaseModel):
    user_id: str = Field(description="The user ID")
    file_id: str = Field(description="The file ID")
    sheet_name: str = Field(description="The name of the sheet")
    find_value: str = Field(description="The value to find")
    replace_value: str = Field(description="The value to replace it with")

class ValidationToolSchema(BaseModel):
    user_id: str = Field(description="The user ID")
    file_id: str = Field(description="The file ID")
    sheet_name: str = Field(description="The name of the sheet")
    cell_range: str = Field(description="The cell range")
    validation_type: str = Field(description="Type of validation e.g. dropdown")
    options: list = Field(description="List of options for the dropdown")

class CondFormatToolSchema(BaseModel):
    user_id: str = Field(description="The user ID")
    file_id: str = Field(description="The file ID")
    sheet_name: str = Field(description="The name of the sheet")
    cell_range: str = Field(description="The cell range")
    rule_type: str = Field(description="Operator e.g. >, <, =, between")
    condition: str = Field(description="The value or formula for the condition")
    format_options: dict = Field(description="Formatting to apply, e.g. {'bg_color': 'FF0000'}")

class FreezePanesToolSchema(BaseModel):
    user_id: str = Field(description="The user ID")
    file_id: str = Field(description="The file ID")
    sheet_name: str = Field(description="The name of the sheet")
    row: int = Field(description="Row number to freeze at")
    col: int = Field(description="Column index to freeze at")

sort_range_tool = create_tool("sort_range", "Sort a range of cells.", SortRangeToolSchema)
find_and_replace_tool = create_tool("find_and_replace", "Find and replace values in a sheet.", FindReplaceToolSchema)
add_data_validation_tool = create_tool("add_data_validation", "Add data validation like a dropdown to cells.", ValidationToolSchema)
apply_conditional_formatting_tool = create_tool("apply_conditional_formatting", "Apply conditional formatting to cells.", CondFormatToolSchema)
freeze_panes_tool = create_tool("freeze_panes", "Freeze panes (rows/columns) in the sheet.", FreezePanesToolSchema)

TOOLS = [
    sort_range_tool, 
    find_and_replace_tool, 
    add_data_validation_tool, 
    apply_conditional_formatting_tool,
    freeze_panes_tool
]

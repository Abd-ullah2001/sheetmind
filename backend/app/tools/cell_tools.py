from typing import Any, List
from pydantic import BaseModel, Field
from app.tools.helper import create_tool

class RangeToolSchema(BaseModel):
    user_id: str = Field(description="The user ID")
    file_id: str = Field(description="The file ID")
    sheet_name: str = Field(description="The name of the sheet")
    cell_range: str = Field(description="The cell range e.g. A1:B10")

class WriteRangeToolSchema(RangeToolSchema):
    values: List[List[Any]] = Field(description="A 2D list of values to write")

class WriteCellToolSchema(BaseModel):
    user_id: str = Field(description="The user ID")
    file_id: str = Field(description="The file ID")
    sheet_name: str = Field(description="The name of the sheet")
    cell: str = Field(description="The cell address e.g. B2")
    value: Any = Field(description="The value to write")

class FormatCellsToolSchema(RangeToolSchema):
    format_options: dict = Field(description="Formatting options like bold, italic, bg_color, font_color, alignment")

read_range_tool = create_tool("read_range", "Read values from a specific cell range.", RangeToolSchema)
write_range_tool = create_tool("write_range", "Write a 2D array of values into a specific cell range.", WriteRangeToolSchema)
write_cell_tool = create_tool("write_cell", "Write a single value into a specific cell.", WriteCellToolSchema)
clear_range_tool = create_tool("clear_range", "Clear all values and formatting from a cell range.", RangeToolSchema)
merge_cells_tool = create_tool("merge_cells", "Merge a range of cells into one.", RangeToolSchema)
format_cells_tool = create_tool("format_cells", "Apply formatting to a range of cells.", FormatCellsToolSchema)

TOOLS = [read_range_tool, write_range_tool, write_cell_tool, clear_range_tool, merge_cells_tool, format_cells_tool]

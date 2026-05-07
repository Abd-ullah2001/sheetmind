from pydantic import BaseModel, Field
from app.tools.helper import create_tool

class CellToolSchema(BaseModel):
    user_id: str = Field(description="The user ID")
    file_id: str = Field(description="The file ID")
    sheet_name: str = Field(description="The name of the sheet")
    cell: str = Field(description="The cell address e.g. B2")

class ApplyFormulaToolSchema(CellToolSchema):
    formula: str = Field(description="The formula string starting with =")

apply_formula_tool = create_tool("apply_formula", "Apply an Excel formula to a cell.", ApplyFormulaToolSchema)
get_cell_formula_tool = create_tool("get_cell_formula", "Get the underlying formula of a cell instead of its value.", CellToolSchema)

TOOLS = [apply_formula_tool, get_cell_formula_tool]

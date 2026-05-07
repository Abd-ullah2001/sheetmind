from pydantic import BaseModel, Field
from app.tools.helper import create_tool

class AddChartToolSchema(BaseModel):
    user_id: str = Field(description="The user ID")
    file_id: str = Field(description="The file ID")
    sheet_name: str = Field(description="The name of the sheet")
    chart_type: str = Field(description="Type of chart: bar, line, or pie")
    data_range: str = Field(description="Data range for the chart e.g. A1:B10")
    title: str = Field(description="Title of the chart")

class PivotToolSchema(BaseModel):
    user_id: str = Field(description="The user ID")
    file_id: str = Field(description="The file ID")
    sheet_name: str = Field(description="The name of the sheet")
    data_range: str = Field(description="Data range to pivot")
    # simplified for AI
    
add_chart_tool = create_tool("add_chart", "Add a chart to the sheet.", AddChartToolSchema)

# We map create_pivot_summary to a placeholder or complex implementation later
create_pivot_summary_tool = create_tool("create_pivot_summary", "Create a pivot table summary.", PivotToolSchema)

TOOLS = [add_chart_tool, create_pivot_summary_tool]

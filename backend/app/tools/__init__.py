from app.tools.file_tools import TOOLS as file_tools
from app.tools.sheet_tools import TOOLS as sheet_tools
from app.tools.cell_tools import TOOLS as cell_tools
from app.tools.formula_tools import TOOLS as formula_tools
from app.tools.data_tools import TOOLS as data_tools
from app.tools.advanced_tools import TOOLS as advanced_tools

ALL_TOOLS = []
ALL_TOOLS.extend(file_tools)
ALL_TOOLS.extend(sheet_tools)
ALL_TOOLS.extend(cell_tools)
ALL_TOOLS.extend(formula_tools)
ALL_TOOLS.extend(data_tools)
ALL_TOOLS.extend(advanced_tools)

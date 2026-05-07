import gspread
from google.oauth2.credentials import Credentials

def get_client(access_token: str):
    creds = Credentials(token=access_token)
    return gspread.authorize(creds)

def _execute_operation(sheet_id: str, access_token: str, operation_func, **kwargs):
    try:
        client = get_client(access_token)
        sh = client.open_by_key(sheet_id)
        result = operation_func(sh, **kwargs)
        return {"success": True, "result": result, "error": None}
    except Exception as e:
        return {"success": False, "result": None, "error": str(e)}

def get_workbook_info(sheet_id: str, access_token: str):
    def op(sh):
        info = {}
        for worksheet in sh.worksheets():
            info[worksheet.title] = {"max_row": worksheet.row_count, "max_column": worksheet.col_count}
        return {"sheets": [ws.title for ws in sh.worksheets()], "dimensions": info}
    return _execute_operation(sheet_id, access_token, op)

def list_sheets(sheet_id: str, access_token: str):
    return _execute_operation(sheet_id, access_token, lambda sh: [ws.title for ws in sh.worksheets()])

def add_sheet(sheet_id: str, access_token: str, sheet_name: str):
    return _execute_operation(sheet_id, access_token, lambda sh: sh.add_worksheet(title=sheet_name, rows=100, cols=20) is not None)

def delete_sheet(sheet_id: str, access_token: str, sheet_name: str):
    def op(sh):
        ws = sh.worksheet(sheet_name)
        sh.del_worksheet(ws)
        return True
    return _execute_operation(sheet_id, access_token, op)

def rename_sheet(sheet_id: str, access_token: str, old_name: str, new_name: str):
    def op(sh):
        ws = sh.worksheet(old_name)
        ws.update_title(new_name)
        return True
    return _execute_operation(sheet_id, access_token, op)

def read_range(sheet_id: str, access_token: str, sheet_name: str, cell_range: str):
    def op(sh):
        ws = sh.worksheet(sheet_name)
        return ws.get(cell_range)
    return _execute_operation(sheet_id, access_token, op)

def write_range(sheet_id: str, access_token: str, sheet_name: str, cell_range: str, values: list):
    def op(sh):
        ws = sh.worksheet(sheet_name)
        ws.update(range_name=cell_range, values=values)
        return True
    return _execute_operation(sheet_id, access_token, op)

def write_cell(sheet_id: str, access_token: str, sheet_name: str, cell: str, value):
    return write_range(sheet_id, access_token, sheet_name, cell, [[value]])

def clear_range(sheet_id: str, access_token: str, sheet_name: str, cell_range: str):
    def op(sh):
        ws = sh.worksheet(sheet_name)
        ws.clear(cell_range)
        return True
    return _execute_operation(sheet_id, access_token, op)

def format_cells(sheet_id: str, access_token: str, sheet_name: str, cell_range: str, format_options: dict):
    # Map simplistic format options to Google Sheets API
    def op(sh):
        ws = sh.worksheet(sheet_name)
        fmt = {}
        text_fmt = {}
        if "bold" in format_options: text_fmt["bold"] = format_options["bold"]
        if "italic" in format_options: text_fmt["italic"] = format_options["italic"]
        if "font_size" in format_options: text_fmt["fontSize"] = format_options["font_size"]
        if text_fmt:
            fmt["textFormat"] = text_fmt
            
        if "bg_color" in format_options:
            # Note: naive hex to rgb conversion required for real implementation
            pass
            
        if "alignment" in format_options:
            fmt["horizontalAlignment"] = format_options["alignment"].upper()
            
        if fmt:
            ws.format(cell_range, fmt)
        return True
    return _execute_operation(sheet_id, access_token, op)

def share_sheet(sheet_id: str, access_token: str, email: str, role: str):
    def op(sh):
        sh.share(email, perm_type='user', role=role)
        return True
    return _execute_operation(sheet_id, access_token, op)

def get_sheet_url(sheet_id: str, access_token: str):
    def op(sh):
        return sh.url
    return _execute_operation(sheet_id, access_token, op)

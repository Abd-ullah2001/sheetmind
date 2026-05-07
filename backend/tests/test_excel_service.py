"""
Unit tests for excel_service functions using a real test .xlsx fixture file.
These tests mock S3 so the file is loaded from disk instead.
"""
import io
import os
import pytest
import openpyxl
from unittest.mock import patch, MagicMock


def _create_test_workbook() -> bytes:
    """Create a minimal test workbook in memory and return its bytes."""
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "Sheet1"

    # Header row
    ws["A1"] = "Name"
    ws["B1"] = "Value"
    ws["C1"] = "Category"

    # Data rows
    data = [
        ("Alice", 100, "A"),
        ("Bob", 250, "B"),
        ("Charlie", 500, "A"),
        ("Diana", 750, "C"),
        ("Eve", 300, "B"),
    ]
    for i, (name, value, cat) in enumerate(data, start=2):
        ws[f"A{i}"] = name
        ws[f"B{i}"] = value
        ws[f"C{i}"] = cat

    # Add a second sheet
    ws2 = wb.create_sheet("Summary")
    ws2["A1"] = "Total"
    ws2["B1"] = "=SUM(Sheet1!B2:B6)"

    buf = io.BytesIO()
    wb.save(buf)
    return buf.getvalue()


# Store fixture bytes once
TEST_WORKBOOK_BYTES = _create_test_workbook()


def _mock_download(s3_key: str) -> bytes:
    return TEST_WORKBOOK_BYTES


def _mock_upload(file_bytes: bytes, s3_key: str) -> str:
    return s3_key


@pytest.fixture(autouse=True)
def mock_s3():
    """Patch S3 calls for all tests in this module."""
    with patch("app.services.excel_service.download_file_to_memory", side_effect=_mock_download), \
         patch("app.services.excel_service.upload_bytes_to_s3", side_effect=_mock_upload):
        yield


def test_get_workbook_info():
    from app.services.excel_service import get_workbook_info
    result = get_workbook_info("test-key")
    assert result["success"] is True
    assert "Sheet1" in result["result"]["sheets"]
    assert "Summary" in result["result"]["sheets"]
    assert result["result"]["dimensions"]["Sheet1"]["max_row"] == 6
    assert result["result"]["dimensions"]["Sheet1"]["max_column"] == 3


def test_list_sheets():
    from app.services.excel_service import list_sheets
    result = list_sheets("test-key")
    assert result["success"] is True
    assert result["result"] == ["Sheet1", "Summary"]


def test_read_range():
    from app.services.excel_service import read_range
    result = read_range("test-key", "Sheet1", "A1:C1")
    assert result["success"] is True
    assert result["result"] == [["Name", "Value", "Category"]]


def test_read_range_data():
    from app.services.excel_service import read_range
    result = read_range("test-key", "Sheet1", "A2:B3")
    assert result["success"] is True
    assert result["result"][0] == ["Alice", 100]
    assert result["result"][1] == ["Bob", 250]


def test_write_cell():
    from app.services.excel_service import write_cell
    result = write_cell("test-key", "Sheet1", "D1", "NewColumn")
    assert result["success"] is True


def test_write_range():
    from app.services.excel_service import write_range
    values = [["X", "Y"], ["1", "2"]]
    result = write_range("test-key", "Sheet1", "D1:E2", values)
    assert result["success"] is True


def test_clear_range():
    from app.services.excel_service import clear_range
    result = clear_range("test-key", "Sheet1", "A1:A2")
    assert result["success"] is True


def test_add_sheet():
    from app.services.excel_service import add_sheet
    result = add_sheet("test-key", "NewSheet")
    assert result["success"] is True


def test_delete_sheet():
    from app.services.excel_service import delete_sheet
    result = delete_sheet("test-key", "Summary")
    assert result["success"] is True


def test_rename_sheet():
    from app.services.excel_service import rename_sheet
    result = rename_sheet("test-key", "Sheet1", "DataSheet")
    assert result["success"] is True


def test_copy_sheet():
    from app.services.excel_service import copy_sheet
    result = copy_sheet("test-key", "Sheet1", "Sheet1_Copy")
    assert result["success"] is True


def test_merge_cells():
    from app.services.excel_service import merge_cells
    result = merge_cells("test-key", "Sheet1", "A1:C1")
    assert result["success"] is True


def test_format_cells():
    from app.services.excel_service import format_cells
    result = format_cells("test-key", "Sheet1", "A1:C1", {
        "bold": True,
        "font_color": "#FF0000",
        "bg_color": "#FFFF00",
        "alignment": "center"
    })
    assert result["success"] is True


def test_apply_formula():
    from app.services.excel_service import apply_formula
    result = apply_formula("test-key", "Sheet1", "D1", "=SUM(B2:B6)")
    assert result["success"] is True


def test_get_cell_formula():
    from app.services.excel_service import get_cell_formula
    # The Summary sheet has a formula in B1
    result = get_cell_formula("test-key", "Summary", "B1")
    assert result["success"] is True
    assert result["result"] is not None
    assert result["result"].startswith("=")


def test_sort_range():
    from app.services.excel_service import sort_range
    result = sort_range("test-key", "Sheet1", "A2:C6", 1, True)
    assert result["success"] is True


def test_find_and_replace():
    from app.services.excel_service import find_and_replace
    result = find_and_replace("test-key", "Sheet1", "Alice", "Alicia")
    assert result["success"] is True
    assert result["result"] >= 1


def test_export_to_csv():
    from app.services.excel_service import export_to_csv
    result = export_to_csv("test-key", "Sheet1")
    assert result["success"] is True
    assert "Name" in result["result"]
    assert "Alice" in result["result"]


def test_freeze_panes():
    from app.services.excel_service import freeze_panes
    result = freeze_panes("test-key", "Sheet1", 2, 1)
    assert result["success"] is True


def test_add_chart():
    from app.services.excel_service import add_chart
    result = add_chart("test-key", "Sheet1", "bar", "A1:B6", "Sales Chart")
    assert result["success"] is True


def test_set_row_height():
    from app.services.excel_service import set_row_height
    result = set_row_height("test-key", "Sheet1", 1, 30.0)
    assert result["success"] is True


def test_set_column_width():
    from app.services.excel_service import set_column_width
    result = set_column_width("test-key", "Sheet1", "A", 25.0)
    assert result["success"] is True


def test_invalid_sheet_name():
    from app.services.excel_service import read_range
    result = read_range("test-key", "NonExistent", "A1:A1")
    assert result["success"] is False
    assert result["error"] is not None

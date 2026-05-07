"""
Unit tests for sheets_service (Google Sheets) using mocked gspread client.
"""
import pytest
from unittest.mock import patch, MagicMock


@pytest.fixture
def mock_gspread():
    """Mock gspread authorize and the spreadsheet object."""
    with patch("app.services.sheets_service.gspread") as mock_gs:
        mock_client = MagicMock()
        mock_gs.authorize.return_value = mock_client

        mock_spreadsheet = MagicMock()
        mock_client.open_by_key.return_value = mock_spreadsheet

        # Setup worksheets
        mock_ws1 = MagicMock()
        mock_ws1.title = "Sheet1"
        mock_ws1.row_count = 100
        mock_ws1.col_count = 20

        mock_ws2 = MagicMock()
        mock_ws2.title = "Sheet2"
        mock_ws2.row_count = 50
        mock_ws2.col_count = 10

        mock_spreadsheet.worksheets.return_value = [mock_ws1, mock_ws2]
        mock_spreadsheet.worksheet.return_value = mock_ws1
        mock_spreadsheet.url = "https://docs.google.com/spreadsheets/d/test-id"

        yield mock_spreadsheet, mock_ws1


def test_get_workbook_info(mock_gspread):
    from app.services.sheets_service import get_workbook_info
    result = get_workbook_info("test-sheet-id", "fake-token")
    assert result["success"] is True
    assert "Sheet1" in result["result"]["sheets"]
    assert "Sheet2" in result["result"]["sheets"]


def test_list_sheets(mock_gspread):
    from app.services.sheets_service import list_sheets
    result = list_sheets("test-sheet-id", "fake-token")
    assert result["success"] is True
    assert "Sheet1" in result["result"]


def test_add_sheet(mock_gspread):
    mock_spreadsheet, _ = mock_gspread
    mock_spreadsheet.add_worksheet.return_value = MagicMock()

    from app.services.sheets_service import add_sheet
    result = add_sheet("test-sheet-id", "fake-token", "NewSheet")
    assert result["success"] is True


def test_delete_sheet(mock_gspread):
    from app.services.sheets_service import delete_sheet
    result = delete_sheet("test-sheet-id", "fake-token", "Sheet1")
    assert result["success"] is True


def test_rename_sheet(mock_gspread):
    from app.services.sheets_service import rename_sheet
    result = rename_sheet("test-sheet-id", "fake-token", "Sheet1", "RenamedSheet")
    assert result["success"] is True


def test_read_range(mock_gspread):
    _, mock_ws = mock_gspread
    mock_ws.get.return_value = [["Name", "Value"], ["Alice", "100"]]

    from app.services.sheets_service import read_range
    result = read_range("test-sheet-id", "fake-token", "Sheet1", "A1:B2")
    assert result["success"] is True
    assert result["result"] == [["Name", "Value"], ["Alice", "100"]]


def test_write_range(mock_gspread):
    from app.services.sheets_service import write_range
    result = write_range("test-sheet-id", "fake-token", "Sheet1", "A1:B2", [["X", "Y"]])
    assert result["success"] is True


def test_write_cell(mock_gspread):
    from app.services.sheets_service import write_cell
    result = write_cell("test-sheet-id", "fake-token", "Sheet1", "A1", "Hello")
    assert result["success"] is True


def test_clear_range(mock_gspread):
    from app.services.sheets_service import clear_range
    result = clear_range("test-sheet-id", "fake-token", "Sheet1", "A1:B2")
    assert result["success"] is True


def test_format_cells(mock_gspread):
    from app.services.sheets_service import format_cells
    result = format_cells("test-sheet-id", "fake-token", "Sheet1", "A1:B1", {
        "bold": True,
        "alignment": "center"
    })
    assert result["success"] is True


def test_share_sheet(mock_gspread):
    from app.services.sheets_service import share_sheet
    result = share_sheet("test-sheet-id", "fake-token", "user@example.com", "reader")
    assert result["success"] is True


def test_get_sheet_url(mock_gspread):
    from app.services.sheets_service import get_sheet_url
    result = get_sheet_url("test-sheet-id", "fake-token")
    assert result["success"] is True
    assert "docs.google.com" in result["result"]


def test_error_handling():
    """Service returns error dict instead of raising when gspread fails."""
    with patch("app.services.sheets_service.gspread") as mock_gs:
        mock_gs.authorize.side_effect = Exception("Auth failed")

        from app.services.sheets_service import get_workbook_info
        result = get_workbook_info("bad-id", "bad-token")
        assert result["success"] is False
        assert "Auth failed" in result["error"]

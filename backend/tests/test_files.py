"""
Tests for the files router: presigned URL generation, confirm upload, file list, delete.
"""
import pytest
from unittest.mock import patch, MagicMock


@pytest.fixture
def authed_client():
    """Create a test client with a valid JWT and mocked services."""
    with patch("app.database.supabase_client") as mock_supabase, \
         patch("app.redis_client.redis_client") as mock_redis, \
         patch("app.s3_client.s3_client") as mock_s3:
        from fastapi.testclient import TestClient
        from app.main import app
        from app.services.auth_service import create_jwt_token

        token = create_jwt_token("user-123", "test@example.com", "google")
        client = TestClient(app)
        headers = {"Authorization": f"Bearer {token}"}
        yield client, headers, mock_supabase, mock_s3


def test_get_files_empty(authed_client):
    """File list returns empty array when user has no files."""
    client, headers, mock_supabase, _ = authed_client

    mock_table = MagicMock()
    mock_supabase.table.return_value = mock_table
    mock_table.select.return_value = mock_table
    mock_table.eq.return_value = mock_table
    mock_table.execute.return_value = MagicMock(data=[])

    response = client.get("/api/v1/files", headers=headers)
    assert response.status_code == 200
    assert response.json() == []


def test_get_files_without_auth():
    """File list returns 403 without auth."""
    with patch("app.database.supabase_client"), \
         patch("app.redis_client.redis_client"), \
         patch("app.s3_client.s3_client"):
        from fastapi.testclient import TestClient
        from app.main import app
        client = TestClient(app)
        response = client.get("/api/v1/files")
        assert response.status_code == 403


@patch("app.routers.files.generate_presigned_upload_url")
def test_upload_url_generation(mock_presign, authed_client):
    """Upload URL endpoint returns file_id, upload_url, and s3_key."""
    client, headers, _, _ = authed_client

    mock_presign.return_value = {
        "url": "https://s3.amazonaws.com/presigned-url",
        "key": "uploads/user-123/some-uuid/original.xlsx",
        "expires_in": 900
    }

    response = client.post(
        "/api/v1/files/upload-url",
        json={"filename": "test.xlsx"},
        headers=headers
    )
    assert response.status_code == 200
    data = response.json()
    assert "file_id" in data
    assert "upload_url" in data
    assert "s3_key" in data


@patch("app.routers.files.parse_excel_metadata")
def test_confirm_upload(mock_celery, authed_client):
    """Confirm upload creates a file record and triggers background parsing."""
    client, headers, mock_supabase, _ = authed_client

    file_record = {
        "id": "file-uuid",
        "user_id": "user-123",
        "display_name": "test.xlsx",
        "file_type": "excel_local",
        "s3_key": "uploads/user-123/file-uuid/original.xlsx",
        "metadata": {}
    }

    mock_table = MagicMock()
    mock_supabase.table.return_value = mock_table
    mock_table.insert.return_value = mock_table
    mock_table.execute.return_value = MagicMock(data=[file_record])

    response = client.post(
        "/api/v1/files/confirm-upload",
        json={
            "file_id": "file-uuid",
            "s3_key": "uploads/user-123/file-uuid/original.xlsx",
            "display_name": "test.xlsx"
        },
        headers=headers
    )
    assert response.status_code == 200
    assert response.json()["display_name"] == "test.xlsx"
    # Verify Celery task was queued
    mock_celery.delay.assert_called_once()


def test_delete_file_not_found(authed_client):
    """Delete returns 404 when file doesn't belong to user."""
    client, headers, mock_supabase, _ = authed_client

    mock_table = MagicMock()
    mock_supabase.table.return_value = mock_table
    mock_table.select.return_value = mock_table
    mock_table.eq.return_value = mock_table
    mock_table.execute.return_value = MagicMock(data=[])

    response = client.delete("/api/v1/files/nonexistent-id", headers=headers)
    assert response.status_code == 404

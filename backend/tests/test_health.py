"""
Tests for the health check endpoint.
Mocks all external service connections so the test is fully isolated.
"""
import pytest
from unittest.mock import patch, MagicMock


@pytest.fixture
def client():
    """Create a test client with mocked external services."""
    # Mock external clients before importing the app
    with patch("app.database.supabase_client") as mock_supabase, \
         patch("app.redis_client.redis_client") as mock_redis, \
         patch("app.s3_client.s3_client") as mock_s3:
        
        from fastapi.testclient import TestClient
        from app.main import app
        yield TestClient(app), mock_supabase, mock_redis, mock_s3


def test_health_all_ok(client):
    """Health endpoint returns 200 and all services ok when everything is connected."""
    test_client, mock_supabase, mock_redis, mock_s3 = client

    # Mock Supabase table query
    mock_table = MagicMock()
    mock_supabase.table.return_value = mock_table
    mock_table.select.return_value = mock_table
    mock_table.limit.return_value = mock_table
    mock_table.execute.return_value = MagicMock(data=[])

    # Mock Redis get
    mock_redis.get.return_value = None

    # Mock S3 head_bucket
    mock_s3.head_bucket.return_value = {}

    response = test_client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["version"] == "1.0.0"
    assert data["services"]["database"] == "ok"
    assert data["services"]["redis"] == "ok"
    assert data["services"]["s3"] == "ok"


def test_health_returns_request_id_header(client):
    """Health endpoint returns X-Request-ID header from logging middleware."""
    test_client, mock_supabase, mock_redis, mock_s3 = client

    mock_table = MagicMock()
    mock_supabase.table.return_value = mock_table
    mock_table.select.return_value = mock_table
    mock_table.limit.return_value = mock_table
    mock_table.execute.return_value = MagicMock(data=[])
    mock_redis.get.return_value = None
    mock_s3.head_bucket.return_value = {}

    response = test_client.get("/api/v1/health")
    assert "x-request-id" in response.headers


def test_health_database_error(client):
    """Health endpoint reports database error if Supabase is unreachable."""
    test_client, mock_supabase, mock_redis, mock_s3 = client

    mock_supabase.table.side_effect = Exception("Connection refused")
    mock_redis.get.return_value = None
    mock_s3.head_bucket.return_value = {}

    response = test_client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "error"
    assert "error" in data["services"]["database"]

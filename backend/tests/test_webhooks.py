"""
Tests for webhook creation, listing, HMAC signature verification on inbound.
"""
import hmac
import hashlib
import pytest
from unittest.mock import patch, MagicMock


@pytest.fixture
def authed_client():
    with patch("app.database.supabase_client") as mock_supabase, \
         patch("app.redis_client.redis_client") as mock_redis, \
         patch("app.s3_client.s3_client") as mock_s3:
        from fastapi.testclient import TestClient
        from app.main import app
        from app.services.auth_service import create_jwt_token

        token = create_jwt_token("user-123", "test@example.com", "google")
        client = TestClient(app)
        headers = {"Authorization": f"Bearer {token}"}
        yield client, headers, mock_supabase


def test_list_webhooks_empty(authed_client):
    """List webhooks returns empty array when none configured."""
    client, headers, mock_supabase = authed_client

    mock_table = MagicMock()
    mock_supabase.table.return_value = mock_table
    mock_table.select.return_value = mock_table
    mock_table.eq.return_value = mock_table
    mock_table.execute.return_value = MagicMock(data=[])

    response = client.get("/api/v1/webhooks/", headers=headers)
    assert response.status_code == 200
    assert response.json() == []


def test_create_webhook(authed_client):
    """Create webhook returns config with generated secret."""
    client, headers, mock_supabase = authed_client

    webhook_record = {
        "id": "wh-123",
        "user_id": "user-123",
        "zapier_url": "https://hooks.zapier.com/test",
        "events": ["file_created", "sheet_edited"],
        "active": True,
        "secret": "generated-secret-hex",
        "created_at": "2024-01-01T00:00:00"
    }

    mock_table = MagicMock()
    mock_supabase.table.return_value = mock_table
    mock_table.insert.return_value = mock_table
    mock_table.execute.return_value = MagicMock(data=[webhook_record])

    response = client.post(
        "/api/v1/webhooks/",
        json={
            "zapier_url": "https://hooks.zapier.com/test",
            "events": ["file_created", "sheet_edited"]
        },
        headers=headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["zapier_url"] == "https://hooks.zapier.com/test"
    assert "secret" in data


def test_delete_webhook(authed_client):
    """Delete webhook returns success message."""
    client, headers, mock_supabase = authed_client

    mock_table = MagicMock()
    mock_supabase.table.return_value = mock_table
    mock_table.delete.return_value = mock_table
    mock_table.eq.return_value = mock_table
    mock_table.execute.return_value = MagicMock(data=[])

    response = client.delete("/api/v1/webhooks/wh-123", headers=headers)
    assert response.status_code == 200
    assert response.json()["message"] == "Webhook deleted"


def test_inbound_webhook_invalid_signature():
    """Inbound webhook rejects requests with invalid HMAC signature."""
    with patch("app.database.supabase_client") as mock_supabase, \
         patch("app.redis_client.redis_client"), \
         patch("app.s3_client.s3_client"):
        from fastapi.testclient import TestClient
        from app.main import app

        mock_table = MagicMock()
        mock_supabase.table.return_value = mock_table
        mock_table.select.return_value = mock_table
        mock_table.eq.return_value = mock_table

        # Return a webhook config with a known secret
        mock_table.execute.return_value = MagicMock(data=[
            {"secret": "real-secret-value"}
        ])

        client = TestClient(app)
        response = client.post("/api/v1/webhooks/inbound", json={
            "user_id": "user-123",
            "file_id": "file-123",
            "query": "sum column A",
            "signature": "definitely-wrong-signature"
        })
        assert response.status_code == 401


def test_inbound_webhook_valid_signature():
    """Inbound webhook accepts requests with valid HMAC signature."""
    with patch("app.database.supabase_client") as mock_supabase, \
         patch("app.redis_client.redis_client") as mock_redis, \
         patch("app.s3_client.s3_client"), \
         patch("app.routers.webhooks.run_agent_query") as mock_agent:
        from fastapi.testclient import TestClient
        from app.main import app

        secret = "test-webhook-secret"
        user_id = "user-123"
        file_id = "file-123"
        query = "sum column A"

        # Compute valid signature
        payload = f"{user_id}{file_id}{query}"
        valid_sig = hmac.new(
            secret.encode(), payload.encode(), hashlib.sha256
        ).hexdigest()

        mock_table = MagicMock()
        mock_supabase.table.return_value = mock_table
        mock_table.select.return_value = mock_table
        mock_table.eq.return_value = mock_table
        mock_table.execute.return_value = MagicMock(data=[
            {"secret": secret}
        ])

        mock_agent.return_value = {
            "response": "Done",
            "tools_called": [],
            "session_id": "s-123",
            "tokens_used": 10,
            "status": "success",
            "error": None
        }

        client = TestClient(app)
        response = client.post("/api/v1/webhooks/inbound", json={
            "user_id": user_id,
            "file_id": file_id,
            "query": query,
            "signature": valid_sig
        })
        assert response.status_code == 200

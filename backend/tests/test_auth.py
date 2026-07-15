"""
Tests for JWT auth service functions and the /auth/me endpoint.
"""
import pytest
from unittest.mock import patch, MagicMock
from datetime import datetime, timedelta


def test_create_and_verify_jwt():
    """JWT tokens can be created and verified successfully."""
    from app.services.auth_service import create_jwt_token, verify_jwt_token

    token = create_jwt_token("user-123", "test@example.com", "google")
    assert isinstance(token, str)
    assert len(token) > 20

    payload = verify_jwt_token(token)
    assert payload["sub"] == "user-123"
    assert payload["email"] == "test@example.com"
    assert payload["provider"] == "google"
    assert "exp" in payload
    assert "iat" in payload


def test_verify_jwt_invalid_token():
    """Invalid JWT tokens raise ValueError."""
    from app.services.auth_service import verify_jwt_token

    with pytest.raises(ValueError, match="Invalid or expired token"):
        verify_jwt_token("this.is.not.a.valid.token")


def test_verify_jwt_tampered_token():
    """Tampered JWT tokens are rejected."""
    from app.services.auth_service import create_jwt_token, verify_jwt_token

    token = create_jwt_token("user-123", "test@example.com", "google")
    # Tamper with the token by changing the last character
    tampered = token[:-1] + ("A" if token[-1] != "A" else "B")

    with pytest.raises(ValueError):
        verify_jwt_token(tampered)


@patch("app.database.supabase_client")
def test_upsert_user_new(mock_supabase):
    """upsert_user inserts a new user when email doesn't exist."""
    from app.services.auth_service import upsert_user

    mock_table = MagicMock()
    mock_supabase.table.return_value = mock_table
    mock_table.select.return_value = mock_table
    mock_table.eq.return_value = mock_table
    mock_table.execute.return_value = MagicMock(data=[])

    new_user = {"id": "new-uuid", "email": "new@example.com", "name": "New User"}
    mock_table.insert.return_value = mock_table
    mock_table.execute.return_value = MagicMock(data=[new_user])

    result = upsert_user("new@example.com", "New User", None, "google")
    assert result["email"] == "new@example.com"


@patch("app.database.supabase_client")
def test_upsert_user_existing(mock_supabase):
    """upsert_user updates last_login when user already exists."""
    from app.services.auth_service import upsert_user

    existing_user = {"id": "existing-uuid", "email": "existing@example.com", "name": "Existing"}
    
    mock_table = MagicMock()
    mock_supabase.table.return_value = mock_table
    mock_table.select.return_value = mock_table
    mock_table.eq.return_value = mock_table
    mock_table.execute.return_value = MagicMock(data=[existing_user])

    # Update chain
    mock_table.update.return_value = mock_table

    result = upsert_user("existing@example.com", "Existing", None, "google")
    assert result["id"] == "existing-uuid"


def test_auth_me_endpoint_without_token():
    """The /auth/me endpoint returns 403 without a token."""
    with patch("app.database.supabase_client"), \
         patch("app.redis_client.redis_client"), \
         patch("app.s3_client.s3_client"):
        from fastapi.testclient import TestClient
        from app.main import app
        client = TestClient(app)
        response = client.get("/api/v1/auth/me")
        assert response.status_code == 403


def test_auth_me_endpoint_with_valid_token():
    """The /auth/me endpoint returns user data with a valid JWT."""
    mock_supabase = MagicMock()
    with patch("app.database.supabase_client", mock_supabase), \
         patch("app.redis_client.redis_client"), \
         patch("app.s3_client.s3_client"):
        from fastapi.testclient import TestClient
        from app.main import app
        from app.services.auth_service import create_jwt_token

        user_data = {
            "id": "user-123",
            "email": "test@example.com",
            "name": "Test User",
            "avatar_url": None,
            "provider": "google",
            "created_at": "2024-01-01T00:00:00",
            "last_login": "2024-01-01T00:00:00"
        }

        mock_table = MagicMock()
        mock_supabase.table.return_value = mock_table
        mock_table.select.return_value = mock_table
        mock_table.eq.return_value = mock_table
        mock_table.execute.return_value = MagicMock(data=[user_data])

        token = create_jwt_token("user-123", "test@example.com", "google")
        client = TestClient(app)
        response = client.get(
            "/api/v1/auth/me",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 200
        assert response.json()["email"] == "test@example.com"

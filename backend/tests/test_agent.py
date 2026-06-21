"""
Tests for the agent query endpoint with mocked NVIDIA API and tool calls.
"""
import pytest
from unittest.mock import patch, MagicMock


@pytest.fixture
def authed_client():
    mock_supabase = MagicMock()
    mock_redis = MagicMock()
    with patch("app.database.supabase_client", mock_supabase), \
         patch("app.redis_client.redis_client", mock_redis), \
         patch("app.s3_client.s3_client"):
        from fastapi.testclient import TestClient
        from app.main import app
        from app.services.auth_service import create_jwt_token

        token = create_jwt_token("user-123", "test@example.com", "google")
        client = TestClient(app)
        headers = {"Authorization": f"Bearer {token}"}
        yield client, headers, mock_supabase, mock_redis


def test_agent_query_without_auth():
    """Agent query returns 403 without token."""
    with patch("app.database.supabase_client"), \
         patch("app.redis_client.redis_client"), \
         patch("app.s3_client.s3_client"):
        from fastapi.testclient import TestClient
        from app.main import app
        client = TestClient(app)
        response = client.post("/api/v1/agent/query", json={
            "file_id": "file-123",
            "query": "sum column A"
        })
        assert response.status_code == 403


@patch("app.services.agent_service.initialize_agent")
@patch("app.services.agent_service.ChatOpenAI")
def test_agent_query_success(mock_llm_class, mock_init_agent, authed_client):
    """Agent query returns a valid response with mocked LLM."""
    client, headers, mock_supabase, mock_redis = authed_client

    # Mock Redis cache miss
    mock_redis.get.return_value = None
    mock_redis.set.return_value = True
    mock_redis.scan.return_value = (0, [])

    # Mock Supabase calls
    mock_table = MagicMock()
    mock_supabase.table.return_value = mock_table
    mock_table.select.return_value = mock_table
    mock_table.eq.return_value = mock_table
    mock_table.order.return_value = mock_table
    mock_table.insert.return_value = mock_table
    mock_table.update.return_value = mock_table
    mock_table.upsert.return_value = mock_table

    # Session lookup returns empty (new session)
    mock_table.execute.return_value = MagicMock(data=[])

    # File lookup needs to return data on second call
    file_record = {
        "id": "file-123",
        "user_id": "user-123",
        "display_name": "test.xlsx",
        "file_type": "excel_local",
        "s3_key": "uploads/user-123/file-123/original.xlsx",
        "metadata": {"sheet_names": ["Sheet1"]}
    }

    call_count = [0]
    def side_effect_execute():
        call_count[0] += 1
        if call_count[0] <= 2:
            # First two calls: session lookup + session insert
            return MagicMock(data=[])
        else:
            # Subsequent calls: file lookup, log insert, session update
            return MagicMock(data=[file_record])

    mock_table.execute.side_effect = side_effect_execute

    # Mock the LangChain agent
    mock_agent = MagicMock()
    mock_agent.invoke.return_value = {
        "output": "I've summed column A. The total is 150.",
        "intermediate_steps": []
    }
    mock_init_agent.return_value = mock_agent

    response = client.post(
        "/api/v1/agent/query",
        json={"file_id": "file-123", "query": "sum column A"},
        headers=headers
    )
    assert response.status_code == 200
    data = response.json()
    assert "response" in data
    assert data["session_id"] is not None
    assert data["status"] == "success"


def test_agent_get_sessions(authed_client):
    """Get sessions returns conversation history."""
    client, headers, mock_supabase, _ = authed_client

    mock_table = MagicMock()
    mock_supabase.table.return_value = mock_table
    mock_table.select.return_value = mock_table
    mock_table.eq.return_value = mock_table
    mock_table.order.return_value = mock_table
    mock_table.execute.return_value = MagicMock(data=[])

    response = client.get("/api/v1/agent/sessions/file-123", headers=headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_agent_delete_sessions(authed_client):
    """Clear sessions returns success message."""
    client, headers, mock_supabase, _ = authed_client

    mock_table = MagicMock()
    mock_supabase.table.return_value = mock_table
    mock_table.delete.return_value = mock_table
    mock_table.eq.return_value = mock_table
    mock_table.execute.return_value = MagicMock(data=[])

    response = client.delete("/api/v1/agent/sessions/file-123", headers=headers)
    assert response.status_code == 200
    assert response.json()["message"] == "Session history cleared"

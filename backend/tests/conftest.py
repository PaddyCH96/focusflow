import pytest
from fastapi.testclient import TestClient
from httpx import AsyncClient, ASGITransport
import os

# Set test environment before importing app
os.environ["ENVIRONMENT"] = "test"
os.environ["DATABASE_URL"] = "postgresql://postgres:postgrespassword@localhost:5432/focusflow_test"

from app.main import app

client = TestClient(app)


@pytest.fixture
def test_client():
    """Provide a test client for API tests."""
    return client


@pytest.fixture
def sample_task():
    """Create and return a sample task."""
    response = client.post("/tasks", json={"title": "Test Task"})
    assert response.status_code == 200
    return response.json()


@pytest.fixture
def sample_session():
    """Create and return a sample session."""
    response = client.post("/sessions", json={"duration": 1500, "status": "completed"})
    assert response.status_code == 200
    return response.json()


@pytest.fixture
def sample_journal():
    """Create and return a sample journal entry."""
    response = client.post("/journal", json={"text": "Test journal entry"})
    assert response.status_code == 200
    return response.json()

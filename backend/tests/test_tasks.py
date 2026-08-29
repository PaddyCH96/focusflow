"""Tests for task CRUD endpoints."""
import pytest
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


class TestTaskEndpoints:
    """Tests for /tasks endpoints."""

    @patch("app.router.get_db")
    def test_get_tasks_returns_list(self, mock_get_db):
        """Test GET /tasks returns a list."""
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_cursor.__enter__.return_value = mock_cursor
        mock_cursor.fetchall.return_value = []
        mock_conn.cursor.return_value = mock_cursor
        mock_get_db.return_value = mock_conn

        response = client.get("/tasks")
        assert response.status_code == 200
        assert isinstance(response.json(), list)

    @patch("app.router.get_db")
    def test_create_task(self, mock_get_db):
        """Test POST /tasks creates a new task."""
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_cursor.__enter__.return_value = mock_cursor
        mock_cursor.fetchone.return_value = {"id": 1, "title": "New Task", "completed": False}
        mock_conn.cursor.return_value = mock_cursor
        mock_get_db.return_value = mock_conn

        response = client.post("/tasks", json={"title": "New Task"})
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "New Task"
        assert data["completed"] is False

    @patch("app.router.get_db")
    def test_toggle_task_completion(self, mock_get_db):
        """Test PUT /tasks/{id} toggles task completion."""
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_cursor.__enter__.return_value = mock_cursor
        mock_cursor.fetchone.return_value = {"id": 1, "title": "Toggle Task", "completed": True}
        mock_conn.cursor.return_value = mock_cursor
        mock_get_db.return_value = mock_conn

        response = client.put("/tasks/1", json={"completed": True})
        assert response.status_code == 200
        assert response.json()["completed"] is True

    @patch("app.router.get_db")
    def test_update_nonexistent_task_returns_404(self, mock_get_db):
        """Test PUT /tasks/{id} returns 404 for invalid ID."""
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_cursor.__enter__.return_value = mock_cursor
        mock_cursor.fetchone.return_value = None
        mock_conn.cursor.return_value = mock_cursor
        mock_get_db.return_value = mock_conn

        response = client.put("/tasks/99999", json={"completed": True})
        assert response.status_code == 404

    def test_create_task_without_title_fails(self):
        """Test POST /tasks fails without title."""
        response = client.post("/tasks", json={})
        assert response.status_code == 422

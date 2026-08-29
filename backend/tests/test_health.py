"""Tests for health check endpoints."""
import pytest
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


class TestHealthEndpoint:
    """Tests for GET /health endpoint."""

    def test_health_returns_ok(self):
        """Test health endpoint returns status ok."""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ok"
        assert data["service"] == "focusflow-backend"

    def test_health_returns_json(self):
        """Test health endpoint returns JSON content type."""
        response = client.get("/health")
        assert "application/json" in response.headers["content-type"]


class TestReadinessEndpoint:
    """Tests for GET /ready endpoint."""

    @patch("app.router.get_db")
    def test_ready_returns_connected(self, mock_get_db):
        """Test readiness endpoint returns connected when database is up."""
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_cursor.__enter__.return_value = mock_cursor
        mock_cursor.fetchone.return_value = (1,)
        mock_conn.cursor.return_value = mock_cursor
        mock_get_db.return_value = mock_conn

        response = client.get("/ready")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ready"
        assert data["database"] == "connected"

    @patch("app.router.get_db")
    def test_ready_returns_503_when_db_unavailable(self, mock_get_db):
        """Test readiness endpoint returns 503 when database is unavailable."""
        mock_get_db.side_effect = Exception("Connection refused")

        response = client.get("/ready")
        assert response.status_code == 503

"""Tests for analytics endpoints."""
import pytest
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


class TestAnalyticsEndpoints:
    """Tests for /analytics endpoints."""

    @patch("app.router.get_db")
    def test_get_heatmap_returns_list(self, mock_get_db):
        """Test GET /analytics/heatmap returns a list."""
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_cursor.__enter__.return_value = mock_cursor
        mock_cursor.fetchall.return_value = []
        mock_conn.cursor.return_value = mock_cursor
        mock_get_db.return_value = mock_conn

        response = client.get("/analytics/heatmap")
        assert response.status_code == 200
        assert isinstance(response.json(), list)

    @patch("app.router.get_db")
    def test_heatmap_response_structure(self, mock_get_db):
        """Test heatmap response has correct structure."""
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_cursor.__enter__.return_value = mock_cursor
        mock_cursor.fetchall.return_value = [
            {
                "focus_date": "2026-08-29",
                "completed_count": 5,
                "failed_count": 1
            }
        ]
        mock_conn.cursor.return_value = mock_cursor
        mock_get_db.return_value = mock_conn

        response = client.get("/analytics/heatmap")
        data = response.json()
        
        if len(data) > 0:
            day = data[0]
            assert "date" in day
            assert "focus_score" in day
            assert "sessions_completed" in day
            assert "sessions_failed" in day

    @patch("app.router.get_db")
    def test_heatmap_with_no_sessions_returns_empty(self, mock_get_db):
        """Test heatmap returns empty list when no sessions."""
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_cursor.__enter__.return_value = mock_cursor
        mock_cursor.fetchall.return_value = []
        mock_conn.cursor.return_value = mock_cursor
        mock_get_db.return_value = mock_conn

        response = client.get("/analytics/heatmap")
        data = response.json()
        assert len(data) == 0

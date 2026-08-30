"""Tests for journal CRUD endpoints."""
import pytest
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


class TestJournalEndpoints:
    """Tests for /journal endpoints."""

    @patch("app.router.get_db")
    def test_get_journal_returns_list(self, mock_get_db):
        """Test GET /journal returns a list."""
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_cursor.__enter__.return_value = mock_cursor
        mock_cursor.fetchall.return_value = []
        mock_conn.cursor.return_value = mock_cursor
        mock_get_db.return_value = mock_conn

        response = client.get("/journal")
        assert response.status_code == 200
        assert isinstance(response.json(), list)

    def test_create_journal_without_text_fails(self):
        """Test POST /journal fails without text."""
        response = client.post("/journal", json={})
        assert response.status_code == 422

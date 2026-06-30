from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
import sys
import os
import pytest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app.main import app

client = TestClient(app)


def test_get_state():
    response = client.get("/state")
    assert response.status_code == 200
    data = response.json()
    assert data["mode"] == "work"
    assert data["remaining_seconds"] == 1500
    assert data["cycle"] == 0


def test_update_state():
    response = client.post("/state", json={
        "mode": "short_break",
        "remaining_seconds": 300,
        "cycle": 1,
    })
    assert response.status_code == 200
    data = response.json()
    assert data["mode"] == "short_break"
    assert data["remaining_seconds"] == 300
    assert data["cycle"] == 1


@patch("app.router.get_db")
def test_get_tasks(mock_get_db):
    mock_conn = MagicMock()
    mock_cursor = MagicMock()
    mock_cursor.__enter__.return_value = mock_cursor
    mock_cursor.fetchall.return_value = []
    mock_conn.cursor.return_value = mock_cursor
    mock_get_db.return_value = mock_conn

    response = client.get("/tasks")
    assert response.status_code == 200
    assert response.json() == []

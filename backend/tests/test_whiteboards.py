from datetime import datetime
from unittest.mock import patch


@patch("app.router.get_db")
def test_get_whiteboards(mock_get_db, client, mock_conn_factory):
    rows = [{"id": 1, "title": "Mind Map", "content": "[]", "timestamp": datetime(2024, 1, 1, 12, 0, 0)}]
    mock_get_db.return_value = mock_conn_factory(fetchall=rows)

    response = client.get("/whiteboards")

    assert response.status_code == 200
    body = response.json()
    assert body[0]["title"] == "Mind Map"
    assert body[0]["timestamp"] == "2024-01-01T12:00:00"


@patch("app.router.get_db")
def test_save_whiteboard(mock_get_db, client, mock_conn_factory):
    mock_get_db.return_value = mock_conn_factory(fetchone={"id": 7})

    response = client.post("/whiteboards", json={"title": "Sketch", "content": "[{\"points\":[]}]"})

    assert response.status_code == 200
    assert response.json() == {"id": 7, "status": "saved"}


@patch("app.router.get_db")
def test_save_whiteboard_defaults_title(mock_get_db, client, mock_conn_factory):
    mock_get_db.return_value = mock_conn_factory(fetchone={"id": 8})

    response = client.post("/whiteboards", json={"content": "[]"})

    assert response.status_code == 200
    assert response.json()["id"] == 8

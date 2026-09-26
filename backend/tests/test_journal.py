from datetime import datetime
from unittest.mock import patch


@patch("app.router.get_db")
def test_get_journals(mock_get_db, client, mock_conn_factory):
    rows = [{"id": 1, "text": "Good focus today.", "timestamp": datetime(2024, 1, 1, 20, 0, 0)}]
    mock_get_db.return_value = mock_conn_factory(fetchall=rows)

    response = client.get("/journal")

    assert response.status_code == 200
    body = response.json()
    assert body[0]["text"] == "Good focus today."
    assert body[0]["timestamp"] == "2024-01-01T20:00:00"


@patch("app.router.get_db")
def test_create_journal_entry(mock_get_db, client, mock_conn_factory):
    created = {"id": 2, "text": "New reflection.", "timestamp": datetime(2024, 1, 2, 21, 0, 0)}
    mock_get_db.return_value = mock_conn_factory(fetchone=created)

    response = client.post("/journal", json={"text": "New reflection."})

    assert response.status_code == 200
    assert response.json()["text"] == "New reflection."

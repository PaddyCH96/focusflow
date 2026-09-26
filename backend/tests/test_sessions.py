from datetime import datetime
from unittest.mock import patch


@patch("app.router.get_db")
def test_get_sessions_serializes_timestamp(mock_get_db, client, mock_conn_factory):
    rows = [{"id": 1, "duration": 1500, "status": "completed", "timestamp": datetime(2024, 1, 1, 9, 0, 0)}]
    mock_get_db.return_value = mock_conn_factory(fetchall=rows)

    response = client.get("/sessions")

    assert response.status_code == 200
    body = response.json()
    assert body[0]["timestamp"] == "2024-01-01T09:00:00"
    assert body[0]["status"] == "completed"


@patch("app.router.get_db")
def test_log_session_defaults_to_completed(mock_get_db, client, mock_conn_factory):
    created = {"id": 2, "duration": 900, "status": "completed", "timestamp": datetime(2024, 1, 2, 10, 0, 0)}
    mock_get_db.return_value = mock_conn_factory(fetchone=created)

    response = client.post("/sessions", json={"duration": 900})

    assert response.status_code == 200
    assert response.json()["status"] == "completed"


@patch("app.router.get_db")
def test_log_failed_session(mock_get_db, client, mock_conn_factory):
    created = {"id": 3, "duration": 200, "status": "failed", "timestamp": datetime(2024, 1, 3, 11, 0, 0)}
    mock_get_db.return_value = mock_conn_factory(fetchone=created)

    response = client.post("/sessions", json={"duration": 200, "status": "failed"})

    assert response.status_code == 200
    assert response.json()["status"] == "failed"

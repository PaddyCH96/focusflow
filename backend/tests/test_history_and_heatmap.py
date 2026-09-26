from datetime import date, datetime
from unittest.mock import patch


@patch("app.router.get_db")
def test_get_history_merges_and_sorts_events(mock_get_db, client, mock_conn_factory):
    task_rows = [{"id": 1, "title": "Write report", "timestamp": datetime(2024, 1, 1, 9, 0, 0)}]
    session_rows = [{"id": 1, "duration": 1500, "timestamp": datetime(2024, 1, 2, 9, 0, 0)}]
    journal_rows = [{"id": 1, "text": "A" * 40, "timestamp": datetime(2024, 1, 3, 9, 0, 0)}]
    mock_get_db.return_value = mock_conn_factory(
        fetchall_sequence=[task_rows, session_rows, journal_rows]
    )

    response = client.get("/history")

    assert response.status_code == 200
    events = response.json()["events"]
    assert len(events) == 3
    # sorted reverse-chronologically: journal (Jan 3), session (Jan 2), task (Jan 1)
    assert [e["type"] for e in events] == ["journal", "session", "task"]
    assert events[0]["title"].startswith("Journal Entry:")
    assert events[1]["title"].startswith("Resolved Focus Session")
    assert events[2]["title"].startswith("Completed Task:")


@patch("app.router.get_db")
def test_get_heatmap_scores_completed_and_failed(mock_get_db, client, mock_conn_factory):
    rows = [
        {"focus_date": date(2024, 1, 1), "completed_count": 4, "failed_count": 0},
        {"focus_date": date(2024, 1, 2), "completed_count": 1, "failed_count": 1},
    ]
    mock_get_db.return_value = mock_conn_factory(fetchall=rows)

    response = client.get("/analytics/heatmap")

    assert response.status_code == 200
    body = response.json()
    assert body[0]["date"] == "2024-01-01"
    assert body[0]["sessions_completed"] == 4
    assert body[0]["sessions_failed"] == 0
    assert body[0]["focus_score"] == 40.0
    # completed 1, failed 1: score = 1 * 10 * (1/2) - (1 * 5) = 0
    assert body[1]["focus_score"] == 0.0


@patch("app.router.get_db")
def test_get_heatmap_empty(mock_get_db, client, mock_conn_factory):
    mock_get_db.return_value = mock_conn_factory(fetchall=[])

    response = client.get("/analytics/heatmap")

    assert response.status_code == 200
    assert response.json() == []

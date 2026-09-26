import io
from datetime import datetime
from unittest.mock import patch, mock_open


@patch("app.router.get_db")
def test_get_voice_notes(mock_get_db, client, mock_conn_factory):
    rows = [{
        "id": 1,
        "title": "Morning thought",
        "file_path": "http://localhost:8000/voice-notes-files/abc.webm",
        "duration": 12,
        "timestamp": datetime(2024, 1, 1, 8, 0, 0),
    }]
    mock_get_db.return_value = mock_conn_factory(fetchall=rows)

    response = client.get("/voice-notes")

    assert response.status_code == 200
    assert response.json()[0]["title"] == "Morning thought"


@patch("builtins.open", new_callable=mock_open)
@patch("app.router.os.makedirs")
@patch("app.router.get_db")
def test_upload_voice_note(mock_get_db, mock_makedirs, mock_file_open, client, mock_conn_factory):
    created = {
        "id": 2,
        "title": "New Recording",
        "file_path": "http://localhost:8000/voice-notes-files/generated.webm",
        "duration": 5,
        "timestamp": datetime(2024, 1, 2, 9, 0, 0),
    }
    mock_get_db.return_value = mock_conn_factory(fetchone=created)

    response = client.post(
        "/voice-notes",
        files={"file": ("note.webm", io.BytesIO(b"fake-audio-bytes"), "audio/webm")},
        data={"title": "New Recording", "duration": "5"},
    )

    assert response.status_code == 200
    body = response.json()
    assert body["title"] == "New Recording"
    assert body["duration"] == 5
    mock_makedirs.assert_called_once()
    mock_file_open.assert_called_once()

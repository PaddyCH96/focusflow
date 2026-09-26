from unittest.mock import patch


@patch("app.router.get_db")
def test_get_audio_tracks(mock_get_db, client, mock_conn_factory):
    rows = [{"id": 1, "name": "Lo-fi Focus", "url": "http://localhost:8000/audio/lofi.mp3", "is_apple_music": False}]
    mock_get_db.return_value = mock_conn_factory(fetchall=rows)

    response = client.get("/audio")

    assert response.status_code == 200
    assert response.json() == rows


@patch("app.router.get_db")
def test_add_audio_track(mock_get_db, client, mock_conn_factory):
    created = {"id": 2, "name": "My Playlist", "url": "https://music.apple.com/abc", "is_apple_music": True}
    mock_get_db.return_value = mock_conn_factory(fetchone=created)

    response = client.post("/audio", json={"name": "My Playlist", "url": "https://music.apple.com/abc", "is_apple_music": True})

    assert response.status_code == 200
    assert response.json() == created

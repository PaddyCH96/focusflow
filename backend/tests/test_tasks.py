from unittest.mock import patch


@patch("app.router.get_db")
def test_get_tasks_returns_list(mock_get_db, client, mock_conn_factory):
    rows = [
        {"id": 1, "title": "Write report", "completed": False},
        {"id": 2, "title": "Read book", "completed": True},
    ]
    mock_get_db.return_value = mock_conn_factory(fetchall=rows)

    response = client.get("/tasks")

    assert response.status_code == 200
    assert response.json() == rows


@patch("app.router.get_db")
def test_create_task(mock_get_db, client, mock_conn_factory):
    created = {"id": 3, "title": "New task", "completed": False}
    mock_get_db.return_value = mock_conn_factory(fetchone=created)

    response = client.post("/tasks", json={"title": "New task"})

    assert response.status_code == 200
    assert response.json() == created


@patch("app.router.get_db")
def test_update_task_completed(mock_get_db, client, mock_conn_factory):
    updated = {"id": 1, "title": "Write report", "completed": True}
    mock_get_db.return_value = mock_conn_factory(fetchone=updated)

    response = client.put("/tasks/1", json={"completed": True})

    assert response.status_code == 200
    assert response.json() == updated


@patch("app.router.get_db")
def test_update_missing_task_returns_404(mock_get_db, client, mock_conn_factory):
    mock_get_db.return_value = mock_conn_factory(fetchone=None)

    response = client.put("/tasks/999", json={"completed": True})

    assert response.status_code == 404


@patch("app.router.get_db")
def test_delete_task(mock_get_db, client, mock_conn_factory):
    mock_get_db.return_value = mock_conn_factory(fetchone={"id": 1})

    response = client.delete("/tasks/1")

    assert response.status_code == 204
    assert response.content == b""


@patch("app.router.get_db")
def test_delete_missing_task_returns_404(mock_get_db, client, mock_conn_factory):
    mock_get_db.return_value = mock_conn_factory(fetchone=None)

    response = client.delete("/tasks/999")

    assert response.status_code == 404

import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

import pytest
from unittest.mock import MagicMock
from fastapi.testclient import TestClient
from app.main import app

_UNSET = object()


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def mock_conn_factory():
    """Builds a MagicMock standing in for a psycopg2 connection, matching the
    `with conn.cursor(cursor_factory=RealDictCursor) as cur:` pattern used
    throughout app/router.py. Pass fetchone/fetchall for a single-call
    result (fetchone=None is a valid, meaningful "not found" case), or
    fetchall_sequence for endpoints that run several queries against the
    same cursor (e.g. /history)."""

    def _make(fetchone=_UNSET, fetchall=_UNSET, fetchall_sequence=None):
        conn = MagicMock()
        cursor = MagicMock()
        cursor.__enter__.return_value = cursor
        if fetchone is not _UNSET:
            cursor.fetchone.return_value = fetchone
        if fetchall is not _UNSET:
            cursor.fetchall.return_value = fetchall
        if fetchall_sequence is not None:
            cursor.fetchall.side_effect = fetchall_sequence
        conn.cursor.return_value = cursor
        return conn

    return _make

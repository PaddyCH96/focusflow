"""initial schema

Revision ID: ca13b694c5ff
Revises: 
Create Date: 2026-08-29 20:54:02.002990

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'ca13b694c5ff'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Create tasks table
    op.execute('''
        CREATE TABLE IF NOT EXISTS tasks (
            id SERIAL PRIMARY KEY,
            title TEXT NOT NULL,
            completed BOOLEAN NOT NULL DEFAULT FALSE,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create sessions table
    op.execute('''
        CREATE TABLE IF NOT EXISTS sessions (
            id SERIAL PRIMARY KEY,
            duration INTEGER NOT NULL,
            status TEXT NOT NULL DEFAULT 'completed',
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create journal table
    op.execute('''
        CREATE TABLE IF NOT EXISTS journal (
            id SERIAL PRIMARY KEY,
            text TEXT NOT NULL,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create audio_tracks table
    op.execute('''
        CREATE TABLE IF NOT EXISTS audio_tracks (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            url TEXT NOT NULL,
            is_apple_music BOOLEAN NOT NULL DEFAULT FALSE
        )
    ''')
    
    # Create voice_notes table
    op.execute('''
        CREATE TABLE IF NOT EXISTS voice_notes (
            id SERIAL PRIMARY KEY,
            title TEXT NOT NULL,
            file_path TEXT NOT NULL,
            duration INTEGER NOT NULL,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create whiteboards table
    op.execute('''
        CREATE TABLE IF NOT EXISTS whiteboards (
            id SERIAL PRIMARY KEY,
            title TEXT NOT NULL DEFAULT 'Untitled Board',
            content TEXT NOT NULL,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Seed default audio tracks
    op.execute('''
        INSERT INTO audio_tracks (name, url, is_apple_music) 
        SELECT 'Lo-fi Focus', 'http://localhost:8000/audio/lofi.mp3', FALSE
        WHERE NOT EXISTS (SELECT 1 FROM audio_tracks WHERE name = 'Lo-fi Focus')
    ''')
    op.execute('''
        INSERT INTO audio_tracks (name, url, is_apple_music) 
        SELECT 'Rain Sound', 'http://localhost:8000/audio/rain.mp3', FALSE
        WHERE NOT EXISTS (SELECT 1 FROM audio_tracks WHERE name = 'Rain Sound')
    ''')
    op.execute('''
        INSERT INTO audio_tracks (name, url, is_apple_music) 
        SELECT 'Forest Ambiance', 'http://localhost:8000/audio/forest.mp3', FALSE
        WHERE NOT EXISTS (SELECT 1 FROM audio_tracks WHERE name = 'Forest Ambiance')
    ''')


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table('whiteboards')
    op.drop_table('voice_notes')
    op.drop_table('audio_tracks')
    op.drop_table('journal')
    op.drop_table('sessions')
    op.drop_table('tasks')

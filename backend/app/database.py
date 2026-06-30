import psycopg2
from psycopg2.extras import RealDictCursor
import os
import time

DB_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgrespassword@postgres:5432/focusflow")

def get_db():
    conn = psycopg2.connect(DB_URL)
    conn.autocommit = True
    return conn

def init_db():
    # Retry logic for Docker compose startup where DB might not be ready instantly
    max_retries = 5
    for i in range(max_retries):
        try:
            conn = get_db()
            cursor = conn.cursor()
            
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS tasks (
                    id SERIAL PRIMARY KEY,
                    title TEXT NOT NULL,
                    completed BOOLEAN NOT NULL DEFAULT FALSE,
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS sessions (
                    id SERIAL PRIMARY KEY,
                    duration INTEGER NOT NULL,
                    status TEXT NOT NULL DEFAULT 'completed',
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS journal (
                    id SERIAL PRIMARY KEY,
                    text TEXT NOT NULL,
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS audio_tracks (
                    id SERIAL PRIMARY KEY,
                    name TEXT NOT NULL,
                    url TEXT NOT NULL,
                    is_apple_music BOOLEAN NOT NULL DEFAULT FALSE
                )
            ''')

            cursor.execute('''
                CREATE TABLE IF NOT EXISTS voice_notes (
                    id SERIAL PRIMARY KEY,
                    title TEXT NOT NULL,
                    file_path TEXT NOT NULL,
                    duration INTEGER NOT NULL,
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')

            cursor.execute('''
                CREATE TABLE IF NOT EXISTS whiteboards (
                    id SERIAL PRIMARY KEY,
                    title TEXT NOT NULL DEFAULT 'Untitled Board',
                    content TEXT NOT NULL, -- JSON string of elements
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            # Seed default tracks if empty
            cursor.execute("SELECT COUNT(*) FROM audio_tracks")
            if cursor.fetchone()[0] == 0:
                cursor.execute("INSERT INTO audio_tracks (name, url, is_apple_music) VALUES ('Lo-fi Focus', 'http://localhost:8000/audio/lofi.mp3', FALSE)")
                cursor.execute("INSERT INTO audio_tracks (name, url, is_apple_music) VALUES ('Rain Sound', 'http://localhost:8000/audio/rain.mp3', FALSE)")
                cursor.execute("INSERT INTO audio_tracks (name, url, is_apple_music) VALUES ('Forest Ambiance', 'http://localhost:8000/audio/forest.mp3', FALSE)")
                
            conn.close()
            print("Database initialized successfully.")
            return
        except psycopg2.OperationalError as e:
            print(f"Database not ready yet, retrying... ({i+1}/{max_retries})")
            time.sleep(2)
    raise Exception("Could not connect to database after retries.")

#!/bin/bash

# setup.sh - FocusFlow Initialization Script
echo "🌊 Initializing FocusFlow Ecosystem..."

# Create necessary directories
mkdir -p data
mkdir -p assets/audio

# Fetch placeholder royalty-free audio files if they don't exist
# We use tiny 1-second silent mp3s or short beeps just to satisfy the HTML5 Audio API for boilerplate
# Users are instructed to replace these with actual tracks
echo "🎵 Setting up audio assets..."
for track in "lofi.mp3" "rain.mp3" "forest.mp3"; do
    if [ ! -f "assets/audio/$track" ]; then
        echo "⬇️ Downloading placeholder for $track..."
        # Downloading a valid sample mp3 to ensure HTML5 Audio API works
        curl -sL "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" -o "assets/audio/$track" || echo "Warning: Could not download $track"
    fi
done

echo "🗄️ Initializing SQLite Database layer..."
# The FastAPI lifespan event handles SQLite DB initialization automatically on startup
# We just need to ensure the data folder exists with correct permissions
chmod 777 data

echo "✅ Setup Complete. You can now run 'docker compose up --build -d'."

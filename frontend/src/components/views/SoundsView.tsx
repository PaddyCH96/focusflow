"use client"
import type { SoundId, SoundState } from "@/lib/storage/types"

const SOUND_LABELS: Record<SoundId, string> = {
  rain: "Rain",
  ocean: "Ocean",
  stream: "Stream",
  wind: "Wind",
  forest: "Forest",
  fireplace: "Fireplace",
  cafe: "Cafe",
  night: "Night",
}

const SOUND_ICONS: Record<SoundId, string> = {
  rain: "🌧️",
  ocean: "🌊",
  stream: "💧",
  wind: "💨",
  forest: "🌲",
  fireplace: "🔥",
  cafe: "☕",
  night: "🌙",
}

export function SoundsView({
  sounds,
  masterVolume,
  onSetMasterVolume,
  onToggleSound,
  onSetVolume,
}: {
  sounds: SoundState[]
  masterVolume: number
  onSetMasterVolume: (v: number) => void
  onToggleSound: (id: SoundId) => void
  onSetVolume: (id: SoundId, v: number) => void
}) {
  return (
    <div className="view-panel">
      <div className="section-card">
        <h3 className="section-title">Ambient Sounds</h3>
        <div className="master-volume-row">
          <label className="vol-label">Master</label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={masterVolume}
            onChange={e => onSetMasterVolume(parseFloat(e.target.value))}
            className="volume-slider"
          />
        </div>
        <div className="sound-grid">
          {sounds.map(sound => (
            <button
              key={sound.id}
              className={`sound-card ${sound.playing ? "playing" : ""}`}
              onClick={() => onToggleSound(sound.id)}
              aria-pressed={sound.playing}
            >
              <span className="sound-icon" aria-hidden="true">{SOUND_ICONS[sound.id]}</span>
              <span className="sound-name">{SOUND_LABELS[sound.id]}</span>
              {sound.playing && (
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={sound.volume}
                  onClick={e => e.stopPropagation()}
                  onChange={e => onSetVolume(sound.id, parseFloat(e.target.value))}
                  className="sound-volume"
                  aria-label={`${SOUND_LABELS[sound.id]} volume`}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

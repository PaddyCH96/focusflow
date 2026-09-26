"use client"
import { useMemo, useState } from "react"
import { Sun, Moon, Volume2, VolumeX, Shuffle, Repeat } from "lucide-react"
import type { SoundState, SoundId, DayNight } from "@/lib/storage/types"

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

export function BottomBar({
  sounds,
  masterVolume,
  onSetMasterVolume,
  onToggleSound,
  onStopAll,
  dayNight,
  onToggleDayNight,
}: {
  sounds: SoundState[]
  masterVolume: number
  onSetMasterVolume: (v: number) => void
  onToggleSound: (id: SoundId) => void
  onStopAll: () => void
  dayNight: DayNight
  onToggleDayNight: () => void
}) {
  const [lastVolume, setLastVolume] = useState(0.5)
  const playing = useMemo(() => sounds.filter(s => s.playing), [sounds])
  const trackLabel = playing.length === 0
    ? "Silent"
    : playing.length === 1
      ? SOUND_LABELS[playing[0].id]
      : `${SOUND_LABELS[playing[0].id]} +${playing.length - 1}`

  const toggleMute = () => {
    if (masterVolume > 0) {
      setLastVolume(masterVolume)
      onSetMasterVolume(0)
    } else {
      onSetMasterVolume(lastVolume || 0.5)
    }
  }

  const shufflePlay = () => {
    const ids = Object.keys(SOUND_LABELS) as SoundId[]
    const candidates = ids.filter(id => !sounds.find(s => s.id === id)?.playing)
    const pool = candidates.length > 0 ? candidates : ids
    const pick = pool[Math.floor(Math.random() * pool.length)]
    onToggleSound(pick)
  }

  return (
    <div className="bottombar">
      <button
        className="icon-btn"
        onClick={onToggleDayNight}
        aria-label={dayNight === "day" ? "Switch to night mode" : "Switch to day mode"}
      >
        {dayNight === "day" ? <Sun size={16} /> : <Moon size={16} />}
      </button>

      <span className="track-pill">
        <span className={`track-pill-dot ${playing.length === 0 ? "silent" : ""}`} />
        {trackLabel}
      </span>

      <div className="bottombar-volume">
        <button className="icon-btn" style={{ width: 32, height: 32 }} onClick={toggleMute} aria-label={masterVolume > 0 ? "Mute" : "Unmute"}>
          {masterVolume > 0 ? <Volume2 size={15} /> : <VolumeX size={15} />}
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={masterVolume}
          onChange={e => onSetMasterVolume(parseFloat(e.target.value))}
          className="volume-slider"
          aria-label="Master ambient volume"
        />
      </div>

      <div className="bottombar-actions">
        <button className="icon-btn" style={{ width: 34, height: 34 }} onClick={shufflePlay} aria-label="Play a random ambient sound">
          <Shuffle size={15} />
        </button>
        <button className="icon-btn" style={{ width: 34, height: 34 }} onClick={onStopAll} aria-label="Stop all ambient sounds">
          <Repeat size={15} />
        </button>
      </div>
    </div>
  )
}

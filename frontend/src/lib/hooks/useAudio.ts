"use client"
import { useCallback, useEffect, useRef, useState } from "react"
import { audioEngine } from "@/lib/audio-engine"
import type { SoundId, SoundState } from "@/lib/storage/types"
import { localStorageProvider } from "@/lib/storage"

const SOUNDS_KEY = "focusflow_sounds"

const defaultSounds: SoundState[] = [
  { id: "rain", playing: false, volume: 0.5 },
  { id: "ocean", playing: false, volume: 0.5 },
  { id: "stream", playing: false, volume: 0.5 },
  { id: "wind", playing: false, volume: 0.5 },
  { id: "forest", playing: false, volume: 0.5 },
  { id: "fireplace", playing: false, volume: 0.5 },
  { id: "cafe", playing: false, volume: 0.5 },
  { id: "night", playing: false, volume: 0.5 },
]

export function useAudio() {
  const [sounds, setSounds] = useState<SoundState[]>(defaultSounds)
  const [masterVolume, setMasterVolume] = useState(0.5)
  const loaded = useRef(false)

  useEffect(() => {
    const saved = localStorageProvider.get<SoundState[]>(SOUNDS_KEY)
    if (saved) setSounds(saved)
    loaded.current = true
  }, [])

  useEffect(() => {
    if (loaded.current) {
      localStorageProvider.set(SOUNDS_KEY, sounds)
    }
  }, [sounds])

  const toggle = useCallback((id: SoundId) => {
    setSounds(prev =>
      prev.map(s => {
        if (s.id !== id) return s
        if (s.playing) {
          audioEngine.stop(id)
          return { ...s, playing: false }
        }
        audioEngine.play(id, s.volume * masterVolume)
        return { ...s, playing: true }
      })
    )
  }, [masterVolume])

  const setVolume = useCallback((id: SoundId, volume: number) => {
    setSounds(prev =>
      prev.map(s => {
        if (s.id !== id) return s
        audioEngine.setVolume(id, volume * masterVolume)
        return { ...s, volume }
      })
    )
  }, [masterVolume])

  const setMasterVol = useCallback((vol: number) => {
    setMasterVolume(vol)
    audioEngine.setMasterVolume(vol)
    sounds.forEach(s => {
      if (s.playing) {
        audioEngine.setVolume(s.id, s.volume * vol)
      }
    })
  }, [sounds])

  const stopAll = useCallback(() => {
    audioEngine.stopAll()
    setSounds(prev => prev.map(s => ({ ...s, playing: false })))
  }, [])

  useEffect(() => {
    return () => {
      audioEngine.cleanup()
    }
  }, [])

  return {
    sounds,
    masterVolume,
    toggle,
    setVolume,
    setMasterVolume: setMasterVol,
    stopAll,
  }
}

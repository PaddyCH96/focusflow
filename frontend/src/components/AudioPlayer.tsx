"use client"
import { useState, useRef, useEffect, useCallback } from "react"
import { Volume2, VolumeX, Music, ChevronUp, Headphones } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

type AudioTrack = {
  id: number
  name: string
  url: string
  is_apple_music: boolean
}

let globalAudioCtx: AudioContext | null = null

export default function AudioPlayer({
  mode,
  expanded,
}: {
  mode: "work" | "shortBreak" | "longBreak"
  expanded?: boolean
}) {
  const [tracks, setTracks] = useState<AudioTrack[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [focusTrack, setFocusTrack] = useState<AudioTrack | null>(null)
  const [breakTrack, setBreakTrack] = useState<AudioTrack | null>(null)
  const [volume, setVolume] = useState(0.4)
  const [showMenu, setShowMenu] = useState(false)

  const focusAudioRef = useRef<HTMLAudioElement | null>(null)
  const breakAudioRef = useRef<HTMLAudioElement | null>(null)
  const ctxRef = useRef<AudioContext | null>(null)
  const focusGainRef = useRef<GainNode | null>(null)
  const breakGainRef = useRef<GainNode | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const reqFrameRef = useRef<number>(0)

  useEffect(() => {
    fetch("http://localhost:8000/audio")
      .then((res) => res.json())
      .then((data) => {
        const allTracks: AudioTrack[] = [...data]
        setTracks(allTracks)
        if (allTracks.length >= 2) {
          setFocusTrack(allTracks[0])
          setBreakTrack(allTracks[1])
        }
      })
      .catch(console.error)
  }, [])

  const setupAudio = useCallback(() => {
    if (!ctxRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
      if (!globalAudioCtx) globalAudioCtx = new AudioContextClass()
      ctxRef.current = globalAudioCtx

      const focusAudio = focusAudioRef.current
      const breakAudio = breakAudioRef.current
      if (!focusAudio || !breakAudio) return

      const focusSource = ctxRef.current.createMediaElementSource(focusAudio)
      const breakSource = ctxRef.current.createMediaElementSource(breakAudio)
      const fGain = ctxRef.current.createGain()
      const bGain = ctxRef.current.createGain()
      const analyser = ctxRef.current.createAnalyser()

      analyser.fftSize = 256
      fGain.gain.value = 0
      bGain.gain.value = 0

      focusSource.connect(fGain)
      breakSource.connect(bGain)
      fGain.connect(analyser)
      bGain.connect(analyser)
      analyser.connect(ctxRef.current.destination)

      focusGainRef.current = fGain
      breakGainRef.current = bGain
      analyserRef.current = analyser

      focusAudio.play().catch(console.error)
      breakAudio.play().catch(console.error)

      const dataArray = new Uint8Array(analyser.frequencyBinCount)
      const updateFreq = () => {
        analyser.getByteFrequencyData(dataArray)
        const sum = dataArray.reduce((num, acc) => num + acc, 0)
        const avg = sum / dataArray.length
        window.dispatchEvent(new CustomEvent("audio-freq", { detail: avg / 255 }))
        reqFrameRef.current = requestAnimationFrame(updateFreq)
      }
      updateFreq()
    }

    if (ctxRef.current && focusGainRef.current && breakGainRef.current) {
      const now = ctxRef.current.currentTime
      const currentVolume = volume
      if (mode === "work") {
        focusGainRef.current.gain.cancelScheduledValues(now)
        focusGainRef.current.gain.linearRampToValueAtTime(currentVolume, now + 5)
        breakGainRef.current.gain.cancelScheduledValues(now)
        breakGainRef.current.gain.linearRampToValueAtTime(0, now + 5)
      } else {
        breakGainRef.current.gain.cancelScheduledValues(now)
        breakGainRef.current.gain.linearRampToValueAtTime(currentVolume, now + 5)
        focusGainRef.current.gain.cancelScheduledValues(now)
        focusGainRef.current.gain.linearRampToValueAtTime(0, now + 5)
      }
    }
  }, [isPlaying, mode, volume])

  useEffect(() => {
    if (!isPlaying) return
    setupAudio()
    return () => {}
  }, [isPlaying, setupAudio])

  const togglePlay = () => {
    if (isPlaying) {
      if (focusAudioRef.current) focusAudioRef.current.pause()
      if (breakAudioRef.current) breakAudioRef.current.pause()
      if (reqFrameRef.current) cancelAnimationFrame(reqFrameRef.current)
      setIsPlaying(false)
    } else {
      setIsPlaying(true)
    }
  }

  // If expanded (standalone ambient view), render full panel
  if (expanded) {
    return (
      <div className="glass-panel rounded-2xl p-6 transition-all duration-500">
        <div className="flex items-center gap-2 mb-5 pb-4 border-b border-border-line">
          <Headphones size={16} style={{ color: "var(--primary-dim)" }} />
          <h2 className="heading-serif text-sm tracking-wide text-text-main">Soundscape</h2>
        </div>

        <div className="space-y-4">
          <button
            onClick={togglePlay}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-xl transition-all duration-300 gold-glow"
            style={{
              background: isPlaying
                ? "linear-gradient(135deg, rgba(214,185,138,0.15), rgba(214,185,138,0.05))"
                : "rgba(59,54,50,0.3)",
              border: "1px solid rgba(214,185,138,0.15)",
              color: "var(--primary)",
            }}
          >
            {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
            <span className="text-sm font-medium">{isPlaying ? "Playing" : "Start Soundscape"}</span>
          </button>

          <div>
            <label className="text-[10px] uppercase tracking-widest font-medium block mb-2" style={{ color: "var(--primary-dim)" }}>
              Focus Track
            </label>
            <select
              className="w-full text-xs p-2.5 rounded-xl outline-none transition-all"
              style={{
                background: "rgba(59,54,50,0.3)",
                border: "1px solid var(--border-line)",
                color: "var(--text-main)",
              }}
              onChange={(e) =>
                setFocusTrack(tracks.find((t) => t.id === Number(e.target.value)) || null)
              }
            >
              {tracks.map((t) => (
                <option key={t.id} value={t.id} selected={t.id === focusTrack?.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-widest font-medium block mb-2" style={{ color: "var(--primary-dim)" }}>
              Relax Track
            </label>
            <select
              className="w-full text-xs p-2.5 rounded-xl outline-none transition-all"
              style={{
                background: "rgba(59,54,50,0.3)",
                border: "1px solid var(--border-line)",
                color: "var(--text-main)",
              }}
              onChange={(e) =>
                setBreakTrack(tracks.find((t) => t.id === Number(e.target.value)) || null)
              }
            >
              {tracks.map((t) => (
                <option key={t.id} value={t.id} selected={t.id === breakTrack?.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-border-line">
            <Volume2 size={14} style={{ color: "var(--primary-dim)" }} />
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full h-1 rounded-full appearance-none cursor-pointer"
              style={{
                background: "rgba(59,54,50,0.4)",
                accentColor: "var(--primary)",
              }}
            />
            <span className="text-[10px] w-8 text-right" style={{ color: "var(--primary-dim)" }}>
              {Math.round(volume * 100)}%
            </span>
          </div>
        </div>

        {focusTrack && <audio ref={focusAudioRef} src={focusTrack.url} loop crossOrigin="anonymous" />}
        {breakTrack && <audio ref={breakAudioRef} src={breakTrack.url} loop crossOrigin="anonymous" />}
      </div>
    )
  }

  // Compact header version
  return (
    <div className="relative">
      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute top-full right-0 mt-2 w-56 rounded-xl p-4 z-50"
            style={{
              background: "rgba(42,39,37,0.95)",
              backdropFilter: "blur(20px)",
              border: "1px solid var(--border-line)",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-text-main">Soundscape</span>
              <button onClick={() => setShowMenu(false)} style={{ color: "var(--text-muted)" }}>
                <ChevronUp size={14} className="rotate-180" />
              </button>
            </div>
            <div className="text-[10px] uppercase tracking-wider mb-1.5" style={{ color: "var(--primary-dim)" }}>
              Volume
            </div>
            <div className="flex items-center gap-2">
              <Volume2 size={12} style={{ color: "var(--primary-dim)" }} />
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full h-1 rounded-full appearance-none cursor-pointer"
                style={{
                  background: "rgba(59,54,50,0.4)",
                  accentColor: "var(--primary)",
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-1.5 px-1.5 py-1 rounded-full glass-panel-light">
        <button
          onClick={togglePlay}
          className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300"
          style={{
            background: isPlaying ? "rgba(214,185,138,0.15)" : "transparent",
            color: "var(--primary)",
          }}
        >
          {isPlaying ? <Music size={14} /> : <VolumeX size={14} />}
        </button>
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="text-[10px] font-medium px-2 py-1.5 rounded-full transition-all duration-200"
          style={{ color: "var(--text-muted)" }}
        >
          {mode === "work" ? "Focus" : "Relax"}
        </button>
      </div>

      {focusTrack && <audio ref={focusAudioRef} src={focusTrack.url} loop crossOrigin="anonymous" />}
      {breakTrack && <audio ref={breakAudioRef} src={breakTrack.url} loop crossOrigin="anonymous" />}
    </div>
  )
}

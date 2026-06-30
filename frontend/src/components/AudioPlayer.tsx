"use client"
import { useState, useRef, useEffect } from "react"
import { Volume2, VolumeX, Music, ChevronUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

type AudioTrack = {
  id: number
  name: string
  url: string
  is_apple_music: boolean
}

// Global hook to share web audio context cleanly across remounts if necessary
let globalAudioCtx: AudioContext | null = null

export default function AudioPlayer({ mode }: { mode: "work" | "shortBreak" | "longBreak" }) {
  const [tracks, setTracks] = useState<AudioTrack[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [focusTrack, setFocusTrack] = useState<AudioTrack | null>(null)
  const [breakTrack, setBreakTrack] = useState<AudioTrack | null>(null)
  
  const [volume, setVolume] = useState(0.5)
  const [showMenu, setShowMenu] = useState(false)
  
  const focusAudioRef = useRef<HTMLAudioElement | null>(null)
  const breakAudioRef = useRef<HTMLAudioElement | null>(null)
  
  // Web Audio Nodes
  const ctxRef = useRef<AudioContext | null>(null)
  const focusGainRef = useRef<GainNode | null>(null)
  const breakGainRef = useRef<GainNode | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const reqFrameRef = useRef<number>(0)

  useEffect(() => {
    fetch("http://localhost:8000/audio")
      .then(res => res.json())
      .then(data => {
         const sattvaTrack = { id: 999, name: "Ancient Echoes (Sattva)", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3", is_apple_music: false }
         const allTracks: AudioTrack[] = [...data, sattvaTrack]
         setTracks(allTracks)
         if (allTracks.length >= 2) {
           setFocusTrack(allTracks.find((t) => t.id === 999) || allTracks[0])
           setBreakTrack(allTracks[2])
         }
      })
      .catch(console.error)
  }, [])

  // Initialize Web Audio API ONLY on user interaction (isPlaying)
  useEffect(() => {
    if (!isPlaying) return
    
    if (!ctxRef.current) {
      const AudioContext = window.AudioContext || (window as Window & typeof globalThis & { webkitAudioContext?: typeof window.AudioContext }).webkitAudioContext
      if (!globalAudioCtx) globalAudioCtx = new AudioContext()
      ctxRef.current = globalAudioCtx

      const focusAudio = focusAudioRef.current
      const breakAudio = breakAudioRef.current

      if (focusAudio && breakAudio) {
        // Create nodes
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

        // Start playback on both (they loop indefinitely)
        focusAudio.play().catch(console.error)
        breakAudio.play().catch(console.error)
        
        // Broadcast frequency loop
        const dataArray = new Uint8Array(analyser.frequencyBinCount)
        const updateFreq = () => {
          analyser.getByteFrequencyData(dataArray)
          // Calc average volume
          const sum = dataArray.reduce((num, acc) => num + acc, 0)
          const avg = sum / dataArray.length
          // Dispatch custom event for Timer.tsx breath animation
          window.dispatchEvent(new CustomEvent('audio-freq', { detail: (avg / 255) }))
          reqFrameRef.current = requestAnimationFrame(updateFreq)
        }
        updateFreq()
      }
    }

    // Perform the crossfade logic
    if (ctxRef.current && focusGainRef.current && breakGainRef.current) {
       const now = ctxRef.current.currentTime
       const currentVolume = volume
       
       // Calculate cross-fade linearly over 5 seconds
       if (mode === "work") {
         focusGainRef.current.gain.cancelScheduledValues(now)
         focusGainRef.current.gain.linearRampToValueAtTime(currentVolume, now + 5.0)
         
         breakGainRef.current.gain.cancelScheduledValues(now)
         breakGainRef.current.gain.linearRampToValueAtTime(0, now + 5.0)
       } else {
         breakGainRef.current.gain.cancelScheduledValues(now)
         breakGainRef.current.gain.linearRampToValueAtTime(currentVolume, now + 5.0)
         
         focusGainRef.current.gain.cancelScheduledValues(now)
         focusGainRef.current.gain.linearRampToValueAtTime(0, now + 5.0)
       }
    }
    
    return () => {} // Don't destroy nodes, just let them persist to avoid DOMException on re-route
  }, [isPlaying, mode, volume])

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

  return (
    <div className="relative flex flex-col items-center">
      <AnimatePresence>
        {showMenu && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-16 right-0 w-72 bg-white/20 dark:bg-zinc-900/50 backdrop-blur-3xl rounded-2xl p-4 shadow-2xl border border-white/20 dark:border-white/10 z-[60]"
          >
            <div className="flex justify-between items-center mb-4">
               <span className="text-sm font-semibold">Soundscape Engine</span>
               <button onClick={() => setShowMenu(false)} className="text-slate-400 hover:text-black dark:hover:text-white">
                 <ChevronUp size={16} className="rotate-180" />
               </button>
            </div>

            <div className="text-xs text-slate-500 mb-2">Focus Audio</div>
            <select 
               className="w-full text-xs p-2 rounded bg-black/5 dark:bg-white/5 outline-none mb-3"
               onChange={e => setFocusTrack(tracks.find(t => t.id === Number(e.target.value)) || null)}
            >
              {tracks.filter(t => !t.is_apple_music).map(t => (
                <option key={t.id} value={t.id} selected={t.id === focusTrack?.id}>{t.name}</option>
              ))}
            </select>

            <div className="text-xs text-slate-500 mb-2">Relax Audio (Cross-fades on Break)</div>
            <select 
               className="w-full text-xs p-2 rounded bg-black/5 dark:bg-white/5 outline-none mb-4"
               onChange={e => setBreakTrack(tracks.find(t => t.id === Number(e.target.value)) || null)}
            >
              {tracks.filter(t => !t.is_apple_music).map(t => (
                <option key={t.id} value={t.id} selected={t.id === breakTrack?.id}>{t.name}</option>
              ))}
            </select>

            <div className="flex items-center space-x-3 pt-3 border-t border-black/5 dark:border-white/10">
              <Volume2 size={16} className="text-slate-500 shrink-0" />
              <input 
                type="range" 
                min="0" max="1" step="0.05"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center space-x-2 bg-white/40 dark:bg-zinc-900/80 backdrop-blur-xl border border-white/20 dark:border-zinc-700/50 p-2 rounded-full shadow-lg">
         <button 
           onClick={togglePlay}
           className="p-3 rounded-full bg-indigo-500 text-white hover:bg-indigo-600 transition-colors shadow-md"
         >
           {isPlaying ? <Music size={18} className="animate-pulse" /> : <VolumeX size={18} />}
         </button>
         <button 
           onClick={() => setShowMenu(!showMenu)}
           className="px-4 py-2 text-sm font-medium rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
         >
           {mode === "work" ? focusTrack?.name || "Focus" : breakTrack?.name || "Relax"}
         </button>
      </div>

      {focusTrack && <audio ref={focusAudioRef} src={focusTrack.url} loop crossOrigin="anonymous" />}
      {breakTrack && <audio ref={breakAudioRef} src={breakTrack.url} loop crossOrigin="anonymous" />}
    </div>
  )
}

"use client"
import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mic, Square, Play, Pause, Trash2, Clock, Music } from "lucide-react"

type VoiceNote = {
  id: number
  title: string
  file_path: string
  duration: number
  timestamp: string
}

export default function VoiceNotes() {
  const [recordings, setRecordings] = useState<VoiceNote[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [playingId, setPlayingId] = useState<number | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const fetchRecordings = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:8000/voice-notes")
      const data = await res.json()
      setRecordings(data)
    } catch (err) {
      console.error("Failed to fetch recordings:", err)
    }
  }, [])

  useEffect(() => {
    const timeout = setTimeout(() => {
      void fetchRecordings()
    }, 0)
    return () => clearTimeout(timeout)
  }, [fetchRecordings])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })
        const formData = new FormData()
        formData.append("file", audioBlob, "recording.webm")
        formData.append("title", `Vani Note ${new Date().toLocaleTimeString()}`)
        formData.append("duration", String(recordingTime))

        try {
          await fetch("http://localhost:8000/voice-notes", {
            method: "POST",
            body: formData,
          })
          fetchRecordings()
        } catch (err) {
          console.error("Upload failed:", err)
        }

        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    } catch (err) {
      console.error("Error starting recording:", err)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }

  const togglePlayback = (note: VoiceNote) => {
    if (playingId === note.id) {
      audioRef.current?.pause()
      setPlayingId(null)
    } else {
      if (audioRef.current) {
        audioRef.current.src = note.file_path
        audioRef.current.play()
        setPlayingId(note.id)
        audioRef.current.onended = () => setPlayingId(null)
      }
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="w-full h-full max-w-4xl mx-auto p-4 lg:p-8 space-y-8 overflow-y-auto custom-scrollbar">
      <audio ref={audioRef} hidden />

      {/* Recording Control Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="projection-card ethopic-glass rounded-[2.5rem] p-12 flex flex-col items-center space-y-6 text-center"
      >
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-text-main tracking-tight italic">Vani Recorder</h1>
          <p className="text-text-muted text-sm uppercase tracking-widest font-medium">Capture your dharma-thoughts in silence</p>
        </div>

        <div className="relative">
          {isRecording && (
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="absolute inset-0 bg-rose-500 rounded-full blur-2xl z-0"
            />
          )}
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center transition-all ${isRecording ? 'bg-rose-500 text-white animate-pulse' : 'bg-primary text-white hover:scale-105 shadow-[0_0_30px_rgba(244,146,82,0.4)]'}`}
          >
            {isRecording ? <Square size={32} fill="currentColor" /> : <Mic size={32} />}
          </button>
        </div>

        <div className="flex flex-col items-center space-y-1">
          <span className={`text-4xl font-mono font-bold tracking-tighter ${isRecording ? 'text-rose-500' : 'text-text-main'}`}>
            {formatTime(recordingTime)}
          </span>
          <span className="text-[10px] text-text-muted uppercase tracking-widest font-bold">Duration</span>
        </div>
      </motion.div>

      {/* Recordings List */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-text-muted uppercase tracking-widest px-2">Knowledge Treasury (Vani)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence>
            {recordings.map((note) => (
              <motion.div
                key={note.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group bg-surface/60 backdrop-blur-xl border border-border-line rounded-3xl p-5 hover:border-primary/50 transition-all flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => togglePlayback(note)}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${playingId === note.id ? 'bg-primary text-white' : 'bg-surface-hover text-text-main group-hover:bg-primary/10 group-hover:text-primary border border-border-line'}`}
                  >
                    {playingId === note.id ? <Pause size={20} fill="currentColor" /> : <Play size={20} className="ml-1" fill="currentColor" />}
                  </button>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-text-main leading-tight italic">{note.title}</span>
                    <div className="flex items-center space-x-2 text-[10px] text-text-muted font-medium uppercase tracking-wider mt-1">
                      <Clock size={10} />
                      <span>{formatTime(note.duration)}</span>
                      <span>•</span>
                      <span>{new Date(note.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 rounded-lg text-text-muted hover:text-rose-500 hover:bg-rose-500/10 transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {recordings.length === 0 && (
            <div className="col-span-full py-12 flex flex-col items-center text-text-muted opacity-40 italic">
              <Music size={48} className="mb-4" />
              <p className="text-sm tracking-widest">No sound-wisdom found in the archives</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

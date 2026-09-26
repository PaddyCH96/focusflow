"use client"
import { useCallback, useEffect, useRef, useState } from "react"
import { Mic, Square } from "lucide-react"
import type { ApiVoiceNote } from "@/lib/api/types"

function formatTimestamp(ts: string): string {
  return new Date(ts).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, "0")}`
}

export function VoiceNotesView({
  notes,
  onUpload,
  isLoading,
  isUploading,
  error,
}: {
  notes: ApiVoiceNote[]
  onUpload: (blob: Blob, title: string, duration: number) => Promise<boolean>
  isLoading: boolean
  isUploading: boolean
  error: string | null
}) {
  const [isRecording, setIsRecording] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [micError, setMicError] = useState<string | null>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const elapsedRef = useRef(0)

  useEffect(() => {
    elapsedRef.current = elapsed
  }, [elapsed])

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      streamRef.current?.getTracks().forEach(track => track.stop())
    }
  }, [])

  const startRecording = useCallback(async () => {
    setMicError(null)
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setMicError("Voice recording isn't supported in this browser.")
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      chunksRef.current = []
      const recorder = new MediaRecorder(stream)
      recorder.ondataavailable = e => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }
      recorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" })
        stream.getTracks().forEach(track => track.stop())
        streamRef.current = null
        const title = `Recording ${new Date().toLocaleString()}`
        await onUpload(blob, title, elapsedRef.current)
      }
      recorderRef.current = recorder
      recorder.start()
      setIsRecording(true)
      setElapsed(0)
      intervalRef.current = setInterval(() => setElapsed(e => e + 1), 1000)
    } catch {
      setMicError("Microphone access was denied or is unavailable.")
    }
  }, [onUpload])

  const stopRecording = useCallback(() => {
    recorderRef.current?.stop()
    setIsRecording(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  return (
    <div className="view-panel">
      <div className="section-card voice-notes-recorder">
        <h3 className="section-title">Vani — Voice Notes</h3>
        <p className="section-subtitle">Capture a thought before it slips away.</p>
        {(error || micError) && <p className="api-error">{micError ?? error}</p>}
        <div className="recorder-controls">
          {isRecording ? (
            <button className="btn-primary recorder-stop" onClick={stopRecording}>
              <Square size={16} /> Stop &middot; {formatDuration(elapsed)}
            </button>
          ) : (
            <button className="btn-primary" onClick={startRecording} disabled={isUploading}>
              <Mic size={16} /> {isUploading ? "Uploading…" : "Record"}
            </button>
          )}
        </div>
      </div>

      <div className="section-card">
        <h3 className="section-title">Recordings</h3>
        {isLoading ? (
          <p className="empty-hint">Loading recordings…</p>
        ) : notes.length === 0 ? (
          <p className="empty-hint">No voice notes yet. Record your first one above.</p>
        ) : (
          <ul className="voice-note-list">
            {notes.map(note => (
              <li key={note.id} className="voice-note-item">
                <div className="voice-note-meta">
                  <span className="voice-note-title">{note.title}</span>
                  <span className="voice-note-time">{formatTimestamp(note.timestamp)} &middot; {formatDuration(note.duration)}</span>
                </div>
                <audio controls src={note.file_path} className="voice-note-audio" />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

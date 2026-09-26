"use client"
import { useState, useEffect, useCallback } from "react"
import { voiceNotesApi } from "@/lib/api/endpoints"
import type { ApiVoiceNote } from "@/lib/api/types"

function errorMessage(err: unknown, fallback: string): string {
  return err instanceof Error ? err.message : fallback
}

export function useVoiceNotes() {
  const [notes, setNotes] = useState<ApiVoiceNote[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    let cancelled = false
    voiceNotesApi.list()
      .then(list => {
        if (!cancelled) setNotes(list)
      })
      .catch(err => {
        if (!cancelled) setError(errorMessage(err, "Failed to load voice notes"))
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const uploadNote = useCallback((blob: Blob, title: string, duration: number) => {
    setIsUploading(true)
    return voiceNotesApi.upload(blob, title, duration)
      .then(created => {
        setNotes(prev => [created, ...prev])
        return true
      })
      .catch(err => {
        setError(errorMessage(err, "Failed to upload voice note"))
        return false
      })
      .finally(() => setIsUploading(false))
  }, [])

  return { notes, uploadNote, isLoading, isUploading, error }
}

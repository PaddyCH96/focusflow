"use client"
import { useState, useEffect, useCallback } from "react"
import { whiteboardsApi } from "@/lib/api/endpoints"
import type { ApiWhiteboard } from "@/lib/api/types"

function errorMessage(err: unknown, fallback: string): string {
  return err instanceof Error ? err.message : fallback
}

export function useWhiteboards() {
  const [boards, setBoards] = useState<ApiWhiteboard[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    let cancelled = false
    whiteboardsApi.list()
      .then(list => {
        if (!cancelled) setBoards(list)
      })
      .catch(err => {
        if (!cancelled) setError(errorMessage(err, "Failed to load whiteboards"))
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const saveBoard = useCallback((title: string, content: string) => {
    setIsSaving(true)
    return whiteboardsApi.save(title, content)
      .then(() => {
        setBoards(prev => [{ id: Date.now(), title, content, timestamp: new Date().toISOString() }, ...prev])
        return true
      })
      .catch(err => {
        setError(errorMessage(err, "Failed to save whiteboard"))
        return false
      })
      .finally(() => setIsSaving(false))
  }, [])

  return { boards, saveBoard, isLoading, isSaving, error }
}

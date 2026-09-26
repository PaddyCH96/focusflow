"use client"
import { useState, useEffect, useCallback } from "react"
import { sessionsApi } from "@/lib/api/endpoints"
import type { Session } from "@/lib/storage/types"
import type { SessionStatus } from "@/lib/api/types"

function errorMessage(err: unknown, fallback: string): string {
  return err instanceof Error ? err.message : fallback
}

export function useSessions() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadToken, setReloadToken] = useState(0)

  useEffect(() => {
    let cancelled = false
    sessionsApi.list()
      .then(apiSessions => {
        if (!cancelled) setSessions(apiSessions)
      })
      .catch(err => {
        if (!cancelled) setError(errorMessage(err, "Failed to load sessions"))
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [reloadToken])

  const reload = useCallback(() => {
    setIsLoading(true)
    setReloadToken(t => t + 1)
  }, [])

  const logSession = useCallback((duration: number, status: SessionStatus = "completed") => {
    sessionsApi.log(duration, status)
      .then(created => setSessions(prev => [created, ...prev]))
      .catch(err => setError(errorMessage(err, "Failed to log session")))
  }, [])

  return { sessions, logSession, isLoading, error, reload }
}

"use client"
import { useState, useEffect, useCallback, useMemo } from "react"
import { localStorageProvider } from "@/lib/storage"
import type { Session } from "@/lib/storage/types"

const SESSIONS_KEY = "focusflow_sessions"

export function useSessions() {
  const [sessions, setSessions] = useState<Session[]>([])

  useEffect(() => {
    const saved = localStorageProvider.get<Session[]>(SESSIONS_KEY)
    if (saved) setSessions(saved)
  }, [])

  useEffect(() => {
    localStorageProvider.set(SESSIONS_KEY, sessions)
  }, [sessions])

  const addSession = useCallback((session: Session) => {
    setSessions(prev => [session, ...prev])
  }, [])

  const totalFocusMinutes = useMemo(
    () => sessions.filter(s => s.type === "work").reduce((acc, s) => acc + s.duration, 0),
    [sessions]
  )

  return { sessions, addSession, totalFocusMinutes }
}

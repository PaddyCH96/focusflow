"use client"
import { useState, useEffect, useCallback } from "react"
import { journalApi } from "@/lib/api/endpoints"
import type { ApiJournalEntry } from "@/lib/api/types"

function errorMessage(err: unknown, fallback: string): string {
  return err instanceof Error ? err.message : fallback
}

export function useJournal() {
  const [entries, setEntries] = useState<ApiJournalEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    journalApi.list()
      .then(list => {
        if (!cancelled) setEntries(list)
      })
      .catch(err => {
        if (!cancelled) setError(errorMessage(err, "Failed to load journal entries"))
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const addEntry = useCallback((text: string) => {
    journalApi.create(text)
      .then(created => setEntries(prev => [created, ...prev]))
      .catch(err => setError(errorMessage(err, "Failed to save journal entry")))
  }, [])

  return { entries, addEntry, isLoading, error }
}

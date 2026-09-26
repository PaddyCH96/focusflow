"use client"
import { useState, useEffect } from "react"
import { heatmapApi } from "@/lib/api/endpoints"
import type { ApiHeatmapDay } from "@/lib/api/types"

export function useHeatmap() {
  const [days, setDays] = useState<ApiHeatmapDay[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    heatmapApi.get()
      .then(list => {
        if (!cancelled) setDays(list)
      })
      .catch(err => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load heatmap")
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return { days, isLoading, error }
}

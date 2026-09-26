"use client"
import { useState, useEffect, useCallback } from "react"
import { tasksApi } from "@/lib/api/endpoints"
import type { Task } from "@/lib/storage/types"

function toTask(apiTask: { id: number; title: string; completed: boolean }): Task {
  return { id: apiTask.id, text: apiTask.title, completed: apiTask.completed }
}

function errorMessage(err: unknown, fallback: string): string {
  return err instanceof Error ? err.message : fallback
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadToken, setReloadToken] = useState(0)

  useEffect(() => {
    let cancelled = false
    tasksApi.list()
      .then(apiTasks => {
        if (!cancelled) setTasks(apiTasks.map(toTask))
      })
      .catch(err => {
        if (!cancelled) setError(errorMessage(err, "Failed to load tasks"))
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

  const addTask = useCallback((text: string) => {
    tasksApi.create(text)
      .then(created => setTasks(prev => [...prev, toTask(created)]))
      .catch(err => setError(errorMessage(err, "Failed to add task")))
  }, [])

  const toggleTask = useCallback((id: number) => {
    setTasks(prev => {
      const target = prev.find(t => t.id === id)
      if (!target) return prev
      const nextCompleted = !target.completed
      tasksApi.setCompleted(id, nextCompleted).catch(err => {
        setError(errorMessage(err, "Failed to update task"))
        setTasks(p => p.map(t => (t.id === id ? { ...t, completed: target.completed } : t)))
      })
      return prev.map(t => (t.id === id ? { ...t, completed: nextCompleted } : t))
    })
  }, [])

  const deleteTask = useCallback((id: number) => {
    setTasks(prev => {
      const removed = prev.find(t => t.id === id)
      tasksApi.remove(id).catch(err => {
        setError(errorMessage(err, "Failed to delete task"))
        if (removed) setTasks(p => [...p, removed].sort((a, b) => a.id - b.id))
      })
      return prev.filter(t => t.id !== id)
    })
  }, [])

  return { tasks, addTask, toggleTask, deleteTask, isLoading, error, reload }
}

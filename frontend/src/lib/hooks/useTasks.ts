"use client"
import { useState, useEffect, useCallback } from "react"
import { localStorageProvider } from "@/lib/storage"
import type { Task } from "@/lib/storage/types"

const TASKS_KEY = "focusflow_tasks"

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    const saved = localStorageProvider.get<Task[]>(TASKS_KEY)
    if (saved) setTasks(saved)
  }, [])

  useEffect(() => {
    localStorageProvider.set(TASKS_KEY, tasks)
  }, [tasks])

  const addTask = useCallback((text: string) => {
    setTasks(prev => [
      ...prev,
      { id: crypto.randomUUID(), text, completed: false, createdAt: new Date().toISOString() },
    ])
  }, [])

  const toggleTask = useCallback((id: string) => {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)))
  }, [])

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id))
  }, [])

  return { tasks, addTask, toggleTask, deleteTask }
}

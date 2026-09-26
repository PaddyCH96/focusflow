"use client"
import { localStorageProvider } from "@/lib/storage"
import { tasksApi, sessionsApi } from "@/lib/api/endpoints"

const MIGRATED_KEY = "focusflow_migrated_v1"
const LEGACY_TASKS_KEY = "focusflow_tasks"
const LEGACY_SESSIONS_KEY = "focusflow_sessions"

interface LegacyTask {
  text: string
  completed: boolean
}

interface LegacySession {
  duration: number
  type?: "work" | "shortBreak" | "longBreak"
}

/**
 * One-time upgrade path: earlier builds kept tasks and sessions in
 * localStorage. Now that they live in the backend, push whatever is still
 * sitting in localStorage up once, then stop looking at it. Guarded by a
 * flag so it never re-runs (and never re-creates duplicates) after the
 * first successful pass.
 */
export async function migrateLocalDataToBackend(): Promise<boolean> {
  if (typeof window === "undefined") return false
  if (localStorage.getItem(MIGRATED_KEY)) return false

  const legacyTasks = localStorageProvider.get<LegacyTask[]>(LEGACY_TASKS_KEY) ?? []
  const legacySessions = localStorageProvider.get<LegacySession[]>(LEGACY_SESSIONS_KEY) ?? []

  if (legacyTasks.length === 0 && legacySessions.length === 0) {
    localStorage.setItem(MIGRATED_KEY, "1")
    return false
  }

  for (const task of legacyTasks) {
    try {
      const created = await tasksApi.create(task.text)
      if (task.completed) await tasksApi.setCompleted(created.id, true)
    } catch {
      // Backend unreachable or rejected the row — leave the flag unset so we retry next load.
      return false
    }
  }

  for (const session of legacySessions) {
    if (session.type && session.type !== "work") continue
    try {
      await sessionsApi.log(session.duration, "completed")
    } catch {
      return false
    }
  }

  localStorageProvider.remove(LEGACY_TASKS_KEY)
  localStorageProvider.remove(LEGACY_SESSIONS_KEY)
  localStorage.setItem(MIGRATED_KEY, "1")
  return true
}

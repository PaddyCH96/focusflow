import type { StorageProvider } from "./provider"

export const localStorageProvider: StorageProvider = {
  get: <T>(key: string): T | null => {
    if (typeof window === "undefined") return null
    try {
      const raw = localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : null
    } catch {
      return null
    }
  },
  set: <T>(key: string, value: T): void => {
    if (typeof window === "undefined") return
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
    }
  },
  remove: (key: string): void => {
    if (typeof window === "undefined") return
    try {
      localStorage.removeItem(key)
    } catch {
    }
  },
}

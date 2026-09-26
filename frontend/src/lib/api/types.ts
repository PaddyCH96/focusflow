export interface ApiTask {
  id: number
  title: string
  completed: boolean
}

export type SessionStatus = "completed" | "failed"

export interface ApiSession {
  id: number
  duration: number
  status: SessionStatus
  timestamp: string
}

export interface ApiJournalEntry {
  id: number
  text: string
  timestamp: string
}

export interface ApiVoiceNote {
  id: number
  title: string
  file_path: string
  duration: number
  timestamp: string
}

export interface ApiWhiteboard {
  id: number
  title: string
  content: string
  timestamp: string
}

export interface ApiHistoryEvent {
  id: number
  type: "task" | "session" | "journal"
  title: string
  timestamp: string
}

export interface ApiHeatmapDay {
  date: string
  focus_score: number
  sessions_completed: number
  sessions_failed: number
}

import { api } from "./client"
import type {
  ApiTask,
  ApiSession,
  SessionStatus,
  ApiJournalEntry,
  ApiVoiceNote,
  ApiWhiteboard,
  ApiHistoryEvent,
  ApiHeatmapDay,
} from "./types"

export const tasksApi = {
  list: () => api.get<ApiTask[]>("/tasks"),
  create: (title: string) => api.post<ApiTask>("/tasks", { title }),
  setCompleted: (id: number, completed: boolean) => api.put<ApiTask>(`/tasks/${id}`, { completed }),
  remove: (id: number) => api.delete<void>(`/tasks/${id}`),
}

export const sessionsApi = {
  list: () => api.get<ApiSession[]>("/sessions"),
  log: (duration: number, status: SessionStatus = "completed") =>
    api.post<ApiSession>("/sessions", { duration, status }),
}

export const journalApi = {
  list: () => api.get<ApiJournalEntry[]>("/journal"),
  create: (text: string) => api.post<ApiJournalEntry>("/journal", { text }),
}

export const voiceNotesApi = {
  list: () => api.get<ApiVoiceNote[]>("/voice-notes"),
  upload: (blob: Blob, title: string, duration: number) => {
    const formData = new FormData()
    formData.append("file", blob, `${title}.webm`)
    formData.append("title", title)
    formData.append("duration", String(duration))
    return api.upload<ApiVoiceNote>("/voice-notes", formData)
  },
}

export const whiteboardsApi = {
  list: () => api.get<ApiWhiteboard[]>("/whiteboards"),
  save: (title: string, content: string) =>
    api.post<{ id: number; status: string }>("/whiteboards", { title, content }),
}

export const historyApi = {
  get: () => api.get<{ events: ApiHistoryEvent[] }>("/history"),
}

export const heatmapApi = {
  get: () => api.get<ApiHeatmapDay[]>("/analytics/heatmap"),
}

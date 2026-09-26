"use client"
import { forwardRef, useState } from "react"
import { CheckCircle2, Circle, Trash2 } from "lucide-react"
import type { Task } from "@/lib/storage/types"

export const TasksView = forwardRef<HTMLInputElement, {
  tasks: Task[]
  onAddTask: (text: string) => void
  onToggleTask: (id: number) => void
  onDeleteTask: (id: number) => void
  isLoading?: boolean
  error?: string | null
}>(function TasksView({ tasks, onAddTask, onToggleTask, onDeleteTask, isLoading, error }, ref) {
  const [taskInput, setTaskInput] = useState("")

  const submit = () => {
    if (taskInput.trim()) {
      onAddTask(taskInput.trim())
      setTaskInput("")
    }
  }

  return (
    <div className="view-panel">
      <div className="section-card">
        <h3 className="section-title">Daily Tasks</h3>
        {error && <p className="api-error">{error}</p>}
        <div className="task-input-row">
          <input
            ref={ref}
            className="task-input"
            placeholder="Add a task..."
            value={taskInput}
            onChange={e => setTaskInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter") submit()
            }}
          />
          <button className="btn-primary" onClick={submit}>Add</button>
        </div>
        {isLoading ? (
          <p className="empty-hint">Loading tasks…</p>
        ) : tasks.length === 0 ? (
          <p className="empty-hint">No tasks yet. Add your first focus task above.</p>
        ) : (
          <ul className="task-list">
            {tasks.map(task => (
              <li key={task.id} className={`task-item ${task.completed ? "completed" : ""}`}>
                <button className="task-check" onClick={() => onToggleTask(task.id)} aria-label={task.completed ? "Mark incomplete" : "Mark complete"}>
                  {task.completed ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                </button>
                <span className="task-text">{task.text}</span>
                <button className="task-delete" onClick={() => onDeleteTask(task.id)} aria-label={`Delete task: ${task.text}`}>
                  <Trash2 size={14} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
})

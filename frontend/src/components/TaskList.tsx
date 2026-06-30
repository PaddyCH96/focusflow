"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, Circle, Plus, ListTodo } from "lucide-react"

type Task = {
  id: number
  title: string
  completed: boolean
}

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState("")

  const fetchTasks = () => {
    fetch("http://localhost:8000/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch(console.error)
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const handleAddTask = async () => {
    if (!newTask.trim()) return
    const currentTask = newTask
    setNewTask("")
    try {
      const res = await fetch("http://localhost:8000/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: currentTask }),
      })
      if (res.ok) fetchTasks()
      else setNewTask(currentTask)
    } catch {
      setNewTask(currentTask)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddTask()
    }
  }

  const toggleTask = async (id: number, completed: boolean) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !completed } : t)))
    await fetch(`http://localhost:8000/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !completed }),
    })
    fetchTasks()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel rounded-2xl p-6 transition-all duration-500"
    >
      <div className="flex items-center gap-2 mb-5 pb-4 border-b border-border-line">
        <ListTodo size={16} style={{ color: "var(--primary-dim)" }} />
        <h2 className="heading-serif text-sm tracking-wide text-text-main">Practice</h2>
        <span className="text-xs ml-auto" style={{ color: "var(--primary-dim)" }}>
          {tasks.filter((t) => t.completed).length}/{tasks.length}
        </span>
      </div>

      <div className="space-y-1.5 mb-5 max-h-[50vh] overflow-y-auto custom-scrollbar pr-1">
        <AnimatePresence>
          {tasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              onClick={() => toggleTask(task.id, task.completed)}
              className="group flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200"
              style={{
                background: task.completed ? "rgba(214,185,138,0.03)" : "rgba(59,54,50,0.2)",
              }}
            >
              <button className="mt-0.5 shrink-0">
                {task.completed ? (
                  <CheckCircle2 size={16} style={{ color: "var(--primary-dim)" }} />
                ) : (
                  <Circle size={16} style={{ color: "var(--text-muted)" }} />
                )}
              </button>
              <span
                className={`text-sm leading-tight pt-0.5 ${
                  task.completed
                    ? "line-through opacity-40"
                    : "text-text-main"
                }`}
              >
                {task.title}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
        {tasks.length === 0 && (
          <div className="text-center text-sm text-text-muted py-10">
            No tasks yet. Add your first practice.
          </div>
        )}
      </div>

      <div className="relative">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a task..."
          className="w-full px-4 py-3 pr-12 rounded-xl text-sm outline-none transition-all duration-300"
          style={{
            background: "rgba(59,54,50,0.2)",
            border: "1px solid var(--border-line)",
            color: "var(--text-main)",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "rgba(214,185,138,0.3)"
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "var(--border-line)"
          }}
        />
        <button
          onClick={handleAddTask}
          disabled={!newTask.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-all duration-200 disabled:opacity-30"
          style={{
            color: "var(--primary)",
            background: newTask.trim() ? "rgba(214,185,138,0.1)" : "transparent",
          }}
        >
          <Plus size={16} />
        </button>
      </div>
    </motion.div>
  )
}

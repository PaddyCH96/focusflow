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
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(console.error)
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const handleAddTask = async () => {
    if (!newTask.trim()) return
    const currentTask = newTask
    setNewTask("") // Optimistic input clear
    try {
      const res = await fetch("http://localhost:8000/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: currentTask })
      })
      if (res.ok) {
        fetchTasks()
      } else {
        setNewTask(currentTask) // Revert on fail
      }
    } catch (e) {
      console.error(e)
      setNewTask(currentTask)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTask()
    }
  }

  const toggleTask = async (id: number, completed: boolean) => {
    // Optimistic UI update
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !completed } : t))
    await fetch(`http://localhost:8000/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !completed })
    })
    fetchTasks()
  }

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="projection-card ethopic-glass rounded-2xl p-6 w-80 h-[400px] flex flex-col transition-colors duration-500"
    >
      <div className="flex items-center space-x-2 text-slate-800 dark:text-slate-200 mb-6 border-b border-black/5 dark:border-white/10 pb-4 shrink-0">
        <ListTodo size={18} className="text-teal-500" />
        <h2 className="font-semibold text-sm tracking-wide">MINI KANBAN</h2>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
        <AnimatePresence>
          {tasks.map(task => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={() => toggleTask(task.id, task.completed)}
              className={`group flex items-start space-x-3 p-3 rounded-xl cursor-pointer transition-all ${task.completed ? 'bg-ambient opacity-50' : 'bg-surface-hover hover:shadow-md border border-border-line'}`}
            >
              <button className="mt-0.5 shrink-0 transition-colors">
                {task.completed ? <CheckCircle2 size={18} className="text-emerald-500" /> : <Circle size={18} className="text-slate-400 group-hover:text-amber-500" />}
              </button>
              <span className={`text-sm leading-tight pt-0.5 ${task.completed ? 'line-through text-slate-500' : 'text-slate-800 dark:text-slate-200'}`}>
                {task.title}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
        {tasks.length === 0 && (
          <div className="text-center text-sm font-medium text-slate-400 mt-10">
            No tasks yet. Stay focused!
          </div>
        )}
      </div>

      {/* Button Glitch Fix: Replaced form wrapper with explicit click and keydown handlers */}
      <div className="mt-4 pt-4 border-t border-black/5 dark:border-white/10 relative">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a new task..."
          className="w-full bg-ambient border border-border-line focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 text-sm outline-none transition-all pr-12 text-text-main placeholder:text-text-muted"
        />
        <button 
          onClick={handleAddTask}
          disabled={!newTask.trim()}
          className="absolute right-2 top-1/2 mt-2 -translate-y-1/2 p-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white disabled:opacity-50 disabled:bg-slate-300 transition-colors cursor-pointer"
        >
          <Plus size={16} />
        </button>
      </div>
    </motion.div>
  )
}

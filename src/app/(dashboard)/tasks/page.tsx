"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Plus, CheckSquare, Square, Clock, AlertTriangle, Flag,
  Trash2, Calendar, Filter,
} from "lucide-react"
import { formatDate } from "@/lib/utils"

interface Task {
  id: string
  title: string
  description: string | null
  dueDate: string | null
  priority: string
  completed: boolean
  completedAt: string | null
  category: string | null
  createdAt: string
}

const priorityConfig: Record<string, { color: string; label: string }> = {
  low: { color: "text-blue-400", label: "Low" },
  medium: { color: "text-yellow-400", label: "Medium" },
  high: { color: "text-orange-400", label: "High" },
  urgent: { color: "text-red-400", label: "Urgent" },
}

const categoryLabels: Record<string, string> = {
  "follow-up": "Follow-up",
  compliance: "Compliance",
  viewing: "Viewing",
  offer: "Offer",
  general: "General",
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [filterPriority, setFilterPriority] = useState("all")
  const [showCompleted, setShowCompleted] = useState(false)

  useEffect(() => { loadTasks() }, [])

  async function loadTasks() {
    const res = await fetch("/api/tasks")
    setTasks(await res.json())
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: formData.get("title"),
        description: formData.get("description") || null,
        dueDate: formData.get("dueDate") ? new Date(formData.get("dueDate") as string).toISOString() : null,
        priority: formData.get("priority") || "medium",
        category: formData.get("category") || null,
      }),
    })
    setDialogOpen(false)
    loadTasks()
  }

  async function toggleComplete(id: string, completed: boolean) {
    await fetch(`/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !completed }),
    })
    loadTasks()
  }

  async function deleteTask(id: string) {
    if (!confirm("Delete this task?")) return
    await fetch(`/api/tasks/${id}`, { method: "DELETE" })
    loadTasks()
  }

  const activeTasks = tasks.filter((t) => !t.completed)
  const completedTasks = tasks.filter((t) => t.completed)
  const overdueTasks = activeTasks.filter((t) => t.dueDate && new Date(t.dueDate) < new Date())
  const todayTasks = activeTasks.filter((t) => {
    if (!t.dueDate) return false
    const due = new Date(t.dueDate)
    const today = new Date()
    return due.toDateString() === today.toDateString()
  })

  const displayTasks = (showCompleted ? completedTasks : activeTasks).filter((t) =>
    filterPriority === "all" || t.priority === filterPriority
  )

  function isOverdue(task: Task) {
    return task.dueDate && new Date(task.dueDate) < new Date() && !task.completed
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tasks</h1>
          <p className="text-muted-foreground">{activeTasks.length} active tasks</p>
        </div>
        <Button
          className="gap-2 bg-gradient-to-r from-[oklch(0.72_0.19_230)] to-[oklch(0.68_0.16_290)] text-white border-0 hover:opacity-90"
          onClick={() => setDialogOpen(true)}
        >
          <Plus className="h-4 w-4" /> Add Task
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl stat-icon-blue flex items-center justify-center">
              <CheckSquare className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{activeTasks.length}</p>
              <p className="text-xs text-muted-foreground">Active</p>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl stat-icon-orange flex items-center justify-center">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{todayTasks.length}</p>
              <p className="text-xs text-muted-foreground">Due Today</p>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl stat-icon-pink flex items-center justify-center">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{overdueTasks.length}</p>
              <p className="text-xs text-muted-foreground">Overdue</p>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl stat-icon-green flex items-center justify-center">
              <CheckSquare className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{completedTasks.length}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 items-center">
        <div className="flex glass rounded-lg overflow-hidden">
          <button
            onClick={() => setShowCompleted(false)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${!showCompleted ? "bg-white/10 text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            Active ({activeTasks.length})
          </button>
          <button
            onClick={() => setShowCompleted(true)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${showCompleted ? "bg-white/10 text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            Completed ({completedTasks.length})
          </button>
        </div>
        <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className="h-10 w-36 rounded-lg px-3 text-sm glass-input">
          <option value="all">All Priority</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* Tasks List */}
      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="glass-card rounded-xl p-4 h-16 animate-shimmer" />
          ))}
        </div>
      ) : displayTasks.length === 0 ? (
        <div className="glass-card rounded-xl py-16 text-center">
          <CheckSquare className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground">
            {showCompleted ? "No completed tasks" : "No active tasks. Well done!"}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {displayTasks.map((task) => {
            const pConfig = priorityConfig[task.priority] || priorityConfig.medium
            return (
              <div
                key={task.id}
                className={`glass-card rounded-xl p-4 flex items-start gap-3 ${isOverdue(task) ? "border-red-500/30" : ""}`}
              >
                <button
                  onClick={() => toggleComplete(task.id, task.completed)}
                  className="mt-0.5 flex-shrink-0"
                >
                  {task.completed ? (
                    <CheckSquare className="h-5 w-5 text-green-400" />
                  ) : (
                    <Square className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`font-medium text-sm ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                    {task.title}
                  </p>
                  {task.description && (
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{task.description}</p>
                  )}
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className={`flex items-center gap-1 text-[10px] font-medium ${pConfig.color}`}>
                      <Flag className="h-3 w-3" /> {pConfig.label}
                    </span>
                    {task.category && (
                      <span className="text-[10px] text-muted-foreground glass rounded-full px-2 py-0.5">
                        {categoryLabels[task.category] || task.category}
                      </span>
                    )}
                    {task.dueDate && (
                      <span className={`flex items-center gap-1 text-[10px] ${isOverdue(task) ? "text-red-400" : "text-muted-foreground"}`}>
                        <Clock className="h-3 w-3" />
                        {isOverdue(task) ? "Overdue: " : "Due: "}
                        {formatDate(task.dueDate)}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-muted-foreground/50 hover:text-red-400 transition-colors flex-shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* Add Task Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="glass-dialog">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input name="title" required placeholder="Follow up with client..." className="glass-input" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea name="description" rows={2} placeholder="Details..." className="glass-input" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label>Priority</Label>
                <select name="priority" defaultValue="medium" className="w-full h-10 rounded-lg px-3 text-sm glass-input">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <select name="category" className="w-full h-10 rounded-lg px-3 text-sm glass-input">
                  <option value="">None</option>
                  <option value="follow-up">Follow-up</option>
                  <option value="compliance">Compliance</option>
                  <option value="viewing">Viewing</option>
                  <option value="offer">Offer</option>
                  <option value="general">General</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Due Date</Label>
                <Input name="dueDate" type="date" className="glass-input" />
              </div>
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-[oklch(0.72_0.19_230)] to-[oklch(0.68_0.16_290)] text-white border-0">
              Create Task
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

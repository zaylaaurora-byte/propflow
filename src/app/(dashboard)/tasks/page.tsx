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

const priorityConfig: Record<string, { color: string; badge: string; label: string }> = {
  low: { color: "text-blue-400", badge: "badge-low", label: "Low" },
  medium: { color: "text-yellow-400", badge: "badge-medium", label: "Medium" },
  high: { color: "text-orange-400", badge: "badge-high", label: "High" },
  urgent: { color: "text-red-400", badge: "badge-urgent", label: "Urgent" },
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
        <div className="flex items-center gap-3">
          <div className="page-header-icon stat-icon-purple">
            <CheckSquare className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-3xl font-bold gradient-text">Tasks</h1>
            <p className="text-muted-foreground">{activeTasks.length} active tasks</p>
          </div>
        </div>
        <button
          className="btn-gradient rounded-xl px-5 py-2.5 text-sm font-semibold flex items-center gap-2"
          onClick={() => setDialogOpen(true)}
        >
          <Plus className="h-4 w-4" /> Add Task
        </button>
      </div>
      <div className="neon-line mt-4" />

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl stat-icon-blue flex items-center justify-center">
              <CheckSquare className="h-5 w-5" />
            </div>
            <div>
              <p className="text-3xl font-bold">{activeTasks.length}</p>
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
              <p className="text-3xl font-bold">{todayTasks.length}</p>
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
              <p className="text-3xl font-bold">{overdueTasks.length}</p>
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
              <p className="text-3xl font-bold">{completedTasks.length}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 items-center">
        <div className="flex glass rounded-lg overflow-hidden border border-white/[0.06]">
          <button
            onClick={() => setShowCompleted(false)}
            className={`px-5 py-2.5 text-sm font-semibold transition-colors ${!showCompleted ? "bg-white/15 text-foreground border-b-2 border-b-purple-400" : "text-muted-foreground hover:text-foreground hover:bg-white/5"}`}
          >
            Active ({activeTasks.length})
          </button>
          <button
            onClick={() => setShowCompleted(true)}
            className={`px-5 py-2.5 text-sm font-semibold transition-colors ${showCompleted ? "bg-white/15 text-foreground border-b-2 border-b-purple-400" : "text-muted-foreground hover:text-foreground hover:bg-white/5"}`}
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
                className={`glass-card rounded-xl p-4 flex items-start gap-3 border border-white/[0.08] ${isOverdue(task) ? "border-l-2 border-l-red-500/60" : ""}`}
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
                    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${pConfig.badge}`}>
                      <Flag className="h-3 w-3" /> {pConfig.label}
                    </span>
                    {task.category && (
                      <span className="text-[11px] font-medium text-muted-foreground glass rounded-full px-2.5 py-0.5 border border-white/[0.06]">
                        {categoryLabels[task.category] || task.category}
                      </span>
                    )}
                    {task.dueDate && (
                      <span className={`flex items-center gap-1 text-[11px] ${isOverdue(task) ? "text-red-400 font-semibold" : "text-muted-foreground"}`}>
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
        <DialogContent className="glass-dialog border-white/[0.08]">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-white/80">Title</Label>
              <Input name="title" required placeholder="Follow up with client..." className="glass-input" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-white/80">Description</Label>
              <Textarea name="description" rows={2} placeholder="Details..." className="glass-input" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-white/80">Priority</Label>
                <select name="priority" defaultValue="medium" className="w-full h-10 rounded-lg px-3 text-sm glass-input">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-white/80">Category</Label>
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
                <Label className="text-sm font-medium text-white/80">Due Date</Label>
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

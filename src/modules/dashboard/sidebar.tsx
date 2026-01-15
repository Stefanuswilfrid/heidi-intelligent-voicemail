"use client"

import { AlertCircle, Calendar, Clock, CheckCircle2, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  currentFilter: string
  onFilterChange: (filter: string) => void
  counts: {
    urgent: number
    today: number
    routine: number
    needsReview: number
    done: number
  }
}

export function Sidebar({ currentFilter, onFilterChange, counts }: SidebarProps) {
  const filters = [
    { id: "all", label: "All Active", icon: Clock, count: counts.urgent + counts.today + counts.routine },
    { id: "urgent", label: "Urgent", icon: AlertCircle, count: counts.urgent, color: "text-red-600" },
    { id: "today", label: "Today", icon: Calendar, count: counts.today, color: "text-amber-600" },
    { id: "routine", label: "Routine", icon: Clock, count: counts.routine, color: "text-emerald-600" },
    { id: "needs-review", label: "Needs Review", icon: AlertTriangle, count: counts.needsReview },
    { id: "done", label: "Done", icon: CheckCircle2, count: counts.done },
  ]

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col">
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-semibold text-secondary">Heidi Calls</h1>
        <p className="text-sm text-muted-foreground mt-1">Voicemail Triage</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {filters.map((filter) => {
          const Icon = filter.icon
          return (
            <button
              key={filter.id}
              onClick={() => onFilterChange(filter.id)}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                currentFilter === filter.id
                  ? "bg-secondary text-secondary-foreground"
                  : "text-foreground hover:bg-muted",
              )}
            >
              <span className="flex items-center gap-3">
                <Icon className={cn("h-4 w-4", filter.color)} />
                {filter.label}
              </span>
              {filter.count > 0 && (
                <span
                  className={cn(
                    "px-2 py-0.5 rounded-full text-xs font-semibold",
                    currentFilter === filter.id
                      ? "bg-secondary-foreground text-secondary"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {filter.count}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <p className="text-xs text-muted-foreground">Last updated: {new Date().toLocaleTimeString()}</p>
      </div>
    </aside>
  )
}

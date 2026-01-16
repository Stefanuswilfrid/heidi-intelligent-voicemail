"use client"

import { AlertCircle, Calendar, Clock, CheckCircle2, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

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
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  useEffect(() => {
    setLastUpdated(new Date())
    const id = window.setInterval(() => setLastUpdated(new Date()), 60_000)
    return () => window.clearInterval(id)
  }, [])

  const filters = [
    { id: "all", label: "All Active", icon: Clock, count: counts.urgent + counts.today + counts.routine },
    { id: "urgent", label: "Urgent", icon: AlertCircle, count: counts.urgent, color: "text-red-600" },
    { id: "today", label: "Today", icon: Calendar, count: counts.today, color: "text-amber-600" },
    { id: "routine", label: "Routine", icon: Clock, count: counts.routine, color: "text-emerald-600" },
    { id: "needs-review", label: "Needs Review", icon: AlertTriangle, count: counts.needsReview },
    { id: "done", label: "Done", icon: CheckCircle2, count: counts.done },
  ]

  return (
    <aside className="w-72 border-r border-border bg-card flex flex-col">
      <div className="p-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-primary grid place-items-center border border-border">
            <span className="text-sm font-black text-primary-foreground">H</span>
          </div>
          <div className="min-w-0">
            <h1 className="text-base font-semibold text-foreground leading-tight">Heidi Calls</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Voicemail triage</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <div className="mb-3 px-2 flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Inbox</span>
          <span className="text-xs text-muted-foreground">
            {counts.urgent + counts.today + counts.routine} active
          </span>
        </div>
        <div className="space-y-1">
        {filters.map((filter) => {
          const Icon = filter.icon
          const isActive = currentFilter === filter.id
          return (
            <button
              key={filter.id}
              onClick={() => onFilterChange(filter.id)}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors border",
                isActive
                  ? "bg-primary/90 text-primary-foreground border-primary"
                  : "text-foreground border-transparent hover:bg-muted",
              )}
            >
              <span className="flex items-center gap-3">
                <span
                  className={cn(
                    "h-8 w-8 rounded-lg grid place-items-center border",
                    isActive ? "bg-primary-foreground/10 border-primary-foreground/20" : "bg-background border-border",
                  )}
                >
                  <Icon className={cn("h-4 w-4", isActive ? "text-primary-foreground" : filter.color)} />
                </span>
                <span className="truncate">{filter.label}</span>
              </span>
              {filter.count > 0 && (
                <span
                  className={cn(
                    "px-2 py-0.5 rounded-full text-xs font-semibold border",
                    isActive
                      ? "bg-primary-foreground/10 text-primary-foreground border-primary-foreground/20"
                      : "bg-muted text-muted-foreground border-border",
                  )}
                >
                  {filter.count}
                </span>
              )}
            </button>
          )
        })}
        </div>
      </nav>

      <div className="p-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          Last updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : "—"}
        </p>
      </div>
    </aside>
  )
}

"use client"

import { AlertCircle, Clock, CheckCircle2, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

interface SidebarProps {
  currentFilter: string
  onFilterChange: (filter: string) => void
  counts: {
    needsAction: number
    needsReview: number
    autoResolved: number
    all: number
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
    {
      id: "needs-action",
      label: "Needs Action",
      icon: AlertCircle,
      count: counts.needsAction,
      color: "text-red-600",
      hintTitle: "Items needing staff action",
      hintBody: "Voicemails that require someone to respond or progress the task.",
    },
    {
      id: "needs-review",
      label: "Needs Review",
      icon: AlertTriangle,
      count: counts.needsReview,
      color: "text-amber-700",
      hintTitle: "Low confidence items",
      hintBody: "The system isn’t sure—review the details and decide the next step.",
    },
    {
      id: "auto-resolved",
      label: "Auto-Resolved",
      icon: CheckCircle2,
      count: counts.autoResolved,
      color: "text-emerald-700",
      hintTitle: "Handled automatically",
      hintBody: "Resolved by the system (e.g. service info, status updates). No staff work needed.",
    },
    {
      id: "all",
      label: "All",
      icon: Clock,
      count: counts.all,
      hintTitle: "Everything",
      hintBody: "All voicemails and actions across every bucket.",
    },
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
            {counts.needsAction} needs action
          </span>
        </div>
        <div className="space-y-1">
        {filters.map((filter) => {
          const Icon = filter.icon
          const isActive = currentFilter === filter.id
          return (
            <div key={filter.id} className="relative group">
              <button
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
                      isActive
                        ? "bg-primary-foreground/10 border-primary-foreground/20"
                        : "bg-background border-border",
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

              {/* Hover preview card (like your reference) */}
              <div
                className={cn(
                  "pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 w-80 rounded-2xl border border-border bg-card shadow-xl",
                  "opacity-0 translate-x-1 invisible transition-all duration-150",
                  "group-hover:opacity-100 group-hover:translate-x-0 group-hover:visible",
                  "group-focus-within:opacity-100 group-focus-within:translate-x-0 group-focus-within:visible",
                  "z-50",
                )}
              >
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-primary/20 border border-primary/30 grid place-items-center shrink-0">
                      <Icon className={cn("h-5 w-5", filter.color)} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-foreground truncate">{filter.hintTitle}</p>
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-muted text-muted-foreground border border-border">
                          {filter.count}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{filter.hintBody}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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

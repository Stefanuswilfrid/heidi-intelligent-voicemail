"use client"

import { Search, Inbox, Users, UserCheck, FileText, Archive,  CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  currentFilter: string
  onFilterChange: (filter: string) => void
  counts: {
    urgent: number
    today: number
    routine: number
    needsReview: number
    autoResolved: number
    done: number
  }
}

export function Sidebar({ currentFilter, onFilterChange, counts }: SidebarProps) {
  const totalActive = counts.urgent + counts.today + counts.routine

  const mainFilters = [
    { id: "urgent", label: "Urgent", icon: UserCheck, count: counts.urgent },
    { id: "needs-review", label: "Needs Review", icon: Users, count: counts.needsReview },
    { id: "auto-resolved", label: "Auto Resolved", icon: FileText, count: counts.autoResolved },
    { id: "all", label: "My Inbox", icon: Inbox, count: totalActive },
    { id: "done", label: "Done", icon: CheckCircle2, count: counts.done },

    { id: "archived", label: "Archived", icon: Archive, count: 0 },
  ]

  const buckets = [
    { id: "today", label: "Today", count: counts.today },
    { id: "routine", label: "Routine", count: counts.routine },
  ]

  return (
    <aside className="w-52 flex flex-col" style={{ backgroundColor: "var(--sidebar-bg)" }}>
      {/* Logo */}
      <div className="px-4 py-4">
        <div className="flex items-center gap-2">
          
          <div className="flex items-center gap-1">
            <span
              className="text-sm font-semibold"
              style={{
                color: "var(--sidebar-foreground)",
                fontFamily:
                  '"Exposure", var(--font-geist-sans), ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
              }}
            >
              Heidi Calls
            </span>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="px-3 mb-2">
        <button
          className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors"
          style={{ color: "var(--sidebar-muted)" }}
        >
          <Search className="h-4 w-4" />
          <span>Search</span>
          <span className="ml-auto text-xs opacity-50">⌘K</span>
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-2">
        <div className="space-y-0.5">
          {mainFilters.map((filter, index) => {
            const Icon = filter.icon
            const isActive = currentFilter === filter.id
            return (
              <button
                key={filter.id}
                onClick={() => onFilterChange(filter.id)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-1.5 rounded-md text-sm transition-all duration-150",
                  "opacity-0 animate-slide-in-left",
                )}
                style={{
                  animationDelay: `${index * 0.03}s`,
                  animationFillMode: "forwards",
                  backgroundColor: isActive ? "var(--sidebar-active)" : "transparent",
                  color: isActive ? "var(--sidebar-foreground)" : "var(--sidebar-muted)",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = "var(--sidebar-hover)"
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = "transparent"
                }}
              >
                <span className="flex items-center gap-2.5">
                  <Icon className="h-4 w-4" />
                  {filter.label}
                </span>
                {filter.count > 0 && (
                  <span
                    className="min-w-[20px] h-5 flex items-center justify-center rounded text-xs font-medium"
                    style={{
                      backgroundColor: isActive ? "var(--primary)" : "transparent",
                      color: isActive ? "var(--primary-foreground)" : "var(--sidebar-muted)",
                    }}
                  >
                    {filter.count}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="px-4 py-3" style={{ borderTop: "1px solid var(--sidebar-border)" }}>
        <div className="flex items-center gap-2 text-xs" style={{ color: "var(--sidebar-muted)" }}>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>Listening for calls</span>
        </div>
      </div>
    </aside>
  )
}

"use client"

import { cn } from "@/lib/utils"
import type { WorkItem } from "@/lib/types"
import { getIntentIcon, getIntentLabel } from "@/lib/intent-utils"
import { Check, Bot } from "lucide-react"

interface VoicemailListProps {
  items: WorkItem[]
  selectedId?: string
  onSelectItem: (item: WorkItem) => void
}

function getRelativeTime(receivedAt: string): string {
  const received = new Date(receivedAt)
  const now = new Date()
  const diffMinutes = Math.floor((now.getTime() - received.getTime()) / (1000 * 60))

  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`
  } else if (diffMinutes < 1440) {
    const hours = Math.floor(diffMinutes / 60)
    return `${hours}h ago`
  } else {
    return received.toLocaleDateString([], { month: "short", day: "numeric" })
  }
}

export function VoicemailList({ items, selectedId, onSelectItem }: VoicemailListProps) {
  if (items.length === 0) {
    return (
      <div className="w-80 flex items-center justify-center border-r border-border bg-card">
        <div className="text-center animate-fade-in-up">
          <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
            <Check className="h-6 w-6 text-emerald-600" />
          </div>
          <p className="text-sm font-semibold text-foreground">All caught up</p>
          <p className="text-xs text-muted-foreground mt-1">No voicemails to review</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-80 border-r border-border bg-card flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground">Your Inbox</h2>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {items.map((item, index) => {
          const Icon = getIntentIcon(item.intent)
          const isSelected = selectedId === item.id
          const staggerClass = `stagger-${Math.min(index + 1, 5)}`

          return (
            <button
              key={item.id}
              onClick={() => onSelectItem(item)}
              className={cn(
                "w-full text-left px-4 py-3 border-b border-border transition-all duration-150",
                "opacity-0 animate-fade-in-up",
                staggerClass,
                isSelected ? "bg-muted/70" : "hover:bg-muted/30",
              )}
            >
              <div className="flex gap-3">
                {/* Urgency Dot */}
                <div className="pt-1.5 flex-shrink-0">
                  <div
                    className={cn(
                      "h-2 w-2 rounded-full",
                      item.urgency === "Urgent" && "bg-red-500",
                      item.urgency === "Today" && "bg-amber-500",
                      item.urgency === "Routine" && "bg-emerald-500",
                    )}
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Title Row */}
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-semibold text-foreground truncate">
                      {item.extractedDetails.patientName || "Unknown caller"}
                    </h3>
                    <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                      {getRelativeTime(item.receivedAt)}
                    </span>
                  </div>

                  {/* Status Badge Row */}
                  <div className="flex items-center gap-1.5 mb-1.5">
                    {item.status === "New" && (
                      <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-primary/20 text-secondary">
                        <Bot className="h-2.5 w-2.5" />
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground truncate">{item.summary.slice(0, 40)}...</span>
                    {item.status === "New" && (
                      <span className="flex-shrink-0 h-2 w-2 rounded-full bg-red-500" />
                    )}
                  </div>

                  {/* Tags Row */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span
                      className={cn(
                        "px-1.5 py-0.5 rounded text-[10px] font-medium",
                        item.urgency === "Urgent" && "bg-red-100 text-red-700",
                        item.urgency === "Today" && "bg-amber-100 text-amber-700",
                        item.urgency === "Routine" && "bg-emerald-100 text-emerald-700",
                      )}
                    >
                      {item.urgency}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground flex items-center gap-0.5">
                      <Icon className="h-2.5 w-2.5" />
                      {getIntentLabel(item.intent)}
                    </span>
                    {item.confidence === "Low" && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-100 text-amber-700">
                        Review
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Processing indicator */}
              {item.status === "In progress" && (
                <div className="flex items-center gap-1.5 mt-2 ml-5">
                  <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-[10px] font-medium text-muted-foreground">HC</span>
                  </div>
                  <span className="text-[10px] text-primary font-medium">Heidi is responding...</span>
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

"use client"

import { cn } from "@/lib/utils"
import type { WorkItem } from "@/lib/types"
import { getIntentIcon, getIntentLabel } from "@/lib/intent-utils"
import { Clock } from "lucide-react"
import { useEffect, useState } from "react"

interface VoicemailListProps {
  items: WorkItem[]
  selectedId?: string
  onSelectItem: (item: WorkItem) => void
}

function ReceivedAtTime({ iso }: { iso: string }) {
  const [label, setLabel] = useState<string>("—")

  useEffect(() => {
    const d = new Date(iso)
    setLabel(d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
  }, [iso])

  return (
    <span suppressHydrationWarning className="tabular-nums">
      {label}
    </span>
  )
}

export function VoicemailList({ items, selectedId, onSelectItem }: VoicemailListProps) {
  if (items.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center border-r border-border bg-background">
        <div className="text-center">
          <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-lg font-medium text-foreground">All caught up!</p>
          <p className="text-sm text-muted-foreground mt-1">No voicemails to review</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 border-r border-border overflow-y-auto bg-background">
      <div className="p-4 border-b border-border bg-card sticky top-0 z-10">
        <h2 className="text-lg font-semibold text-foreground">Voicemails ({items.length})</h2>
      </div>

      <div className="divide-y divide-border">
        {items.map((item) => {
          const Icon = getIntentIcon(item.intent)
          const isAutoResolved = item.handledBy === "Automation" && item.status === "Done"
          const urgencyColor =
            item.urgency === "Urgent"
              ? "bg-red-100 text-red-800 border-red-200"
              : item.urgency === "Today"
                ? "bg-amber-100 text-amber-800 border-amber-200"
                : "bg-emerald-100 text-emerald-800 border-emerald-200"

          return (
            <button
              key={item.id}
              onClick={() => onSelectItem(item)}
              className={cn(
                "w-full p-4 text-left transition-colors hover:bg-muted",
                selectedId === item.id && "bg-accent/10 border-l-4 border-l-secondary",
              )}
            >
              <div className="flex items-start gap-3">
                {isAutoResolved ? (
                  <div className="px-2 py-1 rounded-md text-xs font-semibold border bg-emerald-100 text-emerald-800 border-emerald-200">
                    Auto-resolved
                  </div>
                ) : (
                  <div className={cn("px-2 py-1 rounded-md text-xs font-semibold border", urgencyColor)}>
                    {item.urgency}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-xs font-medium text-muted-foreground">{getIntentLabel(item.intent)}</span>
                    {item.confidence === "Low" && (
                      <span className="text-xs text-amber-600 font-medium">Low confidence</span>
                    )}
                  </div>

                  <h3 className="font-semibold text-foreground mb-1 text-balance">
                    {item.extractedDetails.patientName || "Unknown caller"}
                  </h3>

                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2 text-pretty">{item.summary}</p>

                  {item.missingInfo.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {item.missingInfo.slice(0, 2).map((info) => (
                        <span
                          key={info}
                          className="px-2 py-0.5 bg-amber-50 text-amber-700 text-xs rounded border border-amber-200"
                        >
                          Missing: {info}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-medium text-secondary">→ {item.recommendedNextStep}</span>
                    <ReceivedAtTime iso={item.receivedAt} />
                  </div>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

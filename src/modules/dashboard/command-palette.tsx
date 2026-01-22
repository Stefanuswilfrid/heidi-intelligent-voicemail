"use client"

import { useEffect, useCallback } from "react"
import { Command } from "cmdk"
import {
  Search,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react"
import type { WorkItem } from "@/lib/types"
import { formatRelativeTime } from "@/lib/time-utils"
import { getUrgencyColor } from "@/lib/intent-utils"

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  items: WorkItem[]
  onSelectItem: (item: WorkItem) => void
}

const urgencyIcons: Record<string, typeof AlertCircle> = {
  Urgent: AlertCircle,
  Today: Clock,
  Routine: CheckCircle2,
}

export function CommandPalette({
  open,
  onOpenChange,
  items,
  onSelectItem,
}: CommandPaletteProps) {
  // Handle keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        onOpenChange(!open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [open, onOpenChange])

  const handleSelect = useCallback(
    (item: WorkItem) => {
      onSelectItem(item)
      onOpenChange(false)
    },
    [onSelectItem, onOpenChange]
  )

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={() => onOpenChange(false)}
      />

      {/* Command Dialog */}
      <div className="absolute left-1/2 top-[20%] -translate-x-1/2 w-full max-w-xl animate-scale-in">
        <Command
          className="rounded-xl border shadow-2xl overflow-hidden"
          style={{
            backgroundColor: "var(--card)",
            borderColor: "var(--border)",
          }}
          loop
        >
          <div
            className="flex items-center gap-2 px-4 border-b"
            style={{ borderColor: "var(--border)" }}
          >
            <Search
              className="h-4 w-4 shrink-0"
              style={{ color: "var(--muted-foreground)" }}
            />
            <Command.Input
              placeholder="Search voicemails by patient, intent, or content..."
              className="flex-1 py-4 text-sm bg-transparent outline-none placeholder:text-muted-foreground"
              style={{ color: "var(--foreground)" }}
              autoFocus
            />
            <kbd
              className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border px-1.5 text-[10px] font-medium"
              style={{
                backgroundColor: "var(--muted)",
                borderColor: "var(--border)",
                color: "var(--muted-foreground)",
              }}
            >
              ESC
            </kbd>
          </div>

          <Command.List
            className="max-h-[360px] overflow-y-auto p-2"
            style={{ scrollbarWidth: "thin" }}
          >
            <Command.Empty className="py-12 text-center text-sm text-muted-foreground">
              No voicemails found.
            </Command.Empty>

            <Command.Group
              heading="Voicemails"
              className="text-xs font-medium text-muted-foreground px-2 py-1.5"
            >
              {items.map((item) => {
                const UrgencyIcon = urgencyIcons[item.urgency] || Clock
                const patientName =
                  item.extractedDetails.patientName || "Unknown caller"

                return (
                  <Command.Item
                    key={item.id}
                    value={`${patientName} ${item.intent} ${item.transcript}`}
                    onSelect={() => handleSelect(item)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors group"
                    style={{ color: "var(--foreground)" }}
                  >
                    {/* Urgency indicator */}
                    <div
                      className="shrink-0 h-8 w-8 rounded-lg flex items-center justify-center"
                      style={{
                        backgroundColor: `color-mix(in srgb, ${getUrgencyColor(item.urgency)} 15%, transparent)`,
                      }}
                    >
                      <UrgencyIcon
                        className="h-4 w-4"
                        style={{ color: getUrgencyColor(item.urgency) }}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm truncate">
                          {patientName}
                        </span>
                        <span
                          className="text-xs px-1.5 py-0.5 rounded"
                          style={{
                            backgroundColor: "var(--muted)",
                            color: "var(--muted-foreground)",
                          }}
                        >
                          {item.intent}
                        </span>
                      </div>
                      <p
                        className="text-xs truncate mt-0.5"
                        style={{ color: "var(--muted-foreground)" }}
                      >
                        {item.recommendedNextStep}
                      </p>
                    </div>

                    {/* Time */}
                    <span
                      className="shrink-0 text-xs"
                      style={{ color: "var(--muted-foreground)" }}
                    >
                      {formatRelativeTime(item.receivedAt, "short")}
                    </span>
                  </Command.Item>
                )
              })}
            </Command.Group>
          </Command.List>

          {/* Footer */}
          <div
            className="flex items-center justify-between px-4 py-2 border-t text-xs"
            style={{
              borderColor: "var(--border)",
              color: "var(--muted-foreground)",
            }}
          >
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd
                  className="px-1 py-0.5 rounded text-[10px]"
                  style={{ backgroundColor: "var(--muted)" }}
                >
                  ↑↓
                </kbd>
                navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd
                  className="px-1 py-0.5 rounded text-[10px]"
                  style={{ backgroundColor: "var(--muted)" }}
                >
                  ↵
                </kbd>
                select
              </span>
            </div>
            <span>{items.length} voicemails</span>
          </div>
        </Command>
      </div>
    </div>
  )
}


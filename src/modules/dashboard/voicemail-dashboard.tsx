"use client"

import { useState } from "react"
import { VoicemailList } from "./voicemail-list"
import { Sidebar } from "./sidebar"
import { CommandPalette } from "./command-palette"
import type { WorkItem } from "@/lib/types"
import { mockWorkItems } from "@/lib/mock-data"
import { VoicemailDetail } from "./voicemail-detail"

export function VoicemailDashboard() {
  const [selectedItem, setSelectedItem] = useState<WorkItem | null>(null)
  const [filter, setFilter] = useState<string>("urgent")
  const [workItems, setWorkItems] = useState<WorkItem[]>(mockWorkItems)
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)

  const filteredItems = workItems.filter((item) => {
    if (filter === "all") return true
    // My Inbox = active, non-triage items that are not urgent and not needs-review.
    // (With current mock data, this yields just the "Today + High confidence" item.)
    if (filter === "inbox")
      return item.status !== "Done" && item.status !== "Waiting" && item.urgency !== "Urgent" && item.confidence !== "Low"
    if (filter === "urgent") return item.urgency === "Urgent" && item.status !== "Done" && item.status !== "Waiting"
    if (filter === "today") return item.urgency === "Today" && item.status !== "Done" && item.status !== "Waiting"
    if (filter === "routine") return item.urgency === "Routine" && item.status !== "Done" && item.status !== "Waiting"
    if (filter === "needs-review") return item.confidence === "Low" && item.status !== "Done" && item.status !== "Waiting"
    if (filter === "triage") return item.status === "Waiting"
    if (filter === "auto-resolved") return item.status === "Done" && item.handledBy === "Automation"
    if (filter === "done") return item.status === "Done" && item.handledBy !== "Automation"
    if (filter === "archived") return false
    return true
  })

  const handleStatusChange = (id: string, status: WorkItem["status"]) => {
    setWorkItems((items) => items.map((item) => (item.id === id ? { ...item, status } : item)))
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        currentFilter={filter}
        onFilterChange={setFilter}
        onSearchClick={() => setCommandPaletteOpen(true)}
        counts={{
          inbox: workItems.filter(
            (i) => i.status !== "Done" && i.status !== "Waiting" && i.urgency !== "Urgent" && i.confidence !== "Low",
          ).length,
          all: workItems.length,
          urgent: workItems.filter((i) => i.urgency === "Urgent" && i.status !== "Done" && i.status !== "Waiting").length,
          today: workItems.filter((i) => i.urgency === "Today" && i.status !== "Done" && i.status !== "Waiting").length,
          routine: workItems.filter((i) => i.urgency === "Routine" && i.status !== "Done" && i.status !== "Waiting").length,
          needsReview: workItems.filter((i) => i.confidence === "Low" && i.status !== "Done" && i.status !== "Waiting").length,
          triage: workItems.filter((i) => i.status === "Waiting").length,
          autoResolved: workItems.filter((i) => i.status === "Done" && i.handledBy === "Automation").length,
          done: workItems.filter((i) => i.status === "Done" && i.handledBy !== "Automation").length,
        }}
      />
      <div className="flex flex-1 overflow-hidden">
        <VoicemailList items={filteredItems} selectedId={selectedItem?.id} onSelectItem={setSelectedItem} />
        {selectedItem ? (
          <VoicemailDetail
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
            onStatusChange={handleStatusChange}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-card">
            <div className="text-center animate-fade-in-up">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-foreground">Select a voicemail</p>
              <p className="text-xs text-muted-foreground mt-1">Choose a message from your inbox to view details</p>
            </div>
          </div>
        )}
      </div>

      <CommandPalette
        open={commandPaletteOpen}
        onOpenChange={setCommandPaletteOpen}
        items={workItems}
        onSelectItem={setSelectedItem}
      />
    </div>
  )
}

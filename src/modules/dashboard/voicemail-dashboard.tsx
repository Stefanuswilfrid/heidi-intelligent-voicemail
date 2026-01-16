"use client"

import { useState } from "react"
import { VoicemailList } from "./voicemail-list"
import { VoicemailDetail } from "./voicemail-detail"
import { Sidebar } from "./sidebar"
import { WorkItem } from "@/lib/types"
import { mockWorkItems } from "@/lib/mock-data"


export function VoicemailDashboard() {
  const [selectedItem, setSelectedItem] = useState<WorkItem | null>(null)
  const [filter, setFilter] = useState<string>("needs-action")
  const [workItems, setWorkItems] = useState<WorkItem[]>(mockWorkItems)

  const counts = {
    needsAction: workItems.filter(
      (i) => (i.handledBy ?? "Staff") !== "Automation" && i.status !== "Done" && i.confidence !== "Low",
    ).length,
    needsReview: workItems.filter((i) => i.confidence === "Low" && i.status !== "Done").length,
    autoResolved: workItems.filter((i) => i.handledBy === "Automation" && i.status === "Done").length,
    all: workItems.length,
  }

  const filteredItems = workItems.filter((item) => {
    if (filter === "needs-action")
      return (item.handledBy ?? "Staff") !== "Automation" && item.status !== "Done" && item.confidence !== "Low"
    if (filter === "needs-review") return item.confidence === "Low" && item.status !== "Done"
    if (filter === "auto-resolved") return item.handledBy === "Automation" && item.status === "Done"
    if (filter === "all") return true
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
        counts={counts}
      />
      <div className="flex flex-1 overflow-hidden">
        <VoicemailList items={filteredItems} selectedId={selectedItem?.id} onSelectItem={setSelectedItem} />
        {selectedItem && (
          <VoicemailDetail
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
            onStatusChange={handleStatusChange}
          />
        )}
      </div>
    </div>
  )
}

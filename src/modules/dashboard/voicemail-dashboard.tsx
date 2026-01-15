"use client"

import { useState } from "react"
import { VoicemailList } from "./voicemail-list"
import { VoicemailDetail } from "./voicemail-detail"
import { Sidebar } from "./sidebar"
import { WorkItem } from "@/lib/types"
import { mockWorkItems } from "@/lib/mock-data"


export function VoicemailDashboard() {
  const [selectedItem, setSelectedItem] = useState<WorkItem | null>(null)
  const [filter, setFilter] = useState<string>("all")
  const [workItems, setWorkItems] = useState<WorkItem[]>(mockWorkItems)

  const filteredItems = workItems.filter((item) => {
    if (filter === "all") return item.status !== "Done"
    if (filter === "urgent") return item.urgency === "Urgent" && item.status !== "Done"
    if (filter === "today") return item.urgency === "Today" && item.status !== "Done"
    if (filter === "routine") return item.urgency === "Routine" && item.status !== "Done"
    if (filter === "needs-review") return item.confidence === "Low" && item.status !== "Done"
    if (filter === "done") return item.status === "Done"
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
        counts={{
          urgent: workItems.filter((i) => i.urgency === "Urgent" && i.status !== "Done").length,
          today: workItems.filter((i) => i.urgency === "Today" && i.status !== "Done").length,
          routine: workItems.filter((i) => i.urgency === "Routine" && i.status !== "Done").length,
          needsReview: workItems.filter((i) => i.confidence === "Low" && i.status !== "Done").length,
          done: workItems.filter((i) => i.status === "Done").length,
        }}
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

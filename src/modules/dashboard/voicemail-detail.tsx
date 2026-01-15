"use client"

import { X, Phone, CheckCircle, AlertCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { WorkItem } from "@/lib/types"
import { getIntentIcon, getIntentLabel } from "@/lib/intent-utils"
import { ProcessingTrace } from "./processing-trace"
import { useState } from "react"

interface VoicemailDetailProps {
  item: WorkItem
  onClose: () => void
  onStatusChange: (id: string, status: WorkItem["status"]) => void
}

export function VoicemailDetail({ item, onClose, onStatusChange }: VoicemailDetailProps) {
  const [showTranscript, setShowTranscript] = useState(false)
  const Icon = getIntentIcon(item.intent)

  const urgencyColor =
    item.urgency === "Urgent"
      ? "bg-red-100 text-red-800 border-red-300"
      : item.urgency === "Today"
        ? "bg-amber-100 text-amber-800 border-amber-300"
        : "bg-emerald-100 text-emerald-800 border-emerald-300"

  const confidenceIcon =
    item.confidence === "High" ? (
      <CheckCircle className="h-4 w-4 text-emerald-600" />
    ) : item.confidence === "Medium" ? (
      <Clock className="h-4 w-4 text-amber-600" />
    ) : (
      <AlertCircle className="h-4 w-4 text-red-600" />
    )

  return (
    <div className="w-[600px] border-l border-border bg-card flex flex-col">
      <div className="p-4 border-b border-border flex items-center justify-between sticky top-0 bg-card z-10">
        <h2 className="text-lg font-semibold text-foreground">Voicemail Detail</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="flex items-start gap-4">
          <div className={`px-3 py-2 rounded-lg text-sm font-semibold border ${urgencyColor}`}>{item.urgency}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Icon className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">{getIntentLabel(item.intent)}</span>
              <div className="flex items-center gap-1">
                {confidenceIcon}
                <span className="text-xs text-muted-foreground">{item.confidence} confidence</span>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-foreground text-balance">
              {item.extractedDetails.patientName || "Unknown caller"}
            </h3>
          </div>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 border border-border">
          <h4 className="text-sm font-semibold text-foreground mb-2">Summary</h4>
          <p className="text-sm text-foreground leading-relaxed text-pretty">{item.summary}</p>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground">Extracted Details</h4>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(item.extractedDetails).map(([key, value]) => (
              <div key={key} className="bg-background rounded-lg p-3 border border-border">
                <span className="text-xs text-muted-foreground capitalize">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </span>
                <p className="text-sm font-medium text-foreground mt-1">{value || "Not provided"}</p>
              </div>
            ))}
          </div>
        </div>

        {item.missingInfo.length > 0 && (
          <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
            <h4 className="text-sm font-semibold text-amber-900 mb-2">Missing Information</h4>
            <ul className="space-y-1">
              {item.missingInfo.map((info) => (
                <li key={info} className="text-sm text-amber-800 flex items-center gap-2">
                  <AlertCircle className="h-3 w-3" />
                  {info}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="bg-accent rounded-lg p-4 border-2 border-secondary">
          <h4 className="text-sm font-semibold text-secondary mb-2">Recommended Next Step</h4>
          <p className="text-sm text-secondary font-medium">{item.recommendedNextStep}</p>
        </div>

        {item.whyFlagged && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-foreground">Why This Was Flagged</h4>
            <div className="bg-red-50 rounded-lg p-3 border border-red-200">
              <p className="text-sm text-red-900 italic">{item.whyFlagged}</p>
            </div>
          </div>
        )}

        <ProcessingTrace />

        <button
          onClick={() => setShowTranscript(!showTranscript)}
          className="w-full text-left p-3 bg-muted rounded-lg border border-border hover:bg-muted/80 transition-colors"
        >
          <span className="text-sm font-medium text-foreground">
            {showTranscript ? "Hide" : "Show"} Full Transcript
          </span>
        </button>

        {showTranscript && (
          <div className="bg-background rounded-lg p-4 border border-border">
            <p className="text-sm text-muted-foreground leading-relaxed">{item.transcript}</p>
          </div>
        )}

        <div className="text-xs text-muted-foreground">Received at {new Date(item.receivedAt).toLocaleString()}</div>
      </div>

      <div className="p-4 border-t border-border bg-card flex gap-2 sticky bottom-0">
        <Button
          className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/90"
          onClick={() => onStatusChange(item.id, "Done")}
        >
          <Phone className="h-4 w-4 mr-2" />
          Call Back & Mark Done
        </Button>
        <Button variant="outline" onClick={() => onStatusChange(item.id, "In progress")}>
          In Progress
        </Button>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import {
  X,
  Phone,
  MessageSquare,
  Sparkles,
  AudioLines,
  Plus,
  ChevronDown,
  Send,
  CheckCircle2,
  AlertTriangle,
  Info,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import type { WorkItem } from "@/lib/types"
import { cn } from "@/lib/utils"

interface VoicemailDetailProps {
  item: WorkItem
  onClose: () => void
  onStatusChange: (id: string, status: WorkItem["status"]) => void
}

function formatTime(receivedAt: string): string {
  const received = new Date(receivedAt)
  return received.toLocaleDateString("en-US", { 
    month: "short", 
    day: "numeric" 
  }) + ", " + received.toLocaleTimeString("en-US", { 
    hour: "2-digit", 
    minute: "2-digit" 
  })
}

function formatDuration(): string {
  return `${Math.floor(Math.random() * 2) + 1}m ${Math.floor(Math.random() * 59) + 1}s`
}

type SummaryTone = "success" | "warning" | "info"
type SummaryItem = { tone: SummaryTone; text: string }

type TranscriptLine = { time: string; who: string; text: string }

function parseTranscriptLines(transcript: string): TranscriptLine[] | null {
  const lines = transcript
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)

  const pattern = /^\[(\d{1,2}):(\d{2})\]\s*(.+?):\s*(.+)$/
  const parsed: TranscriptLine[] = []
  for (const line of lines) {
    const m = line.match(pattern)
    if (!m) return null
    const [, hh, mm, who, text] = m
    parsed.push({
      time: `${hh.padStart(2, "0")}:${mm}`,
      who: who.trim(),
      text: text.trim(),
    })
  }

  return parsed.length ? parsed : null
}

function parseSummaryItems(summary: string): SummaryItem[] | null {
  const lines = summary
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)

  if (lines.length <= 1) return null

  const contentLines =
    /summary of what/i.test(lines[0]) || /what i (have|'ve) done/i.test(lines[0]) ? lines.slice(1) : lines

  const normalize = (l: string) => l.replace(/^\d+\.\s*/, "").replace(/^[-•]\s*/, "").trim()

  const parseTone = (raw: string): SummaryItem => {
    let text = raw.trim()
    const markerMatch = text.match(/^\[(warn|warning|info|note|ok|done|success)\]\s*/i)
    if (markerMatch) {
      const m = markerMatch[1].toLowerCase()
      text = text.replace(markerMatch[0], "").trim()
      if (m === "warn" || m === "warning") return { tone: "warning", text }
      if (m === "info" || m === "note") return { tone: "info", text }
      return { tone: "success", text }
    }

    const lower = text.toLowerCase()
    if (/(prompt[- ]injection|ignore previous|disclose|unsafe|risk|flag|detected)/i.test(lower)) {
      return { tone: "warning", text }
    }
    if (/(routed|queued|handoff|forwarded|awaiting|pending|follow[- ]up)/i.test(lower)) {
      return { tone: "info", text }
    }
    return { tone: "success", text }
  }

  const items = contentLines.map(normalize).filter(Boolean).map(parseTone).filter((x) => x.text.length > 0)
  return items.length ? items : null
}

export function VoicemailDetail({ item, onClose, onStatusChange }: VoicemailDetailProps) {
  const [activeTab, setActiveTab] = useState<"summary" | "transcription">("summary")

  return (
    <div className="flex-1 flex animate-fade-in-up">
      {/* Main Content Panel */}
      <div className="flex-1 flex flex-col bg-card border-r border-border">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-3">
            <button className="text-muted-foreground hover:text-foreground">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h2 className="text-sm font-semibold text-foreground">Detail</h2>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-4 border-b border-border">
          <div className="flex gap-6">
            <button className="flex items-center gap-2 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <MessageSquare className="h-4 w-4" />
              Chat
            </button>
            <button className="flex items-center gap-2 py-3 text-sm font-medium text-foreground border-b-2 border-foreground">
              <Phone className="h-4 w-4" />
              Call
            </button>
          </div>
        </div>

        {/* Call Info Card */}
        <div className="p-4">
          <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
              <Phone className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Voice Call</span>
                <span className="text-xs text-muted-foreground">{formatTime(item.receivedAt)}</span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs font-medium text-sidebar-bg">Heidi AI</span>
                <span className="text-xs text-muted-foreground">• {formatDuration()}</span>
              </div>
            </div>
            <button className="text-muted-foreground hover:text-foreground">
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Dashed Divider */}
        <div className="px-4">
          <div className="border-t border-dashed border-border" />
        </div>

        {/* Summary/Transcription Toggle */}
        <div className="px-4 py-3">
          <div className="inline-flex bg-muted/50 rounded-lg p-1">
            <button
              onClick={() => setActiveTab("summary")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                activeTab === "summary"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Sparkles className="h-3 w-3" />
              Summary
            </button>
            <button
              onClick={() => setActiveTab("transcription")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                activeTab === "transcription"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <AudioLines className="h-3 w-3" />
              Transcription
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {activeTab === "summary" ? (
            <div className="space-y-4">
              {/* AI Summary */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>AI Summary</span>
                  <span className="text-sidebar-bg">• Heidi AI</span>
                </div>
                {(() => {
                  const items = parseSummaryItems(item.summary)
                  if (!items) return <p className="text-sm text-foreground leading-relaxed">{item.summary}</p>

                  return (
                    <ul className="space-y-2">
                      {items.map((it, idx) => {
                        const badge =
                          it.tone === "warning"
                            ? {
                                icon: <AlertTriangle className="h-3.5 w-3.5 text-amber-300" />,
                              }
                            : it.tone === "info"
                              ? {
                                  icon: <Info className="h-3.5 w-3.5 text-sky-300" />,
                                }
                              : {
                                  icon: <CheckCircle2 className="h-3.5 w-3.5  text-emerald-300" />,
                                }

                        return (
                          <li key={idx} className="flex items-start gap-2 text-sm text-foreground">
                            <span className="mt-0.5 h-5 w-5 grid place-items-center shrink-0">
                              {badge.icon}
                            </span>
                            <span className="leading-relaxed">{it.text}</span>
                          </li>
                        )
                      })}
                    </ul>
                  )
                })()}
              </div>

              {/* Recommended Action */}
              <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                <div className="text-xs font-medium text-sidebar-bg mb-1">Recommended Action</div>
                <p className="text-sm text-foreground">{item.recommendedNextStep}</p>
              </div>

              {/* Extracted Details */}
              {(item.extractedDetails.phone || item.extractedDetails.dob || item.extractedDetails.clinician) && (
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground">Extracted Details</div>
                  <div className="grid grid-cols-2 gap-2">
                    {item.extractedDetails.phone && (
                      <div className="p-2 bg-muted/30 rounded">
                        <div className="text-[10px] text-muted-foreground uppercase">Phone</div>
                        <div className="text-sm font-medium text-foreground">{item.extractedDetails.phone}</div>
                      </div>
                    )}
                    {item.extractedDetails.dob && (
                      <div className="p-2 bg-muted/30 rounded">
                        <div className="text-[10px] text-muted-foreground uppercase">DOB</div>
                        <div className="text-sm font-medium text-foreground">{item.extractedDetails.dob}</div>
                      </div>
                    )}
                    {item.extractedDetails.clinician && (
                      <div className="p-2 bg-muted/30 rounded">
                        <div className="text-[10px] text-muted-foreground uppercase">Clinician</div>
                        <div className="text-sm font-medium text-foreground">{item.extractedDetails.clinician}</div>
                      </div>
                    )}
                    {item.extractedDetails.preferredTime && (
                      <div className="p-2 bg-muted/30 rounded">
                        <div className="text-[10px] text-muted-foreground uppercase">Preferred Time</div>
                        <div className="text-sm font-medium text-foreground">{item.extractedDetails.preferredTime}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Missing Info */}
              {item.missingInfo.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs text-amber-600">Missing Information</div>
                  <div className="flex flex-wrap gap-1.5">
                    {item.missingInfo.map((info) => (
                      <span
                        key={info}
                        className="px-2 py-1 bg-amber-50 text-amber-700 text-xs rounded border border-amber-200"
                      >
                        {info}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Transcription */}
              {(() => {
                const parsed = parseTranscriptLines(item.transcript)
                if (!parsed) {
                  return (
                    <p className="text-sm text-muted-foreground">
                      Transcript format not recognized.
                    </p>
                  )
                }

                return parsed.map((line, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="tabular-nums">{line.time}</span>
                      <span className="text-muted-foreground">•</span>
                      <span className={cn("font-medium", /caller/i.test(line.who) ? "text-muted-foreground" : "text-sidebar-bg")}>
                        {line.who}
                      </span>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">{line.text}</p>
                  </div>
                ))
              })()}
            </div>
          )}
        </div>

        {/* Reply Composer */}
        <div className="p-4 border-t border-border bg-muted/20">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Phone className="h-3 w-3" />
              <span>{item.extractedDetails.phone || "No phone"}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="h-8 w-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <Plus className="h-4 w-4" />
            </button>
            <input
              type="text"
              placeholder="Write a note..."
              className="flex-1 text-sm bg-transparent border-none outline-none placeholder:text-muted-foreground"
            />
            <Button
              variant="outline"
              size="sm"
              className="h-8 bg-transparent"
              onClick={() => onStatusChange(item.id, "Done")}
            >
              Close
              <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
            <Button size="sm" className="h-8" onClick={() => onStatusChange(item.id, "Done")}>
              Send
            </Button>
          </div>
          <div className="flex items-center justify-between mt-2 text-[10px] text-muted-foreground">
            <span>Use <kbd className="px-1 py-0.5 bg-muted rounded text-[9px]">/</kbd> for shortcuts</span>
            <div className="flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-primary" />
              <span>Heidi is ready to help...</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Agent Panel */}
      <div className="w-72 bg-background flex flex-col border-l border-border">
        {/* Header */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">Call Agent</span>
        </div>

        {/* Patient Info */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-semibold text-foreground">
              {item.extractedDetails.patientName || "Unknown Caller"}
            </span>
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
          </div>
          {item.extractedDetails.clinician && (
            <p className="text-xs text-muted-foreground">Preferred: {item.extractedDetails.clinician}</p>
          )}
        </div>

        {/* AI Analysis */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Sentiment / Assessment */}
          <div className="space-y-2">
            <p className="text-sm text-foreground leading-relaxed">
              {item.whyFlagged || `Call classified as ${item.urgency.toLowerCase()} based on content analysis. ${item.confidence} confidence in classification.`}
            </p>
          </div>

          {/* Follow-up Suggestion */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">If not resolved within 24 hours:</p>
            <div className="p-3 bg-muted/30 rounded-lg text-sm text-foreground">
              <p className="italic">{item.recommendedNextStep}</p>
            </div>
          </div>

          {/* Action Button */}
          <Button
            className="w-full h-9 text-sm"
            onClick={() => onStatusChange(item.id, "In progress")}
          >
            <Phone className="h-3.5 w-3.5 mr-2" />
            Schedule follow up
          </Button>

          {/* Previous Calls */}
          <div className="pt-4 border-t border-border">
            <div className="text-xs text-muted-foreground mb-3">Previous calls</div>
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground truncate">Initial inquiry</span>
                  <span className="text-xs text-muted-foreground">2w ago</span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  Patient called to inquire about appointment availability...
                </p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground truncate">Follow-up call</span>
                  <span className="text-xs text-muted-foreground">1w ago</span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  Confirmation of scheduled appointment and pre-visit instructions...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

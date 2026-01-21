"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import {
  X,
  Phone,
  Sparkles,
  AudioLines,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  Info,
  Volume2,
  Square,
  PlayIcon,
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

function formatRelativeTime(receivedAt: string): string {
  const then = new Date(receivedAt).getTime()
  const now = Date.now()
  const diffMs = now - then
  if (!Number.isFinite(diffMs)) return "Received recently"

  const minutes = Math.floor(diffMs / (1000 * 60))
  if (minutes < 1) return "Received just now"
  if (minutes < 60) return `Received ${minutes} min ago`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `Received ${hours} hour${hours === 1 ? "" : "s"} ago`

  const days = Math.floor(hours / 24)
  return `Received ${days} day${days === 1 ? "" : "s"} ago`
}

function isAfterHours(receivedAt: string): boolean {
  const d = new Date(receivedAt)
  const hour = d.getHours()
  // Simple heuristic: after-hours outside 8am–6pm local time.
  return hour < 8 || hour >= 18
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

function buildTtsText(lines: TranscriptLine[] | null, fallback: string) {
  if (!lines) return fallback
  return lines
    .map((l) => {
      const who = l.who.trim()
      // Make it more natural for TTS than reading timestamps.
      return `${who}: ${l.text}`
    })
    .join("\n")
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

  const parsedTranscript = useMemo(() => parseTranscriptLines(item.transcript), [item.transcript])
  const ttsText = useMemo(
    () => buildTtsText(parsedTranscript, item.transcript),
    [parsedTranscript, item.transcript],
  )

  const [ttsSupported, setTtsSupported] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasUtterance, setHasUtterance] = useState(false)
  const [rate, setRate] = useState<1 | 1.5 | 2>(1)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    setTtsSupported(typeof window !== "undefined" && "speechSynthesis" in window)
  }, [])

  // Reset TTS when switching items
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel()
    }
    utteranceRef.current = null
    setIsPlaying(false)
    setHasUtterance(false)
  }, [item.id])

  const stopTts = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel()
    }
    utteranceRef.current = null
    setIsPlaying(false)
    setHasUtterance(false)
  }

  const startTts = () => {
    if (!(typeof window !== "undefined" && "speechSynthesis" in window)) return

    // Restart cleanly each time to keep the UI simple/predictable.
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(ttsText)
    u.rate = rate
    u.onend = () => {
      utteranceRef.current = null
      setIsPlaying(false)
      setHasUtterance(false)
    }
    u.onerror = () => {
      utteranceRef.current = null
      setIsPlaying(false)
      setHasUtterance(false)
    }
    utteranceRef.current = u
    window.speechSynthesis.speak(u)
    setIsPlaying(true)
    setHasUtterance(true)
  }

  const pauseTts = () => {
    if (!(typeof window !== "undefined" && "speechSynthesis" in window)) return
    window.speechSynthesis.pause()
    setIsPlaying(false)
    setHasUtterance(true)
  }

  const resumeTts = () => {
    if (!(typeof window !== "undefined" && "speechSynthesis" in window)) return
    window.speechSynthesis.resume()
    setIsPlaying(true)
    setHasUtterance(true)
  }

  const toggleTts = () => {
    if (!ttsSupported) return
    // If we have an utterance that was paused, resume. Otherwise (re)start from beginning.
    if (utteranceRef.current && typeof window !== "undefined" && window.speechSynthesis.paused) {
      resumeTts()
      return
    }
    if (isPlaying) {
      pauseTts()
      return
    }
    startTts()
  }

  useEffect(() => {
    // If rate changes mid-play, restart to apply it (simple behavior).
    if (!ttsSupported) return
    if (!utteranceRef.current) return
    if (isPlaying) {
      startTts()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rate])

  return (
    <div className="flex-1 flex flex-col bg-card animate-fade-in-up">
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

      

        {/* Call Info Card */}
        <div className="p-4">
          <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
            <button
              className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors"
              onClick={toggleTts}
              disabled={!ttsSupported}
              aria-label={ttsSupported ? (isPlaying ? "Pause transcript" : "Play transcript") : "Listen not supported"}
              title={ttsSupported ? (isPlaying ? "Pause" : "Listen") : "Listen not supported"}
            >
              <PlayIcon className="h-4 w-4" />
            </button>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Voice Call</span>
                <span className="text-xs text-muted-foreground">{formatTime(item.receivedAt)}</span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs font-medium text-sidebar-bg">Heidi AI</span>
                <span className="text-xs text-muted-foreground">• {formatDuration()}</span>
                {!ttsSupported && <span className="text-xs text-muted-foreground">• Listen not supported</span>}
                {ttsSupported && (
                  <span className="text-xs text-muted-foreground">• {rate}x</span>
                )}
              </div>
            </div>
            <button className="text-muted-foreground hover:text-foreground" title="More">
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Dashed Divider */}
        <div className="px-4">
          <div className="border-t border-dashed border-border" />
        </div>

        {/* Caller + Assessment (persistent, above tabs) */}
        <div className="px-4 pt-4 pb-2">
          <div className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0">
                    <div
                      className={cn(
                        "h-10 w-10 rounded-full grid place-items-center border",
                        item.urgency === "Urgent"
                          ? "bg-red-50 border-red-100 text-red-600"
                          : item.urgency === "Today"
                            ? "bg-amber-50 border-amber-100 text-amber-700"
                            : "bg-sky-50 border-sky-100 text-sky-700",
                      )}
                      aria-hidden="true"
                    >
                      <span className="text-sm font-semibold">
                        {(item.extractedDetails.patientName || "Unknown Caller").trim().charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="text-sm font-semibold text-foreground truncate">
                        {item.extractedDetails.patientName || "Unknown Caller"}
                      </div>
                      <span
                        className={cn(
                          "shrink-0 px-2 py-0.5 rounded-full text-[10px] font-semibold border",
                          item.urgency === "Urgent"
                            ? "bg-red-500 text-white border-red-500"
                            : item.urgency === "Today"
                              ? "bg-amber-200 text-amber-900 border-amber-200"
                              : "bg-emerald-100 text-emerald-800 border-emerald-100",
                        )}
                      >
                        {item.urgency}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">{formatRelativeTime(item.receivedAt)}</div>
                  </div>
                </div>

                <span
                  className={cn(
                    "px-2 py-0.5 rounded-full text-[10px] font-semibold",
                    item.urgency === "Urgent" && "bg-orange-100 text-orange-700",
                    item.urgency === "Today" && "bg-emerald-100 text-emerald-700",
                    item.urgency === "Routine" && "bg-muted text-muted-foreground",
                  )}
                >
                  {item.urgency === "Urgent" ? "High value customer" : item.urgency === "Today" ? "Active" : "Standard"}
                </span>
              </div>
              {item.extractedDetails.clinician && (
                <p className="text-xs text-muted-foreground">
                  Preferred: {item.extractedDetails.clinician}
                </p>
              )}
            </div>
          </div>
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

        {/* Assessment (below tabs) */}
        <div className="px-4 pb-2">
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">Assessment</div>
            <p className="text-sm text-foreground leading-relaxed">
              Customer seems calm, but has potential to become frustrated. Likely non-technical as she hasn't read the
              instruction on her medicine.
            </p>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {activeTab === "summary" ? (
            <div className="space-y-4">
              {/* AI Summary */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>AI Processing Trace</span>
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

              {/* Urgency Assessment */}
              <div className="rounded-lg border border-border bg-card/50 px-4 py-3">
                <div className="flex items-center gap-2 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>Urgency Assessment</span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-xs text-muted-foreground">Level</div>
                    <div
                      className={cn(
                        "mt-1 text-base font-semibold",
                        item.urgency === "Urgent"
                          ? "text-orange-600"
                          : item.urgency === "Today"
                            ? "text-amber-500"
                            : "text-emerald-600",
                      )}
                    >
                      {item.urgency}
                    </div>
                  </div>

                  <div className="border-l border-border pl-6">
                    <div className="text-xs text-muted-foreground">Confidence</div>
                    <div className="mt-1 text-base font-semibold text-foreground">{item.confidence}</div>
                  </div>
                </div>
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

              {/* Context Brief (formerly right-side AI Agent panel) */}
              <div className="pt-4 space-y-3">
               

                <div className="pt-2 border-t border-border">
                  <div className="text-xs text-muted-foreground mb-3">Previous calls</div>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground truncate">Initial inquiry</span>
                        <span className="text-xs text-muted-foreground">6h ago</span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        Patient called to inquire about appointment availability...
                      </p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground truncate">Follow-up call</span>
                        <span className="text-xs text-muted-foreground">2w ago</span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        Confirmation of scheduled appointment and pre-visit instructions...
                      </p>
                    </div>
                  </div>
                </div>
              </div>
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

        {/* Bottom bar: playback controls + reply composer */}
        <div className="border-t border-border bg-muted/20">
          {ttsSupported && hasUtterance && (
            <div className="px-4 py-2 border-b border-border/60 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleTts}
                  className="h-8 w-8 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  aria-label={isPlaying ? "Pause transcript" : "Play transcript"}
                  title={isPlaying ? "Pause" : "Listen"}
                >
                  {isPlaying ? (
                    <div className="flex items-center gap-1">
                      <span className="h-3.5 w-1.5 rounded bg-foreground/80" />
                      <span className="h-3.5 w-1.5 rounded bg-foreground/80" />
                    </div>
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </button>
                <span className="text-xs text-muted-foreground">
                  {isPlaying ? "Listening to transcript" : "Transcript paused"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 rounded-md border border-border bg-card/50 p-0.5">
                  {[1, 1.5, 2].map((r) => (
                    <button
                      key={r}
                      onClick={() => setRate(r as 1 | 1.5 | 2)}
                      className={cn(
                        "px-2 py-1 text-[11px] font-medium rounded",
                        rate === r ? "bg-primary/20 text-sidebar-bg" : "text-muted-foreground hover:text-foreground",
                      )}
                      title={`${r}x`}
                    >
                      {r}x
                    </button>
                  ))}
                </div>
                <button
                  onClick={stopTts}
                  className="h-8 w-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  aria-label="Stop"
                  title="Stop"
                >
                  <Square className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Persistent actions */}
          <div className="px-4 py-3 flex items-center justify-between gap-3">
            <Button className="h-9 text-sm" onClick={() => onStatusChange(item.id, "In progress")}>
              <Phone className="h-3.5 w-3.5 mr-2" />
              Schedule follow up
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-9"
                onClick={() => onStatusChange(item.id, "Waiting")}
              >
                Set waiting
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-9"
                onClick={() => onStatusChange(item.id, "Done")}
              >
                Mark done
              </Button>
            </div>
          </div>
        </div>
    </div>
  )
}

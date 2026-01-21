export type SummaryTone = "success" | "warning" | "info"
export type SummaryItem = { tone: SummaryTone; text: string }

export type TranscriptLine = { time: string; who: string; text: string }

export function parseTranscriptLines(transcript: string): TranscriptLine[] | null {
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

export function buildTtsText(lines: TranscriptLine[] | null, fallback: string) {
  if (!lines) return fallback
  return lines
    .map((l) => {
      const who = l.who.trim()
      // Make it more natural for TTS than reading timestamps.
      return `${who}: ${l.text}`
    })
    .join("\n")
}

export function parseSummaryItems(summary: string): SummaryItem[] | null {
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



export type RelativeTimeStyle = "short" | "received"

function formatMonthDay(d: Date): string {
  return d.toLocaleDateString([], { month: "short", day: "numeric" })
}

/**
 * Absolute timestamp formatted as "Mon DD, HH:MM AM/PM" (matches existing UI in detail header).
 */
export function formatTime(receivedAt: string): string {
  const received = new Date(receivedAt)
  return (
    received.toLocaleDateString("en-US", { month: "short", day: "numeric" }) +
    ", " +
    received.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
  )
}

/**
 * Relative timestamp used across list/detail.
 * - style "short": "2m ago" | "2h ago" | "Jan 5"
 * - style "received": "Received 2 min ago" | "Received 2 hours ago" | "Received Jan 5"
 */
export function formatRelativeTime(receivedAt: string, style: RelativeTimeStyle): string {
  const received = new Date(receivedAt)
  const now = new Date()

  const diffMinutesRaw = Math.floor((now.getTime() - received.getTime()) / (1000 * 60))
  const diffMinutes = Number.isFinite(diffMinutesRaw) ? Math.max(0, diffMinutesRaw) : 0

  if (style === "short") {
    if (diffMinutes < 60) return `${diffMinutes}m ago`
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`
    return formatMonthDay(received)
  }

  // style === "received"
  if (diffMinutes < 1) return "Received just now"
  if (diffMinutes < 60) return `Received ${diffMinutes} min ago`

  const hours = Math.floor(diffMinutes / 60)
  if (hours < 24) return `Received ${hours} hour${hours === 1 ? "" : "s"} ago`

  return `Received ${formatMonthDay(received)}`
}

/**
 * Simple heuristic: after-hours outside 8am–6pm local time.
 */
export function isAfterHours(receivedAt: string): boolean {
  const d = new Date(receivedAt)
  const hour = d.getHours()
  return hour < 8 || hour >= 18
}



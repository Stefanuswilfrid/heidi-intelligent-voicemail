import { CheckCircle2 } from "lucide-react"

export function ProcessingTrace() {
  const steps = [
    "Transcript received",
    "Intent detected",
    "Urgency assessed",
    "Key details extracted",
    "Summary generated",
    "Work item created",
  ]

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold text-foreground">Processing Steps</h4>
      <div className="bg-background rounded-lg p-4 border border-border space-y-2">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
            {step}
          </div>
        ))}
      </div>
    </div>
  )
}

"use client"

import { CheckCircle2, Sparkles, Brain, FileSearch, AlertCircle, FileText, FolderPlus } from "lucide-react"
import { cn } from "@/lib/utils"

export function ProcessingTrace() {
  const steps = [
    { label: "Transcript received", icon: FileText, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Intent detected", icon: Brain, color: "text-purple-500", bg: "bg-purple-50" },
    { label: "Urgency assessed", icon: AlertCircle, color: "text-amber-500", bg: "bg-amber-50" },
    { label: "Key details extracted", icon: FileSearch, color: "text-cyan-500", bg: "bg-cyan-50" },
    { label: "Summary generated", icon: Sparkles, color: "text-primary-foreground", bg: "bg-primary/20" },
    { label: "Work item created", icon: FolderPlus, color: "text-emerald-500", bg: "bg-emerald-50" },
  ]

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
        <Brain className="h-4 w-4 text-secondary" />
        AI Processing Trace
      </h4>
      <div className="bg-background rounded-xl p-4 border border-border">
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-[19px] top-6 bottom-6 w-0.5 bg-border" />

          <div className="space-y-0">
            {steps.map((step, index) => {
              const StepIcon = step.icon
              return (
                <div
                  key={index}
                  className={cn("flex items-center gap-3 py-2.5 relative", "opacity-0 animate-fade-in-up")}
                  style={{ animationDelay: `${index * 0.1}s`, animationFillMode: "forwards" }}
                >
                  {/* Icon circle */}
                  <div
                    className={cn(
                      "h-10 w-10 rounded-full flex items-center justify-center z-10 border-2 border-background transition-transform hover:scale-110",
                      step.bg,
                    )}
                  >
                    <StepIcon className={cn("h-4 w-4", step.color)} />
                  </div>

                  {/* Label */}
                  <span className="text-sm text-foreground font-medium flex-1">{step.label}</span>

                  {/* Checkmark */}
                  <div className="h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <span>Processed in 0.8s</span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            High confidence
          </span>
        </div>
      </div>
    </div>
  )
}

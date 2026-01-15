import {
    Calendar,
    XCircle,
    Pill,
    FileText,
    FileCheck,
    CreditCard,
    AlertCircle,
    MessageSquare,
    HelpCircle,
  } from "lucide-react"
  import type { Intent } from "./types"
  
  export function getIntentIcon(intent: Intent) {
    const icons: Record<Intent, typeof Calendar> = {
      "Book appointment": Calendar,
      "Cancel / reschedule": XCircle,
      "Prescription request": Pill,
      "Test results": FileText,
      "Referral / forms": FileCheck,
      "Billing / admin": CreditCard,
      "Urgent symptoms": AlertCircle,
      "Complaint / feedback": MessageSquare,
      "Other / unclear": HelpCircle,
    }
    return icons[intent]
  }
  
  export function getIntentLabel(intent: Intent): string {
    return intent
  }
  
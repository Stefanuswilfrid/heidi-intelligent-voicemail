export type Intent =
  | "Book appointment"
  | "Cancel / reschedule"
  | "Prescription request"
  | "Test results"
  | "Referral / forms"
  | "Billing / admin"
  | "Urgent symptoms"
  | "Complaint / feedback"
  | "Other / unclear"

export type Urgency = "Urgent" | "Today" | "Routine"

export type Confidence = "High" | "Medium" | "Low"

export type Status = "New" | "In progress" | "Waiting" | "Done"

export type HandledBy = "Automation" | "Staff"

export interface ExtractedDetails {
  patientName?: string
  phone?: string
  dob?: string
  clinician?: string
  preferredTime?: string
}

export interface WorkItem {
  id: string
  intent: Intent
  urgency: Urgency
  summary: string
  extractedDetails: ExtractedDetails
  confidence: Confidence
  missingInfo: string[]
  recommendedNextStep: string
  status: Status
  handledBy?: HandledBy
  receivedAt: string
  whyFlagged?: string
  transcript: string
}

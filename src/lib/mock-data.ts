import type { WorkItem } from "./types"

export const mockWorkItems: WorkItem[] = [
  {
    id: "1",
    intent: "Urgent symptoms",
    urgency: "Urgent",
    summary:
      "Patient reporting severe chest pain and shortness of breath for the past hour. Requested immediate callback.",
    extractedDetails: {
      patientName: "Sarah Mitchell",
      phone: "555-0123",
      dob: "1978-05-12",
    },
    confidence: "High",
    missingInfo: ["Preferred time"],
    recommendedNextStep: "Call back immediately",
    status: "New",
    receivedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    whyFlagged: '"severe chest pain" and "shortness of breath" indicate potentially life-threatening symptoms',
    transcript:
      "Hi, this is Sarah Mitchell. My date of birth is May 12th, 1978. I'm calling because I've been having severe chest pain and shortness of breath for about an hour now. My number is 555-0123. Please call me back as soon as possible.",
  },
  {
    id: "2",
    intent: "Test results",
    urgency: "Today",
    summary:
      "Patient calling about blood work results from last week. Mentioned anxiety about waiting and would like to speak with Dr. Chen today.",
    extractedDetails: {
      patientName: "Michael Torres",
      phone: "555-0456",
      clinician: "Dr. Chen",
    },
    confidence: "High",
    missingInfo: ["Date of birth"],
    recommendedNextStep: "Check results system and return call today",
    status: "New",
    receivedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    transcript:
      "Hello, this is Michael Torres calling about my blood work results from last week. I haven't heard back yet and I'm getting a bit anxious. Could Dr. Chen please call me today? My number is 555-0456. Thank you.",
  },
  {
    id: "3",
    intent: "Book appointment",
    urgency: "Routine",
    summary: "New patient requesting initial consultation. Flexible on timing, prefers morning appointments next week.",
    extractedDetails: {
      patientName: "Jennifer Park",
      phone: "555-0789",
      preferredTime: "Morning, next week",
    },
    confidence: "High",
    missingInfo: [],
    recommendedNextStep: "Schedule appointment for next week morning",
    status: "New",
    receivedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    transcript:
      "Hi there, my name is Jennifer Park and I'm a new patient. I'd like to schedule an initial consultation. I'm pretty flexible but I prefer morning appointments if possible, maybe sometime next week? You can reach me at 555-0789. Thanks!",
  },
  {
    id: "4",
    intent: "Prescription request",
    urgency: "Today",
    summary: "Patient needs refill on blood pressure medication. Pharmacy is CVS on Main Street. Running low.",
    extractedDetails: {
      patientName: "Robert Kim",
      phone: "555-0234",
    },
    confidence: "Medium",
    missingInfo: ["Date of birth", "Specific medication name"],
    recommendedNextStep: "Verify patient details and process refill today",
    status: "New",
    receivedAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    transcript:
      "This is Robert Kim. I need a refill on my blood pressure medication. I'm running pretty low. My pharmacy is CVS on Main Street. Please call me at 555-0234. Thanks.",
  },
  {
    id: "5",
    intent: "Complaint / feedback",
    urgency: "Today",
    summary:
      "Patient expressing frustration about long wait times during last visit and difficulty reaching the office by phone.",
    extractedDetails: {
      patientName: "Linda Watson",
      phone: "555-0567",
    },
    confidence: "High",
    missingInfo: [],
    recommendedNextStep: "Manager callback to address concerns",
    status: "New",
    receivedAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    transcript:
      "Hi, my name is Linda Watson and I wanted to provide some feedback. I had an appointment last Thursday and waited over an hour past my scheduled time. I've also been trying to reach your office by phone for three days with no answer. This is really frustrating. Please have someone call me at 555-0567 to discuss this.",
  },
  {
    id: "6",
    intent: "Cancel / reschedule",
    urgency: "Today",
    summary: "Patient needs to reschedule tomorrow's 2pm appointment due to work conflict. Can do any time Friday.",
    extractedDetails: {
      patientName: "David Lee",
      phone: "555-0891",
      preferredTime: "Any time Friday",
    },
    confidence: "High",
    missingInfo: [],
    recommendedNextStep: "Cancel tomorrow and reschedule for Friday",
    status: "New",
    receivedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    transcript:
      "Hello, this is David Lee. I have an appointment tomorrow at 2pm but something came up at work and I need to reschedule. I'm free any time on Friday if you have availability. My number is 555-0891.",
  },
  {
    id: "7",
    intent: "Other / unclear",
    urgency: "Routine",
    summary:
      "Unclear message, caller mentioned something about forms but audio quality was poor. Multiple topics discussed.",
    extractedDetails: {
      phone: "555-0345",
    },
    confidence: "Low",
    missingInfo: ["Patient name", "Specific request", "Date of birth"],
    recommendedNextStep: "Call back to clarify needs",
    status: "New",
    receivedAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    transcript:
      "[Poor audio quality] Hi... calling about... forms... insurance... need to... appointment... call me at 555-0345...",
  },
  {
    id: "8",
    intent: "Book appointment",
    urgency: "Routine",
    summary: "Patient requesting annual physical. Last exam was over a year ago. Prefers Dr. Anderson if available.",
    extractedDetails: {
      patientName: "Emma Rodriguez",
      phone: "555-0678",
      clinician: "Dr. Anderson",
    },
    confidence: "High",
    missingInfo: ["Preferred time"],
    recommendedNextStep: "Schedule annual physical with Dr. Anderson",
    status: "Done",
    receivedAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    transcript:
      "Hi, this is Emma Rodriguez. I need to schedule my annual physical. I think it's been over a year since my last one. I prefer to see Dr. Anderson if she's available. You can reach me at 555-0678. Thank you!",
  },
]

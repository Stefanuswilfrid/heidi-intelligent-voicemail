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
      `[09:41] Sunset GP Team: Hi, this is Alex from Sunset GP. How can I help today?\n` +
      `[09:41] Caller: Hi, this is Sarah Mitchell. I’m having severe chest pain and shortness of breath for about an hour.\n` +
      `[09:42] Sunset GP Team: I’m sorry to hear that — I can see your caller ID. Can you confirm your date of birth?\n` +
      `[09:43] Sunset GP Team: Thanks. Can you confirm your date of birth?\n` +
      `[09:43] Caller: May 12th, 1978.\n` +
      `[09:44] Sunset GP Team: My colleague will get back to you right away. If you’re having severe symptoms, please call emergency services.`,
  },
  {
    id: "2",
    intent: "Test results",
    urgency: "Today",
    summary:
      "Caller asked about pending blood work results. System advised results are not available yet and are expected within 1 business day; no callback required.",
    extractedDetails: {
      patientName: "Michael Torres",
      phone: "555-0456",
      clinician: "Dr. Chen",
    },
    confidence: "High",
    missingInfo: [],
    recommendedNextStep: "Auto-resolved: informed caller results are pending (expected within 1 business day)",
    status: "Done",
    handledBy: "Automation",
    receivedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    transcript:
      `[10:12] Sunset GP Team: Hi, this is Alex from Sunset GP. How can I help?\n` +
      `[10:12] Caller: Hi, this is Michael Torres. I’m calling about my blood work results from last week.\n` +
      `[10:13] Sunset GP Team: Thanks — I can see your recent blood test order with Dr. Chen.\n` +
      `[10:13] Sunset GP Team: Your results aren’t available yet. They’re expected to come through within 1 business day.\n` +
      `[10:14] Sunset GP Team: If you haven’t received an update after that, reply here and we’ll follow up.\n` +
      `[10:14] Caller: Okay, thank you.\n` +
      `[10:15] Sunset GP Team: You’re welcome — anything else I can help with?`,
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
      `[08:25] Sunset GP Team: Hi, this is Alex from Sunset GP. How can I help?\n` +
      `[08:25] Caller: Hi, I’m Jennifer Park. I’d like to schedule an initial consultation.\n` +
      `[08:27] Sunset GP Team: And what time works best?\n` +
      `[08:27] Caller: Morning appointments next week if possible.\n` +
      `[08:28] Sunset GP Team: Thanks — we’ll call you back to confirm.`,
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
      `[13:02] Sunset GP Team: Hi, this is Alex from Sunset GP. How can I help?\n` +
      `[13:02] Caller: This is Robert Kim. I need a refill on my blood pressure medication — I’m running low.\n` +
      `[13:04] Sunset GP Team: Which medication is it?\n` +
      `[13:04] Caller: I’m not sure of the name right now.\n` +
      `[13:05] Sunset GP Team: No worries — my colleague will get back to you. What’s the best time to reach you back?`,
  },
  {
    id: "6",
    intent: "Book appointment",
    urgency: "Today",
    summary:
      "Summary of what I completed\n" +
      "1. Scanned today’s practitioner schedules and confirmed all appointments are fully booked.\n" +
      "2. Checked tomorrow’s calendar and found a couple of available slots.\n" +
      "3. Asked the patient to confirm their preferred time tomorrow.\n" +
      "4. Prepared to notify the practitioner and add a reminder once the patient confirms.",
    extractedDetails: {
      patientName: "David Lee",
      phone: "555-0891",
      preferredTime: "Tomorrow (flexible)",
    },
    confidence: "High",
    missingInfo: [],
    recommendedNextStep: "Await patient confirmation on a tomorrow slot; then confirm and add calendar reminder",
    status: "Waiting",
    handledBy: "Automation",
    receivedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    transcript:
      `[11:18] Sunset GP Team: Hi, this is Alex from Sunset GP. How can I help?\n` +
      `[11:18] Caller: Hi, this is David Lee — I’d like to book an appointment today if possible.\n` +
      `[11:19] Sunset GP Team: Thanks, David. I’ve scanned today’s schedules — all practitioners are fully booked.\n` +
      `[11:19] Sunset GP Team: I can see a couple of openings tomorrow. Would tomorrow work for you?\n` +
      `[11:20] Caller: Yes, tomorrow works.\n` +
      `[11:20] Sunset GP Team: Great — do you prefer morning, afternoon, or a specific time (e.g. 10:30 or 15:00)?\n` +
      `[11:21] Caller: Afternoon would be best.\n` +
      `[11:21] Sunset GP Team: Got it — I’ll line up an afternoon slot and we’ll confirm shortly.`,
  },
  {
    id: "7",
    intent: "Other / unclear",
    urgency: "Routine",
    summary:
      "Unclear message, caller mentioned something about forms but audio quality was poor. Multiple topics discussed.",
    extractedDetails: {},
    confidence: "Low",
    missingInfo: ["Patient name", "Specific request", "Date of birth", "Phone number"],
    recommendedNextStep: "Call back to clarify needs",
    status: "New",
    receivedAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    transcript:
      `[09:05] Sunset GP Team: Hi, this is Alex from Sunset GP. How can I help?\n` +
      `[09:05] Caller: [Poor audio quality] Hi… calling about… forms… insurance… need to… appointment…\n` +
      `[09:06] Sunset GP Team: Sorry — I couldn’t catch that. It looks like your caller ID is blocked. What’s the best number to reach you?\n` +
      `[09:06] Caller: I’d rather not share it right now.\n` +
      `[09:07] Sunset GP Team: My colleague will get back to you, whats the best time to reach you back?`,
  },

  {
    id: "9",
    intent: "Other / unclear",
    urgency: "Routine",
    summary:
      "Caller asked a basic service question (travel vaccines). System responded with service availability and next steps; no callback required.",
    extractedDetails: {},
    confidence: "High",
    missingInfo: [],
    recommendedNextStep: "Auto-resolved: provided service information (no callback needed)",
    status: "Done",
    handledBy: "Automation",
    receivedAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    transcript:
      `[15:26] Sunset GP Team: Hi, this is Alex from Sunset GP. How can I help?\n` +
      `[15:26] Caller: Hi — do you provide travel vaccines?\n` +
      `[15:27] Sunset GP Team: Yes — we provide common travel vaccines. If you share your destination and travel date, we can advise what you need.\n` +
      `[15:27] Sunset GP Team: You can book online or call reception during opening hours. Would you like the booking link?\n` +
      `[15:28] Caller: Yes please.\n` +
      `[15:28] Sunset GP Team: Sure — here’s the booking link and our opening hours. Anything else I can help with?`,
  },
  {
    id: "10",
    intent: "Other / unclear",
    urgency: "Routine",
    summary:
      "Caller forgot what supplements Dr. Patel recommended. System confirmed the plan on file and provided the instructions; no callback required.",
    extractedDetails: {
      patientName: "Daniel Harper",
      clinician: "Dr. Patel",
    },
    confidence: "High",
    missingInfo: [],
    recommendedNextStep: "Auto-resolved: provided supplement instructions from the care plan (no callback needed)",
    status: "Done",
    handledBy: "Automation",
    receivedAt: new Date(Date.now() - 1000 * 60 * 22).toISOString(),
    transcript:
      `[09:18] Sunset GP Team: Hi, this is Alex from Sunset GP. How can I help?\n` +
      `[09:18] Caller: Hi — Dr. Patel told me to take some supplements but I forgot which ones. Can you remind me?\n` +
      `[09:19] Sunset GP Team: Sure — I can see your care plan from Dr. Patel.\n` +
      `[09:19] Sunset GP Team: It notes: Vitamin D3 1000 IU once daily, and magnesium glycinate 200 mg at night.\n` +
      `[09:20] Sunset GP Team: If you have any side effects or questions about dosing, please book a follow‑up.\n` +
      `[09:20] Caller: Great, thanks.\n` +
      `[09:21] Sunset GP Team: You’re welcome — anything else I can help with?`,
  },
  {
    id: "11",
    intent: "Book appointment",
    urgency: "Today",
    summary:
      "Summary of what I completed\n" +
      "1. Checked today’s vaccine appointment availability and confirmed all practitioners are fully booked.\n" +
      "2. Scanned tomorrow’s calendar and found availability (including a 3:00 PM slot).\n" +
      "3. Forwarded the request to the practitioner for confirmation.\n" +
      "4. Added a calendar reminder for tomorrow at 3:00 PM pending confirmation.",
    extractedDetails: {
      patientName: "Maya Collins",
      preferredTime: "Tomorrow 3:00 PM",
    },
    confidence: "High",
    missingInfo: [],
    recommendedNextStep: "Await practitioner confirmation; send booking confirmation to patient",
    status: "Waiting",
    handledBy: "Automation",
    receivedAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    transcript:
      `[17:05] Sunset GP Team: Hi, this is Alex from Sunset GP. How can I help?\n` +
      `[17:05] Caller: Hi — I’d like to schedule a vaccine appointment today if possible.\n` +
      `[17:06] Sunset GP Team: Thanks. I’ve checked today’s schedule — all practitioners are fully booked.\n` +
      `[17:06] Sunset GP Team: I can see availability tomorrow, including a 3:00 PM slot. Would tomorrow at 3 PM work?\n` +
      `[17:07] Caller: Yes, tomorrow 3pm works.\n` +
      `[17:07] Sunset GP Team: Great — I’ve forwarded your request to the practitioner for confirmation and set a reminder.\n` +
      `[17:08] Sunset GP Team: We’ll confirm the booking as soon as it’s approved.`,
  },
]

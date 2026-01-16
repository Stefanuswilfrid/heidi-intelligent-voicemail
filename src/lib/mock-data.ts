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
      "Summary of what I completed\n" +
      "1. Customer asked whether the clinic provides travel vaccines.\n" +
      "2. Scanned the business info documents in the knowledge base for service availability.\n" +
      "3. Responded with the clinic’s service information and next steps.\n" +
      "4. Customer acknowledged with 'okay, thank you'",
    extractedDetails: {},
    confidence: "High",
    missingInfo: [],
    recommendedNextStep: "Auto-resolved: provided service information from business info documents",
    status: "Done",
    handledBy: "Automation",
    receivedAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    transcript:
      `[15:26] Sunset GP Team: Hi, this is Alex from Sunset GP. How can I help?\n` +
      `[15:26] Caller: Hi — do you provide travel vaccines?\n` +
      `[15:27] Sunset GP Team: Let me check our business info documents.\n` +
      `[15:27] Sunset GP Team: Yes — we provide common travel vaccines.\n` +
      `[15:27] Sunset GP Team: If you share your destination and travel date, we can advise what you need. You can also book online or call reception.\n` +
      `[15:28] Caller: Okay, thank you.\n` +
      `[15:28] Sunset GP Team: You’re welcome — anything else I can help with?`,
  },
  {
    id: "11",
    intent: "Book appointment",
    urgency: "Today",
    summary:
      "Summary of what I completed\n" +
      "1. Checked today’s vaccine appointment availability and confirmed all practitioners are fully booked.\n" +
      "2. Scanned Dr. Aisha Rahman’s calendar for tomorrow and found 3 empty slots between 4:00 PM and 5:30 PM.\n" +
      "3. Offered those 3 slots to the customer and captured their selection.\n" +
      "4. Forwarded the chosen slot via WhatsApp to Dr. Aisha Rahman.\n" +
      "5. Dr. Aisha Rahman confirmed the booking.\n" +
      "6. Added a calendar reminder for the confirmed slot (tomorrow at 4:45 PM).",
    extractedDetails: {
      patientName: "Maya Collins",
      preferredTime: "Tomorrow 4:45 PM",
    },
    confidence: "High",
    missingInfo: [],
    recommendedNextStep: "Auto-resolved: booking confirmed; send confirmation message to patient",
    status: "Done",
    handledBy: "Automation",
    receivedAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    transcript:
      `[17:05] Sunset GP Team: Hi, this is Alex from Sunset GP. How can I help?\n` +
      `[17:05] Caller: Hi — I’d like to schedule a vaccine appointment today if possible.\n` +
      `[17:06] Sunset GP Team: Thanks. I’ve checked today’s schedule — all practitioners are fully booked.\n` +
      `[17:06] Sunset GP Team: I checked Dr. Aisha Rahman’s calendar for tomorrow — she has 3 open slots between 4:00 PM and 5:30 PM (4:00, 4:45, 5:30).\n` +
      `[17:07] Sunset GP Team: Which time would you like to book?\n` +
      `[17:07] Caller: 4:45 PM please.\n` +
      `[17:07] Sunset GP Team: Great — I’ll forward the 4:45 PM request via WhatsApp to Dr. Aisha Rahman now.\n` +
      `[17:08] Dr. Aisha Rahman: Confirmed — booked for tomorrow at 4:45 PM.\n` +
      `[17:08] Sunset GP Team: Perfect — you’re booked for tomorrow at 4:45 PM. We’ll send a confirmation shortly.`,
  },
]

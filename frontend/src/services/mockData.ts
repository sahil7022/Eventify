import { MainEvent, SubEvent, UserProfile, Broadcast } from "./types";

// SHARED MOCK DATA (Simulates a MySQL Database)
export const MOCK_EVENTS: MainEvent[] = [
  {
    id: "e1",
    name: "Nexus Tech Summit 2025",
    collegeName: "VIT Chennai",
    date: "2025-10-12",
    time: "10:00",
    location: "Grand Arena, South Block",
    image: "https://images.unsplash.com/photo-1540575861501-7ad0582371f3?auto=format&fit=crop&q=80",
    category: "Tech",
    price: "₹499",
    description: "Dive into the future of neural interfaces and quantum computing at the campus's largest technology gathering.",
    totalOrganizers: 50,
    organizersPerSubEvent: 5,
    allowParticipants: true,
    maxParticipants: 1000,
    subEventCount: 3
  },
  {
    id: "e2",
    name: "Strategic Biz Expo",
    collegeName: "VIT Vellore",
    date: "2025-11-05",
    time: "09:00",
    location: "Innovation Hub, Main Campus",
    image: "https://images.unsplash.com/photo-1475721027185-39a1294d55ee?auto=format&fit=crop&q=80",
    category: "Business",
    price: "Free",
    description: "Connect with industry leaders and entrepreneurial minds to forge the next generation of commerce.",
    totalOrganizers: 30,
    organizersPerSubEvent: 3,
    allowParticipants: true,
    maxParticipants: 500,
    subEventCount: 2
  }
];

export const MOCK_SUB_EVENTS: SubEvent[] = [
  {
    id: "sub1",
    eventId: "e1",
    name: "Neural Frontiers Keynote",
    date: "2025-10-12",
    time: "10:30",
    venue: "Hall A",
    location: "Hall A",
    teamLeads: [
      { id: "u1", name: "Dr. Elena Vance" }
    ],
    organizers: [
      { id: "u3", name: "Alice Green" }
    ],
    participantCount: 156,
    organizersLimit: 5,
    participantsLimit: 300,
    description: "Exploring the next generation of brain-computer interfaces."
  },
  {
    id: "sub2",
    eventId: "e1",
    name: "Quantum Logic Workshop",
    date: "2025-10-14",
    time: "14:00",
    venue: "Innovation Lab 4",
    location: "Innovation Lab 4",
    teamLeads: [],
    organizers: [],
    participantCount: 45,
    organizersLimit: 3,
    participantsLimit: 60,
    description: "Hands-on quantum gate construction."
  }
];

export const MOCK_BROADCASTS: Broadcast[] = [
  {
    id: "b1",
    eventId: "e1",
    authorId: "admin1",
    authorName: "System Command",
    message: "Welcome to Nexus Tech Summit 2025! Please ensure your digital IDs are updated.",
    timestamp: "2h ago",
    target: "all"
  },
  {
    id: "b2",
    eventId: "e1",
    authorId: "admin1",
    authorName: "System Command",
    message: "Registration for the Quantum Workshop is now 80% full.",
    timestamp: "5h ago",
    target: "participants"
  }
];

export const MOCK_APPROVED_ORGANIZERS: UserProfile[] = [
  { uid: "u3", name: "Alice Green", email: "alice@event.com", role: "organizer", college: "VIT Chennai", department: "IT", mobile: "1122334455", interests: [] },
  { uid: "u4", name: "Bob White", email: "bob@event.com", role: "organizer", college: "VIT Chennai", department: "EE", mobile: "5544332211", interests: [] },
  { uid: "u5", name: "Charlie Brown", email: "charlie@event.com", role: "organizer", college: "VIT Vellore", department: "Business", mobile: "9988776655", interests: [] }
];

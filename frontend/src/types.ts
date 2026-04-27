/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Session {
  id: string;
  title: string;
  time: string;
  speaker: string;
  location: string;
  description: string;
}

export interface Event {
  id: string;
  name: string;
  collegeName?: string;
  date: string;
  time?: string;
  location: string;
  image: string;
  bannerUrl?: string;
  category: "Tech" | "Business" | "Art" | "Sports";
  price: string;
  description: string;
  totalOrganizers?: number;
  organizersPerSubEvent?: number;
  allowParticipants?: boolean;
  maxParticipants?: number;
  subEventCount?: number;
  sessions?: Session[];
}

export interface Booking {
  id: string;
  role: "Participant" | "Organizer";
  status: "Upcoming" | "Completed" | "Cancelled";
}

export type Role = "admin" | "organizer" | "participant" | "team_lead" | "sub_organizer" | "user" | "super_admin";

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  college: string;
  department: string;
  mobile: string;
  interests: string[];
  role: Role;
  viewAs?: Role;
  assignedSubEventIds?: string[];
  imageUrl?: string;
}

export type MainEvent = Event;

export interface SubEvent {
  id: string;
  eventId: string;
  name: string;
  date: string;
  time: string;
  venue: string;
  location?: string; // Adding as optional for wizard compatibility
  posterUrl?: string;
  teamLeads: { id: string; name: string; avatar?: string; imageUrl?: string }[];
  organizers?: { id: string; name: string; avatar?: string; imageUrl?: string }[];
  participantCount: number;
  organizersLimit?: number;
  participantsLimit?: number;
  description: string;
  rulesType?: "text" | "file";
  rulesContent?: string;
  rulesFileUrl?: string;
  rules?: string;
  instructions?: string;
}

export interface Organizer {
  id: string;
  name: string;
  role: string;
  assignedSubEvent?: string;
  status: 'active' | 'offline';
}

export interface OrganizerAnnouncement {
  id: string;
  subEventId?: string; // If undefined, it's a main event announcement
  authorId: string;
  authorName: string;
  message: string;
  timestamp: string;
}

export interface AdminStats {
  totalEvents: number;
  ongoingEvents: number;
  completedEvents: number;
  totalParticipants: number;
  activeOrganizers: number;
  popularEvent?: string;
  trendingEvent?: string;
  websiteTraffic?: number;
}

export interface ExternalEventRequest {
  id: string;
  collegeName: string;
  eventName: string;
  eventDetails: string;
  websiteLink?: string;
  status: "pending" | "approved" | "rejected";
  timestamp: string;
}

export interface OrganizerApplication {
  id: string;
  userId: string;
  userName: string;
  eventName: string;
  eventId: string;
  status: "pending" | "approved" | "rejected";
  timestamp: string;
}

export interface Broadcast {
  id: string;
  eventId?: string;
  title?: string;
  message: string;
  timestamp: string;
  type: 'info' | 'alert';
  target?: "all" | "organizers" | "participants";
}


export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'event' | 'system' | 'reminder' | 'alert';
}

export type NotificationVariant = 'success' | 'error' | 'info';

export interface ToastNotification {
  id: string;
  message: string;
  type: NotificationVariant;
}

export interface RuleBook {
  subEventId: string;
  rulesType: "text" | "file";
  rulesContent?: string;
  fileUrl?: string;
  fileName?: string;
  isPublished: boolean;
  updatedAt: string;
}

export interface ParticipantEvent {
  id: string;
  userId: string;
  eventId: string;
  subEventId?: string;
  posterUrl?: string; // Sub-event specific poster visibility
  name: string;
  date: string;
  time: string;
  venue: string;
  status: "Upcoming" | "Completed" | "Cancelled";
  description: string;
  rules?: string;
  instructions?: string;
  announcements: {
    id: string;
    message: string;
    timestamp: string;
    author: string;
  }[];
}

import { UserProfile, SubEvent, RuleBook } from "../types";

const BASE_URL = "http://localhost:5000/api";
const getToken = () => localStorage.getItem("token") || "";

export const OrganizerService = {
  getSubEvents: async (eventId: string): Promise<SubEvent[]> => {
    const res = await fetch(`${BASE_URL}/events/${eventId}/sub-events`);
    return res.json();
  },

  getParticipants: async (eventId: string) => {
    const res = await fetch(`${BASE_URL}/events/${eventId}/participants`, {
      headers: { Authorization: getToken() }
    });
    return res.json();
  },

  getBroadcasts: async (eventId: string) => {
    const res = await fetch(`${BASE_URL}/events/${eventId}/notices`);
    return res.json();
  },

  postAnnouncement: async (eventId: string, message: string) => {
    const res = await fetch(`${BASE_URL}/events/notice`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Authorization: getToken() 
      },
      body: JSON.stringify({ eventId, message })
    });
    return res.json();
  },

  updateSubEvent: async (id: string, data: Partial<SubEvent>) => {
    const res = await fetch(`${BASE_URL}/events/sub-events/${id}`, {
      method: "PATCH",
      headers: { 
        "Content-Type": "application/json",
        Authorization: getToken() 
      },
      body: JSON.stringify(data)
    });
    return res.json();
  }
};

import { MainEvent, SubEvent, AdminStats, UserProfile, Role, Broadcast, OrganizerApplication, ExternalEventRequest } from "../types";

const BASE_URL = "http://localhost:5000/api";
const getToken = () => localStorage.getItem("token") || "";

export const AdminService = {
  // 📊 Stats & Analytics
  getDashboardStats: async (): Promise<AdminStats> => {
    const res = await fetch(`${BASE_URL}/admin/stats`, {
      headers: { Authorization: getToken() }
    });
    return res.json();
  },

  // 🧩 External Event Requests
  getExternalEventRequests: async (): Promise<ExternalEventRequest[]> => {
    const res = await fetch(`${BASE_URL}/admin/external-requests`, {
      headers: { Authorization: getToken() }
    });
    return res.json();
  },

  handleExternalEventRequest: async (requestId: string, action: "approve" | "reject") => {
    const res = await fetch(`${BASE_URL}/admin/external-requests/${requestId}`, {
      method: "PATCH",
      headers: { 
        "Content-Type": "application/json",
        Authorization: getToken() 
      },
      body: JSON.stringify({ status: action === "approve" ? "approved" : "rejected" })
    });
    return res.json();
  },

  // 🧩 Event Management
  getEvents: async (): Promise<MainEvent[]> => {
    const res = await fetch(`${BASE_URL}/events`);
    return res.json();
  },

  createEvent: async (data: Partial<MainEvent>) => {
    const res = await fetch(`${BASE_URL}/events`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Authorization: getToken() 
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  updateEvent: async (id: string, data: Partial<MainEvent>) => {
    const res = await fetch(`${BASE_URL}/events/${id}`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        Authorization: getToken() 
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  deleteEvent: async (id: string) => {
    const res = await fetch(`${BASE_URL}/events/${id}`, {
      method: "DELETE",
      headers: { Authorization: getToken() }
    });
    return res.json();
  },

  // 🧩 Sub-Event Management
  getSubEvents: async (eventId: string): Promise<SubEvent[]> => {
    const res = await fetch(`${BASE_URL}/events/${eventId}/sub-events`);
    return res.json();
  },

  createSubEvent: async (eventId: string, data: Partial<SubEvent>) => {
    const res = await fetch(`${BASE_URL}/events/${eventId}/sub-events`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Authorization: getToken() 
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // 👥 Organizer Applications
  getApplications: async (): Promise<OrganizerApplication[]> => {
    const res = await fetch(`${BASE_URL}/admin/applications`, {
      headers: { Authorization: getToken() }
    });
    return res.json();
  },

  handleApplication: async (appId: string, action: "approve" | "reject") => {
    const res = await fetch(`${BASE_URL}/admin/applications/${appId}`, {
      method: "PATCH",
      headers: { 
        "Content-Type": "application/json",
        Authorization: getToken() 
      },
      body: JSON.stringify({ status: action === "approve" ? "approved" : "rejected" })
    });
    return res.json();
  },

  // 👥 User Management
  getUsers: async (): Promise<UserProfile[]> => {
    const res = await fetch(`${BASE_URL}/admin/users`, {
      headers: { Authorization: getToken() }
    });
    return res.json();
  },

  updateUserRole: async (userId: string, role: Role) => {
    const res = await fetch(`${BASE_URL}/admin/users/${userId}/role`, {
      method: "PATCH",
      headers: { 
        "Content-Type": "application/json",
        Authorization: getToken() 
      },
      body: JSON.stringify({ role })
    });
    return res.json();
  },

  // 📢 Broadcast System
  sendBroadcast: async (data: Partial<Broadcast>) => {
    const res = await fetch(`${BASE_URL}/events/notice`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Authorization: getToken() 
      },
      body: JSON.stringify({
        eventId: data.eventId,
        message: data.message,
        type: data.type
      })
    });
    return res.json();
  }
};

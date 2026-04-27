const BASE_URL = "http://localhost:5000/api";

// 🔐 GET TOKEN
const getToken = () => localStorage.getItem("token") || "";

export const api = {

  /* ================= AUTH ================= */

  login: async (data: { email: string; password: string }) => {
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    // ✅ store token (IMPORTANT)
    if (result.token) {
      localStorage.setItem("token", result.token);
    }

    return result;
  },

  /* ================= EVENTS ================= */

  getEvents: async () => {
    const res = await fetch(`${BASE_URL}/events`);
    return res.json();
  },

  /* ================= PROFILE ================= */

  getProfile: async () => {
    const res = await fetch(`${BASE_URL}/profile`, {
      headers: {
        Authorization: getToken(),
      },
    });
    return res.json();
  },

  saveProfile: async (profile: any) => {
    const res = await fetch(`${BASE_URL}/profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: getToken(),
      },
      body: JSON.stringify(profile),
    });
    return res.json();
  },

  /* ================= REGISTRATION ================= */

  registerEvent: async (eventId: number, role = "Participant") => {
    const res = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: getToken(),
      },
      body: JSON.stringify({ eventId, role }),
    });
    return res.json();
  },

  getRegistrations: async () => {
    const res = await fetch(`${BASE_URL}/registrations`, {
      headers: {
        Authorization: getToken(),
      },
    });
    return res.json();
  },

  /* ================= BOOKMARK ================= */

  bookmarkEvent: async (eventId: number) => {
    const res = await fetch(`${BASE_URL}/bookmark`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: getToken(),
      },
      body: JSON.stringify({ eventId }),
    });
    return res.json();
  },

  removeBookmark: async (eventId: number) => {
    const res = await fetch(`${BASE_URL}/bookmark/${eventId}`, {
      method: "DELETE",
      headers: {
        Authorization: getToken(),
      },
    });
    return res.json();
  },

  getBookmarks: async () => {
    const res = await fetch(`${BASE_URL}/bookmarks`, {
      headers: {
        Authorization: getToken(),
      },
    });
    return res.json();
  },

  /* ================= STATS ================= */

  getStats: async () => {
    const res = await fetch(`${BASE_URL}/stats`);
    return res.json();
  },

  getOrganizerStats: async (eventId: number) => {
    const res = await fetch(`${BASE_URL}/organizer/stats/${eventId}`);
    return res.json();
  },
};
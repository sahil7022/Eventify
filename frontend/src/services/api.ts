const BASE_URL = "http://localhost:5000/api";

// 🔐 GET TOKEN
const getToken = () => localStorage.getItem("token") || "";

export const api = {

  /* ================= AUTH ================= */

  login: async (data: { email: string; password: string }) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
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

  register: async (data: any) => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  /* ================= EVENTS ================= */

  getEvents: async () => {
    const res = await fetch(`${BASE_URL}/events`);
    return res.json();
  },

  getEventById: async (id: string) => {
    const res = await fetch(`${BASE_URL}/events/${id}`);
    return res.json();
  },

  /* ================= PROFILE ================= */

  getProfile: async () => {
    const res = await fetch(`${BASE_URL}/auth/profile`, {
      headers: {
        Authorization: getToken(),
      },
    });
    return res.json();
  },

  saveProfile: async (profile: any) => {
    const res = await fetch(`${BASE_URL}/auth/profile`, {
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

  registerEvent: async (eventId: number, teamName: string = "", role = "Participant") => {
    const res = await fetch(`${BASE_URL}/events/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: getToken(),
      },
      body: JSON.stringify({ eventId, team_name: teamName, role }),
    });
    return res.json();
  },

  getRegistrations: async () => {
    const res = await fetch(`${BASE_URL}/events/user/registrations`, {
      headers: {
        Authorization: getToken(),
      },
    });
    return res.json();
  },

  /* ================= BOOKMARK ================= */

  bookmarkEvent: async (eventId: number) => {
    const res = await fetch(`${BASE_URL}/events/bookmark`, {
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
    const res = await fetch(`${BASE_URL}/events/bookmark/${eventId}`, {
      method: "DELETE",
      headers: {
        Authorization: getToken(),
      },
    });
    return res.json();
  },

  getBookmarks: async () => {
    const res = await fetch(`${BASE_URL}/events/user/bookmarks`, {
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
    const res = await fetch(`${BASE_URL}/admin/stats/${eventId}`); // Updated path
    return res.json();
  },

  uploadPhoto: async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch(`${BASE_URL}/auth/profile/image`, {
      method: "POST",
      headers: {
        Authorization: getToken(),
      },
      body: formData,
    });
    return res.json();
  },
};
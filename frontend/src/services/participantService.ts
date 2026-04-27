const BASE_URL = "http://localhost:5000/api";
const getToken = () => localStorage.getItem("token") || "";

export const ParticipantService = {
  getUserEvents: async (): Promise<any[]> => {
    const res = await fetch(`${BASE_URL}/events/user/registrations`, {
      headers: { Authorization: getToken() }
    });
    return res.json();
  },

  cancelRegistration: async (eventId: string): Promise<{ success: boolean; message: string }> => {
    const res = await fetch(`${BASE_URL}/events/register/${eventId}`, {
      method: "DELETE",
      headers: { Authorization: getToken() }
    });
    return res.json();
  },

  getRuleBook: async (subEventId: string): Promise<any> => {
    const res = await fetch(`${BASE_URL}/events/sub-events/${subEventId}/notices`);
    return res.json();
  }
};

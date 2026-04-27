import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Event, Booking, UserProfile } from "../types";
import { useNotification } from "../contexts/NotificationContext";
import { firebaseService } from "../services/firebaseService";

export const useDashboard = () => {
  const { showNotification } = useNotification();
  const [searchParams] = useSearchParams();
  const [user] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const currentTab = searchParams.get("tab") || (user?.role === "admin" && (!user.viewAs || user.viewAs === "admin") ? "admin" : "hub");
  
  const [events, setEvents] = useState<Event[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const allEvents = await firebaseService.getEvents();
        setEvents(allEvents as any);

        if (user && user.uid) {
          const myBookings = await firebaseService.getUserRegistrations(user.uid);
          setBookings(myBookings as any);
        }
      } catch (err: any) {
        console.error("Dashboard data fetch failed:", err);
        showNotification('error', 'Failed to synchronize mission data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const [managingEvent, setManagingEvent] = useState<Event | null>(null);

  const featured = events.length > 0 ? events[0] : null;

  const handleJoin = (e: Event, sub?: any) => {
    const bookingId = sub ? `${e.id}-${sub.id}` : e.id;
    if (!bookings.find(b => b.id === bookingId)) {
      setBookings([...bookings, { id: bookingId, role: 'Participant', status: 'Upcoming' }]);
      showNotification('success', `Transmission Synchronized! You joined ${sub ? sub.name : e.name}.`);
    } else {
      showNotification('info', `Identity already registered for ${sub ? sub.name : e.name}.`);
    }
  };

  const handleCancel = (eventId: string) => {
    setBookings(prev => prev.map(b => b.id === eventId ? { ...b, status: 'Cancelled' } : b));
    showNotification('info', 'Event cancelled.');
  };

  return {
    user,
    events,
    featured,
    bookings,
    currentTab,
    managingEvent,
    setManagingEvent,
    handleJoin,
    handleCancel
  };
};

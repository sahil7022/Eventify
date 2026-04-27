import { useState, useEffect } from "react";
import { AdminService } from "../services/adminService";
import { MainEvent, SubEvent, AdminStats, UserProfile, Role, Broadcast, OrganizerApplication, ExternalEventRequest } from "../types";
import { useNotification } from "../contexts/NotificationContext";

export function useAdminDashboard() {
  const { showNotification } = useNotification();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [events, setEvents] = useState<MainEvent[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [applications, setApplications] = useState<OrganizerApplication[]>([]);
  const [externalRequests, setExternalRequests] = useState<ExternalEventRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      const [statsData, eventsData, usersData, broadcastsData, appData, extData] = await Promise.all([
        AdminService.getDashboardStats(),
        AdminService.getEvents(),
        AdminService.getUsers(),
        AdminService.getBroadcasts(),
        AdminService.getApplications(),
        AdminService.getExternalEventRequests()
      ]);
      setStats(statsData);
      setEvents(eventsData);
      setUsers(usersData);
      setBroadcasts(broadcastsData);
      setApplications(appData);
      setExternalRequests(extData);
    } catch (err) {
      console.error("Failed to fetch admin data", err);
      showNotification('error', "Unable to connect. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const createEvent = async (data: Partial<MainEvent>) => {
    try {
      await AdminService.createEvent(data);
      showNotification('success', "Event created successfully.");
      fetchInitialData();
      return true;
    } catch (err) {
      showNotification('error', "Failed to create event.");
      return false;
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      await AdminService.deleteEvent(id);
      showNotification('success', "Event deleted.");
      setEvents(events.filter(e => e.id !== id));
      return true;
    } catch (err) {
      showNotification('error', "Failed to delete event.");
      return false;
    }
  };

  const updateRole = async (userId: string, role: Role) => {
    try {
      await AdminService.updateUserRole(userId, role);
      setUsers(users.map(u => u.uid === userId ? { ...u, role } : u));
      showNotification('success', "Permissions updated.");
      return true;
    } catch (err) {
      showNotification('error', "Failed to update permissions.");
      return false;
    }
  };

  const sendNotification = async (data: Partial<Broadcast>) => {
    try {
      await AdminService.sendBroadcast(data);
      showNotification('success', "Notification sent.");
      fetchInitialData();
      return true;
    } catch (err) {
      showNotification('error', "Failed to send notification.");
      return false;
    }
  };

  const handleApplication = async (appId: string, action: "approve" | "reject") => {
    try {
      await AdminService.handleApplication(appId, action);
      setApplications(prev => prev.filter(app => app.id !== appId));
      showNotification('success', `Application ${action === 'approve' ? 'approved' : 'rejected'}.`);
      if (action === 'approve') fetchInitialData();
      return true;
    } catch (err) {
      showNotification('error', "Something went wrong.");
      return false;
    }
  };

  const promoteToAdmin = async (email: string) => {
    try {
      await AdminService.promoteToAdmin(email);
      showNotification('success', `${email} is now an admin.`);
      fetchInitialData();
      return true;
    } catch (err) {
      showNotification('error', "Failed to update admin role.");
      return false;
    }
  };

  const handleExternalRequest = async (requestId: string, action: "approve" | "reject") => {
    try {
      await AdminService.handleExternalEventRequest(requestId, action);
      setExternalRequests(prev => prev.filter(req => req.id !== requestId));
      showNotification('success', `Request ${action === 'approve' ? 'approved' : 'rejected'}.`);
      if (action === 'approve') fetchInitialData();
      return true;
    } catch (err) {
      showNotification('error', "Failed to process request.");
      return false;
    }
  };

  const updateEvent = async (id: string, data: Partial<MainEvent>) => {
    try {
      await AdminService.updateEvent(id, data);
      showNotification('success', "Event updated.");
      fetchInitialData();
      return true;
    } catch (err) {
      showNotification('error', "Failed to update event.");
      return false;
    }
  };

  const getSubEvents = async (eventId: string) => {
    try {
      return await AdminService.getSubEvents(eventId);
    } catch (err) {
      showNotification('error', "Failed to load sub-events.");
      return [];
    }
  };

  const createSubEvent = async (eventId: string, data: Partial<SubEvent>) => {
    try {
      await AdminService.createSubEvent(eventId, data);
      showNotification('success', "Sub-event created.");
      return true;
    } catch (err) {
      showNotification('error', "Failed to create sub-event.");
      return false;
    }
  };

  const deleteSubEvent = async (subEventId: string) => {
    try {
      await AdminService.deleteSubEvent(subEventId);
      showNotification('success', "Sub-event deleted.");
      return true;
    } catch (err) {
      showNotification('error', "Failed to delete sub-event.");
      return false;
    }
  };

  const getApprovedOrganizers = async () => {
    try {
      return await AdminService.getApprovedOrganizers();
    } catch (err) {
      showNotification('error', "Failed to load organizers.");
      return [];
    }
  };

  const assignOrganizers = async (subEventId: string, organizerIds: string[], leadsCount: number) => {
    try {
      await AdminService.assignOrganizersToSubEvent(subEventId, organizerIds, leadsCount);
      showNotification('success', "Organizers assigned.");
      return true;
    } catch (err) {
      showNotification('error', "Failed to assign organizers.");
      return false;
    }
  };

  return {
    stats,
    events,
    users,
    notifications: broadcasts,
    applications,
    externalRequests,
    isLoading,
    createEvent,
    updateEvent,
    deleteEvent,
    getSubEvents,
    createSubEvent,
    deleteSubEvent,
    getApprovedOrganizers,
    assignOrganizers,
    updateRole,
    sendNotification,
    handleApplication,
    promoteToAdmin,
    handleExternalRequest,
    refresh: fetchInitialData
  };
}

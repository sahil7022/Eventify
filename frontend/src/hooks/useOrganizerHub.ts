import { useState, useEffect } from "react";
import { UserProfile, SubEvent, Event } from "../types";
import { OrganizerService } from "../services/organizerService";

export function useOrganizerHub(mainEvent: Event) {
  const [currentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem("user");
    let parsed = saved ? JSON.parse(saved) : null;
    
    // For demo purposes, we will force a role and assigned sub-events if none exists
    if (!parsed) {
      parsed = {
        uid: "u123",
        name: "Demo Lead",
        email: "lead@eventify.com",
        role: "team_lead",
        assignedSubEventIds: ["sub2", "sub1"],
        college: "Tech Inst.",
        dept: "Event Mgmt",
        mobile: "1234567890",
        interests: ["Management"],
        collegeId: "TL-001"
      };
      localStorage.setItem("user", JSON.stringify(parsed));
    }

    if (parsed && (!parsed.role || parsed.role === 'user')) {
       parsed.role = 'super_admin'; 
    }
    return parsed;
  });

  const [subEvents, setSubEvents] = useState<SubEvent[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeOrganizers, setActiveOrganizers] = useState(0);
  const [organizersList, setOrganizersList] = useState<any[]>([]);
  const [mostPopularName, setMostPopularName] = useState("Loading...");

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [subs, annons, organizers, popular, orgList] = await Promise.all([
          OrganizerService.getSubEvents(mainEvent.id),
          OrganizerService.getBroadcasts(mainEvent.id),
          OrganizerService.getActiveOrganizers(),
          OrganizerService.getMostPopular(),
          OrganizerService.getActiveOrganizersList()
        ]);
        setSubEvents(subs);
        setAnnouncements(annons);
        setActiveOrganizers(organizers.count);
        setMostPopularName(popular.name);
        setOrganizersList(orgList);
      } catch (err) {
        console.error("Sync error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [mainEvent.id]);

  const filteredSubEvents = subEvents.filter(sub => {
    const matchesSearch = sub.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          sub.venue.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (currentUser?.role === "super_admin") return matchesSearch;
    
    if (currentUser?.role === "team_lead" || currentUser?.role === "sub_organizer") {
      const isAssigned = currentUser.assignedSubEventIds?.includes(sub.id) || 
                         sub.teamLeads.some(tl => tl.id === currentUser.uid);
      return matchesSearch && isAssigned;
    }
    
    return false;
  });

  const canEdit = (sub: SubEvent) => {
    if (currentUser?.role === "super_admin") return true;
    if (currentUser?.role === "team_lead") {
      return currentUser.assignedSubEventIds?.includes(sub.id) || 
             sub.teamLeads.some(tl => tl.id === currentUser.uid);
    }
    return false;
  };

  return {
    currentUser,
    subEvents,
    filteredSubEvents,
    announcements,
    loading,
    searchQuery,
    setSearchQuery,
    activeOrganizers,
    organizersList,
    mostPopularName,
    canEdit
  };
}

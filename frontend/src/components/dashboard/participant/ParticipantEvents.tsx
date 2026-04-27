import React, { useState, useEffect, useMemo } from "react";
import { Search, Filter, CalendarDays, CheckCircle2, XCircle, Activity, ChevronRight, Hash } from "lucide-react";
import { ParticipantEvent } from "../../../types";
import { ParticipantService } from "../../../services/participantService";
import { EventCard } from "./EventCard";
import { EventDetailsModal } from "./EventDetailsModal";
import { UpcomingEventsSlider } from "./UpcomingEventsSlider";
import { motion, AnimatePresence } from "framer-motion";
import { useNotification } from "../../../contexts/NotificationContext";

export const ParticipantEvents = () => {
  const { showNotification } = useNotification();
  const [events, setEvents] = useState<ParticipantEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"All" | "Upcoming" | "Completed" | "Cancelled">("All");
  const [selectedEvent, setSelectedEvent] = useState<ParticipantEvent | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        // API: GET /api/participant/events?userId=${user.uid}&search=${searchQuery}
        const data = await ParticipantService.getUserEvents(user.uid || "guest");
        setEvents(data);
      } catch (err) {
        console.error("Failed to fetch participant events", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [searchQuery]); // Refetch or re-filter on search change

  const handleCancel = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this registration?")) return;

    try {
      const response = await ParticipantService.cancelRegistration(id);
      if (response.success) {
        setEvents(prev => prev.map(e => e.id === id ? { ...e, status: "Cancelled" } : e));
        showNotification('success', 'Registration cancelled successfully.');
      }
    } catch (err) {
      console.error("Cancellation failed", err);
      showNotification('error', 'Could not cancel registration.');
    }
  };

  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      const matchesSearch = e.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = activeFilter === "All" || e.status === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [events, searchQuery, activeFilter]);

  const stats = useMemo(() => {
    return {
      upcoming: events.filter(e => e.status === "Upcoming").length,
      completed: events.filter(e => e.status === "Completed").length
    };
  }, [events]);

  const upcomingEvents = useMemo(() => {
    return events
      .filter(e => e.status === "Upcoming")
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [events]);

  return (
    <div className="space-y-8 md:space-y-12">
      {/* 🚀 Summary & Highlight Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2">
           <UpcomingEventsSlider 
            events={upcomingEvents} 
            onViewDetails={setSelectedEvent} 
           />
        </div>

        <div className="glass-panel p-6 md:p-10 rounded-[2.5rem] md:rounded-[3rem] border-brand-border flex flex-col justify-between space-y-6 md:space-y-8">
           <div className="space-y-2">
              <p className="text-[9px] md:text-[10px] font-black text-brand-text-secondary uppercase tracking-[0.2em] md:tracking-[0.3em] italic">Squad Readiness</p>
              <h4 className="text-2xl md:text-3xl font-black text-white italic uppercase tracking-tighter">Mission Stats</h4>
           </div>
           
           <div className="space-y-4 md:space-y-6">
              <div className="flex items-center justify-between p-3.5 md:p-4 bg-white/5 rounded-xl md:rounded-2xl border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-accent/10 flex items-center justify-center text-brand-accent">
                    <Activity size={16} />
                  </div>
                  <p className="text-[9px] md:text-[10px] font-black text-white uppercase italic tracking-widest">Upcoming</p>
                </div>
                <p className="text-lg md:text-xl font-black text-brand-accent italic leading-none">{stats.upcoming}</p>
              </div>

              <div className="flex items-center justify-between p-3.5 md:p-4 bg-white/5 rounded-xl md:rounded-2xl border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <CheckCircle2 size={16} />
                  </div>
                  <p className="text-[9px] md:text-[10px] font-black text-white uppercase italic tracking-widest">Completed</p>
                </div>
                <p className="text-lg md:text-xl font-black text-emerald-500 italic leading-none">{stats.completed}</p>
              </div>
           </div>
        </div>
      </div>

      {/* 🔍 Search & Filters */}
      <div className="sticky top-0 z-30 pt-2 md:pt-4 -mt-2 md:-mt-4">
        <div className="glass-panel p-3 md:p-4 rounded-[1.5rem] md:rounded-[2rem] border-brand-border flex flex-col md:flex-row items-center gap-3 md:gap-4 shadow-2xl bg-brand-bg/80 backdrop-blur-md">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text-secondary w-4 h-4 md:w-[18px] md:h-[18px]" />
            <input 
              type="text" 
              placeholder="Search missions..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-brand-border rounded-xl pl-11 md:pl-12 pr-4 py-2.5 md:py-3 text-[11px] md:text-sm text-white placeholder:text-brand-text-secondary focus:border-brand-accent transition-all outline-none"
            />
          </div>
          
          <div className="flex items-center gap-1.5 md:gap-2 p-1 bg-white/5 rounded-[1rem] md:rounded-xl border border-white/10 w-full md:w-auto overflow-x-auto no-scrollbar">
            {["All", "Upcoming", "Completed", "Cancelled"].map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f as any)}
                className={`flex-1 md:flex-none px-4 md:px-6 py-2 md:py-2.5 rounded-lg text-[8px] md:text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  activeFilter === f ? "bg-brand-accent text-white shadow-lg shadow-brand-accent-glow" : "text-brand-text-secondary hover:text-white"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 📜 Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">
        <AnimatePresence mode="popLayout">
          {loading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="glass-panel h-60 md:h-64 rounded-3xl md:rounded-[2.5rem] border-brand-border animate-pulse bg-white/5" />
            ))
          ) : filteredEvents.length > 0 ? (
            filteredEvents.map(event => (
              <EventCard 
                key={event.id} 
                event={event} 
                onCancel={handleCancel}
                onViewDetails={setSelectedEvent}
              />
            ))
          ) : (
            <div className="col-span-full py-16 md:py-20 text-center space-y-4">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white/5 rounded-2xl md:rounded-[2rem] flex items-center justify-center mx-auto text-brand-text-secondary">
                <Hash className="w-8 h-8 md:w-10 md:h-10" />
              </div>
              <p className="text-[9px] md:text-[10px] font-black text-brand-text-secondary uppercase tracking-[0.2em] md:tracking-[0.3em] italic">No matching transmissions found</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      <EventDetailsModal 
        event={selectedEvent} 
        onClose={() => setSelectedEvent(null)} 
      />
    </div>
  );
};

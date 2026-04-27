import React from "react";
import { ParticipantEvents } from "../../components/dashboard/participant/ParticipantEvents";

interface MyEventsProps {
  events: any[]; // Kept for prop compatibility with Dashboard.tsx, but we'll fetch real data
  bookings: any[];
  onCancel: (id: string) => void;
}

/**
 * MY EVENTS PAGE (PARTICIPANT SIDE)
 * 
 * This component serves as the tactical dashboard for participants.
 * Features: Upcoming Highlight, Registered Events, Search/Filter, Cancellation, and Details.
 */
export const MyEvents = ({ events, bookings, onCancel }: MyEventsProps) => {
  return (
    <div className="pb-20">
      <ParticipantEvents />
    </div>
  );
};

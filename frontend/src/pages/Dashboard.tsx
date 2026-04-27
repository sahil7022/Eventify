/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Event, Booking, UserProfile } from "../types";

// Sub-components
import { Hub } from "./dashboard/Hub";
import { Insights } from "./dashboard/Insights";
import { MyEvents } from "./dashboard/MyEvents";
import { OrganizerHub } from "./dashboard/OrganizerHub";
import { EventControl } from "./dashboard/EventControl";
import { AdminDashboard } from "./dashboard/AdminDashboard";
import { useNotification } from "../contexts/NotificationContext";
import { useDashboard } from "../hooks/useDashboard";

export default function Dashboard() {
  const {
    user,
    events,
    featured,
    bookings,
    currentTab,
    managingEvent,
    setManagingEvent,
    handleJoin,
    handleCancel
  } = useDashboard();

  const isSimulation = user?.role === "admin" && user.viewAs && user.viewAs !== "admin";
  const displayRole = isSimulation ? user?.viewAs : user?.role;

  const renderContent = () => {
    if (managingEvent) {
      return <EventControl key="manage" event={managingEvent} onBack={() => setManagingEvent(null)} />;
    }

    // Admin Strict View
    if (!isSimulation && user?.role === "admin") {
      return <AdminDashboard activePath={currentTab} />;
    }

    // Role-based views
    switch (displayRole) {
      case "organizer":
      case "team_lead":
        return <OrganizerHub events={events} onManage={setManagingEvent} />;
      case "participant":
      default:
        switch (currentTab) {
          case "hub":
            return <Hub events={events} featured={featured} bookings={bookings} onJoin={handleJoin} />;
          case "insights":
            return <Insights />;
          case "events":
            return <MyEvents events={events} bookings={bookings} onCancel={handleCancel} />;
          default:
            return <Hub events={events} featured={featured} bookings={bookings} onJoin={handleJoin} />;
        }
    }
  };

  return (
    <div className="p-6 lg:p-10 pb-20">
      <div className="flex items-center justify-between gap-6 mb-12">
        <div>
           <div className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-1 italic">
             Sector: {currentTab.includes('admin') ? "Strategic Command" : "Field Operations"}
           </div>
           <h2 className="text-4xl lg:text-5xl font-black italic uppercase tracking-tighter text-brand-text-primary">
              {isSimulation ? `${user?.viewAs} Simulation` : (
                currentTab.startsWith("admin") ? "Admin Hub" : 
                currentTab === "hub" ? "The Hub" : 
                currentTab === "insights" ? "Intelligence" : 
                currentTab === "events" ? "My Events" : 
                "Organizer Hub"
              )}
           </h2>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={`${currentTab}-${displayRole}-${managingEvent?.id}`}
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

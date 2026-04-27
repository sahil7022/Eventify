import React from 'react';
import { 
  Shield, 
  Activity
} from "lucide-react";
import { useAdminDashboard } from "../../hooks/useAdminDashboard";
import { Overview } from "../admin/Overview";
import { EventsManager } from "../admin/EventsManager";
import { OrganizerControl } from "../admin/OrganizerControl";
import { ParticipantDatabase } from "../admin/ParticipantDatabase";
import { NotificationCenter } from "../admin/BroadcastCenter";
import { SystemAnalytics } from "../admin/SystemAnalytics";
import { SecuritySettings } from "../admin/SecuritySettings";
import { ExternalRequests } from "../admin/ExternalRequests";

export const AdminDashboard = ({ activePath }: { activePath: string }) => {
  const { 
    stats, 
    events, 
    users, 
    notifications,
    applications,
    externalRequests,
    isLoading, 
    deleteEvent, 
    updateEvent,
    createEvent,
    getSubEvents,
    createSubEvent,
    deleteSubEvent,
    getApprovedOrganizers,
    assignOrganizers,
    updateRole, 
    sendNotification,
    handleApplication,
    promoteToAdmin,
    handleExternalRequest
  } = useAdminDashboard();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Activity size={40} className="text-brand-accent animate-spin" />
          <p className="text-[10px] font-black text-brand-accent uppercase tracking-widest italic animate-pulse">Updating...</p>
        </div>
      </div>
    );
  }

  const renderSection = () => {
    switch (activePath) {
      case "admin-events":
        return (
          <EventsManager 
            events={events} 
            deleteEvent={deleteEvent}
            updateEvent={updateEvent}
            createEvent={createEvent}
            getSubEvents={getSubEvents}
            createSubEvent={createSubEvent}
            deleteSubEvent={deleteSubEvent}
            getApprovedOrganizers={getApprovedOrganizers}
            assignOrganizers={assignOrganizers}
          />
        );
      case "admin-organizers":
        return (
          <OrganizerControl 
            applications={applications} 
            users={users} 
            handleApplication={handleApplication} 
            updateRole={updateRole} 
          />
        );
      case "admin-participants":
        return <ParticipantDatabase events={events} users={users} />;
      case "admin-requests":
        return <ExternalRequests requests={externalRequests} handleRequest={handleExternalRequest} />;
      case "admin-notifications":
        return <NotificationCenter events={events} broadcasts={notifications} sendBroadcast={sendNotification} />;
      case "admin-analytics":
        return <SystemAnalytics stats={stats} events={events} />;
      case "admin-settings":
        return <SecuritySettings promoteToAdmin={promoteToAdmin} />;
      case "admin":
      default:
        return <Overview stats={stats} broadcasts={notifications} />;
    }
  };

  const getTitle = () => {
    switch (activePath) {
      case "admin-events": return "Events";
      case "admin-organizers": return "Organizers";
      case "admin-participants": return "Participants";
      case "admin-requests": return "Event Requests";
      case "admin-notifications": return "Notifications";
      case "admin-analytics": return "Analytics";
      case "admin-settings": return "Settings";
      default: return "Dashboard";
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* 🚀 Header */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/5 p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-12 bg-brand-accent/5 rounded-full blur-3xl -mr-20 -mt-20" />
        <div className="space-y-1 relative z-10">
          <h2 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter">
            {getTitle()}
          </h2>
          <p className="text-[10px] font-black text-brand-accent uppercase tracking-widest italic flex items-center gap-2">
            <Shield size={12} /> Admin Access
          </p>
        </div>
        
        <div className="flex items-center gap-4 relative z-10">
           <div className="p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
              <Activity size={20} className="text-brand-accent animate-pulse" />
           </div>
           <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black text-white uppercase italic">Status: Online</p>
              <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest italic">Server: Online</p>
           </div>
        </div>
      </section>

      {renderSection()}
    </div>
  );
};

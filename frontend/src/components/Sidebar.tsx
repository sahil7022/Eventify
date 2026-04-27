import React, { useState } from "react";
import { 
  LogOut, 
  Globe, 
  TrendingUp, 
  Ticket, 
  BriefcaseBusiness, 
  Sparkles,
  User,
  Shield,
  LayoutDashboard,
  Users,
  Radio,
  BarChart3,
  ChevronRight,
  Settings as SettingsIcon
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserProfile } from "../types";

export const Sidebar = ({ user, isMobileOpen, onClose }: { user: UserProfile | null, isMobileOpen: boolean, onClose: () => void }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isSimulation = user?.role === "admin" && user.viewAs && user.viewAs !== "admin";

  const adminMenuItems = [
    { id: "admin", label: "Dashboard", icon: Shield, path: "/dashboard?tab=admin" },
    { id: "admin-events", label: "Events", icon: Globe, path: "/dashboard?tab=admin-events" },
    { id: "admin-organizers", label: "Organizers", icon: BriefcaseBusiness, path: "/dashboard?tab=admin-organizers" },
    { id: "admin-participants", label: "Participants", icon: Users, path: "/dashboard?tab=admin-participants" },
    { id: "admin-requests", label: "Event Requests", icon: Sparkles, path: "/dashboard?tab=admin-requests" },
    { id: "admin-notifications", label: "Notifications", icon: Radio, path: "/dashboard?tab=admin-notifications" },
    { id: "admin-analytics", label: "Analytics", icon: BarChart3, path: "/dashboard?tab=admin-analytics" },
    { id: "admin-settings", label: "Settings", icon: SettingsIcon, path: "/dashboard?tab=admin-settings" },
  ];

  const participantMenuItems = [
    { id: "hub", label: "Central Hub", icon: Globe, path: "/dashboard?tab=hub" },
    { id: "insights", label: "My Insights", icon: TrendingUp, path: "/dashboard?tab=insights" },
    { id: "events", label: "My Events", icon: Ticket, path: "/dashboard?tab=events" },
  ];

  const organizerMenuItems = [
    { id: "organizer", label: "Organizer Hub", icon: BriefcaseBusiness, path: "/dashboard?tab=organizer" },
  ];

  const teamLeadMenuItems = [
    { id: "organizer", label: "Team Lead Hub", icon: BriefcaseBusiness, path: "/dashboard?tab=organizer" },
  ];

  const getMenuItems = () => {
    if (isSimulation) {
      if (user?.viewAs === "participant") return participantMenuItems;
      if (user?.viewAs === "organizer") return organizerMenuItems;
      if (user?.viewAs === "team_lead") return teamLeadMenuItems;
    }

    if (user?.role === "admin") return adminMenuItems;
    if (user?.role === "organizer") return organizerMenuItems;
    if (user?.role === "team_lead") return teamLeadMenuItems;
    return participantMenuItems;
  };

  const handleSwitchRole = (role: string) => {
    const updated = { ...user, viewAs: role };
    localStorage.setItem("user", JSON.stringify(updated));
    window.location.reload();
  };

  const handleBackToAdmin = () => {
    const updated = { ...user, viewAs: "admin" };
    localStorage.setItem("user", JSON.stringify(updated));
    window.location.reload();
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <aside className={`fixed lg:relative inset-y-0 left-0 w-72 bg-brand-bg border-r border-brand-border flex flex-col z-[120] transition-transform duration-300 lg:translate-x-0 ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
      <div className="p-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-brand-accent flex items-center justify-center shadow-lg shadow-brand-accent-glow">
          <Sparkles size={20} className="text-white fill-current" />
        </div>
        <span className="text-2xl font-bold tracking-tight text-brand-text-primary uppercase italic">Eventify</span>
      </div>

      <nav className="flex-1 px-6 space-y-1 mt-4 overflow-y-auto scrollbar-none">
        {isSimulation && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
             <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-3 italic">Simulation Mode: {user?.viewAs}</p>
             <button 
               onClick={handleBackToAdmin}
               className="w-full py-2 bg-amber-500 text-white rounded-xl text-[8px] font-black uppercase tracking-widest shadow-lg shadow-amber-500/20"
             >
               Back to Admin Mode
             </button>
          </div>
        )}

        <div className="px-4 py-2 text-[10px] font-bold text-brand-text-secondary uppercase tracking-widest">Main Menu</div>
        {getMenuItems().map((item) => (
          <button
            key={item.id}
            onClick={() => {
              navigate(item.path);
              onClose();
            }}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${
              location.search.includes(`tab=${item.id}`) || (location.pathname === "/dashboard" && location.search === "" && item.id === "hub")
                ? "bg-brand-accent text-white shadow-xl shadow-brand-accent-glow"
                : "text-brand-text-secondary hover:text-brand-text-primary hover:bg-brand-glass"
            }`}
          >
            <item.icon size={18} />
            {item.label}
          </button>
        ))}

        {user?.role === "admin" && !isSimulation && (
           <>
            <div className="pt-8 px-4 py-2 text-[10px] font-bold text-brand-text-secondary uppercase tracking-widest">Simulation</div>
            <div className="grid grid-cols-1 gap-2 px-2 mt-2">
               {(['participant', 'organizer', 'team_lead'] as const).map((r) => (
                 <button 
                   key={r}
                   onClick={() => handleSwitchRole(r)}
                   className="flex items-center justify-between px-4 py-3 rounded-xl border border-white/5 bg-white/5 text-[9px] font-black text-slate-400 hover:text-white uppercase tracking-widest italic transition-all group"
                 >
                   {r}
                   <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
                 </button>
               ))}
            </div>
           </>
        )}

        <div className="pt-8 px-4 py-2 text-[10px] font-bold text-brand-text-secondary uppercase tracking-widest">Personal</div>
        <button
          onClick={() => { navigate("/profile"); onClose(); }}
          className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${
            location.pathname === "/profile"
              ? "bg-brand-accent text-white shadow-xl shadow-brand-accent-glow"
              : "text-brand-text-secondary hover:text-brand-text-primary hover:bg-brand-glass"
          }`}
        >
          <User size={18} />
          My Profile
        </button>
        <button
          onClick={() => { navigate("/settings"); onClose(); }}
          className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${
            location.pathname === "/settings"
              ? "bg-brand-accent text-white shadow-xl shadow-brand-accent-glow"
              : "text-brand-text-secondary hover:text-brand-text-primary hover:bg-brand-glass"
          }`}
        >
          <SettingsIcon size={18} />
          Settings
        </button>
      </nav>

      <div className="p-8 border-t border-brand-border">
         <div 
           onClick={() => { navigate("/profile"); onClose(); }}
           className="flex items-center gap-3 mb-6 p-2 rounded-xl bg-brand-glass border border-brand-border cursor-pointer hover:bg-brand-accent/5 transition-all"
         >
            <div className="w-10 h-10 rounded-lg bg-brand-bg flex items-center justify-center font-bold text-brand-text-primary border border-brand-border shrink-0 uppercase text-xs">
              {user?.name.substring(0, 2) || "ST"}
            </div>
            <div className="min-w-0">
               <div className="text-sm font-bold text-brand-text-primary truncate">{user?.name || "Student"}</div>
               <div className="text-[10px] text-brand-accent uppercase font-black truncate">Active Profile</div>
            </div>
         </div>
         <button 
           onClick={handleLogout}
           className="w-full py-4 bg-brand-glass hover:bg-red-500/10 text-brand-text-secondary hover:text-red-400 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-3 border border-brand-border"
         >
            <LogOut size={16} /> Logout
         </button>
      </div>
    </aside>
  );
};

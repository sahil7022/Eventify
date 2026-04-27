import React from "react";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  Calendar, 
  MapPin, 
  TrendingUp, 
  Shield, 
  Megaphone, 
  Search, 
  Filter, 
  Info,
  Activity
} from "lucide-react";
import { Event } from "../../types";
import { useOrganizerHub } from "../../hooks/useOrganizerHub";
import { SubEventCard } from "../../components/dashboard/organizer/SubEventCard";
import { SubEventControl } from "./SubEventControl";

interface OrganizerHubProps {
  events: Event[];
  onManage: (e: Event) => void;
}

export const OrganizerHub = ({ events }: OrganizerHubProps) => {
  const mainEvent = events[0];
  const {
    currentUser,
    filteredSubEvents,
    announcements,
    loading,
    searchQuery,
    setSearchQuery,
    activeOrganizers,
    mostPopularName,
    canEdit
  } = useOrganizerHub(mainEvent);

  const [selectedSubEvent, setSelectedSubEvent] = React.useState<any>(null);
  const [activeTab, setActiveTab] = React.useState<'hub' | 'sub_dashboard'>('hub');

  if (activeTab === 'sub_dashboard' && selectedSubEvent) {
    return (
      <SubEventControl 
        subEvent={selectedSubEvent} 
        onBack={() => setActiveTab('hub')} 
        role={currentUser?.role || 'user'}
        canEdit={canEdit(selectedSubEvent)}
      />
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12 pb-20">
      
      {/* Main Event Overview */}
      <section className="glass-panel p-6 md:p-10 lg:p-14 rounded-[2.5rem] md:rounded-[4rem] border-brand-border bg-gradient-to-br from-indigo-500/10 to-transparent relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_100%_0%,rgba(99,102,241,0.1),transparent)] pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row justify-between gap-8 md:gap-12 relative z-10">
          <div className="space-y-4 md:space-y-6">
            <div className="flex items-center gap-3">
               <ShieldCheck size={18} className="text-brand-accent md:h-5 md:w-5" />
               <span className="text-[9px] md:text-[10px] font-black text-brand-accent uppercase tracking-widest leading-none">
                 Security Clearance: {currentUser?.role?.replace('_', ' ')}
               </span>
            </div>
            <h3 className="text-3xl md:text-4xl lg:text-6xl font-black text-white italic uppercase tracking-tighter leading-tight md:leading-none">{mainEvent.name}</h3>
            <div className="flex flex-wrap gap-4 md:gap-6 text-brand-text-secondary">
               <div className="flex items-center gap-2 text-xs md:text-sm font-bold"><Calendar size={16} /> {mainEvent.date}</div>
               <div className="flex items-center gap-2 text-xs md:text-sm font-bold"><MapPin size={16} /> {mainEvent.location}</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 md:gap-8 shrink-0">
             <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 md:p-6 rounded-2xl md:rounded-[2rem] text-center">
                <p className="text-[8px] md:text-[9px] font-black text-brand-text-secondary uppercase tracking-widest mb-1">Sub-Events</p>
                <div className="text-2xl md:text-3xl font-black text-white italic">{filteredSubEvents.length}</div>
             </div>
             <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 md:p-6 rounded-2xl md:rounded-[2rem] text-center">
                <p className="text-[8px] md:text-[9px] font-black text-brand-text-secondary uppercase tracking-widest mb-1">Total Signals</p>
                <div className="text-2xl md:text-3xl font-black text-white italic">1.2k</div>
             </div>
          </div>
        </div>
      </section>

      {/* Stats Block */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {[
          { label: "Most Popular", value: mostPopularName, icon: TrendingUp },
          { label: "Active Organizers", value: `${activeOrganizers} Staff`, icon: Shield },
          { label: "Live Announcements", value: announcements.length, icon: Megaphone },
        ].map((stat, i) => (
          <div key={i} className="glass-panel p-4 md:p-6 rounded-2xl md:rounded-3xl border-brand-border flex items-center gap-4">
             <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-brand-accent/10 flex items-center justify-center text-brand-accent shrink-0">
                <stat.icon className="w-4 h-4 md:w-5 md:h-5" />
             </div>
             <div className="overflow-hidden">
                <p className="text-[8px] md:text-[9px] font-bold text-brand-text-secondary uppercase tracking-widest truncate">{stat.label}</p>
                <p className="text-xs md:text-sm font-black text-white uppercase italic truncate">{stat.value}</p>
             </div>
          </div>
        ))}
      </div>

      {/* Sub-Events Management */}
      <section className="space-y-6 md:space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-brand-border pb-6 gap-4 md:gap-6">
           <h4 className="text-xl md:text-2xl font-black text-white italic uppercase tracking-tighter">Sub-Event Management</h4>
           <div className="flex flex-col sm:flex-row gap-3 md:gap-4 flex-1 max-w-2xl justify-end w-full">
              <div className="relative flex-1">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text-secondary" size={16} />
                 <input 
                   type="text"
                   placeholder="Search sub-events..."
                   className="w-full bg-brand-glass border border-brand-border rounded-xl md:rounded-2xl pl-12 pr-4 py-2 md:py-2.5 text-[10px] md:text-xs text-white focus:border-brand-accent transition-all outline-none"
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                 />
              </div>
              <div className="flex items-center gap-3 glass-panel px-4 py-2 rounded-xl md:rounded-2xl border-brand-border h-9 md:h-10 shrink-0 w-max self-end sm:self-auto">
                 <Filter size={14} className="text-brand-accent" />
                 <span className="text-[8px] md:text-[9px] font-bold text-brand-text-secondary uppercase tracking-widest">Authorized: {filteredSubEvents.length}</span>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {loading ? (
             Array(3).fill(0).map((_, i) => (
                <div key={i} className="h-64 glass-panel rounded-3xl md:rounded-[3rem] animate-pulse bg-white/5" />
             ))
          ) : filteredSubEvents.map((sub) => (
            <SubEventCard 
              key={sub.id} 
              sub={sub} 
              onManage={(s) => { setSelectedSubEvent(s); setActiveTab('sub_dashboard'); }} 
            />
          ))}
        </div>
      </section>

      {/* Broadcast Feed */}
      <section className="space-y-4 md:space-y-6">
        <div className="flex items-center gap-3">
           <Megaphone size={20} className="text-brand-accent" />
           <h4 className="text-xl md:text-2xl font-black text-white italic uppercase tracking-tighter">Unified Transmission Feed</h4>
        </div>
        <div className="glass-panel p-6 md:p-8 rounded-[2.5rem] md:rounded-[3rem] border-brand-border space-y-4">
           {loading ? (
             <div className="py-12 flex justify-center"><Activity className="animate-spin text-brand-accent" /></div>
           ) : announcements.length > 0 ? (
             announcements.map(anon => (
                <div key={anon.id} className="flex gap-4 p-3 md:p-4 rounded-xl md:rounded-2xl bg-white/5 border border-white/5 hover:border-brand-accent/20 transition-all group">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-brand-accent/10 flex items-center justify-center text-brand-accent shrink-0">
                     <Info className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                        <p className="text-[11px] md:text-xs font-black text-white italic uppercase truncate">{anon.authorName} <span className="text-[8px] md:text-[9px] text-brand-accent tracking-widest not-italic ml-2">[{anon.subEventName}]</span></p>
                        <span className="text-[8px] md:text-[9px] font-bold text-brand-text-secondary uppercase tracking-widest shrink-0">{anon.timestamp}</span>
                     </div>
                     <p className="text-xs md:text-sm text-brand-text-secondary line-clamp-2 md:line-clamp-none font-medium">{anon.message}</p>
                  </div>
               </div>
             ))
           ) : (
             <p className="text-center py-10 text-brand-text-secondary italic uppercase text-[9px] md:text-[10px] font-bold tracking-widest text-xs">No transmissions intercepted.</p>
           )}
        </div>
      </section>
    </motion.div>
  );
};

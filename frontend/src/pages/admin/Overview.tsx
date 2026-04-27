import React from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  TrendingUp, 
  Megaphone,
  ChevronRight,
  Activity
} from "lucide-react";
import { AdminStats, Broadcast } from '../../types';

interface OverviewProps {
  stats: AdminStats | null;
  broadcasts: Broadcast[];
}

export const Overview = ({ stats, broadcasts }: OverviewProps) => {
  return (
    <div className="space-y-8">
      {/* 📊 Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {[
          { label: "Total Events", value: stats?.totalEvents, icon: Package, color: "text-blue-400" },
          { label: "Active Events", value: stats?.ongoingEvents, icon: Activity, color: "text-emerald-400" },
          { label: "Completed Events", value: stats?.completedEvents, icon: LayoutDashboard, color: "text-slate-400" },
          { label: "Participants", value: stats?.totalParticipants, icon: Users, color: "text-brand-accent" },
          { label: "Website Traffic", value: stats?.websiteTraffic, icon: TrendingUp, color: "text-indigo-400" }
        ].map((stat, idx) => (
          <div key={idx} className="glass-panel p-6 rounded-[2rem] border-brand-border bg-gradient-to-br from-white/5 to-transparent flex items-center justify-between group hover:border-brand-accent/30 transition-all">
            <div className="space-y-1">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic">{stat.label}</p>
              <h4 className="text-3xl font-black text-white italic">{stat.value || 0}</h4>
            </div>
            <div className={`p-4 rounded-2xl bg-white/5 border border-white/5 ${stat.color} group-hover:scale-110 transition-transform`}>
              <stat.icon size={24} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 glass-panel p-8 rounded-[2.5rem] border-brand-border space-y-6">
            <div className="flex items-center justify-between">
               <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Recent Notifications</h3>
               <TrendingUp size={16} className="text-brand-accent" />
            </div>
            <div className="space-y-4">
               {broadcasts.length === 0 ? (
                 <p className="text-slate-500 italic text-sm">No notifications sent yet.</p>
               ) : (
                 broadcasts.slice(0, 5).map(b => (
                   <div key={b.id} className="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-brand-accent/20 transition-all cursor-default">
                      <div className="flex items-center gap-4">
                         <div className="p-3 bg-brand-accent/10 rounded-xl text-brand-accent">
                            <Megaphone size={16} />
                         </div>
                         <div>
                            <p className="text-sm font-black text-white italic uppercase truncate max-w-[200px]">{b.title || "No Title"}</p>
                            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest italic">{new Date(b.timestamp).toLocaleString()}</p>
                         </div>
                      </div>
                      <ChevronRight size={16} className="text-slate-700" />
                   </div>
                 ))
               )}
            </div>
         </div>

         <div className="glass-panel p-8 rounded-[2.5rem] border-brand-border space-y-8">
            <div>
               <h3 className="text-xl font-black text-white italic uppercase tracking-tighter mb-1">Engagement Trends</h3>
               <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest italic leading-relaxed">Real-time engagement across all events.</p>
            </div>
            
            <div className="space-y-6">
               <div className="p-5 rounded-2xl bg-brand-accent/5 border border-brand-accent/10">
                  <p className="text-[8px] font-black text-brand-accent uppercase tracking-widest italic mb-2">Popular Event</p>
                  <h5 className="text-lg font-black text-white italic uppercase">{stats?.popularEvent || "Analyzing..."}</h5>
               </div>
               
               <div className="p-5 rounded-2xl bg-indigo-500/5 border border-indigo-500/10">
                  <p className="text-[8px] font-black text-indigo-400 uppercase tracking-widest italic mb-2">Trending Event</p>
                  <h5 className="text-lg font-black text-white italic uppercase">{stats?.trendingEvent || "Detecting..."}</h5>
               </div>
            </div>

            <div className="pt-4 border-t border-white/5">
                <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                   <p className="text-[8px] font-black text-emerald-500 uppercase italic">System Updated</p>
                </div>
            </div>
         </div>
      </div>
    </div>
  );
};

import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  Activity, 
  Zap, 
  Users,
  Target
} from "lucide-react";
import { AdminStats, MainEvent } from '../../types';

interface SystemAnalyticsProps {
  stats: AdminStats | null;
  events: MainEvent[];
}

export const SystemAnalytics = ({ stats, events }: SystemAnalyticsProps) => {
  return (
    <div className="space-y-8">
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Visual Metric */}
          <div className="lg:col-span-2 glass-panel p-8 rounded-[2.5rem] border-brand-border space-y-10">
             <div className="flex items-center justify-between">
                <div>
                   <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Event Participation</h3>
                   <p className="text-[10px] font-black text-brand-accent uppercase tracking-widest italic mt-1">Engagement across different events</p>
                </div>
                <div className="p-4 bg-brand-accent/10 border border-brand-accent/20 rounded-2xl text-brand-accent h-fit">
                   <Activity size={24} />
                </div>
             </div>

             <div className="h-72 flex items-end justify-between gap-6 px-4">
                {events.slice(0, 7).map((e, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                     <div className="relative w-full h-full flex items-end">
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: `${( (120 - (i * 12)) / 120 ) * 100}%` }}
                          className="w-full bg-gradient-to-t from-brand-accent via-indigo-600 to-indigo-500 rounded-2xl relative overflow-hidden group-hover:brightness-125 transition-all shadow-xl shadow-indigo-900/20"
                        >
                           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                        </motion.div>
                     </div>
                     <span className="text-[8px] font-black text-slate-500 uppercase italic truncate w-full text-center tracking-tighter">{e.name.split(' ')[0]}</span>
                  </div>
                ))}
             </div>
          </div>

          {/* Side Performance Cards */}
          <div className="space-y-8">
             <div className="glass-panel p-8 rounded-[2.5rem] border-brand-border space-y-6 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-accent/10 rounded-full blur-3xl" />
                <h4 className="text-sm font-black text-white uppercase italic tracking-widest flex items-center gap-2">
                   <Target size={14} className="text-brand-accent" /> Top Performing Event
                </h4>
                <div className="space-y-1">
                   <h5 className="text-2xl font-black text-white italic uppercase">{stats?.popularEvent || "Identifying..." }</h5>
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Popular Choice</p>
                </div>
                <div className="pt-4 flex items-center justify-between">
                   <div className="flex -space-x-3">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-brand-bg bg-white/10" />
                      ))}
                   </div>
                   <span className="text-[9px] font-black text-emerald-400 italic font-black uppercase">+12% Growth</span>
                </div>
             </div>

             <div className="glass-panel p-8 rounded-[2.5rem] border-brand-border space-y-6 relative overflow-hidden">
                <Zap size={48} className="absolute -bottom-4 -right-4 text-white/5 rotate-12" />
                <h4 className="text-sm font-black text-white uppercase italic tracking-widest">Event Categories</h4>
                <div className="space-y-4">
                   {[
                     { label: "Technical", value: 65, color: "bg-indigo-500" },
                     { label: "Business", value: 32, color: "bg-brand-accent" },
                     { label: "Cultural", value: 18, color: "bg-blue-500" }
                   ].map((item, idx) => (
                      <div key={idx} className="space-y-2">
                         <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest italic">
                            <span className="text-slate-500">{item.label}</span>
                            <span className="text-white">{item.value}%</span>
                         </div>
                         <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: `${item.value}%` }}
                               className={`h-full ${item.color}`}
                            />
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          </div>
       </div>

       {/* Detailed Stats Row */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Total Events", value: stats?.totalEvents || 0, icon: BarChart3 },
            { label: "Total Participants", value: stats?.totalParticipants || 0, icon: Users },
            { label: "Active Organizers", value: stats?.activeOrganizers || 0, icon: Target },
            { label: "Website Traffic", value: stats?.websiteTraffic || 0, icon: Activity }
          ].map((item, idx) => (
             <div key={idx} className="glass-panel p-6 rounded-3xl border-brand-border flex items-center gap-4 hover:border-brand-accent/20 transition-all group">
                <div className="p-3 bg-white/5 rounded-xl text-slate-500 group-hover:text-brand-accent transition-colors">
                   <item.icon size={18} />
                </div>
                <div>
                   <p className="text-[8px] font-black text-slate-500 uppercase italic tracking-widest">{item.label}</p>
                   <h5 className="text-lg font-black text-white italic uppercase leading-none mt-0.5">{item.value}</h5>
                </div>
             </div>
          ))}
       </div>
    </div>
  );
};

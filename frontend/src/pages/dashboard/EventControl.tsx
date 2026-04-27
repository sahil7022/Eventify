import React, { useState } from "react";
import { 
  ArrowLeft, Users, Calendar, MapPin, 
  MessageSquare, Trash2, Edit3, Send, 
  Search, Filter, CheckCircle2, XCircle, Info, Bell 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Event, Session, Broadcast } from "../../types";
import { useNotification } from "../../contexts/NotificationContext";
import { useEventControl } from "../../hooks/useEventControl";

export const EventControl = ({ event, onBack }: { event: Event, onBack: () => void }) => {
  const {
    activeTab,
    setActiveTab,
    broadcasts,
    newMessage,
    setNewMessage,
    handleSendBroadcast,
    handleDecommission,
    handleUpdateSchema
  } = useEventControl(event);

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
      {/* 🔝 Back Nav & Event Identifier */}
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
         <div className="flex items-center gap-6">
           <button 
             onClick={onBack}
             className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 hover:text-white hover:border-indigo-500/30 transition-all"
           >
             <ArrowLeft size={20} />
           </button>
           <div>
              <div className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-1">Operational Mode</div>
              <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white">{event.name}</h3>
           </div>
         </div>
         <div className="flex gap-4">
            <button 
              onClick={handleDecommission}
              className="px-6 py-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
            >
              Decommission
            </button>
            <button 
              onClick={handleUpdateSchema}
              className="px-6 py-3 bg-indigo-500 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-indigo-500/30 hover:bg-indigo-600 transition-all"
            >
              Update Schema
            </button>
         </div>
       </div>

       {/* 🧭 Control Tabs */}
       <div className="flex gap-4 border-b border-white/5 pb-1 overflow-x-auto no-scrollbar">
          {[
            { id: 'roster', label: 'Roster Analysis', icon: Users },
            { id: 'sessions', label: 'Timeline Control', icon: Calendar },
            { id: 'broadcasts', label: 'Signal Broadcast', icon: Bell }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-3 px-8 py-4 rounded-t-3xl transition-all relative ${activeTab === tab.id ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <tab.icon size={16} />
              <span className="text-[10px] font-bold uppercase tracking-widest">{tab.label}</span>
              {activeTab === tab.id && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />}
            </button>
          ))}
       </div>

       <div className="min-h-[500px]">
          {activeTab === 'roster' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: 'Total Enrolled', value: '452', sub: '+12 today' },
                    { label: 'Check-in Ratio', value: '68%', sub: '298 actual' },
                    { label: 'Waitlist', value: '14', sub: 'Critical' },
                    { label: 'Pending Docs', value: '08', sub: 'Review needed' }
                  ].map((stat, i) => (
                    <div key={i} className="glass-panel p-6 rounded-3xl border-white/5">
                       <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic">{stat.label}</p>
                       <h4 className="text-3xl font-black text-white italic mt-2 tracking-tighter">{stat.value}</h4>
                       <p className="text-[9px] font-bold text-indigo-400 uppercase mt-2 tracking-widest">{stat.sub}</p>
                    </div>
                  ))}
               </div>

               <div className="glass-panel rounded-[2.5rem] border-white/5 overflow-hidden">
                  <div className="p-8 border-b border-white/5 flex items-center justify-between">
                     <h4 className="text-lg font-black text-white italic uppercase tracking-tighter">Attendee Roster</h4>
                     <div className="flex gap-4">
                        <div className="relative">
                           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
                           <input placeholder="Filter by name..." className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white outline-none focus:border-indigo-500" />
                        </div>
                     </div>
                  </div>
                  <div className="overflow-x-auto">
                     <table className="w-full text-left">
                        <thead className="bg-[#0f172a]/50 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                           <tr>
                              <th className="px-8 py-4">Participant UID</th>
                              <th className="px-8 py-4">Status</th>
                              <th className="px-8 py-4">Dept. Node</th>
                              <th className="px-8 py-4 text-right">Action</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                           {[
                             { id: 'user_01', name: 'Aarav Mehta', status: 'Verified', dept: 'CS-A' },
                             { id: 'user_02', name: 'Ishita Roy', status: 'Pending', dept: 'ME-C' },
                             { id: 'user_03', name: 'Kabir Singh', status: 'Verified', dept: 'IT-B' }
                           ].map((u, i) => (
                             <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                                <td className="px-8 py-6">
                                   <div className="flex items-center gap-4">
                                      <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 text-xs font-black">{u.name[0]}</div>
                                      <p className="font-bold text-white uppercase italic text-sm">{u.name}</p>
                                   </div>
                                </td>
                                <td className="px-8 py-6">
                                   <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${u.status === 'Verified' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                                      {u.status === 'Verified' ? <CheckCircle2 size={10} /> : <Info size={10} />} {u.status}
                                   </div>
                                </td>
                                <td className="px-8 py-6 text-slate-500 text-xs font-bold uppercase tracking-widest">{u.dept}</td>
                                <td className="px-8 py-6 text-right">
                                   <button className="p-2 text-slate-600 hover:text-white transition-colors"><MoreVertical size={16} /></button>
                                </td>
                             </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            </motion.div>
          )}

          {activeTab === 'broadcasts' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10 max-w-4xl">
               <div className="glass-panel p-8 lg:p-12 rounded-[3rem] border-white/5 space-y-8 bg-slate-900/60">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                       <Send size={24} />
                    </div>
                    <div>
                       <h4 className="text-2xl font-black text-white italic uppercase tracking-tighter leading-none mb-1">New Broadcast</h4>
                       <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Signal all registered participants instantly</p>
                    </div>
                 </div>
                 <div className="space-y-4">
                    <textarea 
                      value={newMessage}
                      onChange={e => setNewMessage(e.target.value)}
                      placeholder="Enter operational broadcast message..." 
                      className="w-full bg-white/5 border border-white/10 rounded-[2rem] p-8 text-white font-medium outline-none focus:border-indigo-500 min-h-[160px] resize-none transition-all placeholder:text-slate-700 shadow-inner"
                    />
                    <div className="flex justify-between items-center px-4">
                       <div className="flex items-center gap-3 text-[9px] font-bold text-slate-600 uppercase tracking-widest">
                          <Info size={12} className="text-indigo-400" /> Auto-archived within 24 hours
                       </div>
                       <button 
                         onClick={handleSendBroadcast}
                         className="flex items-center gap-3 px-10 py-5 bg-indigo-500 text-white rounded-[1.5rem] font-bold uppercase text-[10px] tracking-widest shadow-xl shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-all"
                       >
                         Transmit Signal
                       </button>
                    </div>
                 </div>
               </div>

               <div className="space-y-6">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-4">Signal History</h4>
                  <div className="space-y-4">
                    {broadcasts.map(b => (
                      <div key={b.id} className="glass-panel p-8 rounded-[2.5rem] border-white/5 flex gap-6 items-start hover:border-indigo-500/20 transition-all">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${b.type === 'alert' ? 'bg-red-500/10 text-red-400' : 'bg-indigo-500/10 text-indigo-400'}`}>
                           <h4 className="font-black italic text-xl">S</h4>
                        </div>
                        <div className="flex-1 min-w-0">
                           <div className="flex items-center justify-between mb-2">
                              <span className={`text-[10px] font-black uppercase tracking-widest ${b.type === 'alert' ? 'text-red-400' : 'text-indigo-400'}`}>{b.type === 'alert' ? 'High Priority' : 'Operational Update'}</span>
                              <span className="text-[9px] text-slate-600 font-bold uppercase">{b.timestamp}</span>
                           </div>
                           <p className="text-white font-medium italic pr-12">{b.message}</p>
                        </div>
                        <button className="text-slate-600 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                      </div>
                    ))}
                  </div>
               </div>
            </motion.div>
          )}

          {activeTab === 'sessions' && (
             <div className="flex items-center justify-center py-32 glass-panel rounded-[3.5rem] border-white/5 border-dashed border-2 opacity-30">
                <div className="text-center">
                   <Calendar size={48} className="mx-auto mb-6" />
                   <p className="text-[10px] font-black uppercase tracking-widest italic">Timeline sync in progress...</p>
                </div>
             </div>
          )}
       </div>
    </motion.div>
  );
};

const MoreVertical = ({ className, size }: { className?: string, size?: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="12" cy="12" r="1" />
    <circle cx="12" cy="5" r="1" />
    <circle cx="12" cy="19" r="1" />
  </svg>
);

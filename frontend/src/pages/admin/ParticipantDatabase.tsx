import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Search, 
  ChevronRight,
  Filter,
  UserX,
  CreditCard
} from "lucide-react";
import { MainEvent, UserProfile } from '../../types';

interface ParticipantDatabaseProps {
  events: MainEvent[];
  users: UserProfile[];
}

export const ParticipantDatabase = ({ events, users }: ParticipantDatabaseProps) => {
  const [selectedEvent, setSelectedEvent] = useState<MainEvent | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEvents = events.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const participants = users.filter(u => u.role === 'participant');

  if (selectedEvent) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setSelectedEvent(null)}
            className="p-4 bg-white/5 border border-white/10 rounded-2xl text-slate-400 hover:text-white transition-all"
          >
            <ChevronRight className="rotate-180" size={20} />
          </button>
          <div>
              <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">{selectedEvent.name}</h3>
              <p className="text-[10px] font-black text-brand-accent uppercase tracking-widest italic font-black">Registered Fleet: {participants.length} Entities</p>
          </div>
        </div>

        <div className="glass-panel rounded-[2.5rem] border-brand-border overflow-hidden">
           <table className="w-full text-left">
              <thead className="bg-white/5 border-b border-white/5 text-[9px] font-black uppercase tracking-widest text-slate-500 italic">
                 <tr>
                    <th className="px-8 py-5">Participant Identity</th>
                    <th className="px-8 py-5">College Alpha</th>
                    <th className="px-8 py-5">Department</th>
                    <th className="px-8 py-5">Status</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                 {participants.map(user => (
                   <tr key={user.uid} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-8 py-5">
                         <div>
                            <p className="text-sm font-black text-white italic uppercase">{user.name}</p>
                            <p className="text-[8px] font-medium text-slate-500 lowercase">{user.email}</p>
                         </div>
                      </td>
                      <td className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{user.college}</td>
                      <td className="px-8 py-5 text-[10px] font-black text-indigo-400 uppercase tracking-widest italic">{user.department}</td>
                      <td className="px-8 py-5">
                         <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[8px] font-black uppercase rounded-full border border-emerald-500/20">Active</span>
                      </td>
                   </tr>
                 ))}
              </tbody>
           </table>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
         <div className="relative flex-1 w-full sm:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Search events..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-brand-accent transition-all italic"
            />
         </div>
         <div className="flex gap-4">
            <div className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest italic flex items-center gap-3">
               <Users size={14} className="text-brand-accent" /> Total Users: {users.length}
            </div>
            <div className="px-6 py-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-[10px] font-black text-red-500 uppercase tracking-widest italic flex items-center gap-3">
               <UserX size={14} /> 0 Cancellations
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {filteredEvents.map(event => (
           <div 
             key={event.id} 
             onClick={() => setSelectedEvent(event)}
             className="glass-panel p-6 rounded-[2.5rem] border-brand-border flex items-center justify-between group hover:border-brand-accent/20 transition-all cursor-pointer"
           >
              <div className="space-y-1">
                 <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest italic">{event.name}</p>
                 <div className="flex items-center gap-3">
                    <h4 className="text-2xl font-black text-white italic">{participants.length}</h4>
                    <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest italic">Users</span>
                 </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                 <div className="p-3 bg-white/5 rounded-xl text-slate-500 group-hover:text-brand-accent transition-all">
                    <ChevronRight size={18} />
                 </div>
                 <p className="text-[7px] font-black text-red-500/50 uppercase italic tracking-widest">0 Cancelled</p>
              </div>
           </div>
         ))}
      </div>

      <div className="glass-panel p-12 rounded-[3.5rem] border-brand-border text-center space-y-6 relative overflow-hidden group">
         <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700" />
         
         <div className="relative z-10 space-y-6">
            <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto text-indigo-400 mb-6 group-hover:rotate-12 transition-transform">
               <CreditCard size={32} />
            </div>
            <h4 className="text-2xl font-black text-white italic uppercase tracking-tighter">Participation Log</h4>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic max-w-sm mx-auto leading-relaxed shadow-lg">View all participants for each event here. Select an event above for more details.</p>
            
            <div className="pt-6 flex justify-center gap-4">
               <button className="px-8 py-3 bg-white/5 border border-white/10 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:border-brand-accent/30 transition-all">Download List</button>
               <button className="px-8 py-3 bg-brand-accent text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl shadow-brand-accent/20">Update List</button>
            </div>
         </div>
      </div>
    </div>
  );
};

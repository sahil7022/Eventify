import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, 
  X, 
  Users, 
  Shield, 
  Search, 
  MapPin, 
  Calendar,
  BriefcaseBusiness,
  ArrowRight
} from "lucide-react";
import { OrganizerApplication, UserProfile, Role } from '../../types';

interface OrganizerControlProps {
  applications: OrganizerApplication[];
  users: UserProfile[];
  handleApplication: (appId: string, action: "approve" | "reject") => Promise<boolean>;
  updateRole: (userId: string, role: Role) => Promise<boolean>;
}

export const OrganizerControl = ({ applications, users, handleApplication, updateRole }: OrganizerControlProps) => {
  const [view, setView] = useState<"applications" | "approved">("applications");
  const [searchTerm, setSearchTerm] = useState("");

  const approvedOrganizers = users.filter(u => u.role === "organizer" || u.role === "team_lead");
  
  const filteredApps = applications.filter(a => 
    a.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.eventName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStaff = approvedOrganizers.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
         <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/5">
            <button 
              onClick={() => setView("applications")}
              className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === "applications" ? 'bg-brand-accent text-white shadow-xl shadow-brand-accent/20' : 'text-slate-500 hover:text-white'}`}
            >
               Applications ({applications.length})
            </button>
            <button 
              onClick={() => setView("approved")}
              className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === "approved" ? 'bg-brand-accent text-white shadow-xl shadow-brand-accent/20' : 'text-slate-500 hover:text-white'}`}
            >
               Approved Organizers ({approvedOrganizers.length})
            </button>
         </div>

         <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
               type="text" 
               placeholder="Search users..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-brand-accent transition-all italic"
            />
         </div>
      </div>

      <AnimatePresence mode="wait">
        {view === "applications" ? (
          <motion.div 
            key="apps"
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredApps.length === 0 ? (
               <div className="md:col-span-2 lg:col-span-3 py-20 text-center glass-panel rounded-[3rem] border-brand-border">
                  <Shield size={48} className="mx-auto text-slate-700 mb-4" />
                  <h4 className="text-xl font-black text-white italic uppercase tracking-tighter">No Pending Applications</h4>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">All applications have been checked.</p>
               </div>
            ) : (
               filteredApps.map(app => (
                 <div key={app.id} className="glass-panel p-6 rounded-[2.5rem] border-brand-border group hover:border-brand-accent/30 transition-all flex flex-col h-full">
                    <div className="flex items-center gap-4 mb-6">
                       <div className="w-12 h-12 rounded-2xl bg-brand-accent/10 flex items-center justify-center font-black text-brand-accent italic border border-brand-accent/20">
                          {app.userName.substring(0,1)}
                       </div>
                       <div>
                          <h4 className="text-lg font-black text-white italic uppercase leading-none">{app.userName}</h4>
                          <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1 italic tracking-widest">{new Date(app.timestamp).toLocaleDateString()}</p>
                       </div>
                    </div>

                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5 mb-6 flex-1">
                       <p className="text-[8px] font-black text-indigo-400 uppercase tracking-widest mb-1 italic">Event Name</p>
                       <p className="text-sm font-black text-white italic uppercase">{app.eventName}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                       <button 
                         onClick={() => handleApplication(app.id, 'approve')}
                         className="flex items-center justify-center gap-2 py-3 bg-emerald-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all"
                       >
                          <Check size={14} /> Approve
                       </button>
                       <button 
                         onClick={() => handleApplication(app.id, 'reject')}
                         className="flex items-center justify-center gap-2 py-3 bg-red-500/10 text-red-500 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
                       >
                          <X size={14} /> Reject
                       </button>
                    </div>
                 </div>
               ))
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="staff"
            initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
            className="glass-panel rounded-[2.5rem] border-brand-border overflow-hidden"
          >
            <table className="w-full text-left">
               <thead className="bg-white/5 border-b border-white/5 text-[9px] font-black uppercase tracking-widest text-slate-500 italic">
                  <tr>
                     <th className="px-8 py-5">Organizer</th>
                     <th className="px-8 py-5">Current Role</th>
                     <th className="px-8 py-5">Status</th>
                     <th className="px-8 py-5">Manage Role</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  {filteredStaff.map(staff => (
                    <tr key={staff.uid} className="hover:bg-white/[0.02] transition-colors group">
                       <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center font-black text-indigo-400 italic">
                                {staff.name.substring(0,1)}
                             </div>
                             <div>
                                <p className="text-sm font-black text-white italic uppercase">{staff.name}</p>
                                <p className="text-[8px] font-bold text-slate-500 uppercase italic truncate max-w-[150px]">{staff.email}</p>
                             </div>
                          </div>
                       </td>
                       <td className="px-8 py-6">
                          <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest italic flex items-center gap-1.5 w-max ${
                             staff.role === 'team_lead' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-brand-accent/10 text-brand-accent border border-brand-accent/20'
                          }`}>
                            <BriefcaseBusiness size={10} /> {staff.role.replace('_', ' ')}
                          </span>
                       </td>
                       <td className="px-8 py-6">
                          <p className="text-[9px] font-black text-slate-500 uppercase italic">Unassigned</p>
                       </td>
                       <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                             <select 
                               value={staff.role}
                               onChange={(e) => updateRole(staff.uid, e.target.value as Role)}
                               className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-brand-accent italic cursor-pointer"
                             >
                                <option value="organizer" className="bg-slate-900">Organizer</option>
                                <option value="team_lead" className="bg-slate-900">Team Lead</option>
                                <option value="participant" className="bg-slate-900">Remove Role</option>
                             </select>
                             <button className="p-2 text-slate-500 hover:text-white transition-all">
                                <ArrowRight size={14} />
                             </button>
                          </div>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

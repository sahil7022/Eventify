import React, { useState } from "react";
import { Shield, Bell, Camera, Lock, Mail, Phone, Moon, Globe, Save, LogOut } from "lucide-react";
import { motion } from "framer-motion";

import { useSettings } from "../hooks/useSettings";

export default function Settings() {
  const {
    profile,
    settings,
    setSettings,
    handleToggle,
    handleSave,
    handleLogout
  } = useSettings();

  return (
    <div className="p-4 md:p-6 lg:p-10 space-y-8 md:space-y-12 animate-fade-in max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
           <div className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-1">System Control</div>
           <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter text-white">Parameters</h2>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center gap-3 px-6 md:px-8 py-3.5 md:py-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl md:rounded-[1.5rem] font-bold uppercase text-[9px] md:text-[10px] tracking-widest hover:bg-red-500/20 transition-all active:scale-95"
          >
            <LogOut size={16} /> Logout
          </button>
          <button 
            onClick={handleSave}
            className="flex items-center justify-center gap-3 px-6 md:px-8 py-3.5 md:py-4 bg-indigo-500 text-white rounded-xl md:rounded-[1.5rem] font-bold uppercase text-[9px] md:text-[10px] tracking-widest shadow-xl shadow-indigo-500/20 hover:bg-indigo-600 transition-all active:scale-95"
          >
            <Save size={16} /> Save Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
        
        {/* 👤 Account Settings */}
        <div className="glass-panel p-6 md:p-10 lg:p-14 rounded-[2.5rem] md:rounded-[3.5rem] space-y-8 md:space-y-12 border-white/5 bg-slate-900/40">
           <div className="flex items-center gap-4 border-b border-white/5 pb-6 md:pb-8">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                 <Shield size={20} />
              </div>
              <h3 className="text-xl md:text-2xl font-black text-white italic uppercase tracking-tighter">Core Identity</h3>
           </div>

           <div className="space-y-6 md:space-y-8">
              <div className="flex flex-col sm:flex-row items-center gap-6 md:gap-8 text-center sm:text-left">
                 <div className="relative group">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-[1.5rem] md:rounded-[2rem] bg-slate-800 flex items-center justify-center text-indigo-500 border-2 border-white/10 group-hover:border-indigo-500 transition-all cursor-pointer overflow-hidden shadow-inner">
                       <User size={32} className="group-hover:scale-110 transition-transform" />
                       <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <Camera size={18} className="text-white" />
                       </div>
                    </div>
                 </div>
                 <div className="space-y-1">
                    <p className="text-sm font-bold text-white uppercase italic">Avatar Module</p>
                    <p className="text-[9px] md:text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">Update visual representation <br className="hidden sm:block"/> across all networked mirrors</p>
                 </div>
              </div>

              <div className="space-y-5 md:space-y-6">
                 <div className="space-y-2 md:space-y-3">
                    <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Account Display Name</label>
                    <div className="relative">
                       <User className="absolute left-5 md:left-6 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                       <input 
                         value={settings.name}
                         onChange={e => setSettings({...settings, name: e.target.value})}
                         className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl pl-12 md:pl-16 pr-5 md:pr-6 py-3.5 md:py-4 text-white font-bold outline-none focus:border-indigo-500 transition-all shadow-inner text-sm"
                       />
                    </div>
                 </div>

                 <div className="space-y-2 md:space-y-3">
                    <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Protocol</label>
                    <div className="relative">
                       <Mail className="absolute left-5 md:left-6 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                       <input 
                         value={settings.email}
                         onChange={e => setSettings({...settings, email: e.target.value})}
                         className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl pl-12 md:pl-16 pr-5 md:pr-6 py-3.5 md:py-4 text-white font-bold outline-none focus:border-indigo-500 transition-all shadow-inner text-sm"
                       />
                    </div>
                 </div>

                 <div className="space-y-2 md:space-y-3">
                    <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Security Keyword</label>
                    <div className="relative">
                       <Lock className="absolute left-5 md:left-6 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                       <input 
                         type="password"
                         value="••••••••••••"
                         readOnly
                         className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl pl-12 md:pl-16 pr-5 md:pr-6 py-3.5 md:py-4 text-white font-bold outline-none cursor-not-allowed shadow-inner text-sm"
                       />
                       <button className="absolute right-5 md:right-6 top-1/2 -translate-y-1/2 text-indigo-400 text-[9px] md:text-[10px] font-bold uppercase tracking-widest hover:underline">Revise</button>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        <div className="glass-panel p-6 md:p-10 lg:p-14 rounded-[2.5rem] md:rounded-[3.5rem] space-y-8 md:space-y-12 border-white/5 bg-slate-900/40">
           <div className="flex items-center gap-4 border-b border-white/5 pb-6 md:pb-8">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                 <Shield size={20} />
              </div>
              <h3 className="text-xl md:text-2xl font-black text-white italic uppercase tracking-tighter">Identity Overrides (Switch Role)</h3>
           </div>

           <div className="space-y-8">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic leading-relaxed">
                 [DEMO MODE] Manually override your node's role to test system-wide permissions and dashboard access.
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                 {(['participant', 'organizer', 'team_lead', 'admin'] as const).map((role) => (
                    <button 
                       key={role}
                       onClick={() => {
                          const updated = { ...profile, role };
                          localStorage.setItem("user", JSON.stringify(updated));
                          window.location.reload();
                       }}
                       className={`px-4 py-3 rounded-xl border text-[9px] font-black uppercase tracking-widest italic transition-all ${
                          profile.role === role ? 'bg-amber-500 border-amber-600 text-white shadow-xl shadow-amber-500/20' : 'bg-white/5 border-white/10 text-slate-400 hover:text-amber-500 hover:border-amber-500/30'
                       }`}
                    >
                       {role.replace('_', ' ')}
                    </button>
                 ))}
              </div>
           </div>
        </div>

        {/* 🔔 Notifications Settings */}
        <div className="glass-panel p-6 md:p-10 lg:p-14 rounded-[2.5rem] md:rounded-[3.5rem] space-y-8 md:space-y-12 border-white/5 bg-slate-900/40">
           <div className="flex items-center gap-4 border-b border-white/5 pb-6 md:pb-8">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                 <Bell size={20} />
              </div>
              <h3 className="text-xl md:text-2xl font-black text-white italic uppercase tracking-tighter">Notifications</h3>
           </div>

           <div className="space-y-6 md:space-y-10">
              <div className="flex items-center justify-between group gap-4">
                 <div className="space-y-1">
                    <p className="text-xs md:text-sm font-bold text-white uppercase italic">Event Updated</p>
                    <p className="text-[9px] md:text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">Alerts when event parameters or logistics change</p>
                 </div>
                 <button 
                   onClick={() => handleToggle('email')}
                   className={`w-12 h-7 md:w-14 md:h-8 rounded-full transition-all relative shrink-0 ${settings.notifications.email ? 'bg-indigo-500 shadow-lg shadow-indigo-500/30' : 'bg-slate-800 border border-white/10'}`}
                 >
                    <div className={`absolute top-1 w-5 h-5 md:w-6 md:h-6 rounded-full bg-white transition-all ${settings.notifications.email ? 'left-6 md:left-7' : 'left-1'}`} />
                 </button>
              </div>

              <div className="flex items-center justify-between group gap-4">
                 <div className="space-y-1">
                    <p className="text-xs md:text-sm font-bold text-white uppercase italic">Time Changes</p>
                    <p className="text-[9px] md:text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">Notifications for critical schedule shifts</p>
                 </div>
                 <button 
                   onClick={() => handleToggle('inApp')}
                   className={`w-12 h-7 md:w-14 md:h-8 rounded-full transition-all relative shrink-0 ${settings.notifications.inApp ? 'bg-indigo-500 shadow-lg shadow-indigo-500/30' : 'bg-slate-800 border border-white/10'}`}
                 >
                    <div className={`absolute top-1 w-5 h-5 md:w-6 md:h-6 rounded-full bg-white transition-all ${settings.notifications.inApp ? 'left-6 md:left-7' : 'left-1'}`} />
                 </button>
              </div>

              <div className="flex items-center justify-between group gap-4">
                 <div className="space-y-1">
                    <p className="text-xs md:text-sm font-bold text-white uppercase italic">Critical Alerts</p>
                    <p className="text-[9px] md:text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">Emergency broadcasts and status overrides</p>
                 </div>
                 <button 
                   onClick={() => handleToggle('reminders')}
                   className={`w-12 h-7 md:w-14 md:h-8 rounded-full transition-all relative shrink-0 ${settings.notifications.reminders ? 'bg-indigo-500 shadow-lg shadow-indigo-500/30' : 'bg-slate-800 border border-white/10'}`}
                 >
                    <div className={`absolute top-1 w-5 h-5 md:w-6 md:h-6 rounded-full bg-white transition-all ${settings.notifications.reminders ? 'left-6 md:left-7' : 'left-1'}`} />
                 </button>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}

const User = ({ className, size }: { className?: string, size?: number }) => (
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
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

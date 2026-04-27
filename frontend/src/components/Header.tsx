import React, { useState } from "react";
import { Menu, Bell, X, Info, AlertTriangle, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AppNotification } from "../types";

export const Header = ({ onMenuClick }: { onMenuClick: () => void }) => {
  const [showNotifications, setShowNotifications] = useState(false);

  // Mock notifications - In real app, these would come from an API
  const [notifications, setNotifications] = useState<AppNotification[]>([
    { id: "1", title: "New Event", message: "Tech Summit 2024 is now live!", time: "2m ago", read: false, type: 'event' },
    { id: "2", title: "Reminder", message: "Your workshop starts in 1 hour.", time: "1h ago", read: false, type: 'reminder' },
    { id: "3", title: "System", message: "Profile update successful.", time: "5h ago", read: true, type: 'system' },
  ]);

  // API Structure Preparation (Axios/Fetch ready)
  const fetchNotifications = async () => {
    try {
      // const response = await axios.get('/api/notifications');
      // setNotifications(response.data);
      console.log("Preparing to fetch from /api/notifications...");
    } catch (err) {
      console.error("API Error:", err);
    }
  };

  return (
    <header className="h-20 lg:h-24 bg-brand-bg/40 backdrop-blur-md border-b border-brand-border px-6 lg:px-10 flex items-center justify-between shrink-0 z-50">
      <div className="flex items-center gap-6 flex-1">
        <button 
          className="lg:hidden p-2 text-brand-text-secondary hover:text-brand-text-primary transition-colors" 
          onClick={onMenuClick}
        >
          <Menu />
        </button>
      </div>
      
      <div className="flex items-center gap-4 lg:gap-6 relative">
        <div className="flex gap-2 relative">
          <button 
            onClick={() => {
              setShowNotifications(!showNotifications);
              if (!showNotifications) fetchNotifications();
            }}
            className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 hover:text-indigo-400 hover:border-indigo-500/30 transition-all relative"
          >
            <Bell size={20} />
            {notifications.some(n => !n.read) && (
              <span className="absolute top-3 right-3 w-2 h-2 bg-indigo-500 rounded-full ring-2 ring-slate-900 shadow-lg shadow-indigo-500/50"></span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-40 lg:hidden"
                  onClick={() => setShowNotifications(false)}
                />
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-14 right-0 w-80 lg:w-96 glass-panel rounded-3xl bg-slate-900 border border-white/10 shadow-2xl z-50 p-6 space-y-6"
                >
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <h3 className="text-lg font-bold text-white uppercase italic tracking-tighter">Feed</h3>
                    <button onClick={() => setNotifications(notifications.map(n => ({...n, read: true})))} className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest hover:underline">Mark all read</button>
                  </div>
                  
                  <div className="space-y-4 max-h-[400px] overflow-y-auto no-scrollbar">
                    {notifications.length > 0 ? notifications.map(n => (
                      <div key={n.id} className={`flex gap-4 p-3 rounded-2xl transition-colors hover:bg-white/5 cursor-pointer ${!n.read ? 'bg-indigo-500/5 border-l-2 border-indigo-500' : ''}`}>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${n.type === 'alert' ? 'bg-red-500/10 text-red-400' : 'bg-indigo-500/10 text-indigo-400'}`}>
                          {n.type === 'reminder' ? <Calendar size={18} /> : n.type === 'system' ? <Info size={18} /> : <AlertTriangle size={18} />}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-white truncate">{n.title}</p>
                          <p className="text-xs text-slate-500 line-clamp-2 mt-1">{n.message}</p>
                          <p className="text-[9px] text-slate-600 font-bold uppercase mt-2 italic">{n.time}</p>
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-10 opacity-30">
                        <Bell size={48} className="mx-auto mb-4" />
                        <p className="text-xs font-bold uppercase tracking-widest">No active signals</p>
                      </div>
                    )}
                  </div>
                  
                  <button onClick={() => setShowNotifications(false)} className="w-full py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-t border-white/5 hover:text-white transition-colors">Close Viewport</button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

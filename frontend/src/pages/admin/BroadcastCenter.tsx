import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Megaphone, 
  Send, 
  Globe, 
  Radio, 
  Shield, 
  AlertCircle,
  Clock,
  ArrowRight
} from "lucide-react";
import { MainEvent, Broadcast } from '../../types';

interface BroadcastCenterProps {
  events: MainEvent[];
  broadcasts: Broadcast[];
  sendBroadcast: (data: Partial<Broadcast>) => Promise<boolean>;
}

export const NotificationCenter = ({ events, broadcasts, sendBroadcast }: BroadcastCenterProps) => {
  const [selectedEventId, setSelectedEventId] = useState<string>("all");
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");
  const [target, setTarget] = useState<"all" | "organizers" | "participants">("all");
  const [isTransmitting, setIsTransmitting] = useState(false);

  const handleSend = async () => {
    if (!message || !title) return;
    setIsTransmitting(true);
    const success = await sendBroadcast({
      title,
      message,
      target,
      eventId: selectedEventId === 'all' ? undefined : selectedEventId,
      timestamp: new Date().toISOString(),
      type: 'info'
    });
    if (success) {
      setMessage("");
      setTitle("");
    }
    setIsTransmitting(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <section className="glass-panel p-8 rounded-[2.5rem] border-brand-border space-y-8 h-fit">
         <div>
            <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Send Notification</h3>
            <p className="text-[10px] font-black text-brand-accent uppercase tracking-widest italic mt-1">Send notifications to users</p>
         </div>

         <div className="space-y-6">
            <div className="space-y-3">
               <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic ml-1">Section</label>
               <select 
                 value={selectedEventId}
                 onChange={(e) => setSelectedEventId(e.target.value)}
                 className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-brand-accent transition-all italic"
               >
                  <option value="all" className="bg-slate-900">All Events</option>
                  {events.map(e => <option key={e.id} value={e.id} className="bg-slate-900 text-sm uppercase font-black">{e.name}</option>)}
               </select>
            </div>

            <div className="space-y-3">
               <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic ml-1">Who should receive this?</label>
               <div className="grid grid-cols-3 gap-3">
                  {(['all', 'organizers', 'participants'] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => setTarget(t)}
                      className={`py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all italic border ${target === t ? 'bg-brand-accent/20 border-brand-accent text-brand-accent' : 'bg-white/5 border-white/5 text-slate-500 hover:text-white'}`}
                    >
                       {t}
                    </button>
                  ))}
               </div>
            </div>

            <div className="space-y-3">
               <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic ml-1">Title</label>
               <input 
                 type="text" 
                 placeholder="Enter notification title..."
                 value={title}
                 onChange={(e) => setTitle(e.target.value)}
                 className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-brand-accent transition-all italic"
               />
            </div>

            <div className="space-y-3">
               <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic ml-1">Message</label>
               <textarea 
                 placeholder="Enter message here..."
                 value={message}
                 onChange={(e) => setMessage(e.target.value)}
                 rows={4}
                 className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-brand-accent transition-all italic resize-none"
               />
            </div>

            <button 
              onClick={handleSend}
              disabled={isTransmitting || !message || !title}
              className="w-full py-4 bg-brand-accent disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95"
            >
               {isTransmitting ? "Sending..." : <>Send Notification <Send size={16} /></>}
            </button>
         </div>
      </section>

      <section className="glass-panel p-8 rounded-[2.5rem] border-brand-border space-y-8 flex flex-col h-full">
         <div className="flex items-center justify-between">
            <h4 className="text-xl font-black text-white italic uppercase tracking-tighter">Notification History</h4>
            <Clock size={16} className="text-slate-700" />
         </div>

         <div className="space-y-4 overflow-y-auto flex-1 pr-2 scrollbar-none">
            {broadcasts.length === 0 ? (
               <div className="py-12 text-center space-y-4 border border-white/5 rounded-[2.5rem]">
                  <Radio size={32} className="mx-auto text-slate-800" />
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic">No history found.</p>
               </div>
            ) : (
               broadcasts.map(b => (
                 <div key={b.id} className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-4 group hover:border-brand-accent/20 transition-all">
                    <div className="flex items-center justify-between">
                       <span className="px-3 py-1 rounded-full bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-[8px] font-black uppercase italic">Target: {b.target || 'All'}</span>
                       <span className="text-[8px] font-black text-slate-500 uppercase italic">{new Date(b.timestamp).toLocaleString()}</span>
                    </div>
                    <div>
                       <h5 className="text-sm font-black text-white italic uppercase">{b.title}</h5>
                       <p className="text-[10px] font-medium text-slate-400 mt-2 leading-relaxed">{b.message}</p>
                    </div>
                    {b.eventId && (
                       <div className="pt-3 border-t border-white/5 flex items-center gap-2">
                          <Globe size={10} className="text-indigo-400" />
                          <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Event ID: {b.eventId}</span>
                       </div>
                    )}
                 </div>
               ))
            )}
         </div>
      </section>
    </div>
  );
};

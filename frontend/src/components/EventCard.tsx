import React from "react";
import { motion } from "framer-motion";
import { MapPin, Calendar } from "lucide-react";
import { Event } from "../types";

interface EventCardProps {
  event: Event;
  onViewDetails: (e: Event) => void;
  isJoined?: boolean;
  onManage?: (e: Event) => void;
  showManage?: boolean;
}

export const EventCard = ({ event, onViewDetails, isJoined, onManage, showManage }: EventCardProps) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="glass-panel rounded-[2rem] overflow-hidden group hover:border-indigo-500/40 transition-all flex flex-col h-full bg-gradient-to-b from-white/5 to-transparent shadow-2xl"
  >
    <div className="relative h-60 overflow-hidden">
      <img src={event.bannerUrl || event.image} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-1000" alt={event.name} />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
      <div className="absolute top-4 left-4 glass-item px-3 py-1 rounded-xl text-[9px] font-bold text-indigo-400 uppercase tracking-widest border-indigo-500/20">{event.category}</div>
    </div>
    <div className="p-6 flex-1 flex flex-col">
      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors uppercase italic tracking-tight leading-tight">{event.name}</h3>
      <div className="flex flex-wrap gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">
        <span className="flex items-center gap-1.5"><MapPin size={12} className="text-indigo-500" /> {event.location.split(',')[0]}</span>
        <span className="flex items-center gap-1.5"><Calendar size={12} className="text-indigo-500" /> {event.date.split(',')[0]}</span>
      </div>
      <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-6">
         <span className="text-lg font-black text-white tracking-tighter">{event.price}</span>
         <div className="flex gap-2">
           {showManage ? (
             <button 
               onClick={() => onManage?.(event)}
               className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-bold text-white uppercase tracking-widest hover:bg-white/10 transition-all"
             >
               Manage
             </button>
           ) : (
             <button 
               onClick={() => onViewDetails(event)}
               className={`px-8 py-3 rounded-2xl text-[10px] font-bold text-white uppercase tracking-widest transition-all bg-indigo-500 hover:bg-indigo-600 shadow-xl shadow-indigo-500/20 active:scale-95`}
             >
               View Details
             </button>
           )}
         </div>
      </div>
    </div>
  </motion.div>
);

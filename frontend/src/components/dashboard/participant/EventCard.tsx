import React from "react";
import { Calendar, MapPin, Clock, XCircle, CheckCircle, ArrowRight } from "lucide-react";
import { ParticipantEvent } from "../../../types";
import { motion } from "framer-motion";

interface EventCardProps {
  event: ParticipantEvent;
  onCancel: (id: string) => void;
  onViewDetails: (event: ParticipantEvent) => void;
}

export const EventCard = ({ event, onCancel, onViewDetails }: EventCardProps) => {
  const isUpcoming = event.status === "Upcoming";
  const isCancelled = event.status === "Cancelled";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel p-5 md:p-6 rounded-[2rem] md:rounded-[2.5rem] border-brand-border relative overflow-hidden group hover:border-brand-accent/40 transition-all"
    >
      {event.posterUrl && (
        <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
          <img src={event.posterUrl} className="w-full h-full object-cover" alt="" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-bg to-transparent" />
        </div>
      )}
      
      <div className="relative z-10 flex justify-between items-start mb-4 md:mb-6">
        <div className={`px-3 md:px-4 py-1 md:py-1.5 rounded-full text-[7px] md:text-[8px] font-black uppercase tracking-widest italic ${
          isCancelled ? 'bg-red-500/10 text-red-400' : 
          isUpcoming ? 'bg-brand-accent/10 text-brand-accent' : 
          'bg-emerald-500/10 text-emerald-400'
        }`}>
          {event.status}
        </div>
        <div className="text-[9px] md:text-[10px] font-bold text-brand-text-secondary uppercase tracking-widest italic">
          #{event.id}
        </div>
      </div>

      <div className="relative z-10 mb-5 md:mb-6">
        <h4 className="text-lg md:text-xl font-black text-white italic uppercase tracking-tighter leading-tight mb-2 group-hover:text-brand-accent transition-colors truncate">
          {event.name}
        </h4>
        <div className="space-y-1.5 md:space-y-2">
          <div className="flex items-center gap-2 text-[9px] md:text-[10px] font-bold text-brand-text-secondary uppercase tracking-widest italic">
            <Calendar className="w-3 h-3 md:w-3.5 md:h-3.5 text-brand-accent" /> {event.date}
          </div>
          <div className="flex items-center gap-2 text-[9px] md:text-[10px] font-bold text-brand-text-secondary uppercase tracking-widest italic">
            <Clock className="w-3 h-3 md:w-3.5 md:h-3.5 text-brand-accent" /> {event.time}
          </div>
          <div className="flex items-center gap-2 text-[9px] md:text-[10px] font-bold text-brand-text-secondary uppercase tracking-widest italic line-clamp-1">
            <MapPin className="w-3 h-3 md:w-3.5 md:h-3.5 text-brand-accent" /> {event.venue}
          </div>
        </div>
      </div>

      <div className="flex gap-3 md:gap-4">
        <button 
          onClick={() => onViewDetails(event)}
          className="flex-1 py-3 md:py-4 bg-brand-glass border border-brand-border text-white rounded-xl md:rounded-2xl text-[8px] md:text-[9px] font-black uppercase tracking-widest hover:bg-brand-accent transition-all flex items-center justify-center gap-2"
        >
          Details <ArrowRight className="w-3 h-3 md:w-3.5 md:h-3.5" />
        </button>
        
        {isUpcoming && (
          <button 
            onClick={() => onCancel(event.id)}
            className="flex-1 py-3 md:py-4 bg-white/5 border border-white/5 text-brand-text-secondary rounded-xl md:rounded-2xl text-[8px] md:text-[9px] font-black uppercase tracking-widest hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 transition-all flex items-center justify-center gap-2"
          >
            <XCircle className="w-3 h-3 md:w-3.5 md:h-3.5" /> Cancel
          </button>
        )}
      </div>

      {/* Decorative Icon Background */}
      <div className="absolute -bottom-4 -right-4 opacity-5 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
        {isCancelled ? <XCircle size={100} /> : <CheckCircle size={100} />}
      </div>
    </motion.div>
  );
};

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, ChevronRight, Activity } from "lucide-react";
import { ParticipantEvent } from "../../../types";

interface UpcomingEventsSliderProps {
  events: ParticipantEvent[];
  onViewDetails: (event: ParticipantEvent) => void;
}

export const UpcomingEventsSlider = ({ events, onViewDetails }: UpcomingEventsSliderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  if (events.length === 0) {
    return (
      <div className="glass-panel p-10 rounded-[3rem] border-brand-border flex items-center justify-center text-brand-text-secondary italic uppercase text-[10px] font-black tracking-widest bg-white/5">
        No upcoming deployments scheduled
      </div>
    );
  }

  if (events.length === 1) {
    const event = events[0];
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8 lg:p-10 rounded-[3rem] border-brand-accent/30 bg-brand-accent/5 relative overflow-hidden group shadow-2xl"
      >
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
          <Activity size={120} />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-5 py-2 bg-brand-accent rounded-full text-[10px] font-black text-white uppercase tracking-widest shadow-lg shadow-brand-accent-glow italic">
              Upcoming Mission
            </span>
          </div>
          
          <h3 className="text-3xl lg:text-4xl font-black text-white italic uppercase tracking-tighter leading-none mb-4">
            {event.name}
          </h3>
          
          <div className="flex flex-wrap gap-4 mb-8 text-[11px] font-bold text-brand-text-secondary uppercase tracking-widest italic">
            <div className="flex items-center gap-2 bg-white/5 py-2 px-4 rounded-xl border border-white/5">
              <Calendar size={14} className="text-brand-accent" /> {event.date}
            </div>
            <div className="flex items-center gap-2 bg-white/5 py-2 px-4 rounded-xl border border-white/5">
              <Clock size={14} className="text-brand-accent" /> {event.time}
            </div>
            <div className="flex items-center gap-2 bg-white/5 py-2 px-4 rounded-xl border border-white/5">
              <MapPin size={14} className="text-brand-accent" /> {event.venue}
            </div>
          </div>

          <button 
            onClick={() => onViewDetails(event)}
            className="flex items-center gap-3 text-[10px] font-black text-brand-accent uppercase tracking-[0.2em] group/btn italic"
          >
            Tactical Analysis <ChevronRight size={16} className="group-hover/btn:translate-x-2 transition-transform" />
          </button>
        </div>
      </motion.div>
    );
  }

  const scroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const scrollAmount = containerRef.current.offsetWidth * 0.8;
      containerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative group">
      {/* Navigation Buttons */}
      <button 
        onClick={() => scroll('left')}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-slate-950/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-brand-accent"
      >
        <ChevronRight size={20} className="rotate-180" />
      </button>
      <button 
        onClick={() => scroll('right')}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-slate-950/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-brand-accent"
      >
        <ChevronRight size={20} />
      </button>

      {/* Carousel Container */}
      <div 
        ref={containerRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar py-10 px-4"
        style={{ scrollPadding: '2rem' }}
      >
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0.5, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, amount: 0.6 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="snap-center shrink-0 w-full md:w-[85%] lg:w-[90%]"
          >
            <div 
              className="glass-panel p-8 lg:p-10 rounded-[3rem] border-brand-accent/50 bg-brand-accent/10 relative overflow-hidden shadow-2xl shadow-brand-accent-glow/20"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Activity size={120} className="animate-pulse" />
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <span className="px-5 py-2 bg-brand-accent rounded-full text-[10px] font-black text-white uppercase tracking-widest shadow-lg shadow-brand-accent-glow italic">
                      Incoming Transmission
                    </span>
                    <span className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest italic">
                      0{index + 1} / 0{events.length}
                    </span>
                  </div>
                </div>
                
                <h3 className="text-3xl lg:text-4xl font-black text-white italic uppercase tracking-tighter leading-none mb-4">
                  {event.name}
                </h3>
                
                <div className="flex flex-wrap gap-4 mb-8 text-[11px] font-bold text-brand-text-secondary uppercase tracking-widest italic">
                  <div className="flex items-center gap-2 bg-white/5 py-2 px-4 rounded-xl border border-white/5">
                    <Calendar size={14} className="text-brand-accent" /> {event.date}
                  </div>
                  <div className="flex items-center gap-2 bg-white/5 py-2 px-4 rounded-xl border border-white/5">
                    <Clock size={14} className="text-brand-accent" /> {event.time}
                  </div>
                  <div className="flex items-center gap-2 bg-white/5 py-2 px-4 rounded-xl border border-white/5">
                    <MapPin size={14} className="text-brand-accent" /> {event.venue}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <button 
                    onClick={() => onViewDetails(event)}
                    className="flex items-center gap-3 text-[10px] font-black text-brand-accent uppercase tracking-[0.2em] group/btn italic"
                  >
                    Analyze Intel <ChevronRight size={16} className="group-hover/btn:translate-x-2 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="text-center mt-2">
        <p className="text-[8px] font-black text-brand-text-secondary uppercase tracking-[0.4em] italic opacity-50">Swipe to investigate neighboring missions</p>
      </div>
    </div>
  );
};

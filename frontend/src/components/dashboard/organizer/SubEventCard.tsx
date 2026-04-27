import React from "react";
import { MoreVertical, Clock, Activity, ChevronRight } from "lucide-react";
import { SubEvent } from "../../../types";

interface SubEventCardProps {
  sub: SubEvent;
  onManage: (sub: SubEvent) => void;
}

export const SubEventCard = ({ sub, onManage }: SubEventCardProps) => {
  return (
    <div className="glass-panel p-6 md:p-8 rounded-[2.5rem] md:rounded-[3.5rem] border-brand-border hover:border-brand-accent/40 transition-all group space-y-4 md:space-y-6 relative overflow-hidden">
      {sub.posterUrl && (
        <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
          <img src={sub.posterUrl} className="w-full h-full object-cover" alt="" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-brand-bg/50 to-transparent" />
        </div>
      )}
      
      <div className="relative z-10 flex items-center justify-between">
        <div className="px-3 py-1 bg-brand-glass border border-brand-border text-brand-accent text-[8px] font-black uppercase tracking-widest rounded-full italic truncate max-w-[150px]">
          Venue: {sub.venue.split(',')[0]}
        </div>
        <MoreVertical size={16} className="text-brand-text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      
      <div className="relative z-10">
        <h5 className="text-xl md:text-2xl font-black text-white italic uppercase tracking-tighter group-hover:text-brand-accent transition-colors leading-tight mb-2 truncate">
          {sub.name}
        </h5>
        <div className="flex items-center gap-2 text-[9px] md:text-[10px] font-bold text-brand-text-secondary uppercase tracking-widest italic">
          <Clock size={12} className="text-brand-accent" /> {sub.time} • Oct 12
        </div>
      </div>

      <div className="relative z-10 pt-4 md:pt-6 border-t border-brand-border flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex -space-x-2 overflow-hidden">
            {sub.teamLeads.map((tl) => (
              <div key={tl.id} className="inline-block h-7 w-7 md:h-8 md:w-8 rounded-lg ring-2 ring-brand-bg bg-brand-accent text-white flex items-center justify-center font-bold text-[8px] uppercase ring-offset-brand-bg">
                {tl.name.substring(0, 1)}
              </div>
            ))}
          </div>
          <div className="text-right">
            <p className="text-[8px] font-black text-brand-text-secondary uppercase tracking-widest leading-none mb-1">Participants</p>
            <p className="text-sm font-black text-white italic leading-none">{sub.participantCount}</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1.5 md:gap-2">
          {sub.teamLeads.map(tl => (
            <span key={tl.id} className="px-2 py-1 bg-white/5 rounded-md text-[7px] md:text-[8px] font-bold text-brand-text-secondary uppercase tracking-tighter truncate max-w-[100px]">
              {tl.name}
            </span>
          ))}
        </div>

        <button 
          onClick={() => onManage(sub)}
          className="w-full py-3 md:py-3.5 bg-brand-accent/10 border border-brand-accent/20 text-brand-accent rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-brand-accent hover:text-white transition-all flex items-center justify-center gap-2"
        >
          Manage Sub-Event <ChevronRight size={14} />
        </button>
      </div>

      <div className="absolute top-0 right-0 p-8 md:p-12 opacity-5 translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform">
        <Activity className="w-24 h-24 md:w-32 md:h-32 text-brand-accent" />
      </div>
    </div>
  );
};

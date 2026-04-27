import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, MapPin, Clock, Info, Shield, BookOpen, Megaphone, FileText, ExternalLink, Download, Activity, AlertCircle } from "lucide-react";
import { ParticipantEvent, RuleBook } from "../../../types";
import { ParticipantService } from "../../../services/participantService";

interface EventDetailsModalProps {
  event: ParticipantEvent | null;
  onClose: () => void;
}

export const EventDetailsModal = ({ event, onClose }: EventDetailsModalProps) => {
  const [ruleBook, setRuleBook] = useState<RuleBook | null>(null);
  const [loadingRules, setLoadingRules] = useState(false);

  useEffect(() => {
    if (event && event.subEventId) {
      const fetchRules = async () => {
        setLoadingRules(true);
        try {
          const data = await ParticipantService.getRuleBook(event.subEventId!);
          setRuleBook(data);
        } catch (err) {
          console.error("Failed to load rules", err);
        } finally {
          setLoadingRules(false);
        }
      };
      fetchRules();
    }
  }, [event]);

  if (!event) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-10">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" 
        />
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }} 
          animate={{ scale: 1, opacity: 1, y: 0 }} 
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="glass-panel w-full max-w-3xl p-6 md:p-10 lg:p-12 rounded-[2rem] md:rounded-[4rem] border-brand-border relative z-10 max-h-[90vh] overflow-y-auto no-scrollbar scroll-smooth"
        >
          <button 
            onClick={onClose} 
            className="absolute top-4 md:top-8 right-4 md:right-8 p-2 text-brand-text-secondary hover:text-white transition-colors z-20"
          >
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          <div className="space-y-8 md:space-y-10">
            {/* Header with optional Poster */}
            <div className="pt-4 md:pt-0">
              {event.posterUrl && (
                <div className="w-full h-48 md:h-64 rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden mb-6 md:mb-8 border border-brand-border">
                   <img src={event.posterUrl} className="w-full h-full object-cover" alt="" />
                </div>
              )}
              <div className="flex items-center gap-2 mb-3 md:mb-4">
                 <div className={`px-3 md:px-4 py-1 md:py-1.5 rounded-full text-[7px] md:text-[8px] font-black uppercase tracking-widest italic ${
                   event.status === 'Cancelled' ? 'bg-red-500/10 text-red-400' : 
                   event.status === 'Upcoming' ? 'bg-brand-accent/10 text-brand-accent' : 
                   'bg-emerald-500/10 text-emerald-400'
                 }`}>
                   {event.status}
                 </div>
              </div>
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-white italic uppercase tracking-tighter leading-tight md:leading-none mb-4 md:mb-6">
                {event.name}
              </h2>
              
              <div className="flex flex-wrap gap-4 md:gap-8">
                <div className="flex items-center gap-2.5 md:gap-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-brand-accent shrink-0">
                    <Calendar className="w-4 h-4 md:w-[18px] md:h-[18px]" />
                  </div>
                  <div>
                    <p className="text-[8px] md:text-[9px] font-black text-brand-text-secondary uppercase tracking-widest italic">Date</p>
                    <p className="text-[11px] md:text-sm font-bold text-white uppercase italic">{event.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 md:gap-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-brand-accent shrink-0">
                    <Clock className="w-4 h-4 md:w-[18px] md:h-[18px]" />
                  </div>
                  <div>
                    <p className="text-[8px] md:text-[9px] font-black text-brand-text-secondary uppercase tracking-widest italic">Time</p>
                    <p className="text-[11px] md:text-sm font-bold text-white uppercase italic">{event.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 md:gap-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-brand-accent shrink-0">
                    <MapPin className="w-4 h-4 md:w-[18px] md:h-[18px]" />
                  </div>
                  <div>
                    <p className="text-[8px] md:text-[9px] font-black text-brand-text-secondary uppercase tracking-widest italic">Venue</p>
                    <p className="text-[11px] md:text-sm font-bold text-white uppercase italic tracking-tight">{event.venue}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description & Guidelines */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
              <div className="space-y-4 md:space-y-6">
                <div className="flex items-center gap-2">
                  <Info className="w-3.5 h-3.5 md:w-4 md:h-4 text-brand-accent" />
                  <h4 className="text-[11px] md:text-sm font-black text-white italic uppercase tracking-widest">Description</h4>
                </div>
                <p className="text-brand-text-secondary leading-relaxed text-[11px] md:text-sm">
                  {event.description}
                </p>
              </div>

              <div className="space-y-6 md:space-y-8">
                <div className="space-y-3 md:space-y-4">
                  <div className="flex items-center gap-2 text-brand-accent">
                    <BookOpen className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    <h4 className="text-[10px] md:text-xs font-black uppercase tracking-widest italic">Rule Book</h4>
                  </div>
                  
                  {loadingRules ? (
                    <div className="flex items-center gap-2 py-4 animate-pulse">
                      <Activity className="animate-spin text-brand-text-secondary w-3 h-3 md:w-3.5 md:h-3.5" />
                      <span className="text-[7px] md:text-[8px] font-black text-brand-text-secondary uppercase tracking-widest italic">Syncing Rule Book...</span>
                    </div>
                  ) : ruleBook ? (
                    <div className="space-y-3 md:space-y-4">
                      {!ruleBook.isPublished ? (
                        <div className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-white/5 border border-dashed border-white/10 flex items-center justify-center gap-2 md:gap-3">
                           <AlertCircle className="text-amber-500/50 w-3.5 h-3.5 md:w-4 md:h-4" />
                           <p className="text-[8px] md:text-[9px] font-black text-brand-text-secondary uppercase tracking-[0.2em] italic">Rule Book Pending Release</p>
                        </div>
                      ) : ruleBook.rulesType === 'text' ? (
                        <p className="text-brand-text-secondary text-[10px] md:text-xs italic leading-relaxed whitespace-pre-line">
                          {ruleBook.rulesContent}
                        </p>
                      ) : (
                        <div className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-brand-accent/5 border border-brand-accent/20 flex flex-col gap-2 md:gap-3">
                           <div className="flex items-center gap-3">
                              <FileText className="text-brand-accent w-4.5 h-4.5 md:w-5 md:h-5" />
                              <p className="text-[9px] md:text-[10px] font-black text-white uppercase tracking-widest italic truncate">{ruleBook.fileName || 'Event_Manual.pdf'}</p>
                           </div>
                           <div className="flex gap-2">
                              <button 
                                onClick={() => window.open(ruleBook.fileUrl)}
                                className="flex-1 py-1.5 md:py-2 bg-brand-accent/10 text-brand-accent rounded-lg text-[7px] md:text-[8px] font-black uppercase tracking-widest hover:bg-brand-accent hover:text-white transition-all flex items-center justify-center gap-1.5"
                              >
                                <ExternalLink className="w-2.5 h-2.5 md:w-3 md:h-3" /> View Rule Book
                              </button>
                              <a 
                                href={ruleBook.fileUrl} 
                                download={ruleBook.fileName}
                                className="flex-1 py-1.5 md:py-2 bg-white/5 text-brand-text-secondary rounded-lg text-[7px] md:text-[8px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-1.5"
                              >
                                <Download className="w-2.5 h-2.5 md:w-3 md:h-3" /> Download Rule Book
                              </a>
                           </div>
                        </div>
                      )}
                      {ruleBook.isPublished && <p className="text-[7px] font-bold text-brand-text-secondary uppercase tracking-[0.2em] italic">Last Sync: {new Date(ruleBook.updatedAt).toLocaleDateString()}</p>}
                    </div>
                  ) : (
                    <p className="text-brand-text-secondary text-[10px] md:text-xs italic leading-relaxed">
                      {event.rules || "Standard protocols active. Await briefing upon arrival."}
                    </p>
                  )}
                </div>

                <div className="space-y-3 md:space-y-4">
                  <div className="flex items-center gap-2 text-cyan-400">
                    <BookOpen className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    <h4 className="text-[10px] md:text-xs font-black uppercase tracking-widest italic">Technical Instructions</h4>
                  </div>
                  <p className="text-brand-text-secondary text-[10px] md:text-xs italic leading-relaxed whitespace-pre-line">
                    {event.instructions || "No specific instructions provided. Check in 20 minutes before start."}
                  </p>
                </div>
              </div>
            </div>

            {/* Announcements */}
            <div className="pt-8 md:pt-10 border-t border-white/5 space-y-4 md:space-y-6">
              <div className="flex items-center gap-2">
                <Megaphone className="text-brand-accent w-4 h-4 md:w-[18px] md:h-[18px]" />
                <h4 className="text-base md:text-lg font-black text-white italic uppercase tracking-widest">Recent Transmissions</h4>
              </div>
              
              <div className="space-y-3 md:space-y-4">
                {event.announcements.length > 0 ? (
                  event.announcements.map((ann) => (
                    <div key={ann.id} className="p-4 md:p-5 rounded-xl md:rounded-2xl bg-white/5 border border-white/5 flex gap-3 md:gap-4 transition-all hover:border-brand-accent/20">
                      <div className="shrink-0 w-7 h-7 md:w-8 md:h-8 rounded-lg bg-brand-accent/10 flex items-center justify-center text-brand-accent">
                        <Info className="w-3 h-3 md:w-3.5 md:h-3.5" />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                          <p className="text-[9px] md:text-[10px] font-black text-white italic uppercase tracking-widest truncate">{ann.author}</p>
                          <span className="text-[7px] md:text-[8px] font-bold text-brand-text-secondary uppercase tracking-widest shrink-0">{ann.timestamp}</span>
                        </div>
                        <p className="text-[11px] md:text-xs text-brand-text-secondary leading-normal">{ann.message}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-6 text-[9px] md:text-[10px] font-black text-brand-text-secondary uppercase tracking-widest italic">No active announcements detected.</p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

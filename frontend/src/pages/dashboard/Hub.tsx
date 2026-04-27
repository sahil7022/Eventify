import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Calendar, Sparkles, TrendingUp, Globe, Filter, ArrowLeft, Clock, User, Heart, Share2, Info, ChevronRight, Upload, BookOpen, FileText } from "lucide-react";
import { Event, Booking, SubEvent } from "../../types";
import { EventCard } from "../../components/EventCard";
import { useHub } from "../../hooks/useHub";
import { OrganizerService } from "../../services/organizerService";

interface HubProps {
  events: Event[];
  featured: Event;
  bookings: Booking[];
  onJoin: (e: Event, sub?: SubEvent) => void;
}

export const Hub = ({ events, featured: initialFeatured, bookings, onJoin }: HubProps) => {
  const {
    eventsRef,
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    featured,
    mostPopular,
    categories,
    filteredEvents,
    scrollToEvents
  } = useHub(events, initialFeatured);

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [subEvents, setSubEvents] = useState<SubEvent[]>([]);
  const [loadingSubs, setLoadingSubs] = useState(false);
  const [selectedSubEvent, setSelectedSubEvent] = useState<SubEvent | null>(null);

  useEffect(() => {
    if (selectedEvent) {
      const fetchSubs = async () => {
        setLoadingSubs(true);
        try {
          const data = await OrganizerService.getSubEvents(selectedEvent.id);
          setSubEvents(data);
        } catch (err) {
          console.error("Failed to fetch sub-events", err);
        } finally {
          setLoadingSubs(false);
        }
      };
      fetchSubs();
    }
  }, [selectedEvent]);

  if (selectedEvent) {
    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-12 pb-20">
        <button onClick={() => { setSelectedEvent(null); setSelectedSubEvent(null); }} className="flex items-center gap-2 text-brand-text-secondary hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest">
           <ArrowLeft size={16} /> Return to Explore
        </button>

        {/* Main Event Title Banner */}
        <section className="relative h-[250px] md:h-[400px] rounded-[2.5rem] md:rounded-[4rem] overflow-hidden group">
           <img src={selectedEvent.bannerUrl || selectedEvent.image} className="w-full h-full object-cover" alt="" />
           <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/40 to-transparent" />
           <div className="absolute bottom-10 left-10 right-10">
              <div className="space-y-4">
                 <div className="flex gap-3">
                    <span className="px-3 py-1 bg-brand-accent text-white rounded-full text-[9px] font-black uppercase tracking-widest">{selectedEvent.category}</span>
                    <span className="px-3 py-1 bg-white/10 backdrop-blur-md text-white rounded-full text-[9px] font-black uppercase tracking-widest border border-white/10 italic">Official Transmission</span>
                 </div>
                 <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white italic uppercase tracking-tighter leading-none">{selectedEvent.name}</h2>
                 <div className="flex flex-wrap gap-6 text-slate-300">
                    <div className="flex items-center gap-2 text-xs md:text-sm font-bold uppercase tracking-widest italic"><Calendar size={16} className="text-brand-accent" /> {selectedEvent.date}</div>
                    <div className="flex items-center gap-2 text-xs md:text-sm font-bold uppercase tracking-widest italic"><MapPin size={16} className="text-brand-accent" /> {selectedEvent.location}</div>
                 </div>
              </div>
           </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
           <div className="lg:col-span-2 space-y-10">
              <section className="space-y-6">
                 <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter flex items-center gap-3">
                   <Info className="text-brand-accent" /> Intelligence Briefing
                 </h3>
                 <p className="text-slate-400 text-sm md:text-base leading-relaxed font-medium">
                    {selectedEvent.description}
                 </p>
              </section>

              {/* Sub-Events List */}
              <section className="space-y-8">
                 <div className="flex items-center justify-between border-b border-white/5 pb-6">
                    <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Sector Breakdown (Sub-Events)</h3>
                    <span className="text-[10px] font-black text-brand-accent uppercase tracking-widest italic">[{subEvents.length} Active Nodes]</span>
                 </div>

                 {loadingSubs ? (
                   <div className="py-20 flex justify-center"><div className="w-10 h-10 border-4 border-brand-accent border-t-transparent rounded-full animate-spin" /></div>
                 ) : (
                   <div className="grid grid-cols-1 gap-6">
                      {subEvents.map(sub => (
                        <div key={sub.id} className="glass-panel p-6 rounded-3xl border-brand-border flex flex-col md:flex-row gap-6 hover:border-brand-accent/30 transition-all group">
                           <div className="w-full md:w-48 h-32 rounded-2xl overflow-hidden shrink-0 border border-white/5">
                              <img src={sub.posterUrl || "https://images.unsplash.com/photo-1540575861501-7ad0582371f3?auto=format&fit=crop&q=80"} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                           </div>
                           <div className="flex-1 space-y-4">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                 <div>
                                    <h4 className="text-lg font-black text-white italic uppercase tracking-tighter leading-none">{sub.name}</h4>
                                    <p className="text-[9px] font-bold text-brand-text-secondary uppercase tracking-widest mt-1 italic">{sub.venue}</p>
                                 </div>
                                 <button 
                                   onClick={() => setSelectedSubEvent(sub)}
                                   className="px-6 py-2 bg-brand-accent text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg hover:scale-105 transition-all text-center"
                                 >
                                   View Details
                                 </button>
                              </div>
                              <p className="text-xs text-slate-400 font-medium line-clamp-2">{sub.description}</p>
                              <div className="flex gap-4">
                                 <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-500 uppercase tracking-widest italic">
                                    <Calendar size={12} className="text-brand-accent" /> {sub.date}
                                 </div>
                                 <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-500 uppercase tracking-widest italic">
                                    <Clock size={12} className="text-brand-accent" /> {sub.time}
                                 </div>
                              </div>
                           </div>
                        </div>
                      ))}
                   </div>
                 )}
              </section>
           </div>

           {/* Sidebar: Details / Join Action */}
           <div className="space-y-8">
              <div className="glass-panel p-8 rounded-[2.5rem] border-brand-border space-y-6 sticky top-8">
                 <h4 className="text-lg font-black text-white italic uppercase tracking-tighter">Registration Hub</h4>
                 <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                       <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest italic">Entrance Fee</span>
                       <span className="text-xl font-black text-white italic">{selectedEvent.price}</span>
                    </div>
                    <button 
                      onClick={() => onJoin(selectedEvent)}
                      className="w-full py-5 bg-white text-slate-950 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-2xl"
                    >
                       Join Main Event
                    </button>
                 </div>
                 <p className="text-[9px] text-center text-slate-500 font-bold uppercase tracking-widest italic px-4">
                    Joining the main event grants baseline access to all open sectors.
                 </p>
              </div>
           </div>
        </div>

        {/* Sub-Event Detail Modal */}
        <AnimatePresence>
           {selectedSubEvent && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
                 <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-[#0f172a]/80 backdrop-blur-md"
                    onClick={() => setSelectedSubEvent(null)}
                 />
                 <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="glass-panel w-full max-w-4xl p-0 rounded-[2.5rem] md:rounded-[4rem] border-brand-border relative z-10 shadow-3xl overflow-hidden max-h-[90vh] flex flex-col md:flex-row"
                 >
                    <div className="w-full md:w-2/5 h-64 md:h-auto overflow-hidden relative shrink-0">
                       <img src={selectedSubEvent.posterUrl || "https://images.unsplash.com/photo-1540575861501-7ad0582371f3?auto=format&fit=crop&q=80"} alt="" className="w-full h-full object-cover" />
                       <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent hidden md:block" />
                    </div>
                    <div className="flex-1 p-8 md:p-12 overflow-y-auto space-y-8">
                       <div className="flex justify-between items-start">
                          <div className="space-y-2">
                             <div className="px-3 py-1 bg-brand-accent/20 border border-brand-accent/30 text-brand-accent text-[8px] font-black uppercase tracking-widest rounded-full w-max italic">Sector Detail</div>
                             <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-tight">{selectedSubEvent.name}</h3>
                          </div>
                          <button onClick={() => setSelectedSubEvent(null)} className="p-2 text-slate-500 hover:text-white transition-colors">
                             <ArrowLeft size={24} className="rotate-90 md:rotate-0" />
                          </button>
                       </div>

                       <div className="grid grid-cols-2 gap-6 pb-6 border-b border-white/5">
                          <div>
                             <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 italic">Location Node</p>
                             <p className="text-sm font-black text-white italic">{selectedSubEvent.venue}</p>
                          </div>
                          <div>
                             <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 italic">Time Signature</p>
                             <p className="text-sm font-black text-white italic">{selectedSubEvent.date} @ {selectedSubEvent.time}</p>
                          </div>
                       </div>

                       <section className="space-y-4">
                          <h4 className="text-[10px] md:text-xs font-black text-white italic uppercase tracking-widest flex items-center gap-2">
                             <BookOpen size={14} className="text-brand-accent" /> Rule Book
                          </h4>
                          <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                            {selectedSubEvent.rulesType === 'file' ? (
                              <div className="flex flex-col gap-3">
                                 <div className="flex items-center gap-3">
                                    <FileText className="text-brand-accent w-4 h-4" />
                                    <p className="text-[10px] font-black text-white uppercase tracking-widest italic truncate">Technical Documentation</p>
                                 </div>
                                 <div className="flex gap-2">
                                    <button 
                                      onClick={() => window.open(selectedSubEvent.rulesFileUrl)}
                                      className="flex-1 py-2 bg-brand-accent/10 text-brand-accent border border-brand-accent/20 rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-brand-accent hover:text-white transition-all flex items-center justify-center gap-2"
                                    >
                                      View Rule Book
                                    </button>
                                    <a 
                                      href={selectedSubEvent.rulesFileUrl}
                                      download
                                      className="flex-1 py-2 bg-white/5 text-brand-text-secondary border border-white/10 rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                                    >
                                      Download Rule Book
                                    </a>
                                 </div>
                              </div>
                            ) : (
                              <p className="text-xs md:text-sm text-slate-400 font-medium leading-relaxed whitespace-pre-line">
                                 {selectedSubEvent.rulesContent || selectedSubEvent.rules || "Standard protocols active. Await briefing upon arrival."}
                              </p>
                            )}
                          </div>
                       </section>

                       <section className="space-y-6">
                          <h4 className="text-[10px] font-black text-brand-accent uppercase tracking-widest flex items-center gap-2">
                             <User size={14} /> Intelligence Officers (Team Leads)
                          </h4>
                          <div className="flex flex-wrap gap-4">
                             {selectedSubEvent.teamLeads.map(tl => (
                                <div key={tl.id} className="flex items-center gap-3 p-2 pr-4 rounded-2xl bg-white/5 border border-white/5">
                                   <div className="w-8 h-8 rounded-xl bg-brand-accent/20 border border-brand-accent/30 flex items-center justify-center font-black text-brand-accent italic text-xs uppercase">
                                     {tl.imageUrl ? <img src={tl.imageUrl} className="w-full h-full object-cover rounded-xl" /> : tl.name.substring(0,1)}
                                   </div>
                                   <span className="text-[10px] font-black text-white uppercase italic tracking-tighter">{tl.name}</span>
                                </div>
                             ))}
                          </div>
                       </section>

                       <div className="pt-6">
                          <button 
                            onClick={() => { onJoin(selectedEvent, selectedSubEvent); setSelectedSubEvent(null); }}
                            className="w-full py-4 bg-white text-slate-950 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
                          >
                             Register for this Sector
                          </button>
                       </div>
                    </div>
                 </motion.div>
              </div>
           )}
        </AnimatePresence>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-12">
      
      {/* 🎡 Sliding Advertisement Banner */}
      <section className="relative h-[300px] lg:h-[480px] rounded-[2rem] lg:rounded-[3.5rem] overflow-hidden border border-white/5 shadow-3xl group">
         <AnimatePresence mode="wait">
            <motion.div 
              key={featured.id}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 cursor-pointer"
              onClick={() => setSelectedEvent(featured)}
            >
               <img src={featured.bannerUrl || featured.image} className="w-full h-full object-cover" alt="" />
               <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/20 to-transparent opacity-90 shadow-inner" />
               
               <div className="absolute inset-0 p-6 lg:p-20 flex flex-col justify-end max-w-4xl">
                  <motion.div 
                    animate={{ scale: [1, 1.01, 1], y: [0, -8, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="space-y-4 lg:space-y-6"
                  >
                     <div className="flex items-center gap-3">
                        <div className="px-3 py-1 lg:px-4 lg:py-1.5 bg-indigo-500 text-white text-[8px] lg:text-[9px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg shadow-indigo-500/50">Hot Pick</div>
                        <div className="px-3 py-1 lg:px-4 lg:py-1.5 bg-white/10 backdrop-blur-md text-white text-[8px] lg:text-[9px] font-black uppercase tracking-[0.2em] rounded-full border border-white/10">{featured.category}</div>
                     </div>
                     <h2 className="text-3xl lg:text-8xl font-black text-white italic uppercase tracking-tighter leading-none">{featured.name}</h2>
                     <p className="text-slate-300 text-sm lg:text-xl font-medium max-w-2xl leading-relaxed line-clamp-2">{featured.description}</p>
                     <div className="flex gap-3 lg:gap-4 pt-4 lg:pt-6">
                        <button onClick={(e) => { e.stopPropagation(); scrollToEvents(); }} className="px-6 py-3 lg:px-10 lg:py-5 bg-white text-slate-950 rounded-xl lg:rounded-[1.5rem] font-bold uppercase text-[9px] lg:text-[10px] tracking-widest hover:scale-105 transition-all shadow-2xl">Explore Nexus</button>
                        <button onClick={() => setSelectedEvent(featured)} className="px-6 py-3 lg:px-10 lg:py-5 bg-white/5 backdrop-blur-md border border-white/20 text-white rounded-xl lg:rounded-[1.5rem] font-bold uppercase text-[9px] lg:text-[10px] tracking-widest hover:bg-white/10 transition-all">Deep Dive</button>
                     </div>
                  </motion.div>
               </div>
            </motion.div>
         </AnimatePresence>
      </section>

      {/* 🏆 Most Popular Section */}
      {mostPopular && (
        <section className="glass-panel p-6 rounded-[2.5rem] border-indigo-500/20 bg-indigo-500/5 relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform cursor-pointer" onClick={() => setSelectedEvent(mostPopular)}>
              <TrendingUp size={80} className="text-indigo-400" />
           </div>
           <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6 cursor-pointer" onClick={() => setSelectedEvent(mostPopular)}>
                 <div className="w-16 h-16 rounded-2xl bg-indigo-500 flex items-center justify-center text-white shadow-xl shadow-indigo-500/20">
                    <Sparkles size={24} />
                 </div>
                 <div>
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest italic">Currently Trending</span>
                    <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">{mostPopular.name}</h3>
                 </div>
              </div>
              <button 
                onClick={() => setSelectedEvent(mostPopular)}
                className="px-8 py-4 bg-indigo-500 text-white rounded-xl font-bold uppercase text-[10px] tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg"
              >
                Join the Pulse
              </button>
           </div>
        </section>
      )}

      {/* 🧩 Grid Navigation (Filter) */}
      <section className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 pb-4 border-b border-white/5" ref={eventsRef}>
         <div className="flex flex-col md:flex-row gap-6 flex-1">
            <div className="relative flex-1 max-w-md">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
               <input 
                 type="text"
                 placeholder="Search all events..."
                 className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm focus:border-indigo-500 transition-all outline-none text-white"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
               />
            </div>
            <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-2">
               {categories.map((cat) => (
                 <button 
                   key={cat}
                   onClick={() => setActiveCategory(cat)}
                   className={`whitespace-nowrap px-6 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-white/5 text-slate-500 hover:text-white hover:bg-white/10 border border-white/5'}`}
                 >
                   {cat}
                 </button>
               ))}
            </div>
         </div>
         <div className="flex items-center gap-3 glass-panel px-4 py-2 rounded-2xl border-white/5 flex-shrink-0">
            <Sparkles size={14} className="text-indigo-400" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Events Happening: {events.length}</span>
         </div>
      </section>

      {/* 🏟 Current Opportunities (Events) */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-10">
        {filteredEvents.map((event, i) => (
          <EventCard 
            key={event.id} 
            event={event} 
            onViewDetails={(e) => setSelectedEvent(e)}
            isJoined={bookings.some(b => b.id === event.id)}
          />
        ))}
        {filteredEvents.length === 0 && (
          <div className="col-span-full py-20 text-center glass-panel rounded-[3.5rem] border-white/5">
            <Globe size={48} className="mx-auto mb-6 text-slate-700 animate-pulse" />
            <h3 className="text-xl font-bold text-slate-500 uppercase italic">No signals found in this frequency</h3>
            <p className="text-slate-600 text-xs mt-2 uppercase tracking-widest">Try adjusting your search parameters</p>
          </div>
        )}
      </section>
    </motion.div>
  );
};

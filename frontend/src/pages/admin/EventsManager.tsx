import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Settings, 
  Globe, 
  LayoutDashboard, 
  ChevronRight,
  ArrowLeft,
  Users,
  Search,
  Upload
} from "lucide-react";
import { MainEvent, SubEvent, UserProfile } from '../../types';
import { CreateEventWizard } from './events/CreateEventWizard';

interface EventsManagerProps {
  events: MainEvent[];
  deleteEvent: (id: string) => Promise<boolean>;
}

export const EventsManager = ({ events, deleteEvent, updateEvent, createEvent, getSubEvents, createSubEvent, deleteSubEvent, getApprovedOrganizers, assignOrganizers }: EventsManagerProps & { 
  updateEvent: (id: string, data: Partial<MainEvent>) => Promise<boolean>;
  createEvent: (data: Partial<MainEvent>) => Promise<boolean>;
  getSubEvents: (eventId: string) => Promise<SubEvent[]>;
  createSubEvent: (eventId: string, data: Partial<SubEvent>) => Promise<boolean>;
  deleteSubEvent: (subEventId: string) => Promise<boolean>;
  getApprovedOrganizers: () => Promise<UserProfile[]>;
  assignOrganizers: (subId: string, ids: string[], leadsCount: number) => Promise<boolean>;
}) => {
  const [selectedEvent, setSelectedEvent] = useState<MainEvent | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editingEvent, setEditingEvent] = useState<MainEvent | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEvents = events.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isCreating) {
    return (
      <CreateEventWizard 
        onCancel={() => setIsCreating(false)}
        onSave={async (mainData, subEventsData) => {
          // 1. Create Main Event
          // Note: In a real backend, this might return the new event ID
          const success = await createEvent(mainData);
          
          if (success) {
            // 2. Create Sub-events
            // For demo purposes, we don't have the real ID yet, but we'd normally use it
            for (const subData of subEventsData) {
              await createSubEvent("new-event-id", subData);
            }
            setIsCreating(false);
          }
        }}
      />
    );
  }

  if (editingEvent) {
    return (
      <EventForm 
        event={editingEvent} 
        onSave={async (data) => {
          const success = await updateEvent(editingEvent.id, data);
          if (success) {
            setEditingEvent(null);
          }
        }}
        onCancel={() => {
          setEditingEvent(null);
        }}
      />
    );
  }

  if (selectedEvent) {
    return (
      <SubEventManager 
        event={selectedEvent} 
        onBack={() => setSelectedEvent(null)}
        getSubEvents={getSubEvents}
        createSubEvent={createSubEvent}
        deleteSubEvent={deleteSubEvent}
        getApprovedOrganizers={getApprovedOrganizers}
        assignOrganizers={assignOrganizers}
      />
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
         <div className="relative flex-1 w-full sm:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Search events..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-brand-accent transition-all italic"
            />
         </div>
         <button 
           onClick={() => setIsCreating(true)}
           className="flex items-center gap-2 px-8 py-4 bg-brand-accent text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-all"
         >
            <Plus size={16} /> Create Event
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredEvents.map(event => (
          <motion.div 
            key={event.id}
            layoutId={event.id}
            className="glass-panel p-2 rounded-[2.5rem] border-brand-border overflow-hidden flex flex-col group hover:border-brand-accent/30 transition-all"
          >
            <div className="relative h-48 rounded-[2rem] overflow-hidden mb-6">
              <img src={event.image} alt={event.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute top-4 left-4 bg-brand-accent/90 backdrop-blur-md text-white text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full italic">
                 {event.category}
              </div>
              <div className="absolute bottom-4 left-6 right-6">
                 <h4 className="text-xl font-black text-white italic uppercase truncate">{event.name}</h4>
              </div>
            </div>

            <div className="px-6 pb-6 space-y-6 flex-1 flex flex-col">
               <div className="flex items-center justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest italic">
                  <div className="flex items-center gap-2">
                     <Users size={12} className="text-brand-accent" />
                     <span>124 Users</span>
                  </div>
                  <span>{new Date(event.date).toLocaleDateString()}</span>
               </div>

               <div className="grid grid-cols-2 gap-3 mt-auto">
                  <button 
                    onClick={() => setSelectedEvent(event)}
                    className="flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:border-brand-accent/50 transition-all group/btn"
                  >
                    <LayoutDashboard size={14} className="group-hover/btn:rotate-12 transition-transform" /> Sub-Events
                  </button>
                  <button 
                    onClick={() => setEditingEvent(event)}
                    className="flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:border-indigo-500/50 transition-all"
                  >
                    <Edit3 size={14} /> Edit Event
                  </button>
               </div>
               
               <button 
                  onClick={() => deleteEvent(event.id)}
                  className="w-full py-3 bg-red-500/5 hover:bg-red-500 text-red-500 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest italic transition-all flex items-center justify-center gap-2 border border-red-500/20"
               >
                  <Trash2 size={14} /> Delete Event
               </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const EventForm = ({ event, onSave, onCancel }: { event?: MainEvent; onSave: (data: Partial<MainEvent>) => void; onCancel: () => void }) => {
  const [formData, setFormData] = useState<Partial<MainEvent>>(event || {
    name: "",
    category: "Tech",
    date: new Date().toISOString().split('T')[0],
    location: "",
    price: "Free",
    image: "https://images.unsplash.com/photo-1540575861501-7ad0582371f3?auto=format&fit=crop&q=80",
    description: ""
  });

  return (
    <div className="glass-panel p-8 rounded-[3rem] border-brand-border space-y-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">
          {event ? "Modify Event" : "Initialize Event"}
        </h3>
        <button onClick={onCancel} className="text-slate-500 hover:text-white p-2">
          <ArrowLeft size={24} />
        </button>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic ml-2">Event Name</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="E.g. Tech Quest" 
              className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-brand-accent italic"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic ml-2">Category</label>
            <select 
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value as any })}
              className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-brand-accent italic bg-slate-900"
            >
              <option value="Tech">Tech</option>
              <option value="Art">Art</option>
              <option value="Business">Business</option>
              <option value="Sports">Sports</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic ml-2">Date</label>
            <input 
              type="date" 
              value={formData.date}
              onChange={e => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-brand-accent italic"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic ml-2">Price</label>
            <input 
              type="text" 
              value={formData.price}
              onChange={e => setFormData({ ...formData, price: e.target.value })}
              placeholder="E.g. Free or ₹500" 
              className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-brand-accent italic"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic ml-2">Location</label>
          <input 
            type="text" 
            value={formData.location}
            onChange={e => setFormData({ ...formData, location: e.target.value })}
            placeholder="Room 101, Main Block" 
            className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-brand-accent italic"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic ml-2">Description</label>
          <textarea 
            rows={4}
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-brand-accent italic"
          />
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic ml-2">Event Banner</label>
          <div className="relative group">
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const url = URL.createObjectURL(file);
                  setFormData({ ...formData, image: url });
                }
              }}
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
            />
            <div className="w-full h-40 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center justify-center overflow-hidden relative">
              {formData.image ? (
                <>
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover opacity-50" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Upload size={24} className="text-white mb-2" />
                    <p className="text-[10px] font-black text-white uppercase italic">Change Banner</p>
                  </div>
                </>
              ) : (
                <>
                  <Upload size={24} className="text-slate-600 mb-2" />
                  <p className="text-[10px] font-black text-slate-500 uppercase italic">Upload Banner</p>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button 
            onClick={() => onSave(formData)}
            className="flex-1 py-4 bg-brand-accent text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all"
          >
            {event ? "Commit Changes" : "Create Node"}
          </button>
          <button 
            onClick={onCancel}
            className="flex-1 py-4 bg-white/5 border border-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
          >
            Abort
          </button>
        </div>
      </div>
    </div>
  );
};

const SubEventManager = ({ event, onBack, getSubEvents, createSubEvent, deleteSubEvent, getApprovedOrganizers, assignOrganizers }: { 
  event: MainEvent; 
  onBack: () => void;
  getSubEvents: (id: string) => Promise<SubEvent[]>;
  createSubEvent: (id: string, data: Partial<SubEvent>) => Promise<boolean>;
  deleteSubEvent: (id: string) => Promise<boolean>;
  getApprovedOrganizers: () => Promise<UserProfile[]>;
  assignOrganizers: (subId: string, ids: string[], leadsCount: number) => Promise<boolean>;
}) => {
  const [subEvents, setSubEvents] = useState<SubEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubEvent, setSelectedSubEvent] = useState<SubEvent | null>(null);
  const [allOrganizers, setAllOrganizers] = useState<UserProfile[]>([]);
  const [isAssigning, setIsAssigning] = useState(false);
  const [assignmentData, setAssignmentData] = useState<{ leads: string[], organizers: string[] }>({ leads: [], organizers: [] });

  React.useEffect(() => {
    loadSubEvents();
    loadOrganizers();
  }, [event.id]);

  const loadSubEvents = async () => {
    setIsLoading(true);
    const data = await getSubEvents(event.id);
    setSubEvents(data);
    setIsLoading(false);
  };

  const loadOrganizers = async () => {
    const data = await getApprovedOrganizers();
    setAllOrganizers(data);
  };

  const handleAddSubEvent = async () => {
    const name = prompt("Enter sub-event name:");
    if (name) {
      const success = await createSubEvent(event.id, { name });
      if (success) loadSubEvents();
    }
  };

  const handleOpenAssignment = (se: SubEvent) => {
    setSelectedSubEvent(se);
    // Initialize with current members if any (mocked for now)
    setAssignmentData({ leads: [], organizers: [] });
    setIsAssigning(true);
  };

  const handleSaveAssignment = async () => {
    if (!selectedSubEvent) return;
    const allIds = [...assignmentData.leads, ...assignmentData.organizers];
    const success = await assignOrganizers(selectedSubEvent.id, allIds, assignmentData.leads.length);
    if (success) {
      setIsAssigning(false);
      loadSubEvents();
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-6">
         <button 
           onClick={onBack}
           className="p-4 bg-white/5 border border-white/10 rounded-2xl text-slate-400 hover:text-white transition-all"
         >
           <ArrowLeft size={20} />
         </button>
         <div>
            <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">{event.name} Sub-Events</h3>
            <p className="text-[10px] font-black text-brand-accent uppercase tracking-widest italic">Event Settings</p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="glass-panel p-8 rounded-[2.5rem] border-brand-border space-y-6">
            <div className="flex items-center justify-between">
               <h4 className="text-xl font-black text-white italic uppercase tracking-tighter">Sub-Events List</h4>
               <button 
                 onClick={handleAddSubEvent}
                 className="flex items-center gap-2 px-6 py-3 bg-brand-accent text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg"
               >
                  <Plus size={14} /> Add Sub-Event
               </button>
            </div>
            
            <div className="space-y-4">
               {isLoading ? (
                  <div className="p-12 text-center text-slate-500 italic animate-pulse">Syncing Sub-Events...</div>
               ) : subEvents.length === 0 ? (
                  <div className="py-12 text-center space-y-4 border border-white/5 rounded-3xl">
                     <LayoutDashboard size={32} className="mx-auto text-slate-700" />
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">No sub-events found.</p>
                  </div>
               ) : (
                  subEvents.map(se => (
                    <div key={se.id} className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-4 group hover:border-brand-accent/30 transition-all">
                       <div className="flex items-center justify-between">
                          <div>
                             <p className="text-sm font-black text-white italic uppercase">{se.name}</p>
                             <div className="flex items-center gap-3">
                                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest italic">{se.venue || se.location}</p>
                                <p className="text-[8px] font-black text-brand-accent uppercase tracking-widest italic">Users: 0</p>
                             </div>
                          </div>
                          <div className="flex gap-2">
                             <button 
                               onClick={() => handleOpenAssignment(se)}
                               className="p-2 text-slate-500 hover:text-brand-accent transition-all"
                               title="Assign Organizers"
                             >
                                <Settings size={14} />
                             </button>
                             <button 
                               onClick={async () => {
                                 if(confirm("Delete this sub-event?")) {
                                   await deleteSubEvent(se.id);
                                   loadSubEvents();
                                 }
                               }}
                               className="p-2 text-slate-500 hover:text-red-400 transition-all"
                             >
                               <Trash2 size={14} />
                             </button>
                          </div>
                       </div>

                       {/* Assigned Organizers Display */}
                       <div className="flex flex-wrap gap-4 pt-2 border-t border-white/5">
                          <div className="flex flex-col gap-1">
                             <span className="text-[7px] font-black text-indigo-400 uppercase italic">Team Leads</span>
                             {se.teamLeads && se.teamLeads.length > 0 ? (
                               <div className="flex -space-x-2">
                                  {se.teamLeads.map((tl, i) => (
                                    <div key={i} className="w-6 h-6 rounded-full border-2 border-slate-900 bg-brand-accent flex items-center justify-center overflow-hidden" title={tl.name}>
                                       {tl.avatar || tl.imageUrl ? <img src={tl.avatar || tl.imageUrl} className="w-full h-full object-cover" /> : <span className="text-[8px] font-black text-white">{tl.name[0]}</span>}
                                    </div>
                                  ))}
                               </div>
                             ) : (
                               <span className="text-[7px] font-bold text-slate-600 uppercase italic">Not Assigned</span>
                             )}
                          </div>
                          <div className="flex flex-col gap-1">
                             <span className="text-[7px] font-black text-emerald-400 uppercase italic">Organizers</span>
                             {se.organizers && se.organizers.length > 0 ? (
                               <div className="flex -space-x-2">
                                  {se.organizers.map((org, i) => (
                                    <div key={i} className="w-6 h-6 rounded-full border-2 border-slate-900 bg-emerald-500 flex items-center justify-center overflow-hidden" title={org.name}>
                                       {org.avatar || org.imageUrl ? <img src={org.avatar || org.imageUrl} className="w-full h-full object-cover" /> : <span className="text-[8px] font-black text-white">{org.name[0]}</span>}
                                    </div>
                                  ))}
                               </div>
                             ) : (
                               <span className="text-[7px] font-bold text-slate-600 uppercase italic">No Sub-Orgs</span>
                             )}
                          </div>
                       </div>
                    </div>
                  ))
               )}
            </div>
         </div>

         <div className="glass-panel p-8 rounded-[2.5rem] border-brand-border space-y-8 relative">
            <AnimatePresence mode="wait">
               {isAssigning && selectedSubEvent ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-8"
                  >
                     <div>
                        <h4 className="text-xl font-black text-white italic uppercase tracking-tighter">Assign Staff</h4>
                        <p className="text-[10px] font-black text-brand-accent uppercase tracking-widest italic">{selectedSubEvent.name}</p>
                     </div>

                     <div className="space-y-6">
                        <div className="space-y-4">
                           <div className="flex items-center justify-between px-1">
                              <label className="text-[10px] font-black text-brand-accent uppercase tracking-widest italic">Approved Nodes</label>
                              <span className="text-[8px] font-bold text-slate-500 uppercase italic">Assign Roles</span>
                           </div>
                           <div className="grid grid-cols-1 gap-3">
                              {allOrganizers.map(org => {
                                 const isLead = assignmentData.leads.includes(org.uid);
                                 const isOrg = assignmentData.organizers.includes(org.uid);
                                 const currentRole = isLead ? 'lead' : isOrg ? 'org' : 'none';

                                 return (
                                    <div 
                                      key={org.uid}
                                      className={`flex items-center justify-between p-4 rounded-3xl border transition-all ${
                                         currentRole !== 'none' 
                                         ? 'bg-brand-accent/5 border-brand-accent/20' 
                                         : 'bg-white/5 border-white/5 grayscale opacity-60 hover:grayscale-0 hover:opacity-100'
                                      }`}
                                    >
                                       <div className="flex items-center gap-3">
                                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black italic text-[10px] ${
                                             currentRole === 'lead' ? 'bg-indigo-500 text-white' : 
                                             currentRole === 'org' ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-500'
                                          }`}>
                                             {org.name[0]}
                                          </div>
                                          <div>
                                             <p className="text-xs font-black text-white italic uppercase">{org.name}</p>
                                             <p className="text-[8px] font-bold text-slate-500 uppercase italic">{org.department}</p>
                                          </div>
                                       </div>

                                       <select 
                                         value={currentRole}
                                         onChange={(e) => {
                                            const role = e.target.value;
                                            setAssignmentData(prev => {
                                               const nextLeads = prev.leads.filter(id => id !== org.uid);
                                               const nextOrgs = prev.organizers.filter(id => id !== org.uid);
                                               
                                               if (role === 'lead') return { ...prev, leads: [...nextLeads, org.uid], organizers: nextOrgs };
                                               if (role === 'org') return { ...prev, leads: nextLeads, organizers: [...nextOrgs, org.uid] };
                                               return { ...prev, leads: nextLeads, organizers: nextOrgs };
                                            });
                                         }}
                                         className="bg-brand-bg border border-white/10 rounded-xl px-3 py-1.5 text-[8px] font-black uppercase italic tracking-widest text-slate-400 focus:text-brand-accent outline-none"
                                       >
                                          <option value="none">Not Linked</option>
                                          <option value="lead">Team Lead</option>
                                          <option value="org">Sub-Organizer</option>
                                       </select>
                                    </div>
                                 );
                              })}
                           </div>
                        </div>
                     </div>

                     <div className="flex gap-4 pt-4">
                        <button 
                          onClick={handleSaveAssignment}
                          className="flex-1 py-4 bg-brand-accent text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-all"
                        >
                          Commit Assignment
                        </button>
                        <button 
                          onClick={() => {
                             setIsAssigning(false);
                             setSelectedSubEvent(null);
                          }}
                          className="px-8 py-4 bg-white/5 border border-white/10 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-white transition-all"
                        >
                          Cancel
                        </button>
                     </div>
                  </motion.div>
               ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-full py-20 space-y-4"
                  >
                     <Users size={48} className="text-slate-800" />
                     <div className="text-center">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Node Member Configuration</p>
                        <p className="text-[8px] font-bold text-slate-600 uppercase italic">Select a sub-event to manage its specific operational staff.</p>
                     </div>
                  </motion.div>
               )}
            </AnimatePresence>
         </div>
      </div>
    </div>
  );
};

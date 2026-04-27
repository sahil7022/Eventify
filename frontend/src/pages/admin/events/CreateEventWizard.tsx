import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Plus, 
  Trash2, 
  Image as ImageIcon,
  Clock,
  MapPin,
  Users,
  Trophy,
  CheckCircle2,
  Calendar,
  Upload
} from 'lucide-react';
import { MainEvent, SubEvent } from '../../../types';
import { motion, AnimatePresence } from 'motion/react';

interface CreateEventWizardProps {
  onCancel: () => void;
  onSave: (mainEvent: Partial<MainEvent>, subEvents: Partial<SubEvent>[]) => Promise<void>;
}

export const CreateEventWizard = ({ onCancel, onSave }: CreateEventWizardProps) => {
  const [step, setStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);

  // Main Event State
  const [mainEvent, setMainEvent] = useState<Partial<MainEvent>>({
    name: "",
    collegeName: "",
    location: "",
    date: new Date().toISOString().split('T')[0],
    time: "10:00",
    totalOrganizers: 10,
    organizersPerSubEvent: 2,
    allowParticipants: true,
    maxParticipants: 500,
    image: "https://images.unsplash.com/photo-1540575861501-7ad0582371f3?auto=format&fit=crop&q=80",
    subEventCount: 0,
    category: "Tech",
    description: "",
    price: "Free"
  });

  // Sub Events State
  const [subEvents, setSubEvents] = useState<Partial<SubEvent>[]>([]);

  const handleMainEventChange = (field: keyof MainEvent, value: any) => {
    setMainEvent(prev => {
      const updated = { ...prev, [field]: value };
      
      // If subEventCount changes, initialize sub-events list
      if (field === 'subEventCount') {
        const count = parseInt(value) || 0;
        const currentSubEvents = [...subEvents];
        if (count > currentSubEvents.length) {
          // Add placeholders
          const newOnes = Array.from({ length: count - currentSubEvents.length }).map(() => ({
            name: "",
            date: updated.date,
            time: updated.time,
            venue: updated.location,
            location: updated.location,
            organizersLimit: updated.organizersPerSubEvent,
            participantsLimit: 50,
            description: ""
          }));
          setSubEvents([...currentSubEvents, ...newOnes]);
        } else if (count < currentSubEvents.length) {
          // Trim
          setSubEvents(currentSubEvents.slice(0, count));
        }
      }
      return updated;
    });
  };

  const updateSubEvent = (index: number, field: keyof SubEvent, value: any) => {
    const updated = [...subEvents];
    updated[index] = { ...updated[index], [field]: value };
    setSubEvents(updated);
  };

  const handleNext = () => {
    if (step === 1) {
      if (!mainEvent.name || !mainEvent.collegeName) {
        alert("Please fill in the required fields.");
        return;
      }
      setStep(2);
    } else {
      setStep(3);
    }
  };

  const handleBack = () => setStep(step - 1);

  const handleFinalSave = async () => {
    setIsSaving(true);
    await onSave(mainEvent, subEvents);
    setIsSaving(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Step Indicator */}
      <div className="flex items-center justify-between px-12 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/5 -z-10" />
        {[1, 2, 3].map(s => (
          <div 
            key={s} 
            className={`w-10 h-10 rounded-full flex items-center justify-center font-black italic transition-all border-2 ${
              step >= s ? 'bg-brand-accent border-brand-accent text-white shadow-xl shadow-brand-accent/20' : 'bg-brand-bg border-white/10 text-slate-500'
            }`}
          >
            {s}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="glass-panel p-8 rounded-[3rem] border-brand-border space-y-10"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Event Foundation</h3>
                <p className="text-[10px] font-black text-brand-accent uppercase tracking-widest italic mt-1">Main Node Initialization</p>
              </div>
              <button onClick={onCancel} className="text-slate-500 hover:text-white transition-colors">
                <ArrowLeft size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic ml-2">Event Designation</label>
                  <input 
                    type="text" 
                    placeholder="E.g. Neural Frontiers 2025"
                    value={mainEvent.name}
                    onChange={(e) => handleMainEventChange('name', e.target.value)}
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white italic outline-none focus:border-brand-accent transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic ml-2">College / Institution</label>
                  <input 
                    type="text" 
                    placeholder="E.g. VIT Chennai"
                    value={mainEvent.collegeName}
                    onChange={(e) => handleMainEventChange('collegeName', e.target.value)}
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white italic outline-none focus:border-brand-accent transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic ml-2">Date</label>
                    <input 
                      type="date"
                      value={mainEvent.date}
                      onChange={(e) => handleMainEventChange('date', e.target.value)}
                      className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white italic outline-none focus:border-brand-accent transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic ml-2">Start Time</label>
                    <input 
                      type="time"
                      value={mainEvent.time}
                      onChange={(e) => handleMainEventChange('time', e.target.value)}
                      className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white italic outline-none focus:border-brand-accent transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic ml-2">Operation Base (Location)</label>
                  <input 
                    type="text" 
                    placeholder="E.g. Mahatma Gandhi Auditorium"
                    value={mainEvent.location}
                    onChange={(e) => handleMainEventChange('location', e.target.value)}
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white italic outline-none focus:border-brand-accent transition-all"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic ml-2">Main Event Banner</label>
                  <div className="relative group">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = URL.createObjectURL(file);
                          handleMainEventChange('image', url);
                        }
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                    <div className="w-full h-40 bg-white/5 border border-white/10 border-dashed rounded-3xl flex flex-col items-center justify-center gap-3 group-hover:border-brand-accent/50 transition-all overflow-hidden relative">
                      {mainEvent.image ? (
                        <>
                          <img src={mainEvent.image} alt="Preview" className="w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-all" />
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <ImageIcon size={32} className="text-white mb-2" />
                            <p className="text-[10px] font-black text-white uppercase tracking-widest italic">Update Banner</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <Upload size={32} className="text-slate-700" />
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Upload Main Banner</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic ml-2">Total Staff Limit</label>
                    <input 
                      type="number"
                      value={mainEvent.totalOrganizers}
                      onChange={(e) => handleMainEventChange('totalOrganizers', parseInt(e.target.value))}
                      className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white italic outline-none focus:border-brand-accent transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic ml-2">Staff per Sector</label>
                    <input 
                      type="number"
                      value={mainEvent.organizersPerSubEvent}
                      onChange={(e) => handleMainEventChange('organizersPerSubEvent', parseInt(e.target.value))}
                      className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white italic outline-none focus:border-brand-accent transition-all"
                    />
                  </div>
                </div>

                <div className="p-6 bg-white/5 border border-white/5 rounded-3xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black text-white italic uppercase tracking-widest">Public Participation</p>
                      <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest italic">Allow external registrations</p>
                    </div>
                    <button 
                      onClick={() => handleMainEventChange('allowParticipants', !mainEvent.allowParticipants)}
                      className={`w-12 h-6 rounded-full relative transition-all ${mainEvent.allowParticipants ? 'bg-brand-accent' : 'bg-slate-800'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${mainEvent.allowParticipants ? 'right-1' : 'left-1'}`} />
                    </button>
                  </div>
                  {mainEvent.allowParticipants && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                      <label className="text-[8px] font-black text-brand-accent uppercase tracking-widest italic ml-1">Max Entity Capacity</label>
                      <input 
                        type="number"
                        value={mainEvent.maxParticipants}
                        onChange={(e) => handleMainEventChange('maxParticipants', parseInt(e.target.value))}
                        className="w-full px-4 py-3 bg-brand-bg border border-white/10 rounded-xl text-white text-xs italic outline-none focus:border-brand-accent"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic ml-2">Sector Count (Sub-Events)</label>
                  <input 
                    type="number"
                    min="0"
                    max="20"
                    placeholder="Enter number of sub-events"
                    value={mainEvent.subEventCount}
                    onChange={(e) => handleMainEventChange('subEventCount', e.target.value)}
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white italic outline-none focus:border-brand-accent transition-all font-black text-lg"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button 
                onClick={handleNext}
                className="flex items-center gap-3 px-12 py-5 bg-brand-accent text-white rounded-3xl text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-brand-accent/20 hover:scale-105 active:scale-95 transition-all group"
              >
                Proceed to Sectors <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-between glass-panel p-8 rounded-[2.5rem] border-brand-border">
              <div>
                <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Sector Mapping</h3>
                <p className="text-[10px] font-black text-brand-accent uppercase tracking-widest italic mt-1">Configuring {subEvents.length} Unique Nodes</p>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={handleBack}
                  className="px-8 py-3 bg-white/5 border border-white/10 text-slate-500 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                >
                  Back
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {subEvents.map((se, idx) => (
                <div key={idx} className="glass-panel p-8 rounded-[2.5rem] border-brand-border space-y-6 hover:border-brand-accent/30 transition-all group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-full -z-10 flex items-center justify-center pt-2 pl-2">
                    <span className="text-4xl font-black italic text-white/5">{idx + 1}</span>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest italic ml-1">Sector Name</label>
                      <input 
                        type="text" 
                        placeholder="E.g. Algorithmic Warfare"
                        value={se.name}
                        onChange={(e) => updateSubEvent(idx, 'name', e.target.value)}
                        className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm italic outline-none focus:border-brand-accent"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest italic ml-1">Date</label>
                        <input 
                          type="date"
                          value={se.date}
                          onChange={(e) => updateSubEvent(idx, 'date', e.target.value)}
                          className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs italic outline-none focus:border-brand-accent"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest italic ml-1">Time</label>
                        <input 
                          type="time"
                          value={se.time}
                          onChange={(e) => updateSubEvent(idx, 'time', e.target.value)}
                          className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs italic outline-none focus:border-brand-accent"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest italic ml-1">Sector Base</label>
                      <input 
                        type="text" 
                        placeholder="Location"
                        value={se.venue}
                        onChange={(e) => {
                          updateSubEvent(idx, 'venue', e.target.value);
                          updateSubEvent(idx, 'location', e.target.value);
                        }}
                        className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm italic outline-none focus:border-brand-accent"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest italic ml-1">Staff Limit</label>
                        <input 
                          type="number"
                          value={se.organizersLimit}
                          onChange={(e) => updateSubEvent(idx, 'organizersLimit', parseInt(e.target.value))}
                          className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs italic outline-none focus:border-brand-accent"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest italic ml-1">User Limit</label>
                        <input 
                          type="number"
                          value={se.participantsLimit}
                          onChange={(e) => updateSubEvent(idx, 'participantsLimit', parseInt(e.target.value))}
                          className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs italic outline-none focus:border-brand-accent"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-8">
              <button 
                onClick={handleBack}
                className="flex items-center gap-3 px-8 py-4 text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-widest italic transition-all"
              >
                <ArrowLeft size={16} /> Reconfigure Foundation
              </button>
              <button 
                onClick={handleNext}
                className="flex items-center gap-3 px-12 py-5 bg-indigo-600 text-white rounded-3xl text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-indigo-600/20 hover:scale-105 active:scale-95 transition-all group"
              >
                Review Transmission <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div 
            key="step3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="glass-panel p-12 rounded-[4rem] border-brand-border space-y-12 text-center"
          >
            <div className="w-24 h-24 bg-brand-accent/20 border border-brand-accent/30 rounded-full flex items-center justify-center mx-auto text-brand-accent shadow-2xl shadow-brand-accent/10">
              <Trophy size={48} />
            </div>

            <div className="space-y-4">
              <h3 className="text-5xl font-black text-white italic uppercase tracking-tighter">Ready for Uplink</h3>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic max-w-lg mx-auto leading-relaxed">
                You are about to project <span className="text-white">{mainEvent.name}</span> with {subEvents.length} operational sectors across the Eventify network. This action will broadcast to all regional nodes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="p-6 bg-white/5 border border-white/5 rounded-3xl space-y-2">
                <Calendar size={20} className="mx-auto text-indigo-400 mb-2" />
                <p className="text-[8px] font-black text-slate-600 uppercase italic">Main Deployment</p>
                <p className="text-sm font-black text-white italic uppercase">{mainEvent.date}</p>
              </div>
              <div className="p-6 bg-white/5 border border-white/5 rounded-3xl space-y-2">
                <MapPin size={20} className="mx-auto text-brand-accent mb-2" />
                <p className="text-[8px] font-black text-slate-600 uppercase italic">Operational Base</p>
                <p className="text-sm font-black text-white italic uppercase">{mainEvent.collegeName}</p>
              </div>
              <div className="p-6 bg-white/5 border border-white/5 rounded-3xl space-y-2">
                <Users size={20} className="mx-auto text-emerald-400 mb-2" />
                <p className="text-[8px] font-black text-slate-600 uppercase italic">Staff Architecture</p>
                <p className="text-sm font-black text-white italic uppercase">{mainEvent.totalOrganizers} Total</p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4 pt-8">
              <button 
                onClick={handleFinalSave}
                disabled={isSaving}
                className="w-full max-w-md py-6 bg-brand-accent text-white rounded-3xl text-sm font-black uppercase tracking-[0.2em] shadow-2xl shadow-brand-accent/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
              >
                {isSaving ? "Synchronizing..." : <><CheckCircle2 size={24} /> Transmit Main Node</>}
              </button>
              <button 
                onClick={handleBack}
                className="text-[10px] font-black text-slate-600 hover:text-white uppercase tracking-widest italic transition-colors"
              >
                Modify Transmission Parameters
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

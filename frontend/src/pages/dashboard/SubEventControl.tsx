import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Edit2, Settings, Download, Activity, Info, Upload, BookOpen, FileText, Check, AlertCircle } from "lucide-react";
import { SubEvent } from "../../types";
import { useSubEventControl } from "../../hooks/useSubEventControl";

interface SubEventControlProps {
  subEvent: SubEvent;
  onBack: () => void;
  role: string;
  canEdit: boolean;
}

export const SubEventControl = ({ subEvent: initialSubEvent, onBack, role, canEdit }: SubEventControlProps) => {
  const {
    activePane,
    setActivePane,
    isEditModalOpen,
    setIsEditModalOpen,
    participants,
    participantsLoading,
    ruleBook,
    ruleBookLoading,
    isSavingRules,
    isPublishing,
    hasSavedLocally,
    rulesDraft,
    setRulesDraft,
    editForm,
    setEditForm,
    isUpdating,
    message,
    setMessage,
    isPosting,
    isUploadingImage,
    currentSubEvent,
    handleSaveRules,
    handlePublishRules,
    handleUpdate,
    handleDownloadList,
    handlePostAnnouncement,
    handleUploadPoster
  } = useSubEventControl(initialSubEvent);

  const handlePosterUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        handleUploadPoster(file);
      }
    };
    input.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setRulesDraft({
        ...rulesDraft,
        rulesType: "file",
        fileName: file.name,
        fileUrl: URL.createObjectURL(file) 
      });
    }
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
      <button onClick={onBack} className="flex items-center gap-2 text-brand-text-secondary hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest">
         <ArrowLeft size={16} /> Return to Hub
      </button>

      <div className="flex flex-col lg:flex-row justify-between items-start gap-6 md:gap-8">
         <div className="space-y-2 md:space-y-3">
            <div className="flex flex-wrap items-center gap-3">
               <div className="px-3 py-1 bg-brand-accent text-white text-[8px] font-black uppercase tracking-widest rounded-full italic shadow-lg shrink-0">Status: Active</div>
               <span className="text-[9px] md:text-[10px] font-bold text-brand-text-secondary uppercase tracking-widest italic truncate">{currentSubEvent.venue}</span>
            </div>
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-white italic uppercase tracking-tighter leading-tight md:leading-none">{currentSubEvent.name}</h3>
         </div>
         <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full lg:w-auto">
            {canEdit && (
               <button 
                onClick={() => setIsEditModalOpen(true)}
                className="flex-1 lg:flex-none px-6 md:px-8 py-3.5 md:py-4 bg-brand-glass border border-brand-border text-white rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-bold uppercase tracking-widest hover:bg-brand-accent transition-all flex items-center justify-center gap-3"
               >
                  <Edit2 className="w-3.5 h-3.5 md:w-4 md:h-4" /> Update Details
               </button>
            )}
            <button className="hidden sm:flex w-12 h-12 glass-panel rounded-2xl items-center justify-center text-brand-text-secondary hover:text-white transition-all shrink-0">
               <Settings size={20} />
            </button>
         </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 md:gap-8 border-b border-brand-border overflow-x-auto no-scrollbar scroll-smooth pb-0.5">
         {[
           { id: 'details', label: 'Details', access: true },
           { id: 'participants', label: 'Participants', access: true },
           { id: 'rulebook', label: 'Rule Book', access: true },
           { id: 'announcements', label: 'Broadcast', access: role !== 'sub_organizer' }
         ].filter(t => t.access).map(t => (
           <button 
             key={t.id}
             onClick={() => setActivePane(t.id as any)}
             className={`pb-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all relative shrink-0 ${activePane === t.id ? 'text-brand-accent' : 'text-brand-text-secondary hover:text-brand-text-primary'}`}
           >
              {t.label}
              {activePane === t.id && <motion.div layoutId="tab" className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-accent" />}
           </button>
         ))}
      </div>

      <div className="min-h-[400px]">
         {activePane === 'details' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <div className="space-y-8">
                 <div className="glass-panel p-10 rounded-[3rem] border-brand-border space-y-6">
                    <h4 className="text-lg md:text-xl font-black text-white italic uppercase tracking-tighter">Information Overview</h4>
                    <p className="text-xs md:text-sm text-brand-text-secondary leading-relaxed">{currentSubEvent.description}</p>
                    <div className="pt-6 grid grid-cols-2 gap-8">
                       <div>
                          <p className="text-[9px] font-black text-brand-text-secondary uppercase tracking-widest mb-1 italic">Total Attendees</p>
                          <p className="text-lg font-black text-white uppercase italic">{currentSubEvent.participantCount}</p>
                       </div>
                       <div>
                          <p className="text-[9px] font-black text-brand-text-secondary uppercase tracking-widest mb-1 italic">Max Capacity</p>
                          <p className="text-lg font-black text-white uppercase italic">150 Slots</p>
                       </div>
                    </div>
                 </div>

                 <div className="glass-panel p-10 rounded-[3rem] border-brand-border space-y-6">
                    <h4 className="text-xl font-black text-white italic uppercase tracking-tighter text-amber-500">Guidelines & Instructions</h4>
                    <div className="space-y-4">
                       <div>
                          <p className="text-[9px] font-black text-brand-text-secondary uppercase tracking-widest mb-2">Rules of Engagement</p>
                          <p className="text-sm text-brand-text-secondary whitespace-pre-line">{currentSubEvent.rules || "No specific rules defined yet."}</p>
                       </div>
                       <div className="pt-4 border-t border-white/5">
                          <p className="text-[9px] font-black text-brand-text-secondary uppercase tracking-widest mb-2">Technical Instructions</p>
                          <p className="text-sm text-brand-text-secondary whitespace-pre-line">{currentSubEvent.instructions || "No specific instructions defined yet."}</p>
                       </div>
                    </div>
                 </div>
               </div>

                <div className="space-y-6 md:space-y-8">
                  {/* Visual Identity Section */}
                  <div className="glass-panel p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border-brand-border space-y-6">
                     <div className="flex items-center justify-between">
                        <h4 className="text-lg font-black text-white italic uppercase tracking-tighter">Visual Identity</h4>
                        <div className="flex items-center gap-2">
                           <Activity size={14} className={`text-brand-accent ${isUploadingImage ? 'animate-spin' : ''}`} />
                           <span className="text-[8px] font-bold text-brand-text-secondary uppercase tracking-widest">{isUploadingImage ? 'Uploading...' : 'Live Node'}</span>
                        </div>
                     </div>
                     
                     <div className="relative group overflow-hidden rounded-2xl md:rounded-[2.5rem] bg-white/5 border border-white/5 aspect-video flex items-center justify-center">
                        {currentSubEvent.posterUrl ? (
                          <img src={currentSubEvent.posterUrl} alt="Poster" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                        ) : (
                          <div className="text-center p-6">
                            <Upload size={32} className="mx-auto text-brand-text-secondary/30 mb-2" />
                            <p className="text-[9px] font-bold text-brand-text-secondary uppercase tracking-widest">No Poster Assigned</p>
                          </div>
                        )}
                        
                        {canEdit && (
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button 
                              onClick={handlePosterUpload}
                              className="px-6 py-3 bg-brand-accent text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2"
                            >
                              <Upload size={14} /> {currentSubEvent.posterUrl ? 'Update Poster' : 'Upload Poster'}
                            </button>
                          </div>
                        )}
                     </div>
                     <p className="text-[8px] md:text-[9px] text-brand-text-secondary font-medium italic opacity-70 leading-relaxed">
                        This poster represents the visual identity of the sub-event across the network.
                     </p>
                  </div>

                  {/* Team Leads Section */}
                  <div className="glass-panel p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border-brand-border space-y-6">
                     <h4 className="text-lg font-black text-white italic uppercase tracking-tighter">Assigned Personnel</h4>
                     <div className="space-y-4 md:space-y-5">
                        {currentSubEvent.teamLeads.map(tl => (
                           <div key={tl.id} className="flex items-center gap-4 md:gap-5 p-4 md:p-5 rounded-2xl md:rounded-[2.5rem] bg-white/5 border border-white/5">
                              <div className="w-12 h-12 rounded-2xl bg-brand-accent/20 border border-brand-accent/30 flex items-center justify-center shrink-0">
                                 {tl.imageUrl ? (
                                    <img src={tl.imageUrl} alt={tl.name} className="w-full h-full object-cover rounded-2xl" referrerPolicy="no-referrer" />
                                 ) : (
                                    <span className="text-lg font-black text-brand-accent italic">{tl.name.substring(0, 1)}</span>
                                 )}
                              </div>
                              <div className="overflow-hidden">
                                 <p className="text-sm font-black text-white italic uppercase truncate">{tl.name}</p>
                                 <p className="text-[9px] font-black text-brand-accent uppercase tracking-widest">Verified Lead</p>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </motion.div>
         )}

         {activePane === 'participants' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel p-8 rounded-[3rem] border-brand-border">
               <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
                  <h4 className="text-xl font-black text-white italic uppercase tracking-tighter">Active Participants</h4>
                  <button 
                    onClick={handleDownloadList}
                    disabled={participantsLoading || participants.length === 0}
                    className="flex items-center gap-2 bg-brand-accent px-6 py-3 rounded-xl text-[10px] font-black text-white uppercase tracking-widest shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
                  >
                    <Download size={14} /> Download List (.xlsx)
                  </button>
               </div>
               <div className="space-y-4">
                  {participantsLoading ? (
                    <div className="py-20 flex flex-col items-center gap-4">
                       <Activity className="animate-spin text-brand-accent" size={32} />
                       <p className="text-[9px] font-black text-brand-text-secondary uppercase tracking-widest italic animate-pulse">Syncing Personnel Data...</p>
                    </div>
                  ) : participants.length > 0 ? (
                    participants.map(p => (
                      <div key={p.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/5 group hover:border-brand-accent/20 transition-all">
                         <div className="flex items-center gap-4 mb-4 sm:mb-0">
                            <div className="w-10 h-10 rounded-xl bg-brand-bg flex items-center justify-center text-white border border-brand-border font-black text-xs uppercase">{p.name.substring(0,2)}</div>
                            <div>
                               <p className="text-sm font-bold text-white uppercase italic">{p.name} <span className="text-[9px] text-brand-text-secondary not-italic ml-2 opacity-50">ID: {p.id}</span></p>
                               <div className="flex gap-4 mt-0.5">
                                 <p className="text-[10px] text-brand-text-secondary italic">{p.email}</p>
                                 <p className="text-[10px] text-brand-text-secondary italic">{p.phone}</p>
                               </div>
                            </div>
                         </div>
                         <div className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest ${p.status === 'Verified' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                            {p.status}
                         </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center py-20 text-brand-text-secondary italic uppercase text-[10px] font-bold tracking-widest">No active personnel detected.</p>
                  )}
               </div>
            </motion.div>
         )}

         {activePane === 'rulebook' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
               <div className="glass-panel p-10 rounded-[3rem] border-brand-border space-y-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                     <div>
                        <h4 className="text-xl font-black text-white italic uppercase tracking-tighter">Tactical Rule Book</h4>
                        <p className="text-[10px] font-bold text-brand-text-secondary uppercase tracking-widest mt-1">Configure parameters for all participants</p>
                     </div>
                     <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10">
                        <button 
                           onClick={() => setRulesDraft({...rulesDraft, rulesType: 'text'})}
                           className={`px-6 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${rulesDraft.rulesType === 'text' ? 'bg-brand-accent text-white shadow-lg' : 'text-brand-text-secondary hover:text-white'}`}
                        >
                           Custom Text
                        </button>
                        <button 
                           onClick={() => setRulesDraft({...rulesDraft, rulesType: 'file'})}
                           className={`px-6 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${rulesDraft.rulesType === 'file' ? 'bg-brand-accent text-white shadow-lg' : 'text-brand-text-secondary hover:text-white'}`}
                        >
                           Upload Manual
                        </button>
                     </div>
                  </div>

                  <div className="pt-6 border-t border-white/5">
                     {rulesDraft.rulesType === 'text' ? (
                        <div className="space-y-4">
                           <label className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest italic ml-4">Rules Content</label>
                           <textarea 
                             value={rulesDraft.rulesContent}
                             onChange={(e) => setRulesDraft({...rulesDraft, rulesContent: e.target.value})}
                             placeholder="Define rules here..."
                             className="w-full h-64 bg-white/5 border border-white/10 rounded-[2rem] p-8 text-sm text-white focus:border-brand-accent outline-none font-medium resize-none shadow-inner"
                           />
                        </div>
                     ) : (
                        <div className="py-20 flex flex-col items-center gap-6 border-2 border-dashed border-white/10 rounded-[3rem] bg-white/[0.02]">
                           <div className="w-20 h-20 bg-brand-accent/10 rounded-[2rem] flex items-center justify-center text-brand-accent">
                              {rulesDraft.fileName ? <FileText size={40} /> : <Upload size={40} />}
                           </div>
                           <div className="text-center">
                              {rulesDraft.fileName ? (
                                <p className="text-white font-bold uppercase italic">{rulesDraft.fileName}</p>
                              ) : (
                                <>
                                  <p className="text-white font-black uppercase italic tracking-tighter">Upload Rules Manual (PDF/DOC)</p>
                                  <p className="text-[10px] text-brand-text-secondary uppercase tracking-widest mt-1">Maximum file size: 10MB</p>
                                </>
                              )}
                           </div>
                           <label className="px-10 py-4 bg-white text-slate-950 rounded-2xl text-[10px] font-black uppercase tracking-widest cursor-pointer hover:scale-105 transition-all">
                              {rulesDraft.fileName ? "Change File" : "Select Security File"}
                              <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
                           </label>
                        </div>
                     )}
                  </div>

                  <div className="flex justify-end gap-4 pt-6 border-t border-white/5">
                     <button 
                       onClick={handleSaveRules}
                       disabled={isSavingRules}
                       className="px-8 py-4 glass-panel border-brand-border text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all rounded-2xl"
                     >
                        {isSavingRules ? "Saving..." : "Save Draft"}
                     </button>
                     <button 
                       onClick={handlePublishRules}
                       disabled={isPublishing || (!hasSavedLocally && ruleBook?.isPublished)}
                       className="px-8 py-4 bg-brand-accent text-white text-[10px] font-black uppercase tracking-widest hover:bg-brand-accent/80 transition-all rounded-2xl shadow-lg flex items-center gap-2"
                     >
                        {isPublishing ? "Syncing..." : <><Check size={16} /> Finalize & Publish</>}
                     </button>
                  </div>

                  {ruleBook?.isPublished && !hasSavedLocally && (
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3">
                       <Check size={16} className="text-emerald-400" />
                       <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Rule Book is currently synchronized and live for all participants.</p>
                    </div>
                  )}
                  {hasSavedLocally && (
                    <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center gap-3">
                       <AlertCircle size={16} className="text-amber-400" />
                       <p className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">You have unpublished changes. Participants are viewing the previous version.</p>
                    </div>
                  )}
               </div>
            </motion.div>
         )}

         {activePane === 'announcements' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
               <div className="glass-panel p-10 rounded-[3rem] border-brand-border space-y-6">
                  <h4 className="text-xl font-black text-white italic uppercase tracking-tighter">Manual Broadcast Relay</h4>
                  <div className="space-y-4">
                     <textarea 
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Broadcast critical transmission to all sub-event participants..."
                        className="w-full h-32 bg-white/5 border border-white/10 rounded-[2rem] p-8 text-sm text-white focus:border-brand-accent outline-none font-medium resize-none shadow-inner"
                     />
                     <div className="flex justify-end">
                        <button 
                          onClick={handlePostAnnouncement}
                          disabled={isPosting || !message.trim()}
                          className="px-10 py-4 bg-brand-accent text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:scale-105 transition-all disabled:opacity-50"
                        >
                           {isPosting ? "Transmitting..." : "Relay Broadcast"}
                        </button>
                     </div>
                  </div>
               </div>
            </motion.div>
         )}
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-10">
            <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
               className="absolute inset-0 bg-brand-bg/80 backdrop-blur-md"
               onClick={() => setIsEditModalOpen(false)}
            />
            <motion.div 
               initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
               className="glass-panel w-full max-w-2xl p-8 md:p-12 rounded-[3rem] md:rounded-[4rem] border-brand-border relative z-10 shadow-3xl overflow-y-auto max-h-[90vh]"
            >
               <div className="flex items-center justify-between mb-8">
                  <h4 className="text-2xl font-black text-white italic uppercase tracking-tighter">Update Parameters</h4>
                  <button onClick={() => setIsEditModalOpen(false)} className="text-brand-text-secondary hover:text-white transition-colors">
                     <X size={24} />
                  </button>
               </div>

               <form onSubmit={handleUpdate} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest ml-4">Operation Date</label>
                        <input type="text" value={editForm.date} onChange={(e) => setEditForm({...editForm, date: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:border-brand-accent outline-none" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest ml-4">Time Window</label>
                        <input type="text" value={editForm.time} onChange={(e) => setEditForm({...editForm, time: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:border-brand-accent outline-none" />
                     </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest ml-4">Designated Venue</label>
                     <input type="text" value={editForm.venue} onChange={(e) => setEditForm({...editForm, venue: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:border-brand-accent outline-none" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest ml-4">General Rules</label>
                     <textarea value={editForm.rules} onChange={(e) => setEditForm({...editForm, rules: e.target.value})} className="w-full h-24 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:border-brand-accent outline-none resize-none" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest ml-4">Sector Instructions</label>
                     <textarea value={editForm.instructions} onChange={(e) => setEditForm({...editForm, instructions: e.target.value})} className="w-full h-24 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:border-brand-accent outline-none resize-none" />
                  </div>
                  <div className="pt-6">
                     <button 
                       type="submit" 
                       disabled={isUpdating}
                       className="w-full py-5 bg-brand-accent text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
                     >
                        {isUpdating ? "Synchronizing..." : "Overwrites Current Node"}
                     </button>
                  </div>
               </form>
            </motion.div>
         </div>
      )}
    </motion.div>
  );
};

const X = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

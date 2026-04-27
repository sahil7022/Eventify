import React, { useState, useEffect } from "react";
import { User, Building2, GraduationCap, Phone, Sparkles, Save, IdCard, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { UserProfile } from "../types";
import { useProfile } from "../hooks/useProfile";

export default function Profile() {
  const {
    profile,
    isEditing,
    setIsEditing,
    tempProfile,
    setTempProfile,
    newInterest,
    setNewInterest,
    handleSave,
    handlePhotoChange,
    addInterest,
    removeInterest
  } = useProfile();

  return (
    <div className="p-4 md:p-6 lg:p-10 space-y-6 md:space-y-10 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <div className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-1">Personal Terminal</div>
           <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter text-white">Identity Node</h2>
        </div>
        <button 
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className={`flex items-center justify-center md:justify-start gap-3 px-6 md:px-8 py-3.5 md:py-4 rounded-[1.2rem] md:rounded-[1.5rem] font-bold uppercase text-[9px] md:text-[10px] tracking-widest transition-all shadow-xl ${isEditing ? 'bg-indigo-500 text-white shadow-indigo-500/20' : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white'}`}
        >
          {isEditing ? <Save size={16} /> : <User size={16} />}
          {isEditing ? "Save Changes" : "Edit Profile"}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-10">
        {/* Profile Card */}
        <div className="glass-panel p-6 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] flex flex-col items-center text-center space-y-6 md:space-y-8 bg-gradient-to-b from-indigo-500/5 to-transparent relative overflow-hidden group border-white/5 shadow-2xl">
           <div className="relative">
              <div className="w-32 h-32 md:w-48 md:h-48 rounded-[2.5rem] md:rounded-[4rem] bg-indigo-500/20 border-2 border-indigo-500/30 flex items-center justify-center text-white overflow-hidden shadow-2xl relative">
                {(isEditing ? tempProfile.imageUrl : profile.imageUrl) ? (
                  <img src={isEditing ? tempProfile.imageUrl : profile.imageUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl md:text-6xl font-black italic">{profile.name.substring(0, 1)}</span>
                )}
              </div>
              
              {isEditing && (
                <label className="absolute -bottom-2 -right-2 p-3 md:p-4 bg-indigo-500 text-white rounded-2xl shadow-xl cursor-pointer hover:scale-110 transition-transform">
                   <Sparkles size={16} />
                   <input type="file" className="hidden" onChange={handlePhotoChange} accept="image/*" />
                </label>
              )}
           </div>
           
           {isEditing && (
             <div className="text-[9px] font-black text-indigo-400 uppercase tracking-widest italic animate-pulse">
               Identity Encryption Active
             </div>
           )}

           <div className="space-y-2">
              <h3 className="text-2xl md:text-3xl font-black text-white italic uppercase tracking-tighter">{profile.name}</h3>
              <p className="text-indigo-400 font-bold uppercase text-[9px] md:text-[10px] tracking-[0.2em]">{profile.role === 'admin' ? 'Strategic Admin' : 'Standard Node'}</p>
           </div>
           
           <div className="w-full pt-6 md:pt-8 border-t border-white/5 grid grid-cols-2 gap-4">
              <div className="text-left">
                <p className="text-[8px] md:text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1 italic">Node Health</p>
                <p className="text-white font-bold text-base md:text-lg italic uppercase tracking-tight">Optimal</p>
              </div>
              <div className="text-right">
                <p className="text-[8px] md:text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1 italic">Trust Score</p>
                <p className="text-indigo-400 font-bold text-base md:text-lg italic uppercase tracking-tight">98.4</p>
              </div>
           </div>
        </div>

        {/* Details Form/Display */}
        <div className="xl:col-span-2 glass-panel p-6 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] space-y-8 md:space-y-12 border-white/5 shadow-3xl bg-slate-900/40 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
             <div className="space-y-3 md:space-y-4">
                <label className="flex items-center gap-2 text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                  <User size={12} className="text-indigo-500" /> Full Name
                </label>
                {isEditing ? (
                  <input 
                    value={tempProfile.name} 
                    onChange={e => setTempProfile({ ...tempProfile, name: e.target.value })}
                    className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl text-white outline-none focus:border-indigo-500 transition-all font-bold text-sm"
                  />
                ) : (
                  <p className="px-5 py-3.5 bg-white/5 border border-transparent rounded-xl md:rounded-2xl text-white font-bold italic tracking-tight text-sm">{profile.name}</p>
                )}
             </div>

             <div className="space-y-3 md:space-y-4">
                <label className="flex items-center gap-2 text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                  <Building2 size={12} className="text-indigo-500" /> College
                </label>
                {isEditing ? (
                  <input 
                    value={tempProfile.college} 
                    onChange={e => setTempProfile({ ...tempProfile, college: e.target.value })}
                    className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl text-white outline-none focus:border-indigo-500 transition-all font-bold text-sm"
                  />
                ) : (
                  <p className="px-5 py-3.5 bg-white/5 border border-transparent rounded-xl md:rounded-2xl text-white font-bold italic tracking-tight text-sm">{profile.college}</p>
                )}
             </div>

             <div className="space-y-3 md:space-y-4">
                <label className="flex items-center gap-2 text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                  <GraduationCap size={12} className="text-indigo-500" /> Department
                </label>
                {isEditing ? (
                  <input 
                    value={tempProfile.department} 
                    onChange={e => setTempProfile({ ...tempProfile, department: e.target.value })}
                    className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl text-white outline-none focus:border-indigo-500 transition-all font-bold text-sm"
                  />
                ) : (
                  <p className="px-5 py-3.5 bg-white/5 border border-transparent rounded-xl md:rounded-2xl text-white font-bold italic tracking-tight text-sm">{profile.department}</p>
                )}
             </div>

             <div className="space-y-3 md:space-y-4">
                <label className="flex items-center gap-2 text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                  <Phone size={12} className="text-indigo-500" /> Mobile Number
                </label>
                {isEditing ? (
                  <input 
                    value={tempProfile.mobile} 
                    onChange={e => setTempProfile({ ...tempProfile, mobile: e.target.value })}
                    className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl text-white outline-none focus:border-indigo-500 transition-all font-bold text-sm"
                  />
                ) : (
                  <p className="px-5 py-3.5 bg-white/5 border border-transparent rounded-xl md:rounded-2xl text-white font-bold italic tracking-tight text-sm">{profile.mobile}</p>
                )}
             </div>
          </div>

          <div className="space-y-4 md:space-y-6 pt-6 md:pt-10 border-t border-white/5">
             <label className="flex items-center gap-2 text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
               <Heart size={12} className="text-indigo-500" /> Interest Spectrum
             </label>
             <div className="flex flex-wrap gap-2 md:gap-4">
                {(isEditing ? tempProfile.interests : profile.interests).map(tag => (
                  <div key={tag} className="px-4 md:px-6 py-2 md:py-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl md:rounded-2xl text-[8px] md:text-[10px] font-black uppercase tracking-widest flex items-center gap-2 md:gap-3">
                    {tag}
                    {isEditing && (
                      <button onClick={() => removeInterest(tag)} className="hover:text-red-400 transition-colors">
                        ×
                      </button>
                    )}
                  </div>
                ))}
                {isEditing && (
                  <div className="flex gap-2">
                    <input 
                      placeholder="Add logic cell..." 
                      value={newInterest}
                      onChange={e => setNewInterest(e.target.value)}
                      onKeyPress={e => e.key === 'Enter' && addInterest()}
                      className="px-4 md:px-6 py-2 md:py-3 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl text-white outline-none focus:border-indigo-500 font-bold text-[8px] md:text-[10px] uppercase w-32 md:w-40"
                    />
                    <button onClick={addInterest} className="px-3 md:px-4 py-2 md:py-3 bg-indigo-500 text-white rounded-xl md:rounded-2xl hover:bg-indigo-600 transition-all shadow-lg">+</button>
                  </div>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  UserPlus, 
  Lock, 
  Mail, 
  AlertTriangle, 
  CheckCircle2,
  X,
  ShieldAlert
} from "lucide-react";

interface SecuritySettingsProps {
  promoteToAdmin: (email: string) => Promise<boolean>;
}

export const SecuritySettings = ({ promoteToAdmin }: SecuritySettingsProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    setIsProcessing(true);
    const success = await promoteToAdmin(email);
    if (success) {
      setEmail("");
      setPassword("");
      setShowConfirm(false);
    }
    setIsProcessing(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-12">
      <section className="glass-panel p-10 rounded-[3rem] border-brand-border space-y-8 relative overflow-hidden">
         <div className="absolute top-0 right-0 p-16 bg-brand-accent/5 rounded-full blur-3xl -mr-10 -mt-10" />
         
         <div className="text-center space-y-3 relative z-10">
            <div className="w-16 h-16 bg-brand-accent/10 border border-brand-accent/20 rounded-2xl flex items-center justify-center mx-auto text-brand-accent mb-6 shadow-xl shadow-brand-accent/5">
               <ShieldCheck size={32} />
            </div>
            <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Admin Settings</h3>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic max-w-sm mx-auto">Give admin access to another user. This lets them manage everything.</p>
         </div>

         <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="space-y-2">
               <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic ml-4">User Email</label>
               <div className="relative">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input 
                    type="email" 
                    required
                    placeholder="user@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-16 pr-8 py-5 bg-white/5 border border-white/10 rounded-3xl text-sm font-bold text-white outline-none focus:border-brand-accent transition-all italic placeholder:text-slate-700"
                  />
               </div>
            </div>

            <div className="space-y-2">
               <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic ml-4">Confirm your password</label>
               <div className="relative">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input 
                    type="password" 
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-16 pr-8 py-5 bg-white/5 border border-white/10 rounded-3xl text-sm font-bold text-white outline-none focus:border-brand-accent transition-all italic placeholder:text-slate-700"
                  />
               </div>
            </div>

            <button 
              type="submit"
              className="w-full py-5 bg-brand-accent text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-brand-accent/20 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all mt-4"
            >
               Make Admin <UserPlus size={18} />
            </button>
         </form>

         <div className="pt-6 border-t border-white/5 flex items-center gap-3 justify-center">
            <ShieldAlert size={14} className="text-amber-500" />
            <p className="text-[8px] font-bold text-slate-600 uppercase italic tracking-widest">All changes are recorded for safety.</p>
         </div>
      </section>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowConfirm(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md glass-panel p-10 rounded-[3.5rem] border-amber-500/30 text-center space-y-8 bg-slate-950 shadow-2xl shadow-amber-500/10"
            >
               <div className="w-20 h-20 bg-amber-500/10 border border-amber-500/20 rounded-3xl flex items-center justify-center mx-auto text-amber-500">
                  <AlertTriangle size={40} />
               </div>
               
               <div className="space-y-4">
                  <h4 className="text-3xl font-black text-white italic uppercase tracking-tighter">Are you sure?</h4>
                  <p className="text-xs font-medium text-slate-400 leading-relaxed">
                     Are you sure you want to make <span className="text-white font-black">{email}</span> an admin? 
                     They will be able to change everything.
                  </p>
               </div>

               <div className="flex flex-col gap-3 pt-4">
                  <button 
                    disabled={isProcessing}
                    onClick={handleConfirm}
                    className="w-full py-5 bg-amber-500 text-white rounded-3xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-amber-500/20 hover:scale-105 transition-all"
                  >
                     {isProcessing ? "Saving..." : <>Make Admin <CheckCircle2 size={18} /></>}
                  </button>
                  <button 
                    onClick={() => setShowConfirm(false)}
                    className="w-full py-5 bg-white/5 text-slate-400 rounded-3xl text-[10px] font-black uppercase tracking-widest hover:text-white transition-all"
                  >
                     Cancel
                  </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

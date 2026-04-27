import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, ArrowRight, ShieldCheck, ChevronLeft } from "lucide-react";
import { useNotification } from "../contexts/NotificationContext";

export default function Reset() {
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) { showNotification('error', 'Enter a new password.'); return; }
    setLoading(true);
    setTimeout(() => {
      showNotification('success', 'Done successfully!');
      navigate("/login");
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] font-sans relative overflow-hidden px-6">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="glass-panel p-8 lg:p-12 rounded-[3rem] shadow-2xl space-y-12">
          
          <div className="flex flex-col items-center text-center gap-6">
            <div className="w-20 h-20 bg-indigo-500/10 border border-indigo-500/20 rounded-[2rem] flex items-center justify-center shadow-inner">
              <ShieldCheck size={40} className="text-indigo-400" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-white italic uppercase tracking-tighter">Reset Key</h1>
              <p className="text-slate-500 font-medium">Define your new access sequence.</p>
            </div>
          </div>

          <form onSubmit={onReset} className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">New Access Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 transition-colors group-focus-within:text-indigo-500" size={18} />
                <input
                  type="password"
                  placeholder="••••••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-indigo-500 transition-all text-white font-medium shadow-inner"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-indigo-500 text-white rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-indigo-600 active:scale-95 transition-all shadow-2xl shadow-indigo-500/20 flex items-center justify-center gap-3 group"
            >
              {loading ? "Updating Node..." : (
                <>
                  Overwrite Key <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-6 border-t border-white/5">
            <button
              onClick={() => navigate("/login")}
              className="text-[10px] font-bold text-slate-500 hover:text-white uppercase tracking-widest transition-colors flex items-center justify-center gap-2 mx-auto"
            >
              <ChevronLeft size={16} /> Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

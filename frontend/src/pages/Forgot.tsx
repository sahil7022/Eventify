import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, ChevronLeft, ArrowRight, ShieldCheck } from "lucide-react";
import { useNotification } from "../contexts/NotificationContext";

export default function Forgot() {
  const { showNotification } = useNotification();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { showNotification('error', 'Enter your email.'); return; }
    setLoading(true);
    setTimeout(() => {
      showNotification('success', 'Reset link sent.');
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] font-sans relative overflow-hidden px-6">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="glass-panel p-8 lg:p-12 rounded-[3rem] shadow-2xl space-y-10">
          <button 
            onClick={() => navigate("/login")}
            className="flex items-center gap-3 text-slate-500 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest group"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Base
          </button>

          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-white italic uppercase tracking-tighter">Forgot Key?</h1>
            <p className="text-slate-500 font-medium leading-relaxed">Enter your institutional email to restore your connection.</p>
          </div>

          <form onSubmit={onForgot} className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 transition-colors group-focus-within:text-indigo-500" size={18} />
                <input
                  type="email"
                  placeholder="name@college.edu"
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-indigo-500 transition-all text-white font-medium shadow-inner"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-indigo-500 text-white rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-indigo-600 active:scale-95 transition-all shadow-2xl shadow-indigo-500/20 flex items-center justify-center gap-3 group"
            >
              {loading ? "Sending..." : (
                <>
                  Request Reset <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="p-6 glass-item border-white/5 rounded-2xl">
            <p className="text-[10px] text-slate-500 font-bold leading-relaxed uppercase italic">
              Verification will be handled via your campus directory link. Ensure your college email is active.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

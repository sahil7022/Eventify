import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, ShieldCheck, Zap } from "lucide-react";
import { AnimatedBackground } from "../components/ui/AnimatedBackground";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen text-slate-100 overflow-hidden font-sans">
      <AnimatedBackground />

      <div className="relative z-10 flex flex-col min-h-screen">
        <nav className="flex justify-between items-center px-6 md:px-16 py-6 md:py-8">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-indigo-500 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles size={16} className="text-white fill-current" />
            </div>
            <span className="text-xl md:text-2xl font-bold text-white uppercase italic">Eventify</span>
          </div>

          <div className="flex gap-4 md:gap-8 items-center">
            <button
              onClick={() => navigate("/login")}
              className="text-slate-400 hover:text-white font-bold text-[10px] md:text-sm uppercase tracking-widest transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="px-4 py-2 md:px-6 md:py-2.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-lg md:rounded-xl font-bold text-[10px] md:text-sm uppercase tracking-widest hover:bg-indigo-500/20 transition-all"
            >
              Register
            </button>
          </div>
        </nav>

        <main className="flex-1 flex flex-col items-center justify-center text-center px-6 max-w-5xl mx-auto py-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-6 md:mb-8 text-center justify-center">
            <Sparkles size={12} /> College Event Platform
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight mb-6 md:mb-8">
            Find and Join <br className="hidden md:block"/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-400 to-indigo-500">Campus Events easily.</span>
          </h1>

          <p className="max-w-2xl text-base md:text-lg text-slate-400 font-medium leading-relaxed mb-10 md:mb-12">
            The best platform for discovering college events, managing your bookings, and connecting with students.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 w-full sm:w-auto">
            <button
              onClick={() => navigate("/login")}
              className="group px-8 py-4 md:px-10 md:py-5 bg-indigo-500 text-white rounded-xl md:rounded-2xl font-bold text-xs md:text-sm uppercase tracking-widest hover:bg-indigo-600 transition-all flex items-center justify-center gap-3"
            >
              Explore <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate("/register")}
              className="px-8 py-4 md:px-10 md:py-5 glass-panel rounded-xl md:rounded-2xl font-bold text-xs md:text-sm uppercase tracking-widest hover:bg-white/5 transition-all text-white"
            >
              Create Account
            </button>
          </div>
        </main>

        <footer className="px-6 md:px-16 py-8 md:py-12 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-white/5">
          <div className="flex gap-6 md:gap-10">
            <div className="flex items-center gap-2">
              <Zap size={14} className="text-indigo-400" />
              <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-slate-500 whitespace-nowrap">Fast Access</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-indigo-400" />
              <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-slate-500 whitespace-nowrap">Verified Users</span>
            </div>
          </div>
          <div className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-slate-600">
            © Eventify all rights reserved
          </div>
        </footer>
      </div>
    </div>
  );
}

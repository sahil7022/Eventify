import React from "react";
import { Home, Calendar, Shield, Sparkles } from "lucide-react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

export default function FloatingNav() {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 lg:hidden w-auto">
      <div className="flex items-center gap-8 px-8 py-3 rounded-3xl 
        bg-[#021011]/90 backdrop-blur-2xl border border-[var(--border)] 
        shadow-[0_10px_40px_rgba(0,0,0,0.5),0_0_20px_rgba(0,243,255,0.1)]">
        <FloatingLink to="/dashboard" icon={<span>🏠</span>} label="Home" />
        <FloatingLink to="/events" icon={<span>📅</span>} label="Events" />
        <FloatingLink to="/admin" icon={<span>🛡</span>} label="Admin" />
        <FloatingLink to="/ai" icon={<span>✦</span>} label="AI" />
      </div>
    </div>
  );
}

function FloatingLink({ to, icon, label }: { to: string, icon: React.ReactNode, label: string }) {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => `
        flex flex-col items-center gap-1 transition-all duration-300
        ${isActive ? "text-brand-cyan" : "text-[var(--text-dim)] hover:text-white"}
      `}
    >
      <span className="text-xl">{icon}</span>
      <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
    </NavLink>
  );
}

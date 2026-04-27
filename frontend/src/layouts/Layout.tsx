import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { UserProfile } from "../types";

export default function Layout({
  children,
  user,
}: {
  children: React.ReactNode;
  user: UserProfile | null;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#0f172a] text-[#f1f5f9] overflow-hidden font-sans">
      
      {/* 📱 Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      <Sidebar 
        user={user} 
        isMobileOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <Header 
          onMenuClick={() => setIsMobileMenuOpen(true)} 
        />

        <div className="flex-1 overflow-y-auto bg-slate-900/10 relative custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
}

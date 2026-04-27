import React from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
}

export const MetricCard = ({ label, value, icon: Icon, color }: MetricCardProps) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="glass-panel p-6 rounded-3xl flex items-center gap-5 border-l-4" 
    style={{ borderLeftColor: color }}
  >
    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center" style={{ color }}>
      <Icon size={24} />
    </div>
    <div>
      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{label}</div>
      <div className="text-3xl font-black text-white mt-1 tracking-tighter italic">{value}</div>
    </div>
  </motion.div>
);

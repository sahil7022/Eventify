import React from 'react';
import { motion } from 'motion/react';

export const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">
      {/* Dynamic Gradient Base */}
      <div className="absolute inset-0 bg-[#020617]" />
      
      {/* Floating Glowing Orbs */}
      <motion.div 
        animate={{
          x: [0, 100, 0],
          y: [0, -100, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute -top-20 -left-20 w-[40rem] h-[40rem] bg-indigo-500/10 rounded-full blur-[120px]"
      />
      
      <motion.div 
        animate={{
          x: [0, -100, 0],
          y: [0, 150, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-1/2 -right-20 w-[35rem] h-[35rem] bg-brand-accent/10 rounded-full blur-[100px]"
      />

      <motion.div 
        animate={{
          x: [0, 50, 0],
          y: [0, 50, 0],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-0 left-1/4 w-[30rem] h-[30rem] bg-emerald-500/5 rounded-full blur-[90px]"
      />

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }}
      />
    </div>
  );
};

import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { ToastNotification, NotificationVariant } from '../types';

interface NotificationContextType {
  showNotification: (type: NotificationVariant, message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within NotificationProvider');
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<ToastNotification[]>([]);

  const showNotification = useCallback((type: NotificationVariant, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
  }, []);

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-4 w-full max-w-[320px] pointer-events-none">
        <AnimatePresence>
          {notifications.map((n) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className="pointer-events-auto"
            >
              <div className={`relative overflow-hidden glass-panel p-5 rounded-2xl border flex items-start gap-4 shadow-2xl ${
                n.type === 'success' ? 'border-emerald-500/30' : 
                n.type === 'error' ? 'border-rose-500/30' : 
                'border-brand-accent/30'
              }`}>
                {/* Glow Effect */}
                <div className={`absolute -inset-1 opacity-10 blur-xl ${
                  n.type === 'success' ? 'bg-emerald-500' : 
                  n.type === 'error' ? 'bg-rose-500' : 
                  'bg-brand-accent'
                }`} />

                <div className="relative z-10 shrink-0 mt-0.5">
                  {n.type === 'success' && <CheckCircle2 size={18} className="text-emerald-400" />}
                  {n.type === 'error' && <AlertCircle size={18} className="text-rose-400" />}
                  {n.type === 'info' && <Info size={18} className="text-brand-accent" />}
                </div>

                <div className="relative z-10 flex-1">
                  <p className="text-[11px] font-black uppercase tracking-widest text-white italic mb-1">
                    {n.type === 'success' ? 'System Sync Success' : n.type === 'error' ? 'Critical Failure' : 'Link Update'}
                  </p>
                  <p className="text-[10px] font-medium text-brand-text-secondary leading-relaxed uppercase tracking-tight">
                    {n.message}
                  </p>
                </div>

                <button 
                  onClick={() => removeNotification(n.id)}
                  className="relative z-10 shrink-0 text-white/20 hover:text-white transition-colors"
                >
                  <X size={14} />
                </button>

                {/* Progress Bar */}
                <motion.div 
                  initial={{ scaleX: 1 }}
                  animate={{ scaleX: 0 }}
                  transition={{ duration: 4, ease: "linear" }}
                  className={`absolute bottom-0 left-0 right-0 h-0.5 origin-left ${
                    n.type === 'success' ? 'bg-emerald-500/50' : 
                    n.type === 'error' ? 'bg-rose-500/50' : 
                    'bg-brand-accent/50'
                  }`}
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
};

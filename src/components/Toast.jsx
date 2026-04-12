import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

export default function Toast({ message, type = 'error', isVisible, onClose, duration = 5000 }) {
  useEffect(() => {
    if (isVisible && duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const config = {
    error: {
      icon: <AlertCircle className="h-5 w-5 text-rose-500" />,
      bg: 'bg-white dark:bg-slate-900',
      border: 'border-rose-200 dark:border-rose-800/50',
      shadow: 'shadow-rose-500/10',
      glow: 'bg-rose-500/10'
    },
    success: {
      icon: <CheckCircle className="h-5 w-5 text-emerald-500" />,
      bg: 'bg-white dark:bg-slate-900',
      border: 'border-emerald-200 dark:border-emerald-800/50',
      shadow: 'shadow-emerald-500/10',
      glow: 'bg-emerald-500/10'
    },
    info: {
      icon: <Info className="h-5 w-5 text-violet-500" />,
      bg: 'bg-white dark:bg-slate-900',
      border: 'border-violet-200 dark:border-violet-800/50',
      shadow: 'shadow-violet-500/10',
      glow: 'bg-violet-500/10'
    }
  };

  const style = config[type] || config.error;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9, x: '-50%' }}
          animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }}
          exit={{ opacity: 0, scale: 0.95, y: 10, x: '-50%' }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className={`fixed bottom-8 left-1/2 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-2xl border ${style.bg} ${style.border} ${style.shadow} backdrop-blur-xl max-w-md w-auto min-w-[320px]`}
        >
          <div className={`p-2 rounded-xl ${style.glow}`}>
            {style.icon}
          </div>
          
          <div className="flex-1">
            <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
              {type === 'error' ? 'Validation Error' : 'Notification'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {message}
            </p>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
          
          {/* Subtle Progress Bar */}
          <motion.div 
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: duration / 1000, ease: 'linear' }}
            className={`absolute bottom-0 left-4 right-4 h-0.5 rounded-full origin-left bg-current opacity-20`}
            style={{ color: type === 'error' ? '#f43f5e' : type === 'success' ? '#10b981' : '#8b5cf6' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

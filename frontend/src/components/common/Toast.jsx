import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

/**
 * PEOPLEPAY360 - TOAST NOTIFICATION COMPONENT
 */
const Toast = ({ message, type = 'success', onClose, duration = 4000 }) => {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const styles = {
    success: 'bg-emerald-800 text-white border-emerald-700',
    error: 'bg-rose-800 text-white border-rose-700',
    warning: 'bg-amber-800 text-white border-amber-700',
    info: 'bg-indigo-800 text-white border-indigo-700',
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-300" />,
    error: <AlertCircle className="w-5 h-5 text-rose-300" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-300" />,
    info: <Info className="w-5 h-5 text-indigo-300" />,
  };

  if (!message) return null;

  return (
    <div className={`fixed bottom-5 right-5 z-50 flex items-center space-x-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium animate-in fade-in slide-in-from-bottom-5 duration-200 ${styles[type]}`}>
      {icons[type]}
      <span className="text-white">{message}</span>
      <button onClick={onClose} className="p-1 hover:opacity-75 transition-opacity">
        <X className="w-4 h-4 text-white/80" />
      </button>
    </div>
  );
};

export default Toast;

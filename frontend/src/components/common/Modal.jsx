import React, { useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * PEOPLEPAY360 - REUSABLE MODAL DIALOG
 */
const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-xl' }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Dialog container */}
      <div className="flex min-h-full items-center justify-center p-3 sm:p-4">
        <div className={`relative w-full ${maxWidth} max-h-[92vh] flex flex-col transform overflow-hidden rounded-2xl bg-white p-4 sm:p-6 shadow-2xl transition-all border border-slate-200`}>
          <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-slate-100 shrink-0">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">{title}</h3>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="overflow-y-auto flex-1 pr-1">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;

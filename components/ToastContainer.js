'use client';

import React from 'react';
import { useAgri } from '@/context/AgriContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useAgri();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div 
      aria-live="polite"
      aria-atomic="true"
      className="fixed top-14 sm:top-16 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-1.5 max-w-[90vw] sm:max-w-sm pointer-events-none"
    >
      {toasts.slice(-1).map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center gap-2 py-2 px-3.5 rounded-full shadow-2xl border backdrop-blur-xl animate-fade-in transition-all ${
            toast.type === 'success'
              ? 'bg-[#182017]/95 border-[#2e7d52]/60 text-[#8bcca2]'
              : toast.type === 'error'
              ? 'bg-[#241812]/95 border-[#4a2316] text-[#fca5a5]'
              : 'bg-[#1c1b19]/95 border-[#383430] text-[#ede9e3]'
          }`}
        >
          <div className="shrink-0">
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-[#5bb37d]" />
            ) : toast.type === 'error' ? (
              <AlertCircle className="w-3.5 h-3.5 text-[#f87171]" />
            ) : (
              <Info className="w-3.5 h-3.5 text-[#d4a03c]" />
            )}
          </div>
          <div className="text-[11px] sm:text-xs font-semibold leading-tight truncate max-w-[260px] sm:max-w-[320px]">
            {toast.message}
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            aria-label="Dismiss notification"
            className="shrink-0 text-[#978f87] hover:text-[#ede9e3] transition p-0.5 ml-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}

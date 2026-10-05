'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Sparkles, Bot, X, BellRing, Check } from 'lucide-react';
import { useAgri } from '@/context/AgriContext';

export default function FloatingAiButton() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const { addToast } = useAgri();

  if (pathname === '/login' || pathname === '/location') {
    return null;
  }

  const handleNotifyMe = () => {
    setSubscribed(true);
    addToast('You are on the KrishiMitra AI early access list! 🌾', 'success');
    setTimeout(() => {
      setIsOpen(false);
      setSubscribed(false);
    }, 1800);
  };

  return (
    <>
      {/* Floating AI Button (FAB) */}
      <aside aria-label="KrishiMitra AI Assistant">
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open KrishiMitra AI Assistant"
          className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-40 group flex items-center gap-2.5 px-3.5 py-3 rounded-full bg-gradient-to-r from-[#2e7d52] via-[#246341] to-[#1c4e33] text-white shadow-2xl shadow-[#2e7d52]/40 hover:shadow-[#2e7d52]/60 border border-[#3d9b63]/60 transition-all duration-300 hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
        >
          {/* Glowing Ping Indicator */}
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400"></span>
          </span>

          <Bot className="w-5 h-5 text-emerald-100 group-hover:rotate-12 transition-transform duration-300" />
          
          <span className="font-bold text-xs tracking-wide pr-1 flex items-center gap-1">
            <span>Krishi AI</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
          </span>
        </button>
      </aside>

      {/* Coming Soon Modal */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="ai-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-[#1f1e1c] border border-[#2d2b27] rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl relative text-[#ede9e3] space-y-4 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close dialog"
              className="absolute top-4 right-4 text-[#978f87] hover:text-white p-1 rounded-xl hover:bg-[#272523] transition focus-visible:ring-2 focus-visible:ring-[#3d9b63]"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header with AI Badge */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#252e24] to-[#1c241b] border border-[#383430] flex items-center justify-center text-2xl shadow-inner shadow-[#2e7d52]/20">
                🤖
              </div>
              <div>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#211c0e] text-[#d4a03c] border border-[#483c1d] text-[10px] font-bold uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  SIH 2026 Feature Preview
                </span>
                <h3 id="ai-modal-title" className="text-base sm:text-lg font-bold text-[#ede9e3] mt-0.5">
                  KrishiMitra AI Voice & Vision
                </h3>
              </div>
            </div>

            {/* Coming Soon Callout */}
            <div className="p-4 rounded-2xl bg-[#151413] border border-[#2d2b27] space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">⏳</span>
                <h4 className="text-sm font-bold text-[#5bb37d]">
                  Coming Soon to KrishiMitra!
                </h4>
              </div>
              <p className="text-xs text-[#a09a93] leading-relaxed">
                Our localized multilingual AI assistant is currently being trained for Indian agrarian agro-climatic zones.
              </p>
            </div>

            {/* Upcoming Features Checklist */}
            <div className="space-y-2 pt-1">
              <h5 className="text-[11px] font-bold uppercase tracking-wider text-[#7a756f]">
                What to expect in the next release:
              </h5>
              
              <ul className="space-y-2 text-xs text-[#c5bfb8]">
                <li className="flex items-start gap-2.5">
                  <span className="p-1 rounded-md bg-[#1c2119] text-[#5bb37d] shrink-0 mt-0.5">
                    🎙️
                  </span>
                  <span>
                    <strong className="text-[#ede9e3]">Regional Voice Advisory:</strong> Ask questions in Hindi, Punjabi, Marathi, Telugu, or Tamil.
                  </span>
                </li>

                <li className="flex items-start gap-2.5">
                  <span className="p-1 rounded-md bg-[#1c2119] text-[#5bb37d] shrink-0 mt-0.5">
                    📸
                  </span>
                  <span>
                    <strong className="text-[#ede9e3]">Leaf Disease Diagnosis:</strong> Snap a photo of infected crops for instant organic treatment advice.
                  </span>
                </li>

                <li className="flex items-start gap-2.5">
                  <span className="p-1 rounded-md bg-[#1c2119] text-[#5bb37d] shrink-0 mt-0.5">
                    📈
                  </span>
                  <span>
                    <strong className="text-[#ede9e3]">Predictive Mandi Rates:</strong> 7-day arrival-based APMC yard price projections.
                  </span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex gap-2.5">
              <button
                type="button"
                onClick={handleNotifyMe}
                disabled={subscribed}
                className="flex-1 py-3 px-4 bg-[#2e7d52] hover:bg-[#266a45] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-[#3d9b63]"
              >
                {subscribed ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-200" />
                    <span>Added to Early Access!</span>
                  </>
                ) : (
                  <>
                    <BellRing className="w-4 h-4" />
                    <span>Notify Me on Launch</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="py-3 px-4 bg-[#272523] hover:bg-[#2d2b27] border border-[#302d29] text-[#ede9e3] font-medium text-xs sm:text-sm rounded-xl transition focus-visible:ring-2 focus-visible:ring-[#3d9b63]"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

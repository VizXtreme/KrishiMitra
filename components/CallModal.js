'use client';

import React, { useState, useEffect } from 'react';
import { useAgri } from '@/context/AgriContext';

export default function CallModal() {
  const { callModal, closeCallModal } = useAgri();
  const [seconds, setSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);

  useEffect(() => {
    if (!callModal.isOpen) {
      setSeconds(0);
      return;
    }
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [callModal.isOpen]);

  if (!callModal.isOpen || !callModal.data) return null;

  const data = callModal.data;
  const name = data.buyerName || data.farmerName || 'Counterparty';
  const phone = data.phone || '+91 98765 43210';
  const crop = data.crop || 'Grain Produce';
  const quantity = data.quantity || data.quantityNeeded || data.harvestQuantity || '';
  const offeredPrice = data.price || data.offeredPrice || data.targetPrice || data.sellingPrice || '';

  const formatTimer = (s) => {
    const min = String(Math.floor(s / 60)).padStart(2, '0');
    const sec = String(s % 60).padStart(2, '0');
    return `${min}:${sec} - Connected`;
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="call-modal-name"
    >
      <div 
        className="bg-[#1f1e1c] border border-[#2d2b27] rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl p-6 text-[#ede9e3] flex flex-col items-center relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Status */}
        <div className="text-xs uppercase tracking-wider text-[#5bb37d] font-semibold mb-2 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#5bb37d] animate-ping" aria-hidden="true"></span>
          <span>Outgoing Secure Call</span>
        </div>

        <div className="text-xs text-[#978f87] mb-6 font-mono" role="status" aria-live="polite">
          {formatTimer(seconds)}
        </div>

        {/* Avatar / Pulse */}
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-full bg-[#252e24] border border-[#383430] p-1 flex items-center justify-center shadow-lg shadow-[#2e7d52]/10">
            <div className="w-full h-full rounded-full bg-[#191917] flex items-center justify-center text-3xl font-bold text-[#ede9e3] select-none">
              {name ? name.charAt(0).toUpperCase() : 'B'}
            </div>
          </div>
          <div className="absolute -inset-2 rounded-full border-2 border-[#2e7d52]/30 animate-pulse pointer-events-none" aria-hidden="true"></div>
        </div>

        {/* Recipient Info */}
        <h3 id="call-modal-name" className="text-xl font-bold text-[#ede9e3] text-center mb-1">
          {name}
        </h3>
        <p className="text-sm text-[#5bb37d] font-mono mb-2">{phone}</p>

        {/* Deal Context */}
        {crop && (
          <div className="bg-[#151413] border border-[#2d2b27] rounded-xl px-4 py-2 text-center text-xs text-[#b5aea7] mb-8 max-w-xs">
            Discussion: <strong className="text-[#ede9e3]">{quantity ? `${quantity} Qtl ` : ''}{crop}</strong>
            {offeredPrice && (
              <span className="text-[#d4a03c] font-semibold"> @ ₹{offeredPrice}/Qtl</span>
            )}
          </div>
        )}

        {/* In-Call Actions */}
        <div className="flex items-center justify-center gap-6 mb-8 w-full" role="group" aria-label="In-Call Controls">
          <button
            onClick={() => setIsMuted(!isMuted)}
            aria-label={isMuted ? 'Unmute microphone' : 'Mute microphone'}
            className={`w-12 h-12 rounded-full border flex items-center justify-center transition focus-visible:ring-2 focus-visible:ring-[#3d9b63] ${
              isMuted ? 'bg-[#241812] border-[#4a2316] text-[#fca5a5]' : 'bg-[#272523] border-[#302d29] text-[#ada6a0] hover:text-white hover:bg-[#2d2b27]'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z" />
            </svg>
          </button>

          <button
            onClick={() => setIsSpeaker(!isSpeaker)}
            aria-label={isSpeaker ? 'Turn off speakerphone' : 'Turn on speakerphone'}
            className={`w-12 h-12 rounded-full border flex items-center justify-center transition focus-visible:ring-2 focus-visible:ring-[#3d9b63] ${
              isSpeaker ? 'bg-[#1c2119] border-[#2b3325] text-[#8bcca2]' : 'bg-[#272523] border-[#302d29] text-[#ada6a0] hover:text-white hover:bg-[#2d2b27]'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          </button>

          <a
            href={`tel:${phone.replace(/\s+/g, '')}`}
            aria-label="Open native device dialer"
            className="w-12 h-12 rounded-full bg-[#272523] border border-[#302d29] flex items-center justify-center text-[#5bb37d] hover:bg-[#2d2b27] transition focus-visible:ring-2 focus-visible:ring-[#3d9b63]"
            title="Open in Device Phone App"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>

        {/* End Call Button */}
        <button
          onClick={closeCallModal}
          aria-label="End Call"
          className="w-16 h-16 rounded-full bg-[#b91c1c] hover:bg-[#dc2626] text-white flex items-center justify-center shadow-lg shadow-[#b91c1c]/40 transition transform hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-white"
        >
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08c-.18-.17-.29-.42-.29-.7 0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11-.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.1-.7-.28-.79-.74-1.69-1.36-2.67-1.85-.33-.16-.56-.5-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z" />
          </svg>
        </button>

      </div>
    </div>
  );
}

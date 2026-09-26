'use client';

import React, { useState, useEffect, useRef } from 'react';

export default function OtpModal({ phone, isOpen, onClose, onVerify }) {
  const [digits, setDigits] = useState(['1', '2', '3', '4', '5', '6']);
  const [secondsLeft, setSecondsLeft] = useState(30);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!isOpen) return;
    setSecondsLeft(30);
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDigitChange = (index, value) => {
    const val = value.slice(-1);
    const newDigits = [...digits];
    newDigits[index] = val;
    setDigits(newDigits);

    if (val && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onVerify(digits.join(''));
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="otp-modal-title"
    >
      <div 
        className="bg-[#1f1e1c] border border-[#2d2b27] rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl p-6 text-[#ede9e3] relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close OTP verification modal"
          className="absolute top-4 right-4 text-[#978f87] hover:text-[#ede9e3] p-1 rounded-lg hover:bg-[#272523] transition focus-visible:ring-2 focus-visible:ring-[#3d9b63]"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="w-12 h-12 rounded-full bg-[#252e24] border border-[#383430] flex items-center justify-center mx-auto mb-4 text-[#5bb37d]" aria-hidden="true">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>

        <h3 id="otp-modal-title" className="text-xl font-bold text-center text-[#ede9e3] mb-1">
          Verify Mobile Number
        </h3>
        <p className="text-xs text-center text-[#978f87] mb-6">
          Enter the 6-digit OTP sent via SMS to <span className="font-medium text-[#5bb37d]">+91 {phone}</span>
        </p>

        <form onSubmit={handleSubmit}>
          {/* OTP 6-box input */}
          <div className="flex justify-center gap-2 mb-6" role="group" aria-label="6-digit verification code">
            {digits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                aria-label={`Digit ${idx + 1}`}
                className="w-10 h-12 text-center text-xl font-bold rounded-lg bg-[#151413] border border-[#302d29] text-[#ede9e3] focus:border-[#2e7d52] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3d9b63]"
              />
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-[#978f87] mb-6">
            <span role="status" aria-live="polite">
              Resend OTP in <strong className="text-[#ede9e3]">{secondsLeft}s</strong>
            </span>
            <button
              type="button"
              disabled={secondsLeft > 0}
              onClick={() => setSecondsLeft(30)}
              className="text-[#5bb37d] hover:text-[#8bcca2] font-medium disabled:opacity-40 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-[#3d9b63]"
            >
              Resend Code
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#2e7d52] hover:bg-[#266a45] text-white rounded-xl font-bold shadow-md shadow-[#2e7d52]/20 border border-[#3d9b63]/30 transition-all flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-[#3d9b63]"
          >
            <span>Verify & Continue</span>
            <svg className="w-4 h-4 text-emerald-100" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </form>

        <div className="mt-4 text-center">
          <span className="text-[11px] text-[#978f87] bg-[#151413] px-2.5 py-1 rounded-full border border-[#2d2b27]">
            Demo Sandbox Code: <code className="text-[#5bb37d] font-mono">123456</code> (Pre-filled)
          </span>
        </div>
      </div>
    </div>
  );
}

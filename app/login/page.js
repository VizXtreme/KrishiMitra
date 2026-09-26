'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAgri } from '@/context/AgriContext';
import OtpModal from '@/components/OtpModal';

export default function LoginPage() {
  const router = useRouter();
  const { loginWithPhone, loginWithGoogle, addToast } = useAgri();

  const [phone, setPhone] = useState('9876543210');
  const [error, setError] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handlePhoneInput = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(val);
    setError('');
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (phone.length !== 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setShowOtpModal(true);
  };

  const handleVerifyOtp = (otpCode) => {
    setShowOtpModal(false);
    loginWithPhone(phone);
    router.push('/location');
  };

  const handleGoogleAuth = () => {
    setGoogleLoading(true);
    setTimeout(() => {
      loginWithGoogle();
      router.push('/location');
    }, 500);
  };

  return (
    <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 py-8 sm:py-10 max-w-md mx-auto w-full animate-slide-up">
      
      {/* Top Brand Logo */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-[#252e24] border border-[#383430] p-0.5 shadow-xl shadow-[#2e7d52]/10 flex items-center justify-center">
          <div className="w-full h-full bg-[#191917] rounded-[22px] flex items-center justify-center text-3xl text-[#5bb37d] select-none">
            🌱
          </div>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#ede9e3]">
          Krishi<span className="text-[#5bb37d]">Mitra</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#978f87] mt-1 font-medium">
          Digital Mandi, Crop Advisory & B2B Trading Hub
        </p>
      </div>

      {/* Login Card */}
      <div className="bg-[#1f1e1c] border border-[#2d2b27] rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div>
            <label htmlFor="phone-input" className="block text-xs font-semibold text-[#c5bfb8] uppercase tracking-wider mb-2">
              Enter 10-digit Mobile Number
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 flex items-center gap-1.5 text-xs font-medium text-[#978f87] border-r border-[#302d29] pr-2.5">
                <span aria-hidden="true">🇮🇳</span>
                <span>+91</span>
              </div>
              <input
                id="phone-input"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                placeholder="98765 43210"
                value={phone}
                onChange={handlePhoneInput}
                required
                className="w-full pl-20 pr-4 py-3.5 bg-[#151413] border border-[#302d29] rounded-xl text-[#ede9e3] font-medium text-sm placeholder:text-[#635e58] focus:outline-none focus:border-[#2e7d52] focus:ring-2 focus:ring-[#3d9b63]/20 transition focus-visible:ring-[#3d9b63]"
              />
            </div>
            {error && (
              <p className="text-[11px] text-[#f87171] mt-1.5 font-medium" role="alert">
                {error}
              </p>
            )}
          </div>

          {/* Green Send OTP Button */}
          <button
            type="submit"
            className="w-full py-3.5 bg-[#2e7d52] hover:bg-[#266a45] text-white font-bold text-sm rounded-xl shadow-md shadow-[#2e7d52]/20 border border-[#3d9b63]/30 active:scale-[0.98] transition flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-[#3d9b63]"
          >
            <span>Send OTP</span>
            <svg className="w-4 h-4 text-emerald-100" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </form>

        {/* Horizontal Divider */}
        <div className="relative my-6 flex items-center justify-center" aria-hidden="true">
          <div className="border-t border-[#2d2b27] w-full"></div>
          <span className="bg-[#1f1e1c] px-3 text-[11px] uppercase tracking-wider text-[#7a756f] font-semibold absolute">
            OR
          </span>
        </div>

        {/* Continue with Google Button */}
        <button
          onClick={handleGoogleAuth}
          disabled={googleLoading}
          aria-label="Continue with Google Authentication"
          className="w-full py-3.5 bg-[#272523] hover:bg-[#2d2b27] border border-[#302d29] text-[#ede9e3] font-medium text-sm rounded-xl transition flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-[#3d9b63]"
        >
          {googleLoading ? (
            <span className="inline-flex items-center gap-2">
              <svg className="animate-spin w-4 h-4 text-[#5bb37d]" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              <span>Authenticating with Google...</span>
            </span>
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" />
                <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5.1 3.7-8.9z" />
                <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.2s.7 5.5 1.9 7.9l3.7-2.9z" />
                <path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.9C3.7 20.6 7.5 23.5 12 23.5z" />
              </svg>
              <span>Continue with Google</span>
            </>
          )}
        </button>

      </div>

      {/* Trust Badges Footer */}
      <div className="mt-8 text-center text-xs text-[#978f87] flex items-center justify-center gap-4">
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5 text-[#5bb37d]" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Direct Mandi Sync
        </span>
        <span aria-hidden="true">•</span>
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5 text-[#5bb37d]" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          ICAR Advisory
        </span>
      </div>

      {/* OTP Modal */}
      <OtpModal
        phone={phone}
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        onVerify={handleVerifyOtp}
      />

    </div>
  );
}

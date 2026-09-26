'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAgri } from '@/context/AgriContext';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { auth, location, weather, unreadMessagesCount, messages, markMessageAsRead, addToast } = useAgri();

  // If on login or location page, don't show the main header (they have self-contained headers)
  if (pathname === '/login' || pathname === '/location') {
    return null;
  }

  // Dashboard Screen Header (Screen 3)
  if (pathname === '/') {
    return (
      <header 
        role="banner" 
        className="sticky top-0 z-30 bg-[#181716]/95 border-b border-[#2d2b27] backdrop-blur-xl px-3 sm:px-6 lg:px-8 py-2 sm:py-3 flex items-center justify-between shadow-md select-none"
      >
        {/* Top-Left: Profile Icon Button 👤 (Routes to /profile) */}
        <Link
          href="/profile"
          id="header-profile-btn"
          aria-label="Open Profile"
          className="relative flex items-center gap-2 p-0.5 sm:p-1 rounded-full hover:bg-[#272523] transition active:scale-95 group focus-visible:ring-2 focus-visible:ring-[#3d9b63] focus-visible:outline-none min-h-[38px] sm:min-h-[44px]"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-[#2e7d52]/60 p-0.5 bg-[#222120] flex items-center justify-center text-base sm:text-lg shrink-0">
            {auth.avatar ? (
              <img src={auth.avatar} alt="Farmer Profile Avatar" className="w-full h-full object-cover rounded-full" />
            ) : (
              <span className="text-[#ede9e3]" aria-hidden="true">👤</span>
            )}
          </div>
          <div className="hidden sm:flex flex-col text-left leading-tight">
            <span className="text-xs font-bold text-[#ede9e3] group-hover:text-[#5bb37d] transition">
              {auth.name ? auth.name : 'Rajesh Kumar'}
            </span>
            <span className="text-[10px] text-[#5bb37d] font-medium">Verified Farmer • {location.district || 'Ludhiana'}</span>
          </div>
        </Link>

        {/* Center: Active Location & Weather Indicator (Routes to /location or /weather) */}
        <Link 
          href="/location"
          aria-label={`Current Location ${location.district || 'Ludhiana'}, ${location.state || 'PB'}, Temperature ${weather.temp}°C, Condition ${weather.condition}`}
          className="flex flex-col items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-xl hover:bg-[#272523] transition focus-visible:ring-2 focus-visible:ring-[#3d9b63] focus-visible:outline-none"
        >
          <div className="flex items-center gap-1 sm:gap-1.5 text-xs font-semibold text-[#ede9e3]">
            <span className="text-[#3d9b63] text-xs sm:text-sm" aria-hidden="true">📍</span>
            <span className="truncate max-w-[130px] sm:max-w-[220px]">
              {location.district || 'Ludhiana'}, {location.state || 'PB'}
            </span>
          </div>
          <span className="text-[9px] sm:text-[10px] text-[#a09a93] font-medium flex items-center gap-1 sm:gap-1.5 mt-0.5">
            <span className="text-[#d4a03c] font-semibold">{weather.temp}°C</span>
            <span aria-hidden="true">•</span>
            <span>{weather.condition}</span>
          </span>
        </Link>

        {/* Top-Right: Quick Shortcuts & Message Icon Button */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <Link
            href="/b2b-hub"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1c2119] hover:bg-[#252a22] text-xs font-semibold text-[#8bcca2] border border-[#2b3325] transition"
          >
            <span>🚜 B2B Trade</span>
          </Link>
          <Link
            href="/mandi"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1d1c16] hover:bg-[#282518] text-xs font-semibold text-[#e8bf6a] border border-[#3a3315] transition"
          >
            <span>📊 Live Mandi</span>
          </Link>

          <Link
            href="/messages"
            id="header-message-btn"
            aria-label={`Open Messages, ${unreadMessagesCount} unread`}
            className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#222120] hover:bg-[#2a2927] border border-[#33302c] flex items-center justify-center text-[#ded8d1] hover:text-white transition active:scale-95 focus-visible:ring-2 focus-visible:ring-[#3d9b63] focus-visible:outline-none"
          >
            <span className="text-base sm:text-lg select-none" aria-hidden="true">💬</span>
            {unreadMessagesCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 sm:top-1 sm:right-1 flex h-3.5 w-3.5" aria-hidden="true">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex items-center justify-center rounded-full h-3.5 w-3.5 bg-rose-500 text-[9px] font-bold text-white">
                  {unreadMessagesCount}
                </span>
              </span>
            )}
          </Link>
        </div>
      </header>
    );
  }

  // Subpage Headers
  const getSubpageMeta = () => {
    switch (pathname) {
      case '/mandi':
        return {
          title: 'Market Mandi Prices',
          rightEl: (
            <Link 
              href="/b2b-hub" 
              className="text-xs text-[#b8862d] hover:text-[#d4a03c] font-semibold flex items-center gap-1 py-1 px-2.5 rounded-lg bg-[#211c0e] border border-[#483c1d] transition focus-visible:ring-2 focus-visible:ring-[#d4a03c] focus-visible:outline-none"
            >
              <span>B2B Hub</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ),
        };
      case '/b2b-hub':
        return {
          title: 'B2B Buy & Sell Hub',
          rightEl: <div className="text-xs text-[#5bb37d] font-mono font-medium">Verified Mandi Desk</div>,
        };
      case '/crop-ai':
        return {
          title: 'Smart Crop AI Hub',
          rightEl: (
            <Link 
              href="/soil-health" 
              className="text-xs text-[#5bb37d] hover:text-[#8bcca2] font-medium flex items-center gap-1 py-1 px-2.5 rounded-lg bg-[#1c2119] border border-[#2b3325] transition focus-visible:ring-2 focus-visible:ring-[#3d9b63] focus-visible:outline-none"
            >
              <span>Soil Card</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ),
        };
      case '/soil-health':
        return {
          title: 'Soil Data Repository',
          rightEl: (
            <Link 
              href="/crop-ai" 
              className="text-xs text-[#5bb37d] hover:text-[#8bcca2] font-medium flex items-center gap-1 py-1 px-2.5 rounded-lg bg-[#1c2119] border border-[#2b3325] transition focus-visible:ring-2 focus-visible:ring-[#3d9b63] focus-visible:outline-none"
            >
              <span>AI Crops</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ),
        };
      case '/weather':
        return {
          title: 'Weather Dashboard',
          subtitle: `${location.district || 'Ludhiana'}, ${location.state || 'PB'}`,
          rightEl: (
            <button 
              onClick={() => addToast('Forecast refreshed with latest IMD radar data.', 'info')} 
              className="p-2 text-[#a09a93] hover:text-white rounded-lg hover:bg-[#272523] transition focus-visible:ring-2 focus-visible:ring-[#3d9b63] focus-visible:outline-none"
              aria-label="Refresh Forecast"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          ),
        };
      case '/schemes':
        return {
          title: 'Government Schemes',
          rightEl: <span className="text-xs text-[#d4a03c] font-mono font-medium">DBT Portal</span>,
        };
      case '/messages':
        return {
          title: 'Buyer Inquiries',
          badge: unreadMessagesCount > 0 ? `${unreadMessagesCount} New` : null,
          rightEl: (
            <button 
              onClick={() => {
                messages.forEach((m) => markMessageAsRead(m.id));
                addToast('All messages marked as read.', 'info');
              }}
              className="text-xs text-[#5bb37d] hover:text-[#8bcca2] font-medium py-1 px-2.5 rounded-lg bg-[#1c2119] border border-[#2b3325] transition focus-visible:ring-2 focus-visible:ring-[#3d9b63] focus-visible:outline-none"
            >
              Mark Read
            </button>
          ),
        };
      case '/profile':
        return {
          title: 'Profile Details',
          rightEl: <div className="w-8"></div>,
        };
      default:
        return {
          title: 'KrishiMitra',
          rightEl: null,
        };
    }
  };

  const meta = getSubpageMeta();

  return (
    <header 
      role="banner" 
      className="sticky top-0 z-30 bg-[#181716]/95 border-b border-[#2d2b27] backdrop-blur-xl px-3 sm:px-6 lg:px-8 py-2 sm:py-3 flex items-center justify-between select-none"
    >
      {/* Top Bar with Back Button (< Dashboard) */}
      <button
        onClick={() => router.push('/')}
        aria-label="Back to Dashboard"
        className="flex items-center gap-1 sm:gap-1.5 text-xs font-semibold text-[#a09a93] hover:text-white p-1 sm:p-1.5 -ml-1 rounded-lg hover:bg-[#272523] transition focus-visible:ring-2 focus-visible:ring-[#3d9b63] focus-visible:outline-none min-h-[38px] sm:min-h-[44px]"
      >
        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#3d9b63] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
        <span className="hidden sm:inline">Back to Dashboard</span>
        <span className="sm:hidden">Back</span>
      </button>

      {/* Screen Title */}
      <div className="text-center px-1.5 sm:px-2 flex-1 max-w-md mx-auto">
        <div className="flex items-center justify-center gap-1.5 sm:gap-2">
          <h1 className="text-xs sm:text-base font-bold text-[#ede9e3] truncate">{meta.title}</h1>
          {meta.badge && (
            <span className="px-1.5 sm:px-2 py-0.5 rounded-full bg-rose-950/80 text-rose-300 border border-rose-800/60 text-[9px] sm:text-[10px] font-bold">
              {meta.badge}
            </span>
          )}
        </div>
        {meta.subtitle && (
          <span className="text-[9px] sm:text-[10px] text-[#3d9b63] font-mono block -mt-0.5">{meta.subtitle}</span>
        )}
      </div>

      {/* Contextual Right Button */}
      <div className="flex items-center justify-end shrink-0 min-w-[36px] sm:min-w-[44px]">
        {meta.rightEl}
      </div>
    </header>
  );
}

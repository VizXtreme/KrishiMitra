'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();

  // Hide on login and location setup screens
  if (pathname === '/login' || pathname === '/location') {
    return null;
  }

  const navItems = [
    { label: 'Home', href: '/', icon: '🏠' },
    { label: 'Mandi', href: '/mandi', icon: '📊' },
    { label: 'B2B Hub', href: '/b2b-hub', icon: '🚜' },
    { label: 'Weather', href: '/weather', icon: '⛅' },
    { label: 'Profile', href: '/profile', icon: '👤' },
  ];

  return (
    <nav 
      role="navigation" 
      aria-label="Bottom Navigation" 
      className="fixed bottom-0 left-0 right-0 z-30 flex justify-center pointer-events-none lg:hidden"
    >
      <div className="w-full max-w-2xl bg-[#181716]/95 border-t border-[#2d2b27] backdrop-blur-xl px-2 sm:px-4 py-2 shrink-0 pointer-events-auto shadow-2xl" style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}>
        <div className="flex items-center justify-around text-xs">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={`bnav-btn flex flex-col items-center justify-center gap-1 transition px-2.5 sm:px-3 py-1.5 rounded-xl min-h-[44px] min-w-[56px] focus-visible:ring-2 focus-visible:ring-[#3d9b63] focus-visible:outline-none ${
                  isActive
                    ? 'text-[#5bb37d] font-bold bg-[#24231f] border border-[#33302c] shadow-inner'
                    : 'text-[#8e8880] hover:text-[#ede9e3] hover:bg-[#222120]'
                }`}
              >
                <span className="text-base select-none" aria-hidden="true">{item.icon}</span>
                <span className="text-[11px] leading-none tracking-tight">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

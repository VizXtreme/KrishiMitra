'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAgri } from '@/context/AgriContext';
import { 
  Bell, 
  MapPin, 
  CloudSun, 
  Menu, 
  X, 
  Sparkles, 
  TrendingUp, 
  ShoppingBag, 
  FlaskConical, 
  Layers, 
  FileText, 
  User, 
  MessageSquare,
  AlertTriangle
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { auth, location, weather, unreadMessagesCount } = useAgri();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Overview Dashboard', icon: Layers },
    { href: '/mandi', label: 'APMC Mandi Rates', icon: TrendingUp },
    { href: '/b2b-hub', label: 'B2B Trade Desk', icon: ShoppingBag },
    { href: '/crop-ai', label: 'Smart Crop AI Hub', icon: Sparkles },
    { href: '/soil-health', label: 'Soil Health Card', icon: FlaskConical },
    { href: '/weather', label: 'Weather Radar & Rain', icon: CloudSun },
    { href: '/schemes', label: 'Govt Schemes & DBT', icon: FileText },
    { href: '/messages', label: 'Buyer Enquiries', icon: MessageSquare, badge: unreadMessagesCount },
    { href: '/location', label: 'GPS & Agro Zone', icon: MapPin },
    { href: '/profile', label: 'Farmer Profile', icon: User },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#181716]/95 backdrop-blur-xl border-b border-[#2d2b27] shadow-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2">
          
          {/* Left: Brand Identity & Mobile Hamburger */}
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-8 h-8 sm:w-9 sm:h-9 rounded-xl text-[#978f87] hover:text-white hover:bg-[#272523] transition flex items-center justify-center shrink-0"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link href="/" className="flex items-center gap-2 min-w-0 group">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#252e24] border border-[#383430] flex items-center justify-center text-[#5bb37d] shadow-sm group-hover:scale-105 transition-transform shrink-0">
                <span className="text-base sm:text-lg">🌱</span>
              </div>
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="font-extrabold text-sm sm:text-lg tracking-tight text-[#ede9e3] group-hover:text-[#5bb37d] transition truncate">
                  KrishiMitra
                </span>
                <span className="hidden xs:inline px-1.5 py-0.5 text-[9px] font-bold tracking-wider uppercase rounded bg-[#1c2119] text-[#5bb37d] border border-[#2b3325] shrink-0">
                  v3.0
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Live GPS & Weather Capsule (Desktop only) */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            <Link
              href="/location"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1f1e1c] hover:bg-[#272523] border border-[#2d2b27] text-xs font-medium text-[#978f87] hover:text-[#ede9e3] transition group"
              title="Click to update GPS or Agro-Climatic Zone"
            >
              <MapPin className="w-3.5 h-3.5 text-[#5bb37d] group-hover:animate-bounce" />
              <span>{location.district}, {location.state}</span>
            </Link>

            <Link
              href="/weather"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1f1e1c] hover:bg-[#272523] border border-[#2d2b27] text-xs font-medium text-[#978f87] hover:text-[#ede9e3] transition"
              title="Click for radar & 14-day rainfall forecast"
            >
              <CloudSun className="w-3.5 h-3.5 text-[#d4a03c]" />
              <span className="text-[#ede9e3]">{weather.temp}°C</span>
              <span className="text-[#635e58]">•</span>
              <span>{weather.condition}</span>
            </Link>

            {weather.severeAlert?.active && (
              <Link
                href="/weather"
                className="hidden xl:flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#241812] border border-[#4a2316] text-[11px] font-semibold text-[#fca5a5] hover:bg-[#381c15] transition animate-pulse"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-[#f87171]" />
                <span>Storm Alert</span>
              </Link>
            )}
          </div>

          {/* Right: Quick Mobile Weather Pill, Notification Bell & Profile */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Mobile-only compact weather pill */}
            <Link
              href="/weather"
              className="md:hidden flex items-center gap-1 px-2 py-1 rounded-full bg-[#1f1e1c] border border-[#2d2b27] text-[11px] font-bold text-[#d4a03c]"
            >
              <CloudSun className="w-3.5 h-3.5 text-[#d4a03c]" />
              <span>{weather.temp}°</span>
            </Link>

            {/* Notification Bell */}
            <Link
              href="/messages"
              className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#1f1e1c] hover:bg-[#272523] border border-[#2d2b27] text-[#978f87] hover:text-white transition flex items-center justify-center shrink-0"
              title="Buyer enquiries & messages"
            >
              <Bell className="w-4 h-4" />
              {unreadMessagesCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5 sm:h-4 sm:w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex items-center justify-center rounded-full h-3.5 w-3.5 sm:h-4 sm:w-4 bg-[#b91c1c] text-[8px] sm:text-[9px] font-bold text-white">
                    {unreadMessagesCount}
                  </span>
                </span>
              )}
            </Link>

            {/* Profile Avatar */}
            <Link
              href="/profile"
              className="flex items-center gap-2 p-0.5 sm:pr-3 rounded-full bg-[#1f1e1c] hover:bg-[#272523] border border-[#2d2b27] text-[#978f87] hover:text-[#ede9e3] transition group shrink-0"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden border-2 border-[#2e7d52]/60 bg-[#151413] shrink-0 flex items-center justify-center">
                {auth.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={auth.avatar} alt={auth.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-3.5 h-3.5 text-[#978f87]" />
                )}
              </div>
              <div className="hidden sm:flex flex-col text-left leading-none">
                <span className="text-xs font-bold text-[#ede9e3] group-hover:text-[#5bb37d] transition">
                  {auth.name.split(' ')[0]}
                </span>
                <span className="text-[10px] text-[#5bb37d] font-medium mt-0.5">
                  Verified Farmer
                </span>
              </div>
            </Link>
          </div>

        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex">
          <div className="w-[82vw] max-w-xs bg-[#191917] border-r border-[#2d2b27] h-full p-4 flex flex-col justify-between overflow-y-auto animate-fade-in shadow-2xl">
            <div className="space-y-4">
              
              <div className="flex items-center justify-between pb-3 border-b border-[#2d2b27]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#252e24] border border-[#383430] flex items-center justify-center text-[#5bb37d] text-base">
                    🌱
                  </div>
                  <div>
                    <h2 className="font-extrabold text-[#ede9e3] text-sm">KrishiMitra</h2>
                    <p className="text-[10px] text-[#5bb37d]">Enterprise Edition</p>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-[#978f87] hover:text-[#ede9e3] hover:bg-[#272523]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Weather Capsule in Drawer */}
              <div className="p-3 rounded-xl bg-[#1f1e1c] border border-[#2d2b27] space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#c5bfb8] flex items-center gap-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-[#5bb37d] shrink-0" />
                    <span className="truncate">{location.district}, {location.state}</span>
                  </span>
                  <span className="text-[#d4a03c] font-bold shrink-0">{weather.temp}°C</span>
                </div>
                <div className="text-[10px] text-[#7a756f] truncate">
                  {location.soilType} • {weather.condition}
                </div>
              </div>

              {/* Nav Links */}
              <nav className="space-y-1">
                {navLinks.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition ${
                        isActive
                          ? 'bg-[#1c2119] text-[#8bcca2] border border-[#2b3325] shadow-sm'
                          : 'text-[#978f87] hover:bg-[#1f1e1c] hover:text-[#ede9e3]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#5bb37d]' : 'text-[#978f87]'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && item.badge > 0 ? (
                        <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#b91c1c] text-white shrink-0">
                          {item.badge}
                        </span>
                      ) : null}
                    </Link>
                  );
                })}
              </nav>

            </div>

            {/* Footer in Drawer */}
            <div className="pt-3 border-t border-[#2d2b27] text-[11px] text-[#7a756f] flex items-center justify-between">
              <span>KrishiMitra v3.0</span>
              <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className="text-[#5bb37d] font-medium">
                Profile &rarr;
              </Link>
            </div>

          </div>

          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}
    </>
  );
}

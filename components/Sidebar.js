'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAgri } from '@/context/AgriContext';
import { 
  LayoutDashboard, 
  TrendingUp, 
  ShoppingBag, 
  Sparkles, 
  FlaskConical, 
  CloudSun, 
  FileText, 
  MessageSquare, 
  MapPin, 
  UserCheck, 
  ChevronRight,
  ShieldCheck,
  Zap
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const { unreadMessagesCount, location, mandiData } = useAgri();

  if (pathname === '/login') {
    return null;
  }

  const navSections = [
    {
      title: 'Core Operations',
      items: [
        { href: '/', label: 'Overview Dashboard', icon: LayoutDashboard },
        { href: '/mandi', label: 'APMC Mandi Rates', icon: TrendingUp, badge: 'Live' },
        { href: '/b2b-hub', label: 'B2B Trade Desk', icon: ShoppingBag, badge: 'Dual Tab' },
      ],
    },
    {
      title: 'Agronomic AI & Climate',
      items: [
        { href: '/crop-ai', label: 'Smart Crop AI Hub', icon: Sparkles, highlight: true },
        { href: '/soil-health', label: 'Soil Health Card', icon: FlaskConical },
        { href: '/weather', label: 'Weather & 14D Rain', icon: CloudSun },
      ],
    },
    {
      title: 'Direct Services & Hub',
      items: [
        { href: '/schemes', label: 'Govt Schemes & DBT', icon: FileText },
        { 
          href: '/messages', 
          label: 'Buyer Enquiries', 
          icon: MessageSquare, 
          count: unreadMessagesCount 
        },
      ],
    },
    {
      title: 'System & Account',
      items: [
        { href: '/location', label: 'GPS / Agro Zone', icon: MapPin },
        { href: '/profile', label: 'Farmer Profile & APMC', icon: UserCheck },
      ],
    },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 xl:w-72 shrink-0 bg-[#191917] border-r border-[#2d2b27] p-4 xl:p-5 h-screen sticky top-0 overflow-y-auto no-scrollbar z-30">
      
      {/* Desktop Brand Header */}
      <Link href="/" className="flex items-center gap-2.5 pb-4 mb-4 border-b border-[#2d2b27] group">
        <div className="w-10 h-10 rounded-xl bg-[#252e24] border border-[#383430] flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
          🌱
        </div>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-black text-base tracking-tight text-[#ede9e3] group-hover:text-[#5bb37d] transition-colors">
              Krishi<span className="text-[#5bb37d]">Mitra</span>
            </span>
            <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-[#1c2119] text-[#5bb37d] border border-[#2b3325]">v3.0</span>
          </div>
          <span className="text-[10px] text-[#978f87] font-medium truncate">Kisan Krishi-Intelligence</span>
        </div>
      </Link>

      <div className="space-y-6 flex-1">
        {navSections.map((section, idx) => (
          <div key={idx} className="space-y-1.5">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#7a756f] px-3">
              {section.title}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs xl:text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-[#1c2119] text-[#8bcca2] border border-[#2b3325] shadow-sm'
                        : 'text-[#978f87] hover:text-[#ede9e3] hover:bg-[#1f1e1c] border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-xl transition-colors ${
                        isActive 
                          ? 'bg-[#252e24] text-[#5bb37d]' 
                          : 'bg-[#1f1e1c] text-[#978f87] group-hover:text-[#5bb37d] group-hover:bg-[#272523]'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="truncate">{item.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {item.badge && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          item.badge === 'Live'
                            ? 'bg-[#1c2119] text-[#5bb37d] border border-[#2b3325]'
                            : 'bg-[#272523] text-[#ada6a0]'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                      {item.count > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#b91c1c] text-white animate-pulse">
                          {item.count}
                        </span>
                      )}
                      {item.highlight && !isActive && (
                        <Zap className="w-3.5 h-3.5 text-[#d4a03c] animate-pulse" />
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Mini Regional Summary Card in Sidebar */}
      <div className="mt-4 p-4 rounded-2xl bg-[#1f1e1c] border border-[#2d2b27] shadow-md space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#978f87] flex items-center gap-1 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-[#5bb37d]" />
            Verified MSP Anchor
          </span>
          <span className="text-[#5bb37d] font-mono font-bold text-[11px]">Wheat</span>
        </div>
        
        <div className="flex items-baseline justify-between">
          <div className="text-lg font-black text-[#ede9e3]">
            ₹{mandiData.mandis[0]?.modalPrice || '2,465'}
            <span className="text-xs font-normal text-[#978f87] ml-1">/Qtl</span>
          </div>
          <span className="text-[10px] font-bold text-[#5bb37d] bg-[#1c2119] px-2 py-0.5 rounded border border-[#2b3325]">
            +₹190 MSP
          </span>
        </div>

        <div className="text-[11px] text-[#7a756f] truncate">
          Active Mandi: {mandiData.mandis[0]?.name}
        </div>
      </div>

    </aside>
  );
}

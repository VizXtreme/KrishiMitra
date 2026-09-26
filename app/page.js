'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAgri } from '@/context/AgriContext';

export default function DashboardPage() {
  const router = useRouter();
  const { weather, banners } = useAgri();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-sliding carousel
  useEffect(() => {
    if (!banners || banners.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [banners]);

  const coreServices = [
    {
      id: 'weather',
      title: 'Weather Dashboard',
      description: '14-day rainfall trend, storm alerts & hourly humidity.',
      badge: '24h Radar',
      icon: '⛅',
      href: '/weather',
    },
    {
      id: 'crop',
      title: 'Smart Crop Recommendation',
      description: 'GPS-based NPK analysis with profit margin & mandi risk tags.',
      badge: 'AI Powered',
      icon: '🌾',
      href: '/crop-ai',
    },
    {
      id: 'b2b',
      title: 'B2B Buy & Sell Hub',
      description: 'Direct grain trade with verified millers, exporters & farmers.',
      badge: 'B2B Trade',
      icon: '🚜',
      href: '/b2b-hub',
    },
    {
      id: 'soil',
      title: 'Soil Data Repository',
      description: 'Record laboratory N, P, K, pH, Carbon & Conductivity.',
      badge: 'Lab Card',
      icon: '🧪',
      href: '/soil-health',
    },
    {
      id: 'schemes',
      title: 'Government Schemes',
      description: 'Subsidies, PM-KISAN, PMFBY insurance & portal links.',
      badge: 'DBT Subsidy',
      icon: '🏛️',
      href: '/schemes',
    },
    {
      id: 'mandi',
      title: 'Market Mandi Prices',
      description: 'Central MSP benchmark & nearby APMC yard price tables.',
      badge: 'APMC Live',
      icon: '📊',
      href: '/mandi',
    },
  ];

  return (
    <div className="flex-1 flex flex-col w-full px-3.5 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-6xl mx-auto space-y-6 animate-slide-up">
      
      {/* Weather Ticker Alert if Active - Warm Terracotta */}
      {weather?.severeAlert?.active && (
        <Link
          href="/weather"
          id="quick-alert-strip"
          className="bg-[#241812]/90 border border-[#4a2316] hover:border-[#6e3420] rounded-2xl p-3.5 flex items-center justify-between gap-3 text-[#ddc09a] transition shadow-lg shadow-black/30 focus-visible:ring-2 focus-visible:ring-[#c99535] focus-visible:outline-none"
          aria-label="Storm Alert: Thunderstorm & Hail Warning within 6 hours. View Radar & Forecast"
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            <span className="text-lg shrink-0" aria-hidden="true">⚠️</span>
            <div className="text-xs truncate">
              <strong className="text-[#d4a65e] font-semibold">Storm Alert:</strong> Thunderstorm & Hail Warning within 6 hours.
            </div>
          </div>
          <span className="text-[11px] font-bold text-[#c99045] underline shrink-0 hover:text-white flex items-center gap-1">
            Radar & Forecast &rarr;
          </span>
        </Link>
      )}

      {/* Ribbon Banner Carousel - Warm Botanical & Harvest Duotones */}
      <section aria-label="Govt and Market Highlights Carousel" className="relative">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#a09a93] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2e7d52]" aria-hidden="true"></span>
            Govt & Market Highlights
          </span>
          <div className="flex items-center gap-1.5" role="tablist" aria-label="Carousel Slides">
            {banners.map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === currentSlide}
                aria-label={`Slide ${i + 1} of ${banners.length}`}
                onClick={() => setCurrentSlide(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentSlide ? 'w-5 bg-[#3d9b63]' : 'w-1.5 bg-[#2d2b27]'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Carousel Container */}
        <div id="banner-carousel" className="relative overflow-hidden rounded-2xl shadow-xl border border-[#2d2b27]">
          <div
            id="carousel-track"
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {banners.map((banner, idx) => {
              const targetRoute =
                banner.targetScreen === 'screen-10'
                  ? '/schemes'
                  : banner.targetScreen === 'screen-11'
                  ? '/mandi'
                  : banner.targetScreen === 'screen-8'
                  ? '/b2b-hub'
                  : '/schemes';

              return (
                <div
                  key={banner.id || idx}
                  className={`w-full shrink-0 p-5 bg-gradient-to-br ${banner.bgGradient} text-[#ede9e3] relative min-h-[160px] flex flex-col justify-between border-b border-white/5`}
                >
                  {/* Decorative watermark */}
                  <div className="absolute -right-4 -bottom-4 text-7xl opacity-10 pointer-events-none select-none" aria-hidden="true">
                    🌾
                  </div>

                  <div>
                    <span className={`inline-block px-2.5 py-0.5 rounded-full bg-black/40 border border-white/10 text-[10px] font-extrabold uppercase tracking-wider ${banner.accentColor} mb-2`}>
                      {banner.tag}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold leading-tight max-w-[85%] text-white">
                      {banner.title}
                    </h3>
                    <p className="text-xs text-[#d1cbc4] mt-1 max-w-[85%] leading-relaxed line-clamp-2">
                      {banner.subtitle}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <button
                      onClick={() => router.push(targetRoute)}
                      className="px-3.5 py-1.5 bg-[#ede9e3] hover:bg-white text-[#191917] rounded-lg text-xs font-bold transition shadow-sm active:scale-95 flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                    >
                      <span>{banner.cta}</span>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    <span className="text-[10px] text-[#a09a93] font-medium">KrishiMitra Verified</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Left & Right Arrow Buttons */}
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)}
            aria-label="Previous Slide"
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-[#d1cbc4] hover:text-white flex items-center justify-center backdrop-blur-sm transition border border-white/10 focus-visible:ring-2 focus-visible:ring-[#3d9b63] focus-visible:outline-none"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % banners.length)}
            aria-label="Next Slide"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-[#d1cbc4] hover:text-white flex items-center justify-center backdrop-blur-sm transition border border-white/10 focus-visible:ring-2 focus-visible:ring-[#3d9b63] focus-visible:outline-none"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </section>

      {/* 6-Card Modular Grid Navigation Interface - Botanical Palette */}
      <section aria-labelledby="core-services-heading">
        <div className="flex items-center justify-between mb-3.5">
          <h2 id="core-services-heading" className="text-sm font-bold uppercase tracking-wider text-[#d1cbc4]">
            Core Farm Services
          </h2>
          <span className="text-[11px] text-[#5bb37d] font-medium">6 Integrated Modules</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 lg:gap-5">
          {coreServices.map((service) => (
            <Link
              key={service.id}
              href={service.href}
              className="group bg-[#1f1e1c] hover:bg-[#212019] border border-[#2d2b27] hover:border-[#3d3935] rounded-2xl p-4 sm:p-5 transition-all duration-200 hover:shadow-lg active:scale-[0.98] flex flex-col justify-between min-h-[160px] focus-visible:ring-2 focus-visible:ring-[#3d9b63] focus-visible:outline-none"
            >
              <div className="flex items-start justify-between">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#252e24] border border-[#273a2f] flex items-center justify-center text-2xl group-hover:border-[#3d3935] group-hover:bg-[#282d24] group-hover:scale-105 transition-all">
                  <span aria-hidden="true">{service.icon}</span>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-[#191917] text-[#978f87] border border-[#2d2b27] text-[10px] font-semibold group-hover:text-[#d1cbc4] group-hover:border-[#3d3935] transition-colors">
                  {service.badge}
                </span>
              </div>
              <div className="mt-3">
                <h3 className="font-bold text-xs sm:text-sm text-[#ede9e3] group-hover:text-[#5bb37d] transition-colors leading-snug">
                  {service.title}
                </h3>
                <p className="text-[10px] sm:text-[11px] text-[#978f87] line-clamp-2 mt-0.5 leading-relaxed">
                  {service.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}

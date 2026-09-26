'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAgri } from '@/context/AgriContext';

export default function LocationPage() {
  const router = useRouter();
  const { location, setLocation, addToast } = useAgri();

  const [preset, setPreset] = useState('ludhiana');
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState('');

  const districtPresets = {
    ludhiana: {
      lat: 30.9010,
      lon: 75.8573,
      district: 'Ludhiana',
      state: 'Punjab',
      region: 'North Agro-Climatic Zone',
      soilType: 'Indo-Gangetic Alluvial Loam',
    },
    pune: {
      lat: 18.5204,
      lon: 73.8567,
      district: 'Pune',
      state: 'Maharashtra',
      region: 'Western Agro-Climatic Zone',
      soilType: 'Black Cotton Soil (Regur)',
    },
    karnal: {
      lat: 29.6857,
      lon: 76.9905,
      district: 'Karnal',
      state: 'Haryana',
      region: 'North Agro-Climatic Zone',
      soilType: 'Indo-Gangetic Alluvial Soil',
    },
    indore: {
      lat: 22.7196,
      lon: 75.8577,
      district: 'Indore',
      state: 'Madhya Pradesh',
      region: 'Central Agro-Climatic Zone',
      soilType: 'Malwa Deep Black Soil',
    },
  };

  const handleAllowLocation = () => {
    setLoading(true);
    setStatusText('Fetching GPS coordinates...');

    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = parseFloat(position.coords.latitude.toFixed(4));
          const lon = parseFloat(position.coords.longitude.toFixed(4));

          const selected = districtPresets[preset] || districtPresets.ludhiana;
          setLocation({
            ...selected,
            lat,
            lon,
            granted: true,
          });

          setStatusText(`Coordinates acquired: ${lat}°, ${lon}°`);

          setTimeout(() => {
            router.push('/');
          }, 400);
        },
        (error) => {
          // Fallback to preset
          const selected = districtPresets[preset] || districtPresets.ludhiana;
          setLocation({
            ...selected,
            granted: true,
          });

          setStatusText(`Using district coordinates: ${selected.lat}°, ${selected.lon}°`);

          setTimeout(() => {
            router.push('/');
          }, 400);
        },
        { timeout: 5000, enableHighAccuracy: true }
      );
    } else {
      const selected = districtPresets[preset] || districtPresets.ludhiana;
      setLocation({
        ...selected,
        granted: true,
      });
      router.push('/');
    }
  };

  const handleDenyLocation = () => {
    const selected = districtPresets[preset] || districtPresets.ludhiana;
    setLocation({
      ...selected,
      granted: false,
    });
    router.push('/');
  };

  return (
    <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 py-8 sm:py-10 max-w-md mx-auto w-full animate-slide-up">
      
      {/* Premium Location Card */}
      <section className="bg-[#1f1e1c] border border-[#2d2b27] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden text-center">
        
        {/* Subtle warm background accents */}
        <div className="absolute -top-20 -left-20 w-48 h-48 bg-[#2e7d52]/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true"></div>
        <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-[#b8862d]/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true"></div>

        {/* Animated Location Pin Icon */}
        <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-[#2e7d52]/10 animate-ping" aria-hidden="true"></div>
          <div className="w-20 h-20 rounded-2xl bg-[#252e24] border border-[#383430] shadow-lg shadow-[#2e7d52]/10 flex items-center justify-center">
            <svg className="w-10 h-10 text-[#5bb37d] transform -rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-xl sm:text-2xl font-bold text-[#ede9e3] tracking-tight leading-snug mb-3">
          Enable Location for Local Mandi Prices & Weather Alerts
        </h1>

        {/* Subtitle & Value Proposition */}
        <p className="text-xs sm:text-sm text-[#978f87] mb-6 leading-relaxed">
          KrishiMitra uses your precise GPS coordinates to calculate hyper-local rainfall forecasts, identify the nearest APMC Mandi rates, and determine regional soil suitability.
        </p>

        {/* Feature Points */}
        <div className="bg-[#151413] border border-[#2d2b27] rounded-2xl p-4 mb-6 text-left space-y-3">
          <div className="flex items-center gap-3 text-xs text-[#c5bfb8]">
            <div className="w-7 h-7 rounded-lg bg-[#1c2119] text-[#5bb37d] flex items-center justify-center shrink-0" aria-hidden="true">
              📊
            </div>
            <span><strong className="text-[#ede9e3]">Live Mandi Rates:</strong> Nearest APMC yards within 25km radius.</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-[#c5bfb8]">
            <div className="w-7 h-7 rounded-lg bg-[#0d1c33] text-[#38bdf8] flex items-center justify-center shrink-0" aria-hidden="true">
              ⛈️
            </div>
            <span><strong className="text-[#ede9e3]">Micro-climate Alerts:</strong> Sudden storm and hailstorm warnings.</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-[#c5bfb8]">
            <div className="w-7 h-7 rounded-lg bg-[#231d10] text-[#d4a03c] flex items-center justify-center shrink-0" aria-hidden="true">
              🧪
            </div>
            <span><strong className="text-[#ede9e3]">District Soil Baseline:</strong> NPK recommendations tailored to your soil.</span>
          </div>
        </div>

        {/* Quick District Preset Selection */}
        <div className="mb-6 text-left">
          <label htmlFor="district-preset-select" className="block text-[11px] font-semibold text-[#978f87] uppercase tracking-wider mb-1.5">
            Or select test agricultural district:
          </label>
          <select
            id="district-preset-select"
            value={preset}
            onChange={(e) => setPreset(e.target.value)}
            className="w-full bg-[#151413] border border-[#302d29] rounded-xl px-3.5 py-2.5 text-xs text-[#ede9e3] focus:outline-none focus:border-[#2e7d52] focus-visible:ring-2 focus-visible:ring-[#3d9b63] cursor-pointer"
          >
            <option value="ludhiana">Ludhiana, Punjab (Alluvial Loam / Grain Hub)</option>
            <option value="pune">Pune, Maharashtra (Black Cotton Soil / Sugarcane & Onion)</option>
            <option value="karnal">Karnal, Haryana (Alluvial Soil / Basmati Rice Hub)</option>
            <option value="indore">Indore, Madhya Pradesh (Malwa Black Soil / Soybean Hub)</option>
          </select>
        </div>

        {/* Buttons Container */}
        <div className="space-y-3">
          <button
            onClick={handleAllowLocation}
            disabled={loading}
            className="w-full py-3.5 bg-[#2e7d52] hover:bg-[#266a45] text-white font-bold text-sm rounded-xl shadow-md shadow-[#2e7d52]/20 border border-[#3d9b63]/30 active:scale-[0.98] transition flex items-center justify-center gap-2 disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-[#3d9b63]"
          >
            <span>{loading ? 'Requesting Permission...' : 'Allow Location Access'}</span>
            <svg className="w-4 h-4 text-emerald-100" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>

          <button
            onClick={handleDenyLocation}
            className="w-full py-3 bg-[#272523] hover:bg-[#2d2b27] text-[#978f87] hover:text-[#ede9e3] font-medium text-xs rounded-xl border border-[#302d29] transition focus-visible:ring-2 focus-visible:ring-[#3d9b63]"
          >
            Don't Allow (Use Default District)
          </button>
        </div>

        {/* Coordinates Status Display */}
        {loading && (
          <div className="mt-4 p-3 bg-[#1c2119] border border-[#2b3325] rounded-xl text-xs text-[#8bcca2] animate-fade-in" role="status" aria-live="polite">
            <div className="flex items-center justify-center gap-2 font-mono">
              <svg className="w-4 h-4 text-[#5bb37d] animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              <span>{statusText}</span>
            </div>
          </div>
        )}

      </section>

    </div>
  );
}

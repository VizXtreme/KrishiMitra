'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAgri } from '@/context/AgriContext';

export default function SoilHealthPage() {
  const router = useRouter();
  const { soil, saveSoilProfile, addToast } = useAgri();

  const [n, setN] = useState(soil.nitrogen || 220);
  const [p, setP] = useState(soil.phosphorus || 42);
  const [k, setK] = useState(soil.potassium || 285);
  const [ph, setPh] = useState(soil.ph || 6.9);
  const [oc, setOc] = useState(soil.organicCarbon || 0.68);
  const [ec, setEc] = useState(soil.electricalConductivity || 0.78);

  const handleSave = (e) => {
    e.preventDefault();
    saveSoilProfile({
      nitrogen: Number(n),
      phosphorus: Number(p),
      potassium: Number(k),
      ph: Number(ph),
      organicCarbon: Number(oc),
      electricalConductivity: Number(ec),
    });
  };

  return (
    <div className="flex-1 flex flex-col w-full px-3.5 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-6xl mx-auto space-y-6 animate-slide-up">
      
      {/* Soil Health Card Lab Summary Header */}
      <section className="bg-[#1f1e1c] border border-[#2d2b27] rounded-3xl p-4 sm:p-5 shadow-lg relative overflow-hidden">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#5bb37d] bg-[#1c2119] px-2.5 py-0.5 rounded-full border border-[#2b3325] mb-2">
              🏛️ Ministry of Agriculture SHC Card
            </span>
            <h2 className="text-base font-bold text-[#ede9e3]">Laboratory Soil Health Certificate</h2>
            <p className="text-xs text-[#978f87] mt-1">
              Sample ID: <strong className="text-[#5bb37d] font-mono">{soil.sampleId || 'SHC-2026-LDH-4491'}</strong>
            </p>
            <p className="text-[11px] text-[#978f87] mt-0.5">
              Issued By: {soil.labName || 'District Soil Testing Center, KVK'}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#252e24] border border-[#383430] flex items-center justify-center text-2xl shrink-0" aria-hidden="true">
            🧪
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#2d2b27] flex flex-wrap items-center justify-between text-xs gap-2">
          <span className="text-[#978f87]">Last Lab Verification: <strong className="text-[#ede9e3]">{soil.testedDate || 'Recent'}</strong></span>
          <span className="px-2.5 py-0.5 rounded-full bg-[#1c2119] text-[#8bcca2] border border-[#2b3325] font-semibold text-[11px]">
            {soil.status || 'Fertile'}
          </span>
        </div>
      </section>

      {/* Structured Profile Form for Laboratory Measurements */}
      <section className="bg-[#1f1e1c] border border-[#2d2b27] rounded-3xl p-4 sm:p-6 shadow-lg space-y-5">
        <div className="border-b border-[#2d2b27] pb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#cdc7c0]">
            Enter Laboratory Measurements
          </h3>
          <p className="text-[11px] text-[#978f87] mt-0.5">
            Input the physical readings from your printed Soil Health Card to update regional recommendations.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* 1. Nitrogen (N) */}
          <div className="bg-[#151413] border border-[#2d2b27] rounded-2xl p-3.5 sm:p-4">
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="soil-n-input" className="text-xs font-bold text-[#ede9e3] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2e7d52]" aria-hidden="true"></span>
                <span>Available Nitrogen (N)</span>
              </label>
              <span className="text-[11px] font-mono text-[#8bcca2] bg-[#1c2119] px-2 py-0.5 rounded-md border border-[#2b3325]">
                kg/ha
              </span>
            </div>
            <div className="flex items-center gap-3">
              <input
                id="soil-n-input"
                type="number"
                step="1"
                value={n}
                onChange={(e) => setN(e.target.value)}
                required
                className="flex-1 px-3.5 py-2.5 bg-[#1b1a18] border border-[#302d29] rounded-xl text-[#ede9e3] font-mono font-bold text-sm focus:outline-none focus:border-[#2e7d52] focus-visible:ring-2 focus-visible:ring-[#3d9b63]"
              />
              <div className="text-[11px] text-[#978f87] shrink-0">
                Rating: <span className="text-[#5bb37d] font-semibold">Medium (Optimal)</span>
              </div>
            </div>
            <p className="text-[10px] text-[#7a756f] mt-1.5">Baseline range: &lt;200 Low | 200-300 Medium | &gt;300 High</p>
          </div>

          {/* 2. Phosphorus (P) */}
          <div className="bg-[#151413] border border-[#2d2b27] rounded-2xl p-3.5 sm:p-4">
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="soil-p-input" className="text-xs font-bold text-[#ede9e3] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2e7d52]" aria-hidden="true"></span>
                <span>Available Phosphorus (P)</span>
              </label>
              <span className="text-[11px] font-mono text-[#8bcca2] bg-[#1c2119] px-2 py-0.5 rounded-md border border-[#2b3325]">
                kg/ha
              </span>
            </div>
            <div className="flex items-center gap-3">
              <input
                id="soil-p-input"
                type="number"
                step="1"
                value={p}
                onChange={(e) => setP(e.target.value)}
                required
                className="flex-1 px-3.5 py-2.5 bg-[#1b1a18] border border-[#302d29] rounded-xl text-[#ede9e3] font-mono font-bold text-sm focus:outline-none focus:border-[#2e7d52] focus-visible:ring-2 focus-visible:ring-[#3d9b63]"
              />
              <div className="text-[11px] text-[#978f87] shrink-0">
                Rating: <span className="text-[#5bb37d] font-semibold">Adequate</span>
              </div>
            </div>
            <p className="text-[10px] text-[#7a756f] mt-1.5">Baseline range: &lt;25 Low | 25-50 Medium | &gt;50 High</p>
          </div>

          {/* 3. Potassium (K) */}
          <div className="bg-[#151413] border border-[#2d2b27] rounded-2xl p-3.5 sm:p-4">
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="soil-k-input" className="text-xs font-bold text-[#ede9e3] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2e7d52]" aria-hidden="true"></span>
                <span>Available Potassium (K)</span>
              </label>
              <span className="text-[11px] font-mono text-[#8bcca2] bg-[#1c2119] px-2 py-0.5 rounded-md border border-[#2b3325]">
                kg/ha
              </span>
            </div>
            <div className="flex items-center gap-3">
              <input
                id="soil-k-input"
                type="number"
                step="1"
                value={k}
                onChange={(e) => setK(e.target.value)}
                required
                className="flex-1 px-3.5 py-2.5 bg-[#1b1a18] border border-[#302d29] rounded-xl text-[#ede9e3] font-mono font-bold text-sm focus:outline-none focus:border-[#2e7d52] focus-visible:ring-2 focus-visible:ring-[#3d9b63]"
              />
              <div className="text-[11px] text-[#978f87] shrink-0">
                Rating: <span className="text-[#5bb37d] font-semibold">High Fertility</span>
              </div>
            </div>
            <p className="text-[10px] text-[#7a756f] mt-1.5">Baseline range: &lt;150 Low | 150-280 Medium | &gt;280 High</p>
          </div>

          {/* 4. pH Level */}
          <div className="bg-[#151413] border border-[#2d2b27] rounded-2xl p-3.5 sm:p-4">
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="soil-ph-input" className="text-xs font-bold text-[#ede9e3] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2e7d52]" aria-hidden="true"></span>
                <span>pH Level (Acidity / Alkalinity)</span>
              </label>
              <span className="text-[11px] font-mono text-[#8bcca2] bg-[#1c2119] px-2 py-0.5 rounded-md border border-[#2b3325]">
                Scale 0-14
              </span>
            </div>
            <div className="flex items-center gap-3">
              <input
                id="soil-ph-input"
                type="number"
                step="0.1"
                value={ph}
                onChange={(e) => setPh(e.target.value)}
                required
                className="flex-1 px-3.5 py-2.5 bg-[#1b1a18] border border-[#302d29] rounded-xl text-[#ede9e3] font-mono font-bold text-sm focus:outline-none focus:border-[#2e7d52] focus-visible:ring-2 focus-visible:ring-[#3d9b63]"
              />
              <div className="text-[11px] text-[#978f87] shrink-0">
                Rating: <span className="text-[#5bb37d] font-semibold">Neutral (Ideal)</span>
              </div>
            </div>
            <p className="text-[10px] text-[#7a756f] mt-1.5">&lt;6.5 Acidic | 6.5 - 7.5 Neutral | &gt;7.5 Alkaline</p>
          </div>

          {/* 5. Organic Carbon (OC) */}
          <div className="bg-[#151413] border border-[#2d2b27] rounded-2xl p-3.5 sm:p-4">
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="soil-oc-input" className="text-xs font-bold text-[#ede9e3] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2e7d52]" aria-hidden="true"></span>
                <span>Organic Carbon (OC)</span>
              </label>
              <span className="text-[11px] font-mono text-[#8bcca2] bg-[#1c2119] px-2 py-0.5 rounded-md border border-[#2b3325]">
                % Percentage
              </span>
            </div>
            <div className="flex items-center gap-3">
              <input
                id="soil-oc-input"
                type="number"
                step="0.01"
                value={oc}
                onChange={(e) => setOc(e.target.value)}
                required
                className="flex-1 px-3.5 py-2.5 bg-[#1b1a18] border border-[#302d29] rounded-xl text-[#ede9e3] font-mono font-bold text-sm focus:outline-none focus:border-[#2e7d52] focus-visible:ring-2 focus-visible:ring-[#3d9b63]"
              />
              <div className="text-[11px] text-[#978f87] shrink-0">
                Rating: <span className="text-[#5bb37d] font-semibold">Medium (Good)</span>
              </div>
            </div>
            <p className="text-[10px] text-[#7a756f] mt-1.5">&lt;0.5% Low | 0.5 - 0.75% Medium | &gt;0.75% High</p>
          </div>

          {/* 6. Electrical Conductivity (EC) */}
          <div className="bg-[#151413] border border-[#2d2b27] rounded-2xl p-3.5 sm:p-4">
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="soil-ec-input" className="text-xs font-bold text-[#ede9e3] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2e7d52]" aria-hidden="true"></span>
                <span>Electrical Conductivity (EC)</span>
              </label>
              <span className="text-[11px] font-mono text-[#8bcca2] bg-[#1c2119] px-2 py-0.5 rounded-md border border-[#2b3325]">
                dS/m (Salinity)
              </span>
            </div>
            <div className="flex items-center gap-3">
              <input
                id="soil-ec-input"
                type="number"
                step="0.01"
                value={ec}
                onChange={(e) => setEc(e.target.value)}
                required
                className="flex-1 px-3.5 py-2.5 bg-[#1b1a18] border border-[#302d29] rounded-xl text-[#ede9e3] font-mono font-bold text-sm focus:outline-none focus:border-[#2e7d52] focus-visible:ring-2 focus-visible:ring-[#3d9b63]"
              />
              <div className="text-[11px] text-[#978f87] shrink-0">
                Rating: <span className="text-[#5bb37d] font-semibold">Non-Saline</span>
              </div>
            </div>
            <p className="text-[10px] text-[#7a756f] mt-1.5">&lt;1.0 dS/m Normal (Safe) | 1.0 - 2.0 Critical | &gt;2.0 Saline Injury</p>
          </div>

          </div>

          {/* Primary Save Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 sm:py-4 bg-[#2e7d52] hover:bg-[#266a45] text-white font-bold text-sm sm:text-base rounded-2xl shadow-lg shadow-[#2e7d52]/20 hover:shadow-[#2e7d52]/30 active:scale-[0.98] transition flex items-center justify-center gap-2 border border-[#3d9b63]/30 focus-visible:ring-2 focus-visible:ring-[#3d9b63]"
            >
              <svg className="w-5 h-5 text-emerald-100" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              <span>Save Soil Profile</span>
            </button>
          </div>

        </form>
      </section>

      {/* Sync Info */}
      <section className="bg-[#151413] border border-[#2d2b27] rounded-2xl p-4 text-xs text-[#978f87] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base" aria-hidden="true">🔄</span>
          <span>Saved data automatically synchronizes with Crop Advisory.</span>
        </div>
        <Link href="/crop-ai" className="text-[#5bb37d] font-bold hover:underline shrink-0 ml-2 focus-visible:ring-2 focus-visible:ring-[#3d9b63]">
          Test Fit &rarr;
        </Link>
      </section>

    </div>
  );
}

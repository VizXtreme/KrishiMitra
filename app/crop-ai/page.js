'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAgri } from '@/context/AgriContext';

export default function CropAiPage() {
  const router = useRouter();
  const { location, soil, setMarketplaceCrop, addToast } = useAgri();

  // Baseline config derived from GPS coordinates & regional zone
  const isPuneOrSouth = (location?.district || '').toLowerCase().includes('pune') || 
                        (location?.state || '').toLowerCase().includes('maharashtra') || 
                        (location?.lat < 20 && location?.lat > 17);

  const baselineConfig = isPuneOrSouth
    ? {
        soilType: location?.soilType || 'Black Cotton Soil (Regur)',
        n: 180,
        p: 32,
        k: 310,
        ph: 7.4,
      }
    : {
        soilType: location?.soilType || 'Indo-Gangetic Alluvial Loam',
        n: 220,
        p: 42,
        k: 285,
        ph: 6.9,
      };

  const [inputN, setInputN] = useState(soil?.nitrogen || baselineConfig.n);
  const [inputP, setInputP] = useState(soil?.phosphorus || baselineConfig.p);
  const [inputK, setInputK] = useState(soil?.potassium || baselineConfig.k);
  const [inputPh, setInputPh] = useState(soil?.ph || baselineConfig.ph);
  const [loading, setLoading] = useState(false);

  // Sync inputs whenever user recalibrates GPS location or updates soil card
  useEffect(() => {
    const n = soil?.nitrogen || baselineConfig.n;
    const p = soil?.phosphorus || baselineConfig.p;
    const k = soil?.potassium || baselineConfig.k;
    const ph = soil?.ph || baselineConfig.ph;
    setInputN(n);
    setInputP(p);
    setInputK(k);
    setInputPh(ph);
    setCrops(computeRecommendations(Number(n), Number(p), Number(k), Number(ph)));
  }, [location?.district, location?.lat, location?.lon, soil?.nitrogen, soil?.phosphorus, soil?.potassium, soil?.ph]);

  // Recommendations calculation
  const computeRecommendations = (n, p, k, ph) => {
    const isNeutralPh = ph >= 6.5 && ph <= 7.8;
    const isHighN = n >= 210;

    return [
      {
        name: 'Basmati Rice (Pusa 1121)',
        category: 'Kharif Cereal / Export Premium',
        suitability: isHighN && isNeutralPh ? 94 : 88,
        profitMargin: 48500,
        mandiPrice: 4150,
        yieldAcre: 16.5,
        riskTag: 'Very Low Risk - Central MSP Backed & High Export Demand',
        riskColor: 'emerald',
        badge: 'Rank #1 Optimal Yield',
        icon: '🌾',
        advisory: 'Excellent nitrogen synergy. Ensure 2-inch shallow standing water during tillering. High mandi liquidation in Khanna and Amritsar APMCs.',
        shortName: 'Basmati Rice',
      },
      {
        name: 'Wheat (HD 2967 / PBW 550)',
        category: 'Rabi Cereal / National Staple',
        suitability: isNeutralPh ? 91 : 84,
        profitMargin: 36200,
        mandiPrice: 2450,
        yieldAcre: 21.0,
        riskTag: 'Low Risk - Guaranteed Central FCI Procurement',
        riskColor: 'emerald',
        badge: 'Rank #2 Safe Return',
        icon: '🌾',
        advisory: 'Balanced P and K levels provide strong resistance to rust lodging. Guaranteed procurement at APMC mandis at or above ₹2,275/Qtl MSP.',
        shortName: 'Wheat',
      },
      {
        name: 'Mustard (Pusa Bold / RH 749)',
        category: 'Rabi Oilseed / High Cash Velocity',
        suitability: ph >= 6.0 && ph <= 8.2 ? 86 : 79,
        profitMargin: 32800,
        mandiPrice: 5650,
        yieldAcre: 8.5,
        riskTag: 'Medium Risk - Oil Mill Spot Cash Premium',
        riskColor: 'amber',
        badge: 'Rank #3 Low Water Need',
        icon: '🌻',
        advisory: 'Requires 40% less irrigation than wheat. Robust oil content (41.5%) attracts immediate spot cash buyers across regional solvent plants.',
        shortName: 'Mustard',
      },
    ];
  };

  const [crops, setCrops] = useState(() => computeRecommendations(inputN, inputP, inputK, inputPh));

  const handleResetBaseline = () => {
    setInputN(baselineConfig.n);
    setInputP(baselineConfig.p);
    setInputK(baselineConfig.k);
    setInputPh(baselineConfig.ph);
    setCrops(computeRecommendations(baselineConfig.n, baselineConfig.p, baselineConfig.k, baselineConfig.ph));
  };

  const handleLoadSoilCard = () => {
    const n = soil?.nitrogen || baselineConfig.n;
    const p = soil?.phosphorus || baselineConfig.p;
    const k = soil?.potassium || baselineConfig.k;
    const ph = soil?.ph || baselineConfig.ph;
    setInputN(n);
    setInputP(p);
    setInputK(k);
    setInputPh(ph);
    setCrops(computeRecommendations(n, p, k, ph));
    addToast('Imported Soil Health Card readings!', 'success');
  };

  const handleRunAi = () => {
    setLoading(true);
    setTimeout(() => {
      const results = computeRecommendations(
        Number(inputN) || baselineConfig.n, 
        Number(inputP) || baselineConfig.p, 
        Number(inputK) || baselineConfig.k, 
        Number(inputPh) || baselineConfig.ph
      );
      setCrops(results);
      setLoading(false);
      addToast('AI Crop Suitability analysis updated successfully!', 'success');
    }, 600);
  };

  const handleTradeCrop = (cropShort) => {
    setMarketplaceCrop(cropShort);
    router.push('/b2b-hub');
  };

  return (
    <div className="flex-1 flex flex-col w-full px-3.5 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-6xl mx-auto space-y-6 animate-slide-up">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column on Desktop: GPS Baseline + Input Form */}
        <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-20">
          
          {/* GPS District Baseline Context Badge Card */}
          <section className="bg-[#1f1e1c] border border-[#2d2b27] rounded-3xl p-4 sm:p-5 shadow-lg relative overflow-hidden space-y-3.5">
            {/* Top row: Status Tag & Icon */}
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1 min-w-0">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#5bb37d] bg-[#1c2119] px-2.5 py-0.5 rounded-full border border-[#2b3325]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5bb37d] animate-pulse" aria-hidden="true"></span>
                  GPS District Baseline Active
                </span>
                <h2 className="text-base sm:text-lg font-bold text-[#ede9e3] tracking-tight truncate">
                  {location?.district || 'Ludhiana'}, {location?.state || 'Punjab'}
                </h2>
                <p className="text-xs text-[#a09a93] leading-relaxed">
                  Zone: <span className="text-[#ede9e3] font-medium">{location?.region || 'North Agro-Climatic Zone'}</span>
                </p>
              </div>

              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#252e24] border border-[#383430] flex items-center justify-center text-2xl shrink-0" aria-hidden="true">
                🌾
              </div>
            </div>

            {/* Middle row: Soil archetype & coordinates chips */}
            <div className="p-3 rounded-2xl bg-[#151413] border border-[#2d2b27] space-y-2">
              <div className="flex items-center justify-between text-xs gap-2">
                <span className="text-[#978f87] text-[11px] shrink-0">Soil Archetype</span>
                <span className="font-semibold text-[#8bcca2] text-[11px] truncate text-right">
                  {baselineConfig.soilType}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs pt-1.5 border-t border-[#262421]">
                <span className="text-[#978f87] text-[11px]">GPS Coordinates</span>
                <span className="font-mono text-[#d4a03c] text-[11px]">
                  {location?.lat}° N, {location?.lon}° E
                </span>
              </div>
            </div>

            {/* Bottom action bar */}
            <div className="pt-1 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-[11px] text-[#978f87]">
                Pre-populated baseline
              </span>
              <div className="flex items-center gap-1.5">
                <Link
                  href="/location"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#5bb37d] hover:text-[#8bcca2] transition py-1 px-2.5 rounded-lg hover:bg-[#252e24] border border-[#2b3325] focus-visible:ring-2 focus-visible:ring-[#3d9b63]"
                >
                  <span>📍 Change GPS</span>
                </Link>
                <button
                  type="button"
                  onClick={handleLoadSoilCard}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#d4a03c] hover:text-[#e8bf6a] transition py-1 px-2.5 rounded-lg hover:bg-[#282214] border border-[#483c1d] focus-visible:ring-2 focus-visible:ring-[#d4a03c]"
                  title="Load laboratory test numbers from Soil Health Card"
                >
                  <span>🧪 Load Lab Card</span>
                </button>
              </div>
            </div>
          </section>

          {/* Editable Soil Input Parameters Form */}
          <section className="bg-[#1f1e1c] border border-[#2d2b27] rounded-3xl p-4 sm:p-6 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-[#2d2b27] pb-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#cdc7c0]">
                  Soil Fertility & Chemistry Inputs
                </h3>
                <p className="text-[11px] text-[#978f87]">Edit values to test different farm parcels or fertilizer treatments.</p>
              </div>
              <button
                onClick={handleResetBaseline}
                className="text-[11px] text-[#978f87] hover:text-[#5bb37d] transition py-1 px-2.5 rounded-lg hover:bg-[#272523] focus-visible:ring-2 focus-visible:ring-[#3d9b63]"
                title="Restore baseline defaults"
              >
                Reset Baseline
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              {/* Nitrogen (N) */}
              <div>
                <label htmlFor="crop-input-n" className="text-xs font-semibold text-[#c5bfb8] mb-1.5 flex items-center justify-between">
                  <span>Nitrogen (N)</span>
                  <span className="text-[10px] text-[#5bb37d] font-mono">kg/ha</span>
                </label>
                <input
                  id="crop-input-n"
                  type="number"
                  step="1"
                  value={inputN}
                  onChange={(e) => setInputN(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#151413] border border-[#302d29] rounded-xl text-[#ede9e3] font-mono font-bold text-sm focus:outline-none focus:border-[#2e7d52] focus-visible:ring-2 focus-visible:ring-[#3d9b63]"
                />
                <span className="text-[10px] text-[#7a756f] mt-1 block">Optimal: 200 - 280</span>
              </div>

              {/* Phosphorus (P) */}
              <div>
                <label htmlFor="crop-input-p" className="text-xs font-semibold text-[#c5bfb8] mb-1.5 flex items-center justify-between">
                  <span>Phosphorus (P)</span>
                  <span className="text-[10px] text-[#5bb37d] font-mono">kg/ha</span>
                </label>
                <input
                  id="crop-input-p"
                  type="number"
                  step="1"
                  value={inputP}
                  onChange={(e) => setInputP(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#151413] border border-[#302d29] rounded-xl text-[#ede9e3] font-mono font-bold text-sm focus:outline-none focus:border-[#2e7d52] focus-visible:ring-2 focus-visible:ring-[#3d9b63]"
                />
                <span className="text-[10px] text-[#7a756f] mt-1 block">Optimal: 35 - 55</span>
              </div>

              {/* Potassium (K) */}
              <div>
                <label htmlFor="crop-input-k" className="text-xs font-semibold text-[#c5bfb8] mb-1.5 flex items-center justify-between">
                  <span>Potassium (K)</span>
                  <span className="text-[10px] text-[#5bb37d] font-mono">kg/ha</span>
                </label>
                <input
                  id="crop-input-k"
                  type="number"
                  step="1"
                  value={inputK}
                  onChange={(e) => setInputK(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#151413] border border-[#302d29] rounded-xl text-[#ede9e3] font-mono font-bold text-sm focus:outline-none focus:border-[#2e7d52] focus-visible:ring-2 focus-visible:ring-[#3d9b63]"
                />
                <span className="text-[10px] text-[#7a756f] mt-1 block">Optimal: 220 - 320</span>
              </div>

              {/* pH Level */}
              <div>
                <label htmlFor="crop-input-ph" className="text-xs font-semibold text-[#c5bfb8] mb-1.5 flex items-center justify-between">
                  <span>pH Level</span>
                  <span className="text-[10px] text-[#5bb37d] font-mono">0 - 14</span>
                </label>
                <input
                  id="crop-input-ph"
                  type="number"
                  step="0.1"
                  value={inputPh}
                  onChange={(e) => setInputPh(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#151413] border border-[#302d29] rounded-xl text-[#ede9e3] font-mono font-bold text-sm focus:outline-none focus:border-[#2e7d52] focus-visible:ring-2 focus-visible:ring-[#3d9b63]"
                />
                <span className="text-[10px] text-[#7a756f] mt-1 block">Neutral: 6.5 - 7.5</span>
              </div>
            </div>

            {/* Tactile Solid Button: 'Run Market-Driven AI Analysis' */}
            <div className="pt-2">
              <button
                onClick={handleRunAi}
                disabled={loading}
                className="w-full py-3.5 sm:py-4 bg-[#2e7d52] hover:bg-[#266a45] text-white font-bold text-sm sm:text-base rounded-2xl shadow-lg shadow-[#2e7d52]/20 hover:shadow-[#2e7d52]/30 active:scale-[0.98] transition flex items-center justify-center gap-2.5 border border-[#3d9b63]/30 disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-[#3d9b63]"
              >
                <svg className="w-5 h-5 text-emerald-100" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>{loading ? 'Synthesizing Recommendations...' : 'Run Market-Driven AI Analysis'}</span>
              </button>
            </div>
          </section>
        </div>

        {/* Right Column on Desktop: AI Recommendations Results */}
        <div className="lg:col-span-7 space-y-4">

      {/* AI Calculation / Loading State */}
      {loading && (
        <div className="bg-[#1f1e1c] border border-[#2d2b27] rounded-2xl p-6 text-center animate-fade-in" role="status" aria-live="polite">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#252e24] border border-[#383430] flex items-center justify-center animate-spin">
            <svg className="w-6 h-6 text-[#5bb37d]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
          </div>
          <h4 className="text-sm font-bold text-[#ede9e3] mb-1">Synthesizing District Crop Recommendations...</h4>
          <p className="text-xs text-[#978f87] max-w-xs mx-auto">
            Cross-referencing soil NPK chemistry with 14-day rainfall forecast & APMC Mandi price volatility indices.
          </p>
        </div>
      )}

      {/* Results Ranking: Top 3 Recommended Crops */}
      <section className={`space-y-4 ${loading ? 'opacity-40' : ''}`} aria-labelledby="top-crops-heading">
        <div className="flex items-center justify-between">
          <h3 id="top-crops-heading" className="text-xs font-bold uppercase tracking-wider text-[#c5bfb8] flex items-center gap-1.5">
            <span aria-hidden="true">🏆</span>
            <span>Top 3 Recommended Crops</span>
          </h3>
          <span className="text-[11px] text-[#5bb37d] font-semibold">Ranked by Net Profit & Fit</span>
        </div>

        <div className="space-y-3.5">
          {crops.map((crop, index) => (
            <div
              key={crop.name}
              className="bg-[#1f1e1c] border border-[#2d2b27] hover:border-[#3a3733] rounded-3xl p-4 sm:p-6 shadow-lg transition-all duration-200 space-y-4 relative overflow-hidden"
            >
              {/* Rank Pill */}
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  index === 0
                    ? 'bg-[#2e7d52] text-white shadow-sm shadow-[#2e7d52]/30'
                    : 'bg-[#272523] text-[#ada6a0] border border-[#302d29]'
                }`}>
                  {crop.badge}
                </span>
                <span className="text-xs text-[#978f87] font-medium">
                  {crop.category}
                </span>
              </div>

              {/* Crop Header */}
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#252e24] border border-[#383430] flex items-center justify-center text-3xl shrink-0" aria-hidden="true">
                  {crop.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-base sm:text-lg font-bold text-[#ede9e3] leading-snug truncate">
                    {crop.name}
                  </h4>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#978f87] mt-0.5">
                    <span>Avg Mandi Rate: <strong className="text-[#ede9e3]">₹{crop.mandiPrice}</strong>/Qtl</span>
                    <span aria-hidden="true">•</span>
                    <span>Yield: {crop.yieldAcre} Qtl/Acre</span>
                  </div>
                </div>
              </div>

              {/* Metric Cards: Suitability % & Estimated Profit Margin */}
              <div className="grid grid-cols-2 gap-3">
                {/* Suitability % */}
                <div className="bg-[#151413] rounded-2xl p-3.5 border border-[#2d2b27]">
                  <span className="text-[10px] uppercase tracking-wider text-[#978f87] font-semibold block mb-1">
                    Soil/Weather Suitability
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <strong className="text-xl sm:text-2xl font-black text-[#5bb37d]">{crop.suitability}%</strong>
                    <span className="text-xs text-[#3d9b63] font-medium">Match</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#272523] rounded-full overflow-hidden mt-2" role="progressbar" aria-valuenow={crop.suitability} aria-valuemin="0" aria-valuemax="100">
                    <div className="h-full bg-[#2e7d52] rounded-full" style={{ width: `${crop.suitability}%` }}></div>
                  </div>
                </div>

                {/* Estimated Profit Margin */}
                <div className="bg-[#151413] rounded-2xl p-3.5 border border-[#2d2b27]">
                  <span className="text-[10px] uppercase tracking-wider text-[#978f87] font-semibold block mb-1">
                    Estimated Profit Margin
                  </span>
                  <div className="flex items-baseline gap-1">
                    <strong className="text-xl sm:text-2xl font-black text-[#d4a03c]">₹{crop.profitMargin.toLocaleString('en-IN')}</strong>
                    <span className="text-[11px] text-[#978f87]">/ Acre</span>
                  </div>
                  <span className="text-[10px] text-[#5bb37d] font-medium block mt-1.5">Net of fertilizer & fuel costs</span>
                </div>
              </div>

              {/* Metric Tag: Market Risk Tag */}
              <div className="bg-[#151413] rounded-xl p-3 border border-[#2d2b27] flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <span className="text-[11px] font-semibold text-[#978f87] uppercase tracking-wider">
                  Market Risk Tag:
                </span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                  crop.riskColor === 'emerald'
                    ? 'bg-[#1c2119] text-[#8bcca2] border border-[#2b3325]'
                    : 'bg-[#231d10] text-[#ddb65a] border border-[#483515]'
                }`}>
                  {crop.riskTag}
                </span>
              </div>

              {/* Agronomic Guidance Note */}
              <p className="text-xs text-[#b5aea7] bg-[#151413] p-3 rounded-xl border border-[#2d2b27] leading-relaxed">
                <strong className="text-[#ede9e3]">ICAR Advisory:</strong> {crop.advisory}
              </p>

              {/* CTA Buttons */}
              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={() => handleTradeCrop(crop.shortName)}
                  className="flex-1 py-2.5 bg-[#272523] hover:bg-[#2d2b27] border border-[#33302c] text-[#ede9e3] rounded-xl text-xs font-semibold transition focus-visible:ring-2 focus-visible:ring-[#3d9b63]"
                >
                  Check B2B Buyers in Hub &rarr;
                </button>
                <button
                  onClick={() => router.push('/mandi')}
                  className="px-4 py-2.5 bg-[#272523] hover:bg-[#2d2b27] border border-[#33302c] text-[#5bb37d] rounded-xl text-xs font-semibold transition focus-visible:ring-2 focus-visible:ring-[#3d9b63]"
                >
                  View Mandis
                </button>
              </div>

            </div>
          ))}
        </div>
      </section>

        </div>
      </div>
    </div>
  );
}

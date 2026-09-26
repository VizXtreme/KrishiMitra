'use client';

import React, { useState } from 'react';
import { useAgri } from '@/context/AgriContext';
import PortalModal from '@/components/PortalModal';

export default function SchemesPage() {
  const { schemes } = useAgri();
  const [activeCategory, setActiveCategory] = useState('All');
  const [activePortal, setActivePortal] = useState(null);

  const categories = ['All', 'Subsidies', 'Crop Insurance', 'Soil Management'];

  const filteredSchemes = schemes.filter((s) => {
    if (activeCategory === 'All') return true;
    return s.category === activeCategory;
  });

  return (
    <div className="flex-1 flex flex-col w-full px-3.5 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-6xl mx-auto space-y-6 animate-slide-up">
      
      {/* Header Banner */}
      <section className="bg-[#1a1810] border border-[#383014] rounded-3xl p-4 sm:p-5 shadow-lg flex items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#d4a03c] block mb-1">
            Central & State Farmer Welfare Schemes
          </span>
          <h2 className="text-base sm:text-lg font-bold text-[#ede9e3]">Direct Benefit Transfer (DBT) Directory</h2>
          <p className="text-xs text-[#a09688] mt-1">
            Verified application gateways for central financial assistance, crop insurance, and equipment grants.
          </p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-[#261e12] border border-[#453618] flex items-center justify-center text-2xl shrink-0" aria-hidden="true">
          🏛️
        </div>
      </section>

      {/* Premium Category Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar touch-pan-x" role="tablist" aria-label="Scheme Categories">
        {categories.map((cat) => (
          <button
            key={cat}
            role="tab"
            aria-selected={activeCategory === cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#3d9b63] focus-visible:outline-none ${
              activeCategory === cat
                ? 'bg-[#2e7d52] text-white shadow-sm shadow-[#2e7d52]/30 border border-[#3d9b63]/30'
                : 'bg-[#1f1e1c] text-[#978f87] hover:text-[#ede9e3] border border-[#2d2b27]'
            }`}
          >
            {cat === 'All'
              ? '🌟 All Schemes'
              : cat === 'Subsidies'
              ? '💰 Subsidies'
              : cat === 'Crop Insurance'
              ? '🛡️ Crop Insurance'
              : '🧪 Soil Management'}
          </button>
        ))}
      </div>

      {/* Directory Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5" aria-label="Schemes List">
        {filteredSchemes.map((scheme) => (
          <article
            key={scheme.id}
            className="bg-[#1f1e1c] border border-[#2d2b27] hover:border-[#3d3935] rounded-3xl p-4 sm:p-6 shadow-lg transition space-y-4 relative overflow-hidden"
          >
            {/* Category Tag & Badge */}
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-[#272523] text-[#ada6a0] border border-[#302d29] text-[10px] font-bold uppercase tracking-wider">
                {scheme.category}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#1c2119] text-[#5bb37d] border border-[#2b3325] text-[10px] font-bold">
                {scheme.badge}
              </span>
            </div>

            {/* Official Scheme Title */}
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#ede9e3] leading-snug">
                {scheme.title}
              </h3>
              <span className="text-[11px] font-mono text-[#5bb37d] mt-0.5 block">Portal: {scheme.portalName}</span>
            </div>

            {/* Short 2-Line Bulleted Benefit Brief */}
            <div className="bg-[#151413] rounded-2xl p-4 border border-[#2d2b27] space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#978f87] block mb-1">
                Key Scheme Benefits:
              </span>
              <ul className="space-y-1.5 text-xs text-[#c5bfb8]">
                {scheme.benefits.map((b, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#5bb37d] font-bold shrink-0 mt-0.5" aria-hidden="true">•</span>
                    <span className="leading-relaxed">{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Eligibility Criteria */}
            <div className="text-xs text-[#b5aea7] px-1">
              <strong className="text-[#ede9e3] block mb-0.5">Eligibility Criteria:</strong>
              <p className="text-[#978f87] text-[11px] leading-relaxed">
                {scheme.eligibility}
              </p>
            </div>

            {/* Primary Green 'Apply Online' Button & External Link */}
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => setActivePortal(scheme)}
                className="flex-1 py-3 bg-[#2e7d52] hover:bg-[#266a45] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-[#2e7d52]/20 border border-[#3d9b63]/30 active:scale-[0.98] transition flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-[#3d9b63]"
              >
                <span>Apply Online</span>
                <svg className="w-4 h-4 text-emerald-100" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>

              <a
                href={scheme.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${scheme.portalName} in external browser window`}
                className="p-3 bg-[#272523] hover:bg-[#2d2b27] text-[#ada6a0] hover:text-[#ede9e3] rounded-xl text-xs border border-[#302d29] transition focus-visible:ring-2 focus-visible:ring-[#3d9b63]"
                title="Open in External Browser"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>

          </article>
        ))}
      </section>

      {/* In-App Browser Modal */}
      {activePortal && (
        <PortalModal portal={activePortal} onClose={() => setActivePortal(null)} />
      )}

    </div>
  );
}

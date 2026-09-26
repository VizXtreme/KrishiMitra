'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAgri } from '@/context/AgriContext';

export default function MandiPricesPage() {
  const router = useRouter();
  const { location, mandiData, marketplace, setMarketplaceCrop } = useAgri();

  const [selectedCrop, setSelectedCrop] = useState(marketplace.selectedCrop || 'Wheat');
  const [sortBy, setSortBy] = useState('distance'); // 'distance' | 'price' | 'arrival'

  const crops = Object.keys(mandiData.msp || {});
  const activeMsp = mandiData.msp[selectedCrop] || 2275;

  // Build comparative mandis for selected crop with realistic variance
  let mandis = (mandiData.mandis || []).map((m) => {
    const priceFactor = activeMsp / 2275;
    const minPrice = Math.round(m.minPrice * priceFactor);
    const maxPrice = Math.round(m.maxPrice * priceFactor);
    const modalPrice = Math.round(m.modalPrice * priceFactor);
    const diffFromMsp = modalPrice - activeMsp;

    return {
      ...m,
      crop: selectedCrop,
      minPrice,
      maxPrice,
      modalPrice,
      diffFromMsp,
      trendDiff: diffFromMsp >= 0 ? `+₹${diffFromMsp} above MSP` : `-₹${Math.abs(diffFromMsp)} below MSP`,
      isAboveMsp: diffFromMsp >= 0,
    };
  });

  // Apply sorting
  if (sortBy === 'price') {
    mandis.sort((a, b) => b.modalPrice - a.modalPrice);
  } else if (sortBy === 'arrival') {
    mandis.sort((a, b) => b.arrivalQty - a.arrivalQty);
  } else {
    mandis.sort((a, b) => a.distanceKm - b.distanceKm);
  }

  const handleCropChange = (e) => {
    const crop = e.target.value;
    setSelectedCrop(crop);
    setMarketplaceCrop(crop);
  };

  const handleSellInB2B = () => {
    setMarketplaceCrop(selectedCrop);
    router.push('/b2b-hub');
  };

  return (
    <div className="flex-1 flex flex-col w-full px-3.5 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-6xl mx-auto space-y-6 animate-slide-up">
      
      {/* Top Layout: Select Crop & Central Govt MSP Box */}
      <section className="bg-[#1f1e1c] border border-[#2d2b27] rounded-3xl p-4 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          
          {/* Left: Clear 'Select Crop' Dropdown Choice Filter */}
          <div className="flex-1">
            <label htmlFor="mandi-crop-dropdown" className="block text-xs font-bold uppercase tracking-wider text-[#a09a93] mb-1.5">
              Select Crop Filter:
            </label>
            <div className="relative">
              <select
                id="mandi-crop-dropdown"
                value={selectedCrop}
                onChange={handleCropChange}
                aria-label="Filter Mandi Rates by Crop"
                className="w-full pl-4 pr-10 py-3 bg-[#151413] border-2 border-[#2d2b27] hover:border-[#2e7d52]/60 rounded-2xl text-[#ede9e3] font-bold text-sm sm:text-base focus:outline-none focus:border-[#3d9b63] appearance-none shadow-sm cursor-pointer focus-visible:ring-2 focus-visible:ring-[#3d9b63]"
              >
                {crops.map((c) => (
                  <option key={c} value={c} className="bg-[#1f1e1c] text-[#ede9e3]">
                    🌾 {c}
                  </option>
                ))}
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#3d9b63] font-bold text-xs" aria-hidden="true">
                ▼
              </div>
            </div>
          </div>

          {/* Right: Official Central Govt MSP in Warm Harvest Amber */}
          <div className="bg-[#1f190d] border-2 border-[#5c4215] rounded-2xl p-4 sm:min-w-[240px] text-left sm:text-right shadow-md flex flex-col justify-center shrink-0">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#c99535] block mb-0.5">
              Official Central Govt MSP
            </span>
            <div className="flex items-baseline justify-start sm:justify-end gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-[#d4a03c] tracking-tight">
                ₹{activeMsp.toLocaleString('en-IN')}
              </span>
              <span className="text-xs font-bold text-[#e8bf6a]">/ Qtl</span>
            </div>
            <span className="text-[10px] text-[#a09a93] font-medium mt-1">
              Baseline Procurement Reference
            </span>
          </div>

        </div>

        {/* District Proximity Context */}
        <div className="pt-3 border-t border-[#2d2b27] flex flex-wrap items-center justify-between text-xs text-[#a09a93] gap-2">
          <span className="flex items-center gap-1.5 font-medium">
            <span aria-hidden="true">📍</span> District: <strong className="text-[#ede9e3]">{location.district}, {location.state}</strong> ({location.lat}°, {location.lon}°)
          </span>
          <span className="text-[#5bb37d] font-mono font-medium">{mandis.length} APMC Yards Active</span>
        </div>
      </section>

      {/* Comparative Table Section */}
      <section className="bg-[#1f1e1c] border border-[#2d2b27] rounded-3xl p-4 sm:p-5 shadow-xl space-y-4">
        
        {/* Table Header & Sort Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2d2b27] pb-3">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#d1cbc4]">
              Surrounding APMC Mandis Comparison
            </h2>
            <p className="text-[11px] text-[#a09a93]">Live prices received from e-NAM agricultural marketing committees.</p>
          </div>

          {/* Quick Sort Pills */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[10px] text-[#a09a93] uppercase font-semibold">Sort by:</span>
            <button
              onClick={() => setSortBy('distance')}
              className={`px-2.5 py-1 rounded-lg transition text-xs ${
                sortBy === 'distance'
                  ? 'bg-[#2e7d52] text-white font-bold shadow-sm'
                  : 'bg-[#242220] text-[#a09a93] hover:text-white border border-[#302d29]'
              }`}
            >
              Distance
            </button>
            <button
              onClick={() => setSortBy('price')}
              className={`px-2.5 py-1 rounded-lg transition text-xs ${
                sortBy === 'price'
                  ? 'bg-[#2e7d52] text-white font-bold shadow-sm'
                  : 'bg-[#242220] text-[#a09a93] hover:text-white border border-[#302d29]'
              }`}
            >
              Modal Price
            </button>
            <button
              onClick={() => setSortBy('arrival')}
              className={`px-2.5 py-1 rounded-lg transition text-xs ${
                sortBy === 'arrival'
                  ? 'bg-[#2e7d52] text-white font-bold shadow-sm'
                  : 'bg-[#242220] text-[#a09a93] hover:text-white border border-[#302d29]'
              }`}
            >
              Arrivals
            </button>
          </div>
        </div>

        {/* Main Feed: Comparative Table Listing Surrounding APMC Mandis */}
        <div className="overflow-x-auto -mx-1 sm:mx-0">
          <table className="w-full text-left text-xs min-w-[380px]" aria-label="Mandi Rates Comparison">
            <thead>
              <tr className="border-b border-[#2d2b27] text-[10px] uppercase font-bold text-[#8e8880] tracking-wider">
                <th scope="col" className="py-2.5 px-3">APMC Mandi & Distance</th>
                <th scope="col" className="py-2.5 px-3 text-right">Daily Min</th>
                <th scope="col" className="py-2.5 px-3 text-right">Daily Max</th>
                <th scope="col" className="py-2.5 px-3 text-right">Modal Price</th>
                <th scope="col" className="py-2.5 px-3 text-right hidden sm:table-cell">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2d2b27]/60 font-medium">
              {mandis.map((m) => (
                <tr key={m.id} className="hover:bg-[#24231f]/70 transition">
                  {/* Mandi Name & Distance */}
                  <td className="py-3 px-3">
                    <div className="font-bold text-[#ede9e3] text-xs sm:text-sm">{m.name}</div>
                    <div className="text-[10px] text-[#a09a93] flex flex-wrap items-center gap-1.5 mt-0.5">
                      <span className="text-[#5bb37d] font-semibold font-mono">{m.distanceKm} km away</span>
                      <span aria-hidden="true">•</span>
                      <span className="truncate max-w-[120px]">{m.subName}</span>
                      <span aria-hidden="true">•</span>
                      <span>Arrival: {m.arrivalQty.toLocaleString()} Qtl</span>
                    </div>
                  </td>

                  {/* Daily Minimum Price */}
                  <td className="py-3 px-3 text-right font-mono text-[#d1cbc4] tabular-nums">
                    ₹{m.minPrice.toLocaleString('en-IN')}
                  </td>

                  {/* Daily Maximum Price */}
                  <td className="py-3 px-3 text-right font-mono text-[#d1cbc4] tabular-nums">
                    ₹{m.maxPrice.toLocaleString('en-IN')}
                  </td>

                  {/* Modal (Average) Market Price with MSP Comparison Tag */}
                  <td className="py-3 px-3 text-right">
                    <div className={`font-black text-sm sm:text-base font-mono tabular-nums ${
                      m.isAboveMsp ? 'text-[#5bb37d]' : 'text-[#d4a03c]'
                    }`}>
                      ₹{m.modalPrice.toLocaleString('en-IN')}
                    </div>
                    <div className={`text-[10px] font-semibold mt-0.5 ${
                      m.isAboveMsp ? 'text-[#8bcca2]' : 'text-[#e8bf6a]'
                    }`}>
                      {m.trendDiff}
                    </div>
                  </td>

                  {/* Desktop Trade Action */}
                  <td className="py-3 px-3 text-right hidden sm:table-cell">
                    <button
                      onClick={handleSellInB2B}
                      className="px-3 py-1.5 rounded-lg bg-[#1c2119] hover:bg-[#1a2e22] text-[#5bb37d] border border-[#2b3325] text-xs font-semibold transition active:scale-95 whitespace-nowrap"
                    >
                      Sell Lot &rarr;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Action Card to Sell in B2B Hub */}
      <section className="bg-gradient-to-r from-[#1a281c] via-[#182318] to-[#121410] border border-[#2a3c2b] rounded-3xl p-4 sm:p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-white">Looking to sell your {selectedCrop}?</h3>
          <p className="text-xs text-[#a09a93] mt-0.5">
            Connect directly with verified buyers on the B2B Hub to negotiate spot cash contracts.
          </p>
        </div>
        <button
          onClick={handleSellInB2B}
          className="w-full sm:w-auto px-5 py-2.5 bg-[#b8862d] hover:bg-[#9a7026] text-white font-bold text-xs rounded-xl shadow-md transition shrink-0 text-center border border-[#c99535]/30 focus-visible:ring-2 focus-visible:ring-white"
        >
          List in B2B Hub &rarr;
        </button>
      </section>

    </div>
  );
}

// js/screens/mandiPrices.js - Screen 11: Market Mandi Prices Dashboard
import { store } from '../store.js';
import { router } from '../router.js';

export function renderMandiPricesScreen(container) {
  const state = store.getState();
  const loc = state.location;
  const mspDict = state.mandiData.msp;
  let selectedCrop = state.marketplace.selectedCrop || 'Wheat';
  let sortBy = 'distance'; // 'distance' | 'price' | 'arrival'

  function renderView() {
    const crops = Object.keys(mspDict);
    const activeMsp = mspDict[selectedCrop] || 2275;

    // Build comparative mandis for selected crop with realistic variance
    let mandis = state.mandiData.mandis.map((m, index) => {
      // Scale prices according to crop MSP
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
        isAboveMsp: diffFromMsp >= 0
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

    container.innerHTML = `
      <div class="flex-1 flex flex-col w-full pb-16">
        
        <!-- Top Bar with Back Button -->
        <header class="sticky top-0 z-20 bg-slate-900/90 border-b border-slate-800 backdrop-blur-xl px-4 py-3 flex items-center justify-between">
          <button
            id="mandi-back-btn"
            class="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
          >
            <svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
            <span>Dashboard</span>
          </button>

          <h1 class="text-sm font-bold text-white">Market Mandi Prices</h1>

          <button id="go-to-b2b-btn" class="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1">
            <span>B2B Hub</span>
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </button>
        </header>

        <!-- Main Content -->
        <main class="px-4 py-5 max-w-2xl mx-auto w-full space-y-6">

          <!-- Top Layout: Clear 'Select Crop' dropdown choice filter & directly to its right: Official Central Govt MSP figure in large, bold, high-visibility green characters as baseline reference -->
          <div class="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
            
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              
              <!-- Left: Clear 'Select Crop' Dropdown Choice Filter -->
              <div class="flex-1">
                <label for="mandi-crop-dropdown" class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Select Crop Filter:
                </label>
                <div class="relative">
                  <select
                    id="mandi-crop-dropdown"
                    class="w-full pl-4 pr-10 py-3 bg-slate-950 border-2 border-emerald-500/60 rounded-2xl text-white font-bold text-base focus:outline-none focus:border-emerald-400 appearance-none shadow-md cursor-pointer"
                  >
                    ${crops
                      .map(
                        (c) => `
                      <option value="${c}" ${c === selectedCrop ? 'selected' : ''}>
                        🌾 ${c}
                      </option>
                    `
                      )
                      .join('')}
                  </select>
                  <div class="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-emerald-400 font-bold text-sm">
                    ▼
                  </div>
                </div>
              </div>

              <!-- Directly To Its Right: Official Central Govt Minimum Support Price (MSP) in Large, Bold, High-Visibility Green Characters -->
              <div class="bg-slate-950/90 border-2 border-emerald-500/50 rounded-2xl p-4 sm:min-w-[210px] text-right sm:text-right shadow-lg shadow-emerald-950/30 flex flex-col justify-center">
                <span class="text-[10px] font-black uppercase tracking-wider text-emerald-400 block mb-0.5">
                  Official Central Govt MSP
                </span>
                
                <div class="flex items-baseline justify-end gap-1.5">
                  <span class="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight drop-shadow-md">
                    ₹${activeMsp.toLocaleString('en-IN')}
                  </span>
                  <span class="text-xs font-bold text-emerald-300">/ Qtl</span>
                </div>

                <span class="text-[10px] text-slate-400 font-medium mt-1">
                  Baseline Procurement Reference
                </span>
              </div>

            </div>

            <!-- District Proximity Context -->
            <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span class="flex items-center gap-1.5 font-medium">
                📍 District: <strong class="text-white">${loc.district}, ${loc.state}</strong> (${loc.lat}°, ${loc.lon}°)
              </span>
              <span class="text-emerald-400 font-mono font-medium">${mandis.length} APMC Yards Active</span>
            </div>

          </div>

          <!-- Comparative Table Section -->
          <div class="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            
            <!-- Table Header & Sort Controls -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h2 class="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Surrounding APMC Mandis Comparison
                </h2>
                <p class="text-[11px] text-slate-500">Live prices received from e-NAM agricultural marketing committees.</p>
              </div>

              <!-- Quick Sort Pills -->
              <div class="flex items-center gap-1.5 text-xs">
                <span class="text-[10px] text-slate-500 uppercase font-semibold">Sort by:</span>
                <button data-sort="distance" class="mandi-sort-pill px-2.5 py-1 rounded-lg transition ${
                  sortBy === 'distance' ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-800 text-slate-400 hover:text-white'
                }">
                  Distance
                </button>
                <button data-sort="price" class="mandi-sort-pill px-2.5 py-1 rounded-lg transition ${
                  sortBy === 'price' ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-800 text-slate-400 hover:text-white'
                }">
                  Modal Price
                </button>
                <button data-sort="arrival" class="mandi-sort-pill px-2.5 py-1 rounded-lg transition ${
                  sortBy === 'arrival' ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-800 text-slate-400 hover:text-white'
                }">
                  Arrivals
                </button>
              </div>
            </div>

            <!-- Main Feed Beneath Header: Comparative Table Listing Surrounding APMC Mandis -->
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs">
                <thead>
                  <tr class="border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    <th class="py-3 px-2">APMC Mandi & Distance</th>
                    <th class="py-3 px-2 text-right">Daily Min</th>
                    <th class="py-3 px-2 text-right">Daily Max</th>
                    <th class="py-3 px-2 text-right">Modal (Average) Price</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-800/60 font-medium">
                  ${mandis
                    .map(
                      (m) => `
                    <tr class="hover:bg-slate-800/40 transition">
                      
                      <!-- Mandi Name & Distance -->
                      <td class="py-3.5 px-2">
                        <div class="font-bold text-white text-xs sm:text-sm">${m.name}</div>
                        <div class="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <span class="text-emerald-400 font-semibold font-mono">${m.distanceKm} km away</span>
                          <span>•</span>
                          <span>${m.subName}</span>
                          <span>•</span>
                          <span>Arrival: ${m.arrivalQty.toLocaleString()} Qtl</span>
                        </div>
                      </td>

                      <!-- Daily Minimum Price -->
                      <td class="py-3.5 px-2 text-right font-mono text-slate-300">
                        ₹${m.minPrice.toLocaleString('en-IN')}
                      </td>

                      <!-- Daily Maximum Price -->
                      <td class="py-3.5 px-2 text-right font-mono text-slate-300">
                        ₹${m.maxPrice.toLocaleString('en-IN')}
                      </td>

                      <!-- Modal (Average) Market Price with MSP Comparison Tag -->
                      <td class="py-3.5 px-2 text-right">
                        <div class="font-black text-sm sm:text-base font-mono ${
                          m.isAboveMsp ? 'text-emerald-400' : 'text-amber-400'
                        }">
                          ₹${m.modalPrice.toLocaleString('en-IN')}
                        </div>
                        <div class="text-[10px] font-semibold mt-0.5 ${
                          m.isAboveMsp ? 'text-emerald-300' : 'text-amber-400'
                        }">
                          ${m.trendDiff}
                        </div>
                      </td>

                    </tr>
                  `
                    )
                    .join('')}
                </tbody>
              </table>
            </div>

          </div>

          <!-- Action Card to sell in B2B Hub -->
          <div class="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-800/40 rounded-3xl p-5 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 class="text-sm font-bold text-white">Looking to sell your ${selectedCrop}?</h3>
              <p class="text-xs text-slate-400 mt-0.5">
                Connect directly with verified buyers on the B2B Hub to negotiate spot cash contracts.
              </p>
            </div>
            <button
              id="sell-in-b2b-btn"
              class="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-950/40 transition shrink-0"
            >
              List in B2B Hub &rarr;
            </button>
          </div>

        </main>

      </div>
    `;

    // Attach Listeners
    container.querySelector('#mandi-back-btn').onclick = () => {
      router.goBack();
    };

    container.querySelector('#go-to-b2b-btn').onclick = () => {
      store.setMarketplaceCrop(selectedCrop);
      router.navigateTo('screen-8');
    };

    container.querySelector('#sell-in-b2b-btn').onclick = () => {
      store.setMarketplaceCrop(selectedCrop);
      router.navigateTo('screen-8');
    };

    // Crop selection change
    const dropdown = container.querySelector('#mandi-crop-dropdown');
    dropdown.onchange = (e) => {
      selectedCrop = e.target.value;
      store.setMarketplaceCrop(selectedCrop);
      renderView();
    };

    // Sorting pills
    container.querySelectorAll('.mandi-sort-pill').forEach((pill) => {
      pill.onclick = () => {
        sortBy = pill.dataset.sort;
        renderView();
      };
    });
  }

  renderView();
}

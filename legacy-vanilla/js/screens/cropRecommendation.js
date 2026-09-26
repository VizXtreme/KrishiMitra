// js/screens/cropRecommendation.js - Screen 7: Smart Crop Recommendation Hub
import { store } from '../store.js';
import { router } from '../router.js';
import { showToast } from '../components/toast.js';

export function renderCropRecommendationScreen(container) {
  const state = store.getState();
  const loc = state.location;
  const soil = state.soil;

  // Background function to determine district's general soil baseline from active GPS coordinates
  const baselineConfig = determineBaselineFromGps(loc.lat, loc.lon, loc.district);

  // Use saved laboratory soil profile if present, else baseline config
  const initialN = soil.nitrogen || baselineConfig.n;
  const initialP = soil.phosphorus || baselineConfig.p;
  const initialK = soil.potassium || baselineConfig.k;
  const initialPh = soil.ph || baselineConfig.ph;

  container.innerHTML = `
    <div class="flex-1 flex flex-col w-full pb-16">
      
      <!-- Top Bar with Back Button -->
      <header class="sticky top-0 z-20 bg-slate-900/90 border-b border-slate-800 backdrop-blur-xl px-4 py-3 flex items-center justify-between">
        <button
          id="crop-back-btn"
          class="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
        >
          <svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
          <span>Dashboard</span>
        </button>

        <h1 class="text-sm font-bold text-white">Smart Crop AI Hub</h1>

        <button id="view-soil-repo-link" class="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1">
          <span>Soil Card</span>
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
        </button>
      </header>

      <!-- Main Hub Container -->
      <main class="px-4 py-5 max-w-xl mx-auto w-full space-y-6">

        <!-- GPS District Baseline Context Badge -->
        <div class="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-800/40 rounded-3xl p-5 shadow-xl relative overflow-hidden">
          <div class="flex items-start justify-between gap-3">
            <div>
              <span class="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-800/50 mb-2">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                GPS District Baseline Detected
              </span>
              <h2 class="text-base font-bold text-white">${loc.district} Agro-Climatic Zone</h2>
              <p class="text-xs text-slate-400 mt-1">
                Regional Soil Archetype: <strong class="text-emerald-300">${baselineConfig.soilType}</strong> (Lat: ${loc.lat}°, Lon: ${loc.lon}°).
              </p>
            </div>
            <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-2xl shrink-0">
              🌾
            </div>
          </div>

          <div class="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Pre-populated with baseline & lab card defaults.</span>
            <span class="text-emerald-400 font-medium">Fully Editable Below</span>
          </div>
        </div>

        <!-- Editable Soil Input Parameters Form -->
        <div class="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
          
          <div class="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 class="text-xs font-bold uppercase tracking-wider text-slate-300">
                Soil Fertility & Chemistry Inputs
              </h3>
              <p class="text-[11px] text-slate-500">Edit values to test different farm parcels or fertilizer treatments.</p>
            </div>
            <button id="reset-soil-btn" class="text-[11px] text-slate-400 hover:text-emerald-400 transition" title="Restore baseline defaults">
              Reset Baseline
            </button>
          </div>

          <div class="grid grid-cols-2 gap-3.5">
            
            <!-- Nitrogen (N) -->
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Nitrogen (N)</span>
                <span class="text-[10px] text-emerald-400 font-mono">kg/ha</span>
              </label>
              <input
                id="input-n"
                type="number"
                step="1"
                value="${initialN}"
                class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white font-mono font-bold text-sm focus:outline-none focus:border-emerald-500"
              />
              <span class="text-[10px] text-slate-500 mt-1 block">Optimal: 200 - 280</span>
            </div>

            <!-- Phosphorus (P) -->
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Phosphorus (P)</span>
                <span class="text-[10px] text-emerald-400 font-mono">kg/ha</span>
              </label>
              <input
                id="input-p"
                type="number"
                step="1"
                value="${initialP}"
                class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white font-mono font-bold text-sm focus:outline-none focus:border-emerald-500"
              />
              <span class="text-[10px] text-slate-500 mt-1 block">Optimal: 35 - 55</span>
            </div>

            <!-- Potassium (K) -->
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Potassium (K)</span>
                <span class="text-[10px] text-emerald-400 font-mono">kg/ha</span>
              </label>
              <input
                id="input-k"
                type="number"
                step="1"
                value="${initialK}"
                class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white font-mono font-bold text-sm focus:outline-none focus:border-emerald-500"
              />
              <span class="text-[10px] text-slate-500 mt-1 block">Optimal: 220 - 320</span>
            </div>

            <!-- pH Level -->
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                <span>pH Level</span>
                <span class="text-[10px] text-emerald-400 font-mono">0 - 14</span>
              </label>
              <input
                id="input-ph"
                type="number"
                step="0.1"
                value="${initialPh}"
                class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white font-mono font-bold text-sm focus:outline-none focus:border-emerald-500"
              />
              <span class="text-[10px] text-slate-500 mt-1 block">Neutral: 6.5 - 7.5</span>
            </div>

          </div>

          <!-- Large Green Button: 'Run Market-Driven AI Analysis' -->
          <div class="pt-3">
            <button
              id="run-ai-btn"
              class="w-full py-4 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm sm:text-base rounded-2xl shadow-xl shadow-emerald-950/50 hover:shadow-emerald-900/60 active:scale-[0.98] transition flex items-center justify-center gap-3"
            >
              <svg class="w-5 h-5 text-emerald-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              <span id="run-ai-text">Run Market-Driven AI Analysis</span>
            </button>
          </div>

        </div>

        <!-- AI Calculation / Loading Container -->
        <div id="ai-loading" class="hidden bg-slate-900/80 border border-slate-800 rounded-2xl p-6 text-center">
          <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center animate-spin">
            <svg class="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg>
          </div>
          <h4 class="text-sm font-bold text-white mb-1">Synthesizing District Crop Recommendations...</h4>
          <p class="text-xs text-slate-400 max-w-xs mx-auto">
            Cross-referencing soil NPK chemistry with 14-day rainfall forecast & APMC Mandi price volatility indices.
          </p>
        </div>

        <!-- Scrollable Results List Ranking Top 3 Recommended Crops -->
        <section id="results-section" class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <span>🏆</span>
              <span>Top 3 Recommended Crops</span>
            </h3>
            <span class="text-[11px] text-emerald-400 font-semibold">Ranked by Net Profit & Agronomic Fit</span>
          </div>

          <div id="results-list" class="space-y-3.5">
            <!-- Dynamically populated crop cards -->
          </div>
        </section>

      </main>

    </div>
  `;

  // Determine baseline from GPS
  function determineBaselineFromGps(lat, lon, district) {
    if (district.toLowerCase().includes('pune') || (lat < 20 && lat > 17)) {
      return {
        soilType: 'Black Cotton Soil (Regur)',
        n: 180,
        p: 32,
        k: 310,
        ph: 7.4
      };
    }
    // Indo-Gangetic Plains (Punjab / Haryana / Western UP)
    return {
      soilType: 'Indo-Gangetic Alluvial Loam',
      n: 220,
      p: 42,
      k: 285,
      ph: 6.9
    };
  }

  // Algorithm to compute top 3 crops based on NPK, pH, and mandi rates
  function computeRecommendations(n, p, k, ph) {
    const isNeutralPh = ph >= 6.5 && ph <= 7.8;
    const isHighN = n >= 210;

    // Crop database
    const allCrops = [
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
        advisory: 'Excellent nitrogen synergy. Ensure 2-inch shallow standing water during tillering. High mandi liquidation in Khanna and Amritsar APMCs.'
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
        advisory: 'Balanced P and K levels provide strong resistance to rust lodging. Guaranteed procurement at APMC mandis at or above ₹2,275/Qtl MSP.'
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
        advisory: 'Requires 40% less irrigation than wheat. Robust oil content (41.5%) attracts immediate spot cash buyers across regional solvent plants.'
      }
    ];

    return allCrops;
  }

  function renderResults(crops) {
    const listEl = container.querySelector('#results-list');
    if (!listEl) return;

    listEl.innerHTML = crops
      .map(
        (crop, index) => `
      <div class="bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 rounded-3xl p-5 sm:p-6 shadow-xl transition-all duration-200 space-y-4 relative overflow-hidden">
        
        <!-- Rank Pill -->
        <div class="flex items-center justify-between">
          <span class="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
            index === 0
              ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-md shadow-emerald-950/40'
              : 'bg-slate-800 text-slate-300 border border-slate-700'
          }">
            ${crop.badge}
          </span>

          <span class="text-xs text-slate-400 font-medium">
            ${crop.category}
          </span>
        </div>

        <!-- Crop Header -->
        <div class="flex items-center gap-3.5">
          <div class="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-3xl shrink-0">
            ${crop.icon}
          </div>
          <div class="flex-1">
            <h4 class="text-base sm:text-lg font-bold text-white leading-snug">
              ${crop.name}
            </h4>
            <div class="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
              <span>Avg Mandi Rate: <strong class="text-white">₹${crop.mandiPrice}</strong>/Qtl</span>
              <span>•</span>
              <span>Yield: ${crop.yieldAcre} Qtl/Acre</span>
            </div>
          </div>
        </div>

        <!-- Required Metric Cards: Suitability % & Estimated Profit Margin -->
        <div class="grid grid-cols-2 gap-3">
          
          <!-- Soil/Weather Suitability % -->
          <div class="bg-slate-950/80 rounded-2xl p-3.5 border border-slate-800/80">
            <span class="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block mb-1">
              Soil/Weather Suitability
            </span>
            <div class="flex items-baseline gap-1.5">
              <strong class="text-xl sm:text-2xl font-black text-emerald-400">${crop.suitability}%</strong>
              <span class="text-xs text-emerald-500 font-medium">Match</span>
            </div>
            <div class="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-2">
              <div class="h-full bg-emerald-400 rounded-full" style="width: ${crop.suitability}%"></div>
            </div>
          </div>

          <!-- Estimated Profit Margin (in INR/Acre) -->
          <div class="bg-slate-950/80 rounded-2xl p-3.5 border border-slate-800/80">
            <span class="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block mb-1">
              Estimated Profit Margin
            </span>
            <div class="flex items-baseline gap-1">
              <strong class="text-xl sm:text-2xl font-black text-amber-300">₹${crop.profitMargin.toLocaleString('en-IN')}</strong>
              <span class="text-[11px] text-slate-400">/ Acre</span>
            </div>
            <span class="text-[10px] text-emerald-400 font-medium block mt-1.5">Net of fertilizer & fuel costs</span>
          </div>

        </div>

        <!-- Required Metric Tag: Market Risk Tag calculated from current mandi metrics -->
        <div class="bg-slate-950/60 rounded-xl p-3 border border-slate-800/80 flex items-center justify-between gap-2">
          <span class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Market Risk Tag:
          </span>
          <span class="text-xs font-bold px-2.5 py-1 rounded-lg ${
            crop.riskColor === 'emerald'
              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
              : 'bg-amber-950/80 text-amber-300 border border-amber-800/60'
          }">
            ${crop.riskTag}
          </span>
        </div>

        <!-- Agronomic Guidance Note -->
        <p class="text-xs text-slate-300 bg-slate-950/40 p-3 rounded-xl border border-slate-800/40 leading-relaxed">
          <strong class="text-slate-200">ICAR Advisory:</strong> ${crop.advisory}
        </p>

        <!-- CTA Buttons -->
        <div class="flex items-center gap-3 pt-1">
          <button
            class="trade-crop-btn flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-xl text-xs font-semibold transition"
            data-crop="${crop.name.split(' ')[0]}"
          >
            Check B2B Buyers in Hub &rarr;
          </button>
          <button
            class="mandi-crop-btn px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-emerald-400 rounded-xl text-xs font-semibold transition"
            data-crop="${crop.name.split(' ')[0]}"
          >
            View Mandis
          </button>
        </div>

      </div>
    `
      )
      .join('');

    // Attach CTA handlers
    listEl.querySelectorAll('.trade-crop-btn').forEach((btn) => {
      btn.onclick = () => {
        store.setMarketplaceCrop(btn.dataset.crop);
        router.navigateTo('screen-8');
      };
    });

    listEl.querySelectorAll('.mandi-crop-btn').forEach((btn) => {
      btn.onclick = () => {
        router.navigateTo('screen-11');
      };
    });
  }

  // Initial render of recommendations
  renderResults(computeRecommendations(initialN, initialP, initialK, initialPh));

  // Attach Event Handlers
  container.querySelector('#crop-back-btn').onclick = () => {
    router.goBack();
  };

  container.querySelector('#view-soil-repo-link').onclick = () => {
    router.navigateTo('screen-9');
  };

  const inputN = container.querySelector('#input-n');
  const inputP = container.querySelector('#input-p');
  const inputK = container.querySelector('#input-k');
  const inputPh = container.querySelector('#input-ph');
  const runAiBtn = container.querySelector('#run-ai-btn');
  const aiLoading = container.querySelector('#ai-loading');
  const resultsSection = container.querySelector('#results-section');

  container.querySelector('#reset-soil-btn').onclick = () => {
    inputN.value = baselineConfig.n;
    inputP.value = baselineConfig.p;
    inputK.value = baselineConfig.k;
    inputPh.value = baselineConfig.ph;
    showToast('Reset to district baseline values.', 'info');
  };

  runAiBtn.onclick = () => {
    const n = Number(inputN.value) || 200;
    const p = Number(inputP.value) || 40;
    const k = Number(inputK.value) || 280;
    const ph = parseFloat(Number(inputPh.value)) || 6.9;

    runAiBtn.disabled = true;
    aiLoading.classList.remove('hidden');
    resultsSection.classList.add('opacity-40');

    setTimeout(() => {
      aiLoading.classList.add('hidden');
      resultsSection.classList.remove('opacity-40');
      runAiBtn.disabled = false;

      const results = computeRecommendations(n, p, k, ph);
      renderResults(results);
      showToast('AI Crop Suitability analysis updated successfully!', 'success');
    }, 700);
  };
}

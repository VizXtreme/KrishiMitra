// js/screens/soilData.js - Screen 9: Soil Data Entry / Repository
import { store } from '../store.js';
import { router } from '../router.js';
import { showToast } from '../components/toast.js';

export function renderSoilDataScreen(container) {
  const state = store.getState();
  const soil = state.soil;
  const loc = state.location;

  container.innerHTML = `
    <div class="flex-1 flex flex-col w-full pb-16">
      
      <!-- Top Bar with Back Button -->
      <header class="sticky top-0 z-20 bg-slate-900/90 border-b border-slate-800 backdrop-blur-xl px-4 py-3 flex items-center justify-between">
        <button
          id="soil-back-btn"
          class="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
        >
          <svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
          <span>Dashboard</span>
        </button>

        <h1 class="text-sm font-bold text-white">Soil Data Repository</h1>

        <button id="quick-recommend-btn" class="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1">
          <span>AI Crops</span>
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
        </button>
      </header>

      <!-- Main Container -->
      <main class="px-4 py-5 max-w-xl mx-auto w-full space-y-6">

        <!-- Soil Health Card Lab Summary Header -->
        <div class="bg-gradient-to-r from-teal-950/60 via-slate-900 to-slate-900 border border-teal-800/40 rounded-3xl p-5 shadow-xl relative overflow-hidden">
          <div class="flex items-start justify-between gap-3">
            <div>
              <span class="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-teal-400 bg-teal-950 px-2.5 py-0.5 rounded-full border border-teal-800/50 mb-2">
                🏛️ Ministry of Agriculture SHC Card
              </span>
              <h2 class="text-base font-bold text-white">Laboratory Soil Health Certificate</h2>
              <p class="text-xs text-slate-400 mt-1">
                Sample ID: <strong class="text-emerald-300 font-mono">${soil.sampleId || 'SHC-2026-LDH-4491'}</strong>
              </p>
              <p class="text-[11px] text-slate-400 mt-0.5">
                Issued By: ${soil.labName || 'District Soil Testing Center, KVK'}
              </p>
            </div>
            <div class="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-2xl shrink-0">
              🧪
            </div>
          </div>

          <div class="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span class="text-slate-400">Last Lab Verification: <strong class="text-white">${soil.testedDate || 'Recent'}</strong></span>
            <span class="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-semibold text-[11px]">
              ${soil.status || 'Fertile'}
            </span>
          </div>
        </div>

        <!-- Structured Profile Form for Laboratory Soil Health Card Measurements -->
        <div class="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-5">
          
          <div class="border-b border-slate-800 pb-3">
            <h3 class="text-xs font-bold uppercase tracking-wider text-slate-300">
              Enter Laboratory Measurements
            </h3>
            <p class="text-[11px] text-slate-400 mt-0.5">
              Input the physical readings from your printed Soil Health Card to update regional recommendations.
            </p>
          </div>

          <div class="space-y-4">
            
            <!-- 1. Nitrogen (N) -->
            <div class="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4">
              <div class="flex items-center justify-between mb-1.5">
                <label class="text-xs font-bold text-white flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>Available Nitrogen (N)</span>
                </label>
                <span class="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800/40">
                  kg/ha
                </span>
              </div>
              <div class="flex items-center gap-3">
                <input
                  id="soil-n"
                  type="number"
                  step="1"
                  value="${soil.nitrogen}"
                  class="flex-1 px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono font-bold text-sm focus:outline-none focus:border-emerald-500"
                />
                <div class="text-[11px] text-slate-400 shrink-0">
                  Rating: <span class="text-emerald-400 font-semibold">Medium (Optimal)</span>
                </div>
              </div>
              <p class="text-[10px] text-slate-500 mt-1.5">Baseline range: &lt;200 Low | 200-300 Medium | &gt;300 High</p>
            </div>

            <!-- 2. Phosphorus (P) -->
            <div class="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4">
              <div class="flex items-center justify-between mb-1.5">
                <label class="text-xs font-bold text-white flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-teal-400"></span>
                  <span>Available Phosphorus (P)</span>
                </label>
                <span class="text-[11px] font-mono text-teal-400 bg-teal-950/60 px-2 py-0.5 rounded-md border border-teal-800/40">
                  kg/ha
                </span>
              </div>
              <div class="flex items-center gap-3">
                <input
                  id="soil-p"
                  type="number"
                  step="1"
                  value="${soil.phosphorus}"
                  class="flex-1 px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono font-bold text-sm focus:outline-none focus:border-teal-500"
                />
                <div class="text-[11px] text-slate-400 shrink-0">
                  Rating: <span class="text-teal-400 font-semibold">Adequate</span>
                </div>
              </div>
              <p class="text-[10px] text-slate-500 mt-1.5">Baseline range: &lt;25 Low | 25-50 Medium | &gt;50 High</p>
            </div>

            <!-- 3. Potassium (K) -->
            <div class="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4">
              <div class="flex items-center justify-between mb-1.5">
                <label class="text-xs font-bold text-white flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-blue-400"></span>
                  <span>Available Potassium (K)</span>
                </label>
                <span class="text-[11px] font-mono text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded-md border border-blue-800/40">
                  kg/ha
                </span>
              </div>
              <div class="flex items-center gap-3">
                <input
                  id="soil-k"
                  type="number"
                  step="1"
                  value="${soil.potassium}"
                  class="flex-1 px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono font-bold text-sm focus:outline-none focus:border-blue-500"
                />
                <div class="text-[11px] text-slate-400 shrink-0">
                  Rating: <span class="text-blue-400 font-semibold">High Fertility</span>
                </div>
              </div>
              <p class="text-[10px] text-slate-500 mt-1.5">Baseline range: &lt;150 Low | 150-280 Medium | &gt;280 High</p>
            </div>

            <!-- 4. pH Level -->
            <div class="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4">
              <div class="flex items-center justify-between mb-1.5">
                <label class="text-xs font-bold text-white flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-amber-400"></span>
                  <span>pH Level (Acidity / Alkalinity)</span>
                </label>
                <span class="text-[11px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-800/40">
                  Scale 0-14
                </span>
              </div>
              <div class="flex items-center gap-3">
                <input
                  id="soil-ph"
                  type="number"
                  step="0.1"
                  value="${soil.ph}"
                  class="flex-1 px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono font-bold text-sm focus:outline-none focus:border-amber-500"
                />
                <div class="text-[11px] text-slate-400 shrink-0">
                  Rating: <span class="text-emerald-400 font-semibold">Neutral (Ideal)</span>
                </div>
              </div>
              <p class="text-[10px] text-slate-500 mt-1.5">&lt;6.5 Acidic | 6.5 - 7.5 Neutral | &gt;7.5 Alkaline</p>
            </div>

            <!-- 5. Organic Carbon (OC) -->
            <div class="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4">
              <div class="flex items-center justify-between mb-1.5">
                <label class="text-xs font-bold text-white flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-rose-400"></span>
                  <span>Organic Carbon (OC)</span>
                </label>
                <span class="text-[11px] font-mono text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded-md border border-rose-800/40">
                  % Percentage
                </span>
              </div>
              <div class="flex items-center gap-3">
                <input
                  id="soil-oc"
                  type="number"
                  step="0.01"
                  value="${soil.organicCarbon}"
                  class="flex-1 px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono font-bold text-sm focus:outline-none focus:border-rose-500"
                />
                <div class="text-[11px] text-slate-400 shrink-0">
                  Rating: <span class="text-emerald-400 font-semibold">Medium (Good)</span>
                </div>
              </div>
              <p class="text-[10px] text-slate-500 mt-1.5">&lt;0.5% Low | 0.5 - 0.75% Medium | &gt;0.75% High</p>
            </div>

            <!-- 6. Electrical Conductivity (EC) -->
            <div class="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4">
              <div class="flex items-center justify-between mb-1.5">
                <label class="text-xs font-bold text-white flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-purple-400"></span>
                  <span>Electrical Conductivity (EC)</span>
                </label>
                <span class="text-[11px] font-mono text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded-md border border-purple-800/40">
                  dS/m (Salinity)
                </span>
              </div>
              <div class="flex items-center gap-3">
                <input
                  id="soil-ec"
                  type="number"
                  step="0.01"
                  value="${soil.electricalConductivity}"
                  class="flex-1 px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono font-bold text-sm focus:outline-none focus:border-purple-500"
                />
                <div class="text-[11px] text-slate-400 shrink-0">
                  Rating: <span class="text-emerald-400 font-semibold">Non-Saline</span>
                </div>
              </div>
              <p class="text-[10px] text-slate-500 mt-1.5">&lt;1.0 dS/m Normal (Safe) | 1.0 - 2.0 Critical | &gt;2.0 Saline Injury</p>
            </div>

          </div>

          <!-- Primary 'Save Soil Profile' Button that writes to local user database -->
          <div class="pt-3">
            <button
              id="save-soil-btn"
              class="w-full py-4 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm sm:text-base rounded-2xl shadow-xl shadow-emerald-950/50 hover:shadow-emerald-900/60 active:scale-[0.98] transition flex items-center justify-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg>
              <span>Save Soil Profile</span>
            </button>
          </div>

        </div>

        <!-- Sync Info -->
        <div class="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 text-xs text-slate-400 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-base">🔄</span>
            <span>Saved data automatically synchronizes with Screen 7 Crop Advisory.</span>
          </div>
          <button id="goto-crop-advisory" class="text-emerald-400 font-bold hover:underline">
            Test Fit &rarr;
          </button>
        </div>

      </main>

    </div>
  `;

  // Attach Listeners
  container.querySelector('#soil-back-btn').onclick = () => {
    router.goBack();
  };

  container.querySelector('#quick-recommend-btn').onclick = () => {
    router.navigateTo('screen-7');
  };

  container.querySelector('#goto-crop-advisory').onclick = () => {
    router.navigateTo('screen-7');
  };

  const soilN = container.querySelector('#soil-n');
  const soilP = container.querySelector('#soil-p');
  const soilK = container.querySelector('#soil-k');
  const soilPh = container.querySelector('#soil-ph');
  const soilOc = container.querySelector('#soil-oc');
  const soilEc = container.querySelector('#soil-ec');

  container.querySelector('#save-soil-btn').onclick = () => {
    const updatedSoil = {
      nitrogen: Number(soilN.value) || 220,
      phosphorus: Number(soilP.value) || 42,
      potassium: Number(soilK.value) || 285,
      ph: parseFloat(Number(soilPh.value)) || 6.9,
      organicCarbon: parseFloat(Number(soilOc.value)) || 0.68,
      electricalConductivity: parseFloat(Number(soilEc.value)) || 0.78,
    };

    store.saveSoilProfile(updatedSoil);
    showToast('Soil Health Profile written to database & synced with AI Advisor!', 'success');
  };
}

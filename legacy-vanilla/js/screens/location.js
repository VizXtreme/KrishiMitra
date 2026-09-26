// js/screens/location.js - Screen 2: Location Access
import { store } from '../store.js';
import { router } from '../router.js';
import { showToast } from '../components/toast.js';

export function renderLocationScreen(container) {
  const state = store.getState();

  container.innerHTML = `
    <div class="flex-1 flex flex-col justify-center px-6 py-10 max-w-md mx-auto w-full">
      
      <!-- Premium Location Card -->
      <div class="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden text-center">
        
        <!-- Glowing background accent -->
        <div class="absolute -top-20 -left-20 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -bottom-20 -right-20 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <!-- Animated Location Pin Icon -->
        <div class="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
          <div class="absolute inset-0 rounded-full bg-emerald-500/10 animate-ping"></div>
          <div class="w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 p-0.5 shadow-xl shadow-emerald-500/30 flex items-center justify-center">
            <div class="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
              <svg class="w-10 h-10 text-emerald-400 transform -rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Heading -->
        <h2 class="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug mb-3">
          Enable Location for Local Mandi Prices & Weather Alerts
        </h2>

        <!-- Subtitle & Value Proposition -->
        <p class="text-xs sm:text-sm text-slate-400 mb-6 leading-relaxed">
          AgriSmart uses your precise GPS coordinates to calculate hyper-local rainfall forecasts, identify the nearest APMC Mandi rates, and determine regional soil suitability.
        </p>

        <!-- Feature Points -->
        <div class="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 mb-8 text-left space-y-3">
          <div class="flex items-center gap-3 text-xs text-slate-300">
            <div class="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              📊
            </div>
            <span><strong>Live Mandi Rates:</strong> Nearest APMC yards within 25km radius.</span>
          </div>
          <div class="flex items-center gap-3 text-xs text-slate-300">
            <div class="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
              ⛈️
            </div>
            <span><strong>Micro-climate Alerts:</strong> Sudden storm and hailstorm warnings.</span>
          </div>
          <div class="flex items-center gap-3 text-xs text-slate-300">
            <div class="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              🧪
            </div>
            <span><strong>District Soil Baseline:</strong> NPK recommendations tailored to your soil.</span>
          </div>
        </div>

        <!-- Quick District Preset Selection -->
        <div class="mb-6 text-left">
          <label class="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Or select test agricultural district:
          </label>
          <select id="district-preset-select" class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500">
            <option value="ludhiana" selected>Ludhiana, Punjab (Alluvial Loam / Grain Hub)</option>
            <option value="pune">Pune, Maharashtra (Black Cotton Soil / Sugarcane & Onion)</option>
            <option value="karnal">Karnal, Haryana (Alluvial Soil / Basmati Rice Hub)</option>
            <option value="indore">Indore, Madhya Pradesh (Malwa Black Soil / Soybean Hub)</option>
          </select>
        </div>

        <!-- Buttons Container -->
        <div class="space-y-3">
          <!-- Primary Allow Location Button -->
          <button
            id="allow-location-btn"
            class="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-emerald-950/50 hover:shadow-emerald-900/60 active:scale-[0.98] transition flex items-center justify-center gap-2"
          >
            <span id="allow-btn-label">Allow Location Access</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </button>

          <!-- Don't Allow Button -->
          <button
            id="deny-location-btn"
            class="w-full py-3 bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 font-medium text-xs rounded-xl border border-slate-800 transition"
          >
            Don't Allow (Use Default District)
          </button>
        </div>

        <!-- Coordinates Status Display (Hidden until active) -->
        <div id="coords-status" class="mt-4 p-3 bg-emerald-950/40 border border-emerald-800/40 rounded-xl text-xs text-emerald-300 hidden">
          <div class="flex items-center justify-center gap-2 font-mono">
            <svg class="w-4 h-4 text-emerald-400 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg>
            <span id="coords-text">Fetching GPS coordinates...</span>
          </div>
        </div>

      </div>

    </div>
  `;

  const allowBtn = container.querySelector('#allow-location-btn');
  const allowBtnLabel = container.querySelector('#allow-btn-label');
  const denyBtn = container.querySelector('#deny-location-btn');
  const coordsStatus = container.querySelector('#coords-status');
  const coordsText = container.querySelector('#coords-text');
  const districtSelect = container.querySelector('#district-preset-select');

  // Handle Allow Location
  allowBtn.addEventListener('click', () => {
    allowBtn.disabled = true;
    coordsStatus.classList.remove('hidden');
    allowBtnLabel.textContent = 'Requesting Permission...';

    // Check district preset
    const preset = districtSelect.value;
    let fallbackLat = 30.9010;
    let fallbackLon = 75.8573;
    let fallbackDistrict = 'Ludhiana';
    let fallbackState = 'Punjab';

    if (preset === 'pune') {
      fallbackLat = 18.5204;
      fallbackLon = 73.8567;
      fallbackDistrict = 'Pune';
      fallbackState = 'Maharashtra';
    } else if (preset === 'karnal') {
      fallbackLat = 29.6857;
      fallbackLon = 76.9905;
      fallbackDistrict = 'Karnal';
      fallbackState = 'Haryana';
    } else if (preset === 'indore') {
      fallbackLat = 22.7196;
      fallbackLon = 75.8577;
      fallbackDistrict = 'Indore';
      fallbackState = 'Madhya Pradesh';
    }

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          coordsText.textContent = `Captured: Lat ${lat.toFixed(4)}°, Lon ${lon.toFixed(4)}° (${fallbackDistrict})`;
          store.setLocation(lat, lon, fallbackDistrict, fallbackState);
          showToast(`Location captured: ${fallbackDistrict}, ${fallbackState}`, 'success');

          setTimeout(() => {
            router.navigateTo('screen-3');
          }, 800);
        },
        (error) => {
          console.warn('Browser geolocation denied/unavailable, applying selected district:', error);
          coordsText.textContent = `Using District GPS: Lat ${fallbackLat}°, Lon ${fallbackLon}° (${fallbackDistrict})`;
          store.setLocation(fallbackLat, fallbackLon, fallbackDistrict, fallbackState);
          showToast(`Location active: ${fallbackDistrict}, ${fallbackState}`, 'success');

          setTimeout(() => {
            router.navigateTo('screen-3');
          }, 800);
        },
        { timeout: 4000, enableHighAccuracy: true }
      );
    } else {
      store.setLocation(fallbackLat, fallbackLon, fallbackDistrict, fallbackState);
      showToast(`Location initialized: ${fallbackDistrict}, ${fallbackState}`, 'info');
      router.navigateTo('screen-3');
    }
  });

  // Handle Deny / Default
  denyBtn.addEventListener('click', () => {
    store.setLocation(30.9010, 75.8573, 'Ludhiana', 'Punjab');
    showToast('Default district coordinates loaded (Ludhiana, Punjab)', 'info');
    router.navigateTo('screen-3');
  });
}

// js/screens/govSchemes.js - Screen 10: Government Schemes
import { store } from '../store.js';
import { router } from '../router.js';
import { openInAppBrowserModal } from '../components/modal.js';

export function renderGovSchemesScreen(container) {
  const state = store.getState();
  let schemes = state.schemes;
  let activeCategory = 'All';

  function renderDirectory() {
    const filtered = schemes.filter((s) => {
      if (activeCategory === 'All') return true;
      return s.category === activeCategory;
    });

    container.innerHTML = `
      <div class="flex-1 flex flex-col w-full pb-16">
        
        <!-- Top Bar with Back Button -->
        <header class="sticky top-0 z-20 bg-slate-900/90 border-b border-slate-800 backdrop-blur-xl px-4 py-3 flex items-center justify-between">
          <button
            id="schemes-back-btn"
            class="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
          >
            <svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
            <span>Dashboard</span>
          </button>

          <h1 class="text-sm font-bold text-white">Government Schemes</h1>

          <span class="text-xs text-amber-400 font-mono font-medium">DBT Portal</span>
        </header>

        <!-- Main Content -->
        <main class="px-4 py-5 max-w-2xl mx-auto w-full space-y-6">

          <!-- Header Banner -->
          <div class="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-800/40 rounded-3xl p-5 shadow-xl flex items-center justify-between gap-4">
            <div>
              <span class="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
                Central & State Farmer Welfare Schemes
              </span>
              <h2 class="text-base sm:text-lg font-bold text-white">Direct Benefit Transfer (DBT) Directory</h2>
              <p class="text-xs text-slate-400 mt-1">
                Verified application gateways for central financial assistance, crop insurance, and equipment grants.
              </p>
            </div>
            <div class="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-2xl shrink-0">
              🏛️
            </div>
          </div>

          <!-- Premium High-Contrast Category Chips: 'Subsidies', 'Crop Insurance', 'Soil Management' -->
          <div class="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            ${['All', 'Subsidies', 'Crop Insurance', 'Soil Management']
              .map(
                (cat) => `
              <button
                data-category="${cat}"
                class="scheme-cat-chip px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg shadow-emerald-950/50'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }"
              >
                ${cat === 'All' ? '🌟 All Schemes' : cat === 'Subsidies' ? '💰 Subsidies' : cat === 'Crop Insurance' ? '🛡️ Crop Insurance' : '🧪 Soil Management'}
              </button>
            `
              )
              .join('')}
          </div>

          <!-- High-Contrast Directory Grid -->
          <div class="grid grid-cols-1 gap-4">
            ${filtered
              .map(
                (scheme) => `
              <div class="bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 rounded-3xl p-5 sm:p-6 shadow-xl transition space-y-4 relative overflow-hidden">
                
                <!-- Category Tag & Badge -->
                <div class="flex items-center justify-between">
                  <span class="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-bold uppercase tracking-wider">
                    ${scheme.category}
                  </span>
                  <span class="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/60 text-[10px] font-bold">
                    ${scheme.badge}
                  </span>
                </div>

                <!-- Official Scheme Title -->
                <div>
                  <h3 class="text-base sm:text-lg font-bold text-white leading-snug">
                    ${scheme.title}
                  </h3>
                  <span class="text-[11px] font-mono text-emerald-400 mt-0.5 block">Portal: ${scheme.portalName}</span>
                </div>

                <!-- Short 2-Line Bulleted Benefit Brief -->
                <div class="bg-slate-950/80 rounded-2xl p-4 border border-slate-800/80 space-y-2">
                  <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Key Scheme Benefits:
                  </span>
                  <ul class="space-y-1.5 text-xs text-slate-200">
                    ${scheme.benefits
                      .map(
                        (b) => `
                      <li class="flex items-start gap-2">
                        <span class="text-emerald-400 font-bold shrink-0 mt-0.5">•</span>
                        <span class="leading-relaxed">${b}</span>
                      </li>
                    `
                      )
                      .join('')}
                  </ul>
                </div>

                <!-- Eligibility Criteria -->
                <div class="text-xs text-slate-300 px-1">
                  <strong class="text-slate-200 block mb-0.5">Eligibility Criteria:</strong>
                  <p class="text-slate-400 text-[11px] leading-relaxed">
                    ${scheme.eligibility}
                  </p>
                </div>

                <!-- Primary Green 'Apply Online' Button (Launches portal URL using in-app browser framework) -->
                <div class="pt-2 flex items-center gap-3">
                  <button
                    class="apply-online-btn flex-1 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-950/40 active:scale-[0.98] transition flex items-center justify-center gap-2"
                    data-title="${scheme.title}"
                    data-url="${scheme.url}"
                    data-portal="${scheme.portalName}"
                  >
                    <span>Apply Online</span>
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  </button>

                  <a
                    href="${scheme.url}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs border border-slate-700 transition"
                    title="Open in External Browser"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                  </a>
                </div>

              </div>
            `
              )
              .join('')}
          </div>

        </main>

      </div>
    `;

    // Attach Listeners
    container.querySelector('#schemes-back-btn').onclick = () => {
      router.goBack();
    };

    container.querySelectorAll('.scheme-cat-chip').forEach((chip) => {
      chip.onclick = () => {
        activeCategory = chip.dataset.category;
        renderDirectory();
      };
    });

    // Handle Apply Online clicks
    container.querySelectorAll('.apply-online-btn').forEach((btn) => {
      btn.onclick = () => {
        openInAppBrowserModal({
          title: btn.dataset.title,
          url: btn.dataset.url,
          portalName: btn.dataset.portal,
        });
      };
    });
  }

  renderDirectory();
}

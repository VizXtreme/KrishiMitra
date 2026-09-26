// js/screens/dashboard.js - Screen 3: Main Page Dashboard
import { store } from '../store.js';
import { router } from '../router.js';

let carouselTimer = null;

export function renderDashboardScreen(container) {
  const state = store.getState();
  const unreadCount = store.getUnreadMessagesCount();
  const location = state.location;
  const weather = state.weather;

  container.innerHTML = `
    <div class="flex-1 flex flex-col w-full pb-2">
      
      <!-- Top App Header -->
      <header class="sticky top-0 z-30 bg-slate-900/90 border-b border-slate-800/90 backdrop-blur-xl px-4 py-3 flex items-center justify-between shadow-md">
        
        <!-- Top-Left: Profile Icon Button 👤 (Routes to Screen 4) -->
        <button
          id="header-profile-btn"
          class="relative flex items-center gap-2.5 p-1.5 rounded-full hover:bg-slate-800 transition active:scale-95 group"
          title="Open Profile (Screen 4)"
        >
          <div class="w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-500/50 p-0.5 bg-slate-800 flex items-center justify-center text-lg">
            ${
              state.auth.avatar
                ? `<img src="${state.auth.avatar}" alt="Avatar" class="w-full h-full object-cover rounded-full" />`
                : `<span class="text-white">👤</span>`
            }
          </div>
          <div class="hidden sm:flex flex-col text-left leading-tight">
            <span class="text-xs font-bold text-white group-hover:text-emerald-400 transition">${state.auth.name.split(' ')[0]}</span>
            <span class="text-[10px] text-emerald-400 font-medium">Verified Farmer</span>
          </div>
        </button>

        <!-- Center: Active Location & Weather Indicator -->
        <div class="flex flex-col items-center">
          <div class="flex items-center gap-1.5 text-xs font-semibold text-white">
            <span class="text-emerald-400 text-sm">📍</span>
            <span>${location.district || 'Ludhiana'}, ${location.state || 'PB'}</span>
          </div>
          <span class="text-[10px] text-slate-400 font-medium flex items-center gap-1">
            <span>${weather.temp}°C</span>
            <span>•</span>
            <span>${weather.condition}</span>
          </span>
        </div>

        <!-- Top-Right: Message Icon Button 💬 with Red Notification Dot (Routes to Screen 5) -->
        <button
          id="header-message-btn"
          class="relative w-10 h-10 rounded-full bg-slate-800/90 hover:bg-slate-700/80 border border-slate-700/70 flex items-center justify-center text-slate-200 hover:text-white transition active:scale-95"
          title="Open Messages (Screen 5)"
        >
          <span class="text-lg">💬</span>
          
          <!-- Red Notification Dot -->
          ${
            unreadCount > 0
              ? `
                <span class="absolute top-1 right-1 flex h-3.5 w-3.5">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span class="relative inline-flex items-center justify-center rounded-full h-3.5 w-3.5 bg-rose-500 text-[9px] font-bold text-white">
                    ${unreadCount}
                  </span>
                </span>
              `
              : ''
          }
        </button>

      </header>

      <!-- Main Dashboard Content -->
      <main class="px-4 py-5 max-w-2xl mx-auto w-full space-y-6">

        <!-- Weather Ticker Alert if Active -->
        ${
          weather.severeAlert?.active
            ? `
              <div id="quick-alert-strip" class="bg-amber-950/40 border border-amber-600/40 hover:border-amber-500 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-amber-200 cursor-pointer transition shadow-lg shadow-amber-950/20">
                <div class="flex items-center gap-2.5 overflow-hidden">
                  <span class="text-lg shrink-0">⚠️</span>
                  <div class="text-xs truncate">
                    <strong class="text-amber-300 font-semibold">Storm Alert:</strong> Thunderstorm & Hail Warning within 6 hours.
                  </div>
                </div>
                <button class="text-[11px] font-bold text-amber-300 underline shrink-0 hover:text-amber-100">
                  Radar & Forecast &rarr;
                </button>
              </div>
            `
            : ''
        }

        <!-- Ribbon Banner Carousel (Flipkart Style Auto-sliding Agricultural Adverts) -->
        <section class="relative">
          <div class="flex items-center justify-between mb-2">
            <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Govt & Market Highlights
            </span>
            <div class="flex items-center gap-1.5" id="carousel-dots">
              ${state.banners
                .map(
                  (_, i) => `
                <button data-index="${i}" class="carousel-dot h-1.5 rounded-full transition-all duration-300 ${
                    i === 0 ? 'w-5 bg-emerald-400' : 'w-1.5 bg-slate-700'
                  }"></button>
              `
                )
                .join('')}
            </div>
          </div>

          <!-- Carousel Container -->
          <div id="banner-carousel" class="relative overflow-hidden rounded-2xl shadow-xl border border-slate-800">
            <div id="carousel-track" class="flex transition-transform duration-500 ease-out" style="transform: translateX(0%);">
              
              ${state.banners
                .map(
                  (banner) => `
                <div class="w-full shrink-0 p-5 bg-gradient-to-br ${banner.bgGradient} text-white relative min-h-[160px] flex flex-col justify-between">
                  <!-- Decorative watermarks -->
                  <div class="absolute -right-4 -bottom-4 text-7xl opacity-10 pointer-events-none select-none">
                    🌾
                  </div>

                  <div>
                    <span class="inline-block px-2.5 py-0.5 rounded-full bg-black/30 border border-white/10 text-[10px] font-extrabold uppercase tracking-wider ${banner.accentColor} mb-2">
                      ${banner.tag}
                    </span>
                    <h3 class="text-base sm:text-lg font-bold leading-tight max-w-[85%] drop-shadow-sm">
                      ${banner.title}
                    </h3>
                    <p class="text-xs text-white/80 mt-1 max-w-[85%] leading-relaxed">
                      ${banner.subtitle}
                    </p>
                  </div>

                  <div class="mt-4 flex items-center justify-between">
                    <button
                      data-target="${banner.targetScreen}"
                      class="banner-cta-btn px-3.5 py-1.5 bg-white text-slate-900 rounded-lg text-xs font-bold hover:bg-emerald-50 transition shadow-md active:scale-95 flex items-center gap-1.5"
                    >
                      <span>${banner.cta}</span>
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"></path></svg>
                    </button>
                    <span class="text-[10px] text-white/50 font-medium">AgriSmart Verified</span>
                  </div>
                </div>
              `
                )
                .join('')}

            </div>

            <!-- Left & Right Arrow Buttons -->
            <button id="carousel-prev" class="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white/80 hover:text-white flex items-center justify-center backdrop-blur-sm transition border border-white/10">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"></path></svg>
            </button>
            <button id="carousel-next" class="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white/80 hover:text-white flex items-center justify-center backdrop-blur-sm transition border border-white/10">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"></path></svg>
            </button>
          </div>
        </section>

        <!-- 6-Card Modular Grid Navigation Interface -->
        <section>
          <div class="flex items-center justify-between mb-3.5">
            <h2 class="text-sm font-bold uppercase tracking-wider text-slate-300">
              Core Farm Services
            </h2>
            <span class="text-[11px] text-emerald-400 font-medium">6 Integrated Modules</span>
          </div>

          <div class="grid grid-cols-2 gap-3.5">

            <!-- Card 1: Weather Dashboard (Routes to Screen 6) -->
            <div
              id="nav-card-weather"
              class="group bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-sky-500/50 rounded-2xl p-4 cursor-pointer transition-all duration-200 hover:shadow-xl hover:shadow-sky-950/20 active:scale-[0.98] flex flex-col justify-between min-h-[145px]"
            >
              <div class="flex items-start justify-between">
                <div class="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  ⛅
                </div>
                <span class="px-2 py-0.5 rounded-md bg-sky-950/80 text-sky-400 border border-sky-800/40 text-[10px] font-bold">
                  24h Radar
                </span>
              </div>
              <div class="mt-3">
                <h3 class="font-bold text-sm text-white group-hover:text-sky-300 transition">
                  Weather Dashboard
                </h3>
                <p class="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                  14-day rainfall trend, storm alerts & hourly humidity.
                </p>
              </div>
            </div>

            <!-- Card 2: Smart Crop Recommendation (Routes to Screen 7) -->
            <div
              id="nav-card-crop"
              class="group bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-4 cursor-pointer transition-all duration-200 hover:shadow-xl hover:shadow-emerald-950/20 active:scale-[0.98] flex flex-col justify-between min-h-[145px]"
            >
              <div class="flex items-start justify-between">
                <div class="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  🌾
                </div>
                <span class="px-2 py-0.5 rounded-md bg-emerald-950/80 text-emerald-400 border border-emerald-800/40 text-[10px] font-bold">
                  AI Powered
                </span>
              </div>
              <div class="mt-3">
                <h3 class="font-bold text-sm text-white group-hover:text-emerald-300 transition">
                  Smart Crop Recommendation
                </h3>
                <p class="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                  GPS-based NPK analysis with profit margin & mandi risk tags.
                </p>
              </div>
            </div>

            <!-- Card 3: B2B Buy & Sell Hub (Routes to Screen 8) -->
            <div
              id="nav-card-b2b"
              class="group bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-4 cursor-pointer transition-all duration-200 hover:shadow-xl hover:shadow-indigo-950/20 active:scale-[0.98] flex flex-col justify-between min-h-[145px]"
            >
              <div class="flex items-start justify-between">
                <div class="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  🚜
                </div>
                <span class="px-2 py-0.5 rounded-md bg-indigo-950/80 text-indigo-400 border border-indigo-800/40 text-[10px] font-bold">
                  B2B Trade
                </span>
              </div>
              <div class="mt-3">
                <h3 class="font-bold text-sm text-white group-hover:text-indigo-300 transition">
                  B2B Buy & Sell Hub
                </h3>
                <p class="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                  Direct grain trade with verified millers, exporters & farmers.
                </p>
              </div>
            </div>

            <!-- Card 4: Soil Data Repository (Routes to Screen 9) -->
            <div
              id="nav-card-soil"
              class="group bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-teal-500/50 rounded-2xl p-4 cursor-pointer transition-all duration-200 hover:shadow-xl hover:shadow-teal-950/20 active:scale-[0.98] flex flex-col justify-between min-h-[145px]"
            >
              <div class="flex items-start justify-between">
                <div class="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  🧪
                </div>
                <span class="px-2 py-0.5 rounded-md bg-teal-950/80 text-teal-400 border border-teal-800/40 text-[10px] font-bold">
                  Lab Card
                </span>
              </div>
              <div class="mt-3">
                <h3 class="font-bold text-sm text-white group-hover:text-teal-300 transition">
                  Soil Data Repository
                </h3>
                <p class="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                  Record laboratory N, P, K, pH, Carbon & Conductivity.
                </p>
              </div>
            </div>

            <!-- Card 5: Government Schemes (Routes to Screen 10) -->
            <div
              id="nav-card-schemes"
              class="group bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-4 cursor-pointer transition-all duration-200 hover:shadow-xl hover:shadow-amber-950/20 active:scale-[0.98] flex flex-col justify-between min-h-[145px]"
            >
              <div class="flex items-start justify-between">
                <div class="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  🏛️
                </div>
                <span class="px-2 py-0.5 rounded-md bg-amber-950/80 text-amber-400 border border-amber-800/40 text-[10px] font-bold">
                  DBT Subsidy
                </span>
              </div>
              <div class="mt-3">
                <h3 class="font-bold text-sm text-white group-hover:text-amber-300 transition">
                  Government Schemes
                </h3>
                <p class="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                  Subsidies, PM-KISAN, PMFBY insurance & portal links.
                </p>
              </div>
            </div>

            <!-- Card 6: Market Mandi Prices (Routes to Screen 11) -->
            <div
              id="nav-card-mandi"
              class="group bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-4 cursor-pointer transition-all duration-200 hover:shadow-xl hover:shadow-emerald-950/20 active:scale-[0.98] flex flex-col justify-between min-h-[145px]"
            >
              <div class="flex items-start justify-between">
                <div class="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  📊
                </div>
                <span class="px-2 py-0.5 rounded-md bg-emerald-950/80 text-emerald-400 border border-emerald-800/40 text-[10px] font-bold">
                  APMC Live
                </span>
              </div>
              <div class="mt-3">
                <h3 class="font-bold text-sm text-white group-hover:text-emerald-300 transition">
                  Market Mandi Prices
                </h3>
                <p class="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                  Central MSP benchmark & nearby APMC yard price tables.
                </p>
              </div>
            </div>

          </div>
        </section>

      </main>

    </div>
  `;

  // Attach Navigation Listeners

  // Screen 4 (Profile)
  container.querySelector('#header-profile-btn').onclick = () => {
    router.navigateTo('screen-4');
  };

  // Screen 5 (Messages)
  container.querySelector('#header-message-btn').onclick = () => {
    router.navigateTo('screen-5');
  };

  // Screen 6 (Weather)
  const weatherCard = container.querySelector('#nav-card-weather');
  if (weatherCard) weatherCard.onclick = () => router.navigateTo('screen-6');

  const alertStrip = container.querySelector('#quick-alert-strip');
  if (alertStrip) alertStrip.onclick = () => router.navigateTo('screen-6');

  // Screen 7 (Smart Crop)
  container.querySelector('#nav-card-crop').onclick = () => {
    router.navigateTo('screen-7');
  };

  // Screen 8 (B2B Marketplace)
  container.querySelector('#nav-card-b2b').onclick = () => {
    router.navigateTo('screen-8');
  };

  // Screen 9 (Soil Data)
  container.querySelector('#nav-card-soil').onclick = () => {
    router.navigateTo('screen-9');
  };

  // Screen 10 (Gov Schemes)
  container.querySelector('#nav-card-schemes').onclick = () => {
    router.navigateTo('screen-10');
  };

  // Screen 11 (Mandi Prices)
  container.querySelector('#nav-card-mandi').onclick = () => {
    router.navigateTo('screen-11');
  };


  // Banner CTA clicks
  container.querySelectorAll('.banner-cta-btn').forEach((btn) => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const target = btn.dataset.target;
      if (target) router.navigateTo(target);
    };
  });

  // Carousel auto-sliding logic (Flipkart-style)
  const track = container.querySelector('#carousel-track');
  const dots = container.querySelectorAll('.carousel-dot');
  const totalSlides = state.banners.length;
  let currentSlide = 0;

  function updateCarousel(index) {
    currentSlide = (index + totalSlides) % totalSlides;
    if (track) {
      track.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
    dots.forEach((dot, idx) => {
      if (idx === currentSlide) {
        dot.className = 'carousel-dot h-1.5 rounded-full transition-all duration-300 w-5 bg-emerald-400';
      } else {
        dot.className = 'carousel-dot h-1.5 rounded-full transition-all duration-300 w-1.5 bg-slate-700';
      }
    });
  }

  // Clear any existing timer
  if (carouselTimer) clearInterval(carouselTimer);
  carouselTimer = setInterval(() => {
    updateCarousel(currentSlide + 1);
  }, 3500);

  // Next / Prev buttons
  const prevBtn = container.querySelector('#carousel-prev');
  const nextBtn = container.querySelector('#carousel-next');

  if (prevBtn) {
    prevBtn.onclick = () => {
      clearInterval(carouselTimer);
      updateCarousel(currentSlide - 1);
    };
  }

  if (nextBtn) {
    nextBtn.onclick = () => {
      clearInterval(carouselTimer);
      updateCarousel(currentSlide + 1);
    };
  }

  // Dots click
  dots.forEach((dot) => {
    dot.onclick = () => {
      clearInterval(carouselTimer);
      updateCarousel(parseInt(dot.dataset.index, 10));
    };
  });
}

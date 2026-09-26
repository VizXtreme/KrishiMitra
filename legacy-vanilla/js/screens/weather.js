// js/screens/weather.js - Screen 6: Weather Dashboard
import { store } from '../store.js';
import { router } from '../router.js';

export function renderWeatherScreen(container) {
  const state = store.getState();
  const weather = state.weather;
  const loc = state.location;

  container.innerHTML = `
    <div class="flex-1 flex flex-col w-full pb-12">
      
      <!-- Top Bar with Back Button -->
      <header class="sticky top-0 z-20 bg-slate-900/90 border-b border-slate-800 backdrop-blur-xl px-4 py-3 flex items-center justify-between">
        <button
          id="weather-back-btn"
          class="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
        >
          <svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
          <span>Dashboard</span>
        </button>

        <div class="text-center">
          <h1 class="text-sm font-bold text-white">Weather Dashboard</h1>
          <span class="text-[10px] text-emerald-400 font-mono">${loc.district}, ${loc.state}</span>
        </div>

        <button id="refresh-weather-btn" class="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition" title="Refresh Forecast">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
        </button>
      </header>

      <!-- Main Weather Content -->
      <main class="px-4 py-5 max-w-2xl mx-auto w-full space-y-6">

        <!-- Explicit Severe Weather Alert Banner for Unexpected Storms -->
        ${
          weather.severeAlert?.active
            ? `
            <div class="bg-gradient-to-r from-rose-950/80 via-amber-950/80 to-slate-900 border-2 border-rose-500/60 rounded-3xl p-5 shadow-2xl shadow-rose-950/40 relative overflow-hidden animate-pulse-subtle">
              <div class="flex items-start gap-3.5">
                <div class="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-2xl shrink-0 text-rose-400">
                  ⚡
                </div>
                <div class="flex-1">
                  <div class="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <span class="px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-black uppercase tracking-wider">
                      IMD Storm Warning
                    </span>
                    <span class="text-[11px] font-mono text-rose-300 font-semibold">
                      ${weather.severeAlert.validTill}
                    </span>
                  </div>

                  <h2 class="text-sm sm:text-base font-bold text-white mb-1.5">
                    ${weather.severeAlert.title}
                  </h2>

                  <p class="text-xs text-rose-100/90 leading-relaxed bg-black/30 p-3 rounded-xl border border-rose-800/30">
                    ${weather.severeAlert.description}
                  </p>
                </div>
              </div>

              <div class="mt-4 pt-3 border-t border-rose-800/40 flex items-center justify-between text-xs text-rose-200">
                <span class="flex items-center gap-1 font-medium">
                  🛡️ Preventive Advisory: Secure tarpaulins on harvested grains.
                </span>
                <span class="font-bold text-rose-300">Level: High</span>
              </div>
            </div>
          `
            : ''
        }

        <!-- Top Section: Current Temperature, Humidity & Local Coordinates -->
        <section class="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
          
          <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
            
            <!-- Hero Temp & Icon -->
            <div class="flex items-center gap-5">
              <div class="w-20 h-20 rounded-3xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-4xl shadow-inner">
                ⛅
              </div>
              <div>
                <div class="flex items-baseline gap-2">
                  <span class="text-4xl sm:text-5xl font-black text-white tracking-tight">${weather.temp}°</span>
                  <span class="text-base font-medium text-slate-400">C</span>
                </div>
                <div class="text-sm font-semibold text-sky-400 mt-0.5">${weather.condition}</div>
                <div class="text-xs text-slate-400">Feels like ${weather.feelsLike}°C</div>
              </div>
            </div>

            <!-- GPS Coordinates pill -->
            <div class="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 text-left text-xs space-y-1 font-mono">
              <span class="text-[10px] text-slate-500 uppercase tracking-wider block font-sans font-bold">Local Station Coordinates</span>
              <div class="text-emerald-400 font-semibold">Lat: ${loc.lat}° N</div>
              <div class="text-emerald-400 font-semibold">Lon: ${loc.lon}° E</div>
              <div class="text-[11px] text-slate-400 font-sans">Elevation: 247m AMSL</div>
            </div>

          </div>

          <!-- Humidity Metrics & Atmospheric Grid -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800/80">
            
            <div class="bg-slate-950/60 rounded-2xl p-3 border border-slate-800/60">
              <span class="text-[10px] uppercase tracking-wider text-slate-400 font-medium block">Relative Humidity</span>
              <div class="flex items-baseline gap-1 mt-1">
                <strong class="text-lg font-bold text-sky-400">${weather.humidity}%</strong>
                <span class="text-[11px] text-slate-500">Humid</span>
              </div>
            </div>

            <div class="bg-slate-950/60 rounded-2xl p-3 border border-slate-800/60">
              <span class="text-[10px] uppercase tracking-wider text-slate-400 font-medium block">Wind Speed</span>
              <div class="flex items-baseline gap-1 mt-1">
                <strong class="text-lg font-bold text-white">${weather.windSpeed}</strong>
                <span class="text-[11px] text-slate-400">km/h NW</span>
              </div>
            </div>

            <div class="bg-slate-950/60 rounded-2xl p-3 border border-slate-800/60">
              <span class="text-[10px] uppercase tracking-wider text-slate-400 font-medium block">Rain Probability</span>
              <div class="flex items-baseline gap-1 mt-1">
                <strong class="text-lg font-bold text-emerald-400">${weather.precipitationChance}%</strong>
                <span class="text-[11px] text-slate-500">Likely</span>
              </div>
            </div>

            <div class="bg-slate-950/60 rounded-2xl p-3 border border-slate-800/60">
              <span class="text-[10px] uppercase tracking-wider text-slate-400 font-medium block">UV Solar Index</span>
              <div class="flex items-baseline gap-1 mt-1">
                <strong class="text-lg font-bold text-amber-400">${weather.uvIndex}</strong>
                <span class="text-[11px] text-slate-500">Moderate</span>
              </div>
            </div>

          </div>

        </section>

        <!-- Hourly Forecast Sliders for the Next 24 Hours -->
        <section class="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl">
          <div class="flex items-center justify-between mb-3.5">
            <h3 class="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <span>⏱️</span>
              <span>24-Hour Micro Forecast Slider</span>
            </h3>
            <span class="text-[10px] text-slate-500">Swipe horizontally &rarr;</span>
          </div>

          <!-- Horizontal Slider Container -->
          <div class="flex items-center gap-3 overflow-x-auto pb-3 pt-1 no-scrollbar cursor-grab active:cursor-grabbing">
            ${weather.hourly
              .map((hour) => {
                const isHighRain = hour.rainProb >= 50;
                return `
                <div class="shrink-0 w-20 bg-slate-950/80 hover:bg-slate-800/80 border ${
                  isHighRain ? 'border-sky-500/40 bg-sky-950/20' : 'border-slate-800'
                } rounded-2xl p-3 text-center transition flex flex-col items-center justify-between">
                  <span class="text-[11px] font-semibold text-slate-400 mb-1">${hour.time}</span>
                  
                  <div class="text-2xl my-1">
                    ${
                      hour.rainProb >= 70
                        ? '🌧️'
                        : hour.rainProb >= 40
                        ? '🌦️'
                        : hour.rainProb >= 20
                        ? '⛅'
                        : '☀️'
                    }
                  </div>

                  <span class="text-sm font-bold text-white">${hour.temp}°</span>
                  
                  <div class="mt-2 w-full">
                    <span class="text-[10px] font-bold ${
                      isHighRain ? 'text-sky-400' : 'text-slate-500'
                    }">${hour.rainProb}%</span>
                    <div class="w-full h-1 bg-slate-800 rounded-full overflow-hidden mt-0.5">
                      <div class="h-full ${
                        isHighRain ? 'bg-sky-400' : 'bg-slate-600'
                      }" style="width: ${hour.rainProb}%"></div>
                    </div>
                  </div>
                </div>
              `;
              })
              .join('')}
          </div>
        </section>

        <!-- Bottom Section: Stylized 14-Day Rainfall Trend Line Graph -->
        <section class="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
          
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 class="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <span>🌧️</span>
                <span>14-Day Rainfall Pattern & Trend Forecast</span>
              </h3>
              <p class="text-[11px] text-slate-400 mt-0.5">
                Long-range precipitation radar modeled for ${loc.district} Agro-Climatic Zone.
              </p>
            </div>

            <div class="flex items-center gap-3 text-[11px]">
              <span class="flex items-center gap-1.5 text-sky-400 font-semibold">
                <span class="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
                Rainfall (mm)
              </span>
              <span class="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                Probability (%)
              </span>
            </div>
          </div>

          <!-- Stylized Trend Line Chart (SVG Interactive Visualization) -->
          <div class="bg-slate-950/80 rounded-2xl p-4 border border-slate-800/80 relative overflow-hidden">
            
            <div class="h-48 w-full relative">
              ${renderRainfallSvgChart(weather.fourteenDayRainfall)}
            </div>

            <!-- Chart Horizontal Axis Labels -->
            <div class="grid grid-cols-7 gap-1 text-[9px] font-mono text-slate-400 pt-2 border-t border-slate-800 text-center">
              <span>Day 1-2</span>
              <span>Day 3-4</span>
              <span>Day 5-6</span>
              <span>Day 7-8</span>
              <span>Day 9-10</span>
              <span>Day 11-12</span>
              <span>Day 13-14</span>
            </div>

          </div>

          <!-- Agronomic Irrigation Guidance based on 14-day rainfall -->
          <div class="bg-emerald-950/30 border border-emerald-800/40 rounded-2xl p-4 text-xs text-emerald-200 flex items-start gap-3">
            <span class="text-xl shrink-0">💡</span>
            <div>
              <strong class="text-emerald-300 font-bold block mb-1">Smart Irrigation Advisory:</strong>
              Significant monsoon precipitation expected on <strong class="text-white">Days 1, 2, and 9</strong> (approx. 45.1mm cumulative). Hold canal/tube-well irrigation cycles for the next 48 hours to prevent root lodging and water logging.
            </div>
          </div>

        </section>

      </main>

    </div>
  `;

  // Attach Listeners
  container.querySelector('#weather-back-btn').onclick = () => {
    router.goBack();
  };

  container.querySelector('#refresh-weather-btn').onclick = () => {
    renderWeatherScreen(container);
  };
}

// Generate stylized SVG chart for 14-day rainfall trend
function renderRainfallSvgChart(data) {
  const width = 600;
  const height = 180;
  const paddingX = 30;
  const paddingY = 25;
  const graphWidth = width - paddingX * 2;
  const graphHeight = height - paddingY * 2;

  const maxMm = 20; // scale up to 20mm
  const points = data.map((d, index) => {
    const x = paddingX + (index / (data.length - 1)) * graphWidth;
    const y = height - paddingY - (d.rainfallMm / maxMm) * graphHeight;
    return { x, y, mm: d.rainfallMm, prob: d.prob, day: d.day, date: d.date };
  });

  const pathD = points.reduce((acc, pt, i) => {
    if (i === 0) return `M ${pt.x},${pt.y}`;
    // Catmull-Rom or cubic spline smooth curve
    const prev = points[i - 1];
    const cx = (prev.x + pt.x) / 2;
    return `${acc} C ${cx},${prev.y} ${cx},${pt.y} ${pt.x},${pt.y}`;
  }, '');

  // Area under curve
  const areaD = `${pathD} L ${points[points.length - 1].x},${height - paddingY} L ${points[0].x},${height - paddingY} Z`;

  return `
    <svg viewBox="0 0 ${width} ${height}" class="w-full h-full overflow-visible" preserveAspectRatio="none">
      <defs>
        <linearGradient id="rainGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.5"/>
          <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.0"/>
        </linearGradient>
      </defs>

      <!-- Background Grid lines -->
      <line x1="${paddingX}" y1="${paddingY}" x2="${width - paddingX}" y2="${paddingY}" stroke="#334155" stroke-dasharray="3,3" stroke-width="0.8"/>
      <line x1="${paddingX}" y1="${paddingY + graphHeight * 0.5}" x2="${width - paddingX}" y2="${paddingY + graphHeight * 0.5}" stroke="#334155" stroke-dasharray="3,3" stroke-width="0.8"/>
      <line x1="${paddingX}" y1="${height - paddingY}" x2="${width - paddingX}" y2="${height - paddingY}" stroke="#475569" stroke-width="1"/>

      <!-- Y-Axis Labels -->
      <text x="${paddingX - 6}" y="${paddingY + 4}" fill="#64748b" font-size="9" text-anchor="end">20mm</text>
      <text x="${paddingX - 6}" y="${paddingY + graphHeight * 0.5 + 4}" fill="#64748b" font-size="9" text-anchor="end">10mm</text>
      <text x="${paddingX - 6}" y="${height - paddingY + 3}" fill="#64748b" font-size="9" text-anchor="end">0mm</text>

      <!-- Area fill -->
      <path d="${areaD}" fill="url(#rainGrad)" />

      <!-- Curve Line -->
      <path d="${pathD}" fill="none" stroke="#38bdf8" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>

      <!-- Data Dots -->
      ${points
        .map(
          (pt) => `
        <g class="cursor-pointer group">
          <circle cx="${pt.x}" cy="${pt.y}" r="4" fill="#0284c7" stroke="#38bdf8" stroke-width="2"/>
          ${
            pt.mm > 5
              ? `<text x="${pt.x}" y="${pt.y - 8}" fill="#e0f2fe" font-size="9" font-weight="bold" text-anchor="middle">${pt.mm}mm</text>`
              : ''
          }
        </g>
      `
        )
        .join('')}
    </svg>
  `;
}

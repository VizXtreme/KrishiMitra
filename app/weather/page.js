'use client';

import React from 'react';
import { useAgri } from '@/context/AgriContext';

export default function WeatherPage() {
  const { weather, location } = useAgri();

  // Generate SVG curve chart for 14-day rainfall trend (from original project)
  const renderRainfallSvgChart = (data) => {
    if (!data || data.length === 0) return null;

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
      const prev = points[i - 1];
      const cx = (prev.x + pt.x) / 2;
      return `${acc} C ${cx},${prev.y} ${cx},${pt.y} ${pt.x},${pt.y}`;
    }, '');

    const areaD = `${pathD} L ${points[points.length - 1].x},${height - paddingY} L ${points[0].x},${height - paddingY} Z`;

    return (
      <svg 
        viewBox={`0 0 ${width} ${height}`} 
        className="w-full h-full overflow-visible" 
        preserveAspectRatio="none"
        aria-label="14-Day Precipitation Curve Chart"
      >
        <defs>
          <linearGradient id="rainGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3d9b63" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#3d9b63" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Background Grid lines */}
        <line x1={paddingX} y1={paddingY} x2={width - paddingX} y2={paddingY} stroke="#2d2b27" strokeDasharray="3,3" strokeWidth="0.8" />
        <line x1={paddingX} y1={paddingY + graphHeight * 0.5} x2={width - paddingX} y2={paddingY + graphHeight * 0.5} stroke="#2d2b27" strokeDasharray="3,3" strokeWidth="0.8" />
        <line x1={paddingX} y1={height - paddingY} x2={width - paddingX} y2={height - paddingY} stroke="#33302c" strokeWidth="1" />

        {/* Y-Axis Labels */}
        <text x={paddingX - 6} y={paddingY + 4} fill="#978f87" fontSize="9" textAnchor="end">20mm</text>
        <text x={paddingX - 6} y={paddingY + graphHeight * 0.5 + 4} fill="#978f87" fontSize="9" textAnchor="end">10mm</text>
        <text x={paddingX - 6} y={height - paddingY + 3} fill="#978f87" fontSize="9" textAnchor="end">0mm</text>

        {/* Area fill */}
        <path d={areaD} fill="url(#rainGrad)" />

        {/* Curve Line */}
        <path d={pathD} fill="none" stroke="#3d9b63" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Data Dots */}
        {points.map((pt, idx) => (
          <g key={idx} className="cursor-pointer group">
            <circle cx={pt.x} cy={pt.y} r="4" fill="#266a45" stroke="#5bb37d" strokeWidth="2" />
            {pt.mm > 5 && (
              <text x={pt.x} y={pt.y - 8} fill="#ede9e3" fontSize="9" fontWeight="bold" textAnchor="middle">
                {pt.mm}mm
              </text>
            )}
          </g>
        ))}
      </svg>
    );
  };

  return (
    <div className="flex-1 flex flex-col w-full px-3.5 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-6xl mx-auto space-y-6 animate-slide-up">
      
      {/* Explicit Severe Weather Alert Banner */}
      {weather?.severeAlert?.active && (
        <section 
          className="bg-[#241812] border border-[#4a2316] rounded-3xl p-4 sm:p-5 shadow-xl relative overflow-hidden"
          role="alert"
          aria-live="polite"
        >
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#331c14] border border-[#582618] flex items-center justify-center text-2xl shrink-0 text-[#f87171]" aria-hidden="true">
              ⚡
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-[#b91c1c] text-white text-[10px] font-bold uppercase tracking-wider">
                  IMD Storm Warning
                </span>
                <span className="text-[11px] font-mono text-[#fca5a5] font-semibold">
                  {weather.severeAlert.validTill}
                </span>
              </div>

              <h2 className="text-sm sm:text-base font-bold text-[#ede9e3] mb-1.5 leading-snug">
                {weather.severeAlert.title}
              </h2>

              <p className="text-xs text-[#fecaca] leading-relaxed bg-[#1a100c] p-3 rounded-xl border border-[#3a1d14]">
                {weather.severeAlert.description}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#4a2316] flex flex-wrap items-center justify-between text-xs text-[#fca5a5] gap-2">
            <span className="flex items-center gap-1 font-medium">
              🛡️ Preventive Advisory: Secure tarpaulins on harvested grains.
            </span>
            <span className="font-bold text-[#fca5a5]">Level: High</span>
          </div>
        </section>
      )}

      {/* Top Section: Current Temperature, Humidity & Local Coordinates */}
      <section className="bg-[#1f1e1c] border border-[#2d2b27] rounded-3xl p-5 sm:p-6 shadow-lg relative overflow-hidden">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Hero Temp & Icon */}
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-[#252e24] border border-[#383430] flex items-center justify-center text-3xl sm:text-4xl shadow-inner shrink-0" aria-hidden="true">
              ⛅
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-black text-[#ede9e3] tracking-tight">{weather.temp}°</span>
                <span className="text-base font-medium text-[#978f87]">C</span>
              </div>
              <div className="text-sm font-semibold text-[#d4a03c] mt-0.5">{weather.condition}</div>
              <div className="text-xs text-[#978f87]">Feels like {weather.feelsLike}°C</div>
            </div>
          </div>

          {/* GPS Coordinates pill */}
          <div className="bg-[#151413] border border-[#2d2b27] rounded-2xl p-3.5 text-left text-xs space-y-1 font-mono w-full sm:w-auto">
            <span className="text-[10px] text-[#978f87] uppercase tracking-wider block font-sans font-bold">Local Station Coordinates</span>
            <div className="text-[#5bb37d] font-semibold">Lat: {location.lat}° N</div>
            <div className="text-[#5bb37d] font-semibold">Lon: {location.lon}° E</div>
            <div className="text-[11px] text-[#978f87] font-sans">Elevation: 247m AMSL</div>
          </div>
        </div>

        {/* Humidity Metrics & Atmospheric Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-[#2d2b27]">
          <div className="bg-[#151413] rounded-2xl p-3 border border-[#2d2b27]">
            <span className="text-[10px] uppercase tracking-wider text-[#978f87] font-medium block">Relative Humidity</span>
            <div className="flex items-baseline gap-1 mt-1">
              <strong className="text-lg font-bold text-[#5bb37d]">{weather.humidity}%</strong>
              <span className="text-[11px] text-[#978f87]">Humid</span>
            </div>
          </div>

          <div className="bg-[#151413] rounded-2xl p-3 border border-[#2d2b27]">
            <span className="text-[10px] uppercase tracking-wider text-[#978f87] font-medium block">Wind Speed</span>
            <div className="flex items-baseline gap-1 mt-1">
              <strong className="text-lg font-bold text-[#ede9e3]">{weather.windSpeed}</strong>
              <span className="text-[11px] text-[#978f87]">km/h NW</span>
            </div>
          </div>

          <div className="bg-[#151413] rounded-2xl p-3 border border-[#2d2b27]">
            <span className="text-[10px] uppercase tracking-wider text-[#978f87] font-medium block">Rain Probability</span>
            <div className="flex items-baseline gap-1 mt-1">
              <strong className="text-lg font-bold text-[#5bb37d]">{weather.precipitationChance}%</strong>
              <span className="text-[11px] text-[#978f87]">Likely</span>
            </div>
          </div>

          <div className="bg-[#151413] rounded-2xl p-3 border border-[#2d2b27]">
            <span className="text-[10px] uppercase tracking-wider text-[#978f87] font-medium block">UV Solar Index</span>
            <div className="flex items-baseline gap-1 mt-1">
              <strong className="text-lg font-bold text-[#d4a03c]">{weather.uvIndex}</strong>
              <span className="text-[11px] text-[#978f87]">Moderate</span>
            </div>
          </div>
        </div>

      </section>

      {/* Hourly Forecast Slider for the Next 24 Hours */}
      <section className="bg-[#1f1e1c] border border-[#2d2b27] rounded-3xl p-4 sm:p-5 shadow-lg">
        <div className="flex items-center justify-between mb-3.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#cdc7c0] flex items-center gap-1.5">
            <span aria-hidden="true">⏱️</span>
            <span>24-Hour Micro Forecast Slider</span>
          </h3>
          <span className="text-[10px] text-[#978f87]">Swipe horizontally &rarr;</span>
        </div>

        {/* Horizontal Slider Container */}
        <div className="flex items-center gap-3 overflow-x-auto pb-3 pt-1 no-scrollbar touch-pan-x">
          {weather.hourly.map((hour, idx) => {
            const isHighRain = hour.rainProb >= 50;
            return (
              <div
                key={idx}
                className={`shrink-0 w-20 ${
                  isHighRain ? 'bg-[#182318] border-[#1f3828]' : 'bg-[#151413] border-[#2d2b27]'
                } border rounded-2xl p-3 text-center transition flex flex-col items-center justify-between min-h-[140px]`}
              >
                <span className="text-[11px] font-semibold text-[#978f87] mb-1">{hour.time}</span>
                
                <div className="text-2xl my-1" aria-hidden="true">
                  {hour.rainProb >= 70
                    ? '🌧️'
                    : hour.rainProb >= 40
                    ? '🌦️'
                    : hour.rainProb >= 20
                    ? '⛅'
                    : '☀️'}
                </div>

                <span className="text-sm font-bold text-[#ede9e3]">{hour.temp}°</span>
                
                <div className="mt-2 w-full">
                  <span className={`text-[10px] font-bold ${isHighRain ? 'text-[#5bb37d]' : 'text-[#978f87]'}`}>
                    {hour.rainProb}%
                  </span>
                  <div className="w-full h-1 bg-[#272523] rounded-full overflow-hidden mt-0.5">
                    <div
                      className={`h-full ${isHighRain ? 'bg-[#2e7d52]' : 'bg-[#33302c]'}`}
                      style={{ width: `${hour.rainProb}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Stylized 14-Day Rainfall Trend Line Graph */}
      <section className="bg-[#1f1e1c] border border-[#2d2b27] rounded-3xl p-4 sm:p-6 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#cdc7c0] flex items-center gap-1.5">
              <span aria-hidden="true">🌧️</span>
              <span>14-Day Rainfall Pattern & Trend Forecast</span>
            </h3>
            <p className="text-[11px] text-[#978f87] mt-0.5">
              Long-range precipitation radar modeled for {location.district} Agro-Climatic Zone.
            </p>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1.5 text-[#5bb37d] font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-[#3d9b63]" aria-hidden="true"></span>
              Rainfall (mm)
            </span>
            <span className="flex items-center gap-1.5 text-[#d4a03c] font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-[#d4a03c]" aria-hidden="true"></span>
              Probability (%)
            </span>
          </div>
        </div>

        {/* Stylized Trend Line Chart */}
        <div className="bg-[#151413] rounded-2xl p-4 border border-[#2d2b27] relative overflow-hidden">
          <div className="h-44 sm:h-48 w-full relative">
            {renderRainfallSvgChart(weather.fourteenDayRainfall)}
          </div>

          {/* Chart Horizontal Axis Labels */}
          <div className="grid grid-cols-7 gap-1 text-[9px] font-mono text-[#978f87] pt-2 border-t border-[#2d2b27] text-center">
            <span>Day 1-2</span>
            <span>Day 3-4</span>
            <span>Day 5-6</span>
            <span>Day 7-8</span>
            <span>Day 9-10</span>
            <span>Day 11-12</span>
            <span>Day 13-14</span>
          </div>
        </div>

        {/* Agronomic Irrigation Guidance */}
        <div className="bg-[#1c2119] border border-[#2b3325] rounded-2xl p-4 text-xs text-[#b5aea7] flex items-start gap-3">
          <span className="text-xl shrink-0" aria-hidden="true">💡</span>
          <div>
            <strong className="text-[#5bb37d] font-bold block mb-1">Smart Irrigation Advisory:</strong>
            Significant precipitation expected on <strong className="text-[#ede9e3]">Days 1, 2, and 9</strong> (approx. 45.1mm cumulative). Hold canal/tube-well irrigation cycles for the next 48 hours to prevent root lodging and water logging.
          </div>
        </div>
      </section>

    </div>
  );
}

'use client';

import React, { useEffect } from 'react';

export default function ErrorBoundary({ error, reset }) {
  useEffect(() => {
    console.error('KrishiMitra Application Error:', error);
  }, [error]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center max-w-md mx-auto space-y-6 animate-slide-up">
      <div className="w-20 h-20 rounded-3xl bg-[#241812] border border-[#4a2316] flex items-center justify-center text-4xl shadow-xl shadow-red-950/20 select-none">
        ⚠️
      </div>

      <div className="space-y-2">
        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#241812] text-[#f87171] border border-[#4a2316]">
          Temporary Exception
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#ede9e3] tracking-tight">
          System Advisory Alert
        </h1>
        <p className="text-xs sm:text-sm text-[#978f87] leading-relaxed">
          An unexpected error occurred while loading this farm module. Your cached local data remains safe.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
        <button
          onClick={() => reset()}
          className="flex-1 py-3 px-4 bg-[#2e7d52] hover:bg-[#266a45] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition text-center focus-visible:ring-2 focus-visible:ring-[#3d9b63]"
        >
          Try Again
        </button>
        <button
          onClick={() => window.location.href = '/'}
          className="flex-1 py-3 px-4 bg-[#272523] hover:bg-[#2d2b27] border border-[#302d29] text-[#ede9e3] font-medium text-xs sm:text-sm rounded-xl transition text-center focus-visible:ring-2 focus-visible:ring-[#3d9b63]"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
}

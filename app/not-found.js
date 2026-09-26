'use client';

import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center max-w-md mx-auto space-y-6 animate-slide-up">
      <div className="w-20 h-20 rounded-3xl bg-[#252e24] border border-[#383430] flex items-center justify-center text-4xl shadow-xl shadow-[#2e7d52]/10 select-none">
        🌾
      </div>
      
      <div className="space-y-2">
        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#211c0e] text-[#d4a03c] border border-[#483c1d]">
          404 — Page Not Found
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#ede9e3] tracking-tight">
          Field Path Not Found
        </h1>
        <p className="text-xs sm:text-sm text-[#978f87] leading-relaxed">
          The agricultural page or mandi resource you are looking for does not exist or may have been relocated.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
        <Link
          href="/"
          className="flex-1 py-3 px-4 bg-[#2e7d52] hover:bg-[#266a45] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition text-center focus-visible:ring-2 focus-visible:ring-[#3d9b63]"
        >
          Return to Dashboard
        </Link>
        <Link
          href="/mandi"
          className="flex-1 py-3 px-4 bg-[#272523] hover:bg-[#2d2b27] border border-[#302d29] text-[#ede9e3] font-medium text-xs sm:text-sm rounded-xl transition text-center focus-visible:ring-2 focus-visible:ring-[#3d9b63]"
        >
          Check Mandi Rates
        </Link>
      </div>
    </div>
  );
}

'use client';

import React from 'react';

export default function PortalModal({ portal, onClose }) {
  if (!portal) return null;

  const { title, url, portalName } = portal;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="portal-modal-title"
    >
      <div 
        className="bg-[#1f1e1c] border border-[#2d2b27] rounded-2xl w-full max-w-2xl h-[90vh] max-h-[720px] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Browser Header Bar */}
        <div className="bg-[#181716] border-b border-[#2d2b27] px-4 py-3 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-[#7a756f]" aria-hidden="true">
            <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
            <span className="w-3 h-3 rounded-full bg-[#2e7d52]"></span>
          </div>

          {/* URL bar */}
          <div className="flex-1 max-w-md bg-[#151413] border border-[#302d29] rounded-lg px-3 py-1.5 flex items-center gap-2 text-xs text-[#978f87]">
            <svg className="w-3.5 h-3.5 text-[#5bb37d] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="truncate font-mono text-[#5bb37d]">{url}</span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-2.5 py-1.5 bg-[#1c2119] text-[#8bcca2] hover:bg-[#252a22] rounded-lg border border-[#2b3325] flex items-center gap-1 font-medium transition focus-visible:ring-2 focus-visible:ring-[#3d9b63]"
              title="Open in External Browser"
            >
              <span>Open External</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
            <button
              onClick={onClose}
              aria-label="Close Portal Viewer"
              className="text-[#978f87] hover:text-[#ede9e3] p-1.5 rounded-lg bg-[#272523] hover:bg-[#2d2b27] transition focus-visible:ring-2 focus-visible:ring-[#3d9b63]"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* In-App Viewer Content / Portal Simulation */}
        <div className="flex-1 bg-[#111110] overflow-y-auto p-4 sm:p-6 text-[#c5bfb8]">
          <div className="max-w-xl mx-auto bg-[#1f1e1c] border border-[#2d2b27] rounded-2xl p-5 sm:p-6 shadow-xl">
            {/* Government Emblem / Header Mock */}
            <div className="border-b border-[#2d2b27] pb-4 mb-5 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#261e12] border border-[#453618] flex items-center justify-center text-2xl shrink-0" aria-hidden="true">
                🏛️
              </div>
              <div className="min-w-0">
                <span className="text-[10px] tracking-wider uppercase font-semibold text-[#d4a03c] block truncate">
                  Government of India • Ministry of Agriculture
                </span>
                <h2 id="portal-modal-title" className="text-base sm:text-lg font-bold text-[#ede9e3] truncate">
                  {title}
                </h2>
              </div>
            </div>

            {/* Portal Notice */}
            <div className="bg-[#1c2119] border border-[#2b3325] rounded-xl p-4 mb-6 text-xs text-[#b5aea7] flex items-start gap-3">
              <svg className="w-5 h-5 text-[#5bb37d] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <div>
                <strong className="font-semibold block text-[#5bb37d] mb-0.5">Secure Farmer Service Portal</strong>
                Official e-Governance window for DBT subsidies, claim status tracking, and registry verification.
              </div>
            </div>

            <div className="space-y-4 text-xs text-[#b5aea7]">
              <p className="leading-relaxed">
                You are securely accessing <strong className="text-[#ede9e3]">{portalName || url}</strong>. To complete your digital registration or check DBT bank disbursement:
              </p>

              <div className="bg-[#151413] rounded-xl p-4 border border-[#2d2b27] space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#272523] text-[#5bb37d] flex items-center justify-center text-[10px] font-bold shrink-0">1</span>
                  <span>Keep your 12-digit Aadhaar Card ready.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#272523] text-[#5bb37d] flex items-center justify-center text-[10px] font-bold shrink-0">2</span>
                  <span>Verify that your bank account is Aadhaar-seeded for DBT.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#272523] text-[#5bb37d] flex items-center justify-center text-[10px] font-bold shrink-0">3</span>
                  <span>Upload your Land Record (Khata/Khasra/Patta) document.</span>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 bg-[#2e7d52] hover:bg-[#266a45] text-white rounded-xl font-bold text-center shadow-md shadow-[#2e7d52]/20 border border-[#3d9b63]/30 flex items-center justify-center gap-2 transition focus-visible:ring-2 focus-visible:ring-[#3d9b63]"
                >
                  <span>Continue to Official Portal</span>
                  <svg className="w-4 h-4 text-emerald-100" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

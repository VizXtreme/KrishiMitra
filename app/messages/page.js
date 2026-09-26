'use client';

import React, { useState } from 'react';
import { useAgri } from '@/context/AgriContext';

export default function MessagesPage() {
  const { messages, markMessageAsRead, openCallModal, addToast } = useAgri();
  const [filter, setFilter] = useState('all');

  const unreadCount = messages.filter((m) => !m.read).length;

  const filtered = messages.filter((m) => {
    if (filter === 'unread') return !m.read;
    if (filter === 'demand') return m.status === 'High Demand' || m.status === 'Export Grade';
    return true;
  });

  const handleCall = (item) => {
    markMessageAsRead(item.id);
    openCallModal(item);
  };

  return (
    <div className="flex-1 flex flex-col w-full px-3.5 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-6xl mx-auto space-y-6 animate-slide-up">
      
      {/* Metrics Strip */}
      <section className="grid grid-cols-3 gap-2.5" aria-label="Lead Statistics">
        <div className="bg-[#1f1e1c] border border-[#2d2b27] rounded-2xl p-3 text-center">
          <span className="text-[10px] uppercase tracking-wider text-[#978f87] font-semibold block">Total Leads</span>
          <strong className="text-base sm:text-lg font-bold text-[#ede9e3]">{messages.length}</strong>
        </div>
        <div className="bg-[#1f1e1c] border border-[#2d2b27] rounded-2xl p-3 text-center">
          <span className="text-[10px] uppercase tracking-wider text-[#978f87] font-semibold block">Unread</span>
          <strong className="text-base sm:text-lg font-bold text-[#f87171]">{unreadCount}</strong>
        </div>
        <div className="bg-[#1f1e1c] border border-[#2d2b27] rounded-2xl p-3 text-center">
          <span className="text-[10px] uppercase tracking-wider text-[#978f87] font-semibold block">Spot Deals</span>
          <strong className="text-base sm:text-lg font-bold text-[#d4a03c]">₹4.2k+</strong>
        </div>
      </section>

      {/* Filter Pills */}
      <div className="flex items-center gap-2 pt-1" role="tablist" aria-label="Filter Messages">
        <button
          role="tab"
          aria-selected={filter === 'all'}
          onClick={() => setFilter('all')}
          className={`filter-pill px-3 py-1.5 rounded-xl text-xs font-semibold transition focus-visible:ring-2 focus-visible:ring-[#3d9b63] focus-visible:outline-none ${
            filter === 'all'
              ? 'bg-[#2e7d52] text-white shadow-sm shadow-[#2e7d52]/30 border border-[#3d9b63]/30'
              : 'bg-[#1f1e1c] text-[#978f87] border border-[#2d2b27] hover:text-[#ede9e3]'
          }`}
        >
          All Queries ({messages.length})
        </button>
        <button
          role="tab"
          aria-selected={filter === 'unread'}
          onClick={() => setFilter('unread')}
          className={`filter-pill px-3 py-1.5 rounded-xl text-xs font-semibold transition focus-visible:ring-2 focus-visible:ring-[#3d9b63] focus-visible:outline-none ${
            filter === 'unread'
              ? 'bg-[#2e7d52] text-white shadow-sm shadow-[#2e7d52]/30 border border-[#3d9b63]/30'
              : 'bg-[#1f1e1c] text-[#978f87] border border-[#2d2b27] hover:text-[#ede9e3]'
          }`}
        >
          Unread ({unreadCount})
        </button>
        <button
          role="tab"
          aria-selected={filter === 'demand'}
          onClick={() => setFilter('demand')}
          className={`filter-pill px-3 py-1.5 rounded-xl text-xs font-semibold transition focus-visible:ring-2 focus-visible:ring-[#3d9b63] focus-visible:outline-none ${
            filter === 'demand'
              ? 'bg-[#2e7d52] text-white shadow-sm shadow-[#2e7d52]/30 border border-[#3d9b63]/30'
              : 'bg-[#1f1e1c] text-[#978f87] border border-[#2d2b27] hover:text-[#ede9e3]'
          }`}
        >
          High Demand
        </button>
      </div>

      {/* Vertical Notification Log List */}
      <section className="pt-2" aria-label="Buyer Notifications">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-[#978f87] bg-[#1f1e1c] rounded-2xl border border-[#2d2b27] p-6">
            <span className="text-3xl mb-2 block" aria-hidden="true">📭</span>
            <p className="text-xs font-medium">No messages found for this filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filtered.map((item) => (
              <article
                key={item.id}
                className={`relative bg-[#1f1e1c] border ${
                  !item.read ? 'border-[#1f3828] shadow-md shadow-[#2e7d52]/10' : 'border-[#2d2b27]'
                } rounded-2xl p-4 sm:p-5 transition hover:border-[#3d3935] space-y-3 flex flex-col justify-between`}
              >
                <div>
                  {/* Unread Dot Indicator */}
                  {!item.read && (
                    <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-[#5bb37d] ring-4 ring-[#1c2119]" aria-label="Unread message"></span>
                  )}

                  {/* Tag & Time */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        item.badgeColor === 'emerald'
                          ? 'bg-[#1c2119] text-[#8bcca2] border border-[#2b3325]'
                          : item.badgeColor === 'amber'
                          ? 'bg-[#231d10] text-[#ddb65a] border border-[#483515]'
                          : 'bg-[#1c2119] text-[#8bcca2] border border-[#2b3325]'
                      }`}
                    >
                      {item.status}
                    </span>
                    <span className="text-[11px] text-[#635e58]" aria-hidden="true">•</span>
                    <span className="text-[11px] text-[#978f87]">{item.timestamp}</span>
                    <span className="text-[11px] text-[#635e58]" aria-hidden="true">•</span>
                    <span className="text-[11px] text-[#978f87] truncate max-w-[140px]">{item.company}</span>
                  </div>

                  {/* Original Specified Card Template */}
                  <div className="bg-[#151413] rounded-xl p-3.5 border border-[#2d2b27] mt-3">
                    <p className="text-sm font-semibold text-[#ede9e3] leading-relaxed">
                      Buyer <span className="text-[#5bb37d] font-bold">{item.buyerName}</span> wants to buy{' '}
                      <span className="text-[#d4a03c] font-bold">{item.quantity} Quintals</span> of{' '}
                      <span className="text-[#ede9e3] font-bold">{item.crop}</span> —{' '}
                      <span className="text-[#5bb37d] font-mono font-medium">{item.phone}</span>
                    </p>

                    <div className="mt-2.5 pt-2 border-t border-[#2d2b27] flex items-center justify-between text-xs text-[#978f87]">
                      <span>Offered Price: <strong className="text-[#ede9e3] font-bold text-sm">₹{item.offeredPrice}</strong> / Qtl</span>
                      <span className="text-[#5bb37d] text-[11px] font-medium">Spot Payment Ready</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-1">
                  <button
                    onClick={() => handleCall(item)}
                    aria-label={`Click to call ${item.buyerName} at ${item.phone}`}
                    className="flex-1 py-2.5 bg-[#2e7d52] hover:bg-[#266a45] text-white font-bold text-xs rounded-xl shadow-md shadow-[#2e7d52]/20 border border-[#3d9b63]/30 active:scale-[0.98] transition flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-[#3d9b63]"
                  >
                    <svg className="w-4 h-4 text-emerald-100" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <span>Click to Call</span>
                  </button>

                  <a
                    href={`tel:${item.phone.replace(/\s+/g, '')}`}
                    aria-label={`Direct telephone dial to ${item.phone}`}
                    className="px-3.5 py-2.5 bg-[#272523] hover:bg-[#2d2b27] text-[#ada6a0] hover:text-[#ede9e3] rounded-xl text-xs font-semibold border border-[#302d29] transition flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-[#3d9b63]"
                    title="Direct Phone Dial"
                  >
                    <span>Dial</span>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}

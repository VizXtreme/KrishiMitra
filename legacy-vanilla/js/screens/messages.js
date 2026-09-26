// js/screens/messages.js - Screen 5: Message Tab (Notification Log)
import { store } from '../store.js';
import { router } from '../router.js';
import { openCallModal } from '../components/modal.js';
import { showToast } from '../components/toast.js';

export function renderMessagesScreen(container) {
  const state = store.getState();
  let messages = [...state.messages];
  let filter = 'all';

  function renderList() {
    const filtered = messages.filter((m) => {
      if (filter === 'unread') return !m.read;
      if (filter === 'demand') return m.status === 'High Demand' || m.status === 'Export Grade';
      return true;
    });

    const unreadCount = messages.filter((m) => !m.read).length;

    container.innerHTML = `
      <div class="flex-1 flex flex-col w-full pb-10">
        
        <!-- Top Bar with Back Button -->
        <header class="sticky top-0 z-20 bg-slate-900/90 border-b border-slate-800 backdrop-blur-xl px-4 py-3 flex items-center justify-between">
          <button
            id="messages-back-btn"
            class="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
          >
            <svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
            <span>Dashboard</span>
          </button>

          <div class="flex items-center gap-2">
            <h1 class="text-sm font-bold text-white">Buyer Inquiries</h1>
            ${
              unreadCount > 0
                ? `<span class="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-bold">${unreadCount} New</span>`
                : ''
            }
          </div>

          <button id="mark-all-read-btn" class="text-xs text-emerald-400 hover:text-emerald-300 font-medium">
            Mark Read
          </button>
        </header>

        <!-- Main Content -->
        <main class="px-4 py-5 max-w-lg mx-auto w-full space-y-4">

          <!-- Metrics Strip -->
          <div class="grid grid-cols-3 gap-2.5">
            <div class="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 text-center">
              <span class="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">Total Leads</span>
              <strong class="text-lg font-bold text-white">${messages.length}</strong>
            </div>
            <div class="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 text-center">
              <span class="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">Unread</span>
              <strong class="text-lg font-bold text-rose-400">${unreadCount}</strong>
            </div>
            <div class="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 text-center">
              <span class="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">Spot Deals</span>
              <strong class="text-lg font-bold text-emerald-400">₹4.2k+</strong>
            </div>
          </div>

          <!-- Filter Pills -->
          <div class="flex items-center gap-2 pt-1">
            <button data-filter="all" class="filter-pill px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              filter === 'all'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
            }">
              All Queries (${messages.length})
            </button>
            <button data-filter="unread" class="filter-pill px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              filter === 'unread'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
            }">
              Unread (${unreadCount})
            </button>
            <button data-filter="demand" class="filter-pill px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              filter === 'demand'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
            }">
              High Demand
            </button>
          </div>

          <!-- Vertical Notification Log List -->
          <div class="space-y-3 pt-2">
            ${
              filtered.length === 0
                ? `
                <div class="text-center py-12 text-slate-500 bg-slate-900/50 rounded-2xl border border-slate-800 p-6">
                  <span class="text-3xl mb-2 block">📭</span>
                  <p class="text-xs font-medium">No messages found for this filter.</p>
                </div>
              `
                : filtered
                    .map(
                      (item) => `
                <div
                  class="relative bg-slate-900/90 border ${
                    !item.read ? 'border-emerald-500/40 shadow-lg shadow-emerald-950/20' : 'border-slate-800'
                  } rounded-2xl p-4 sm:p-5 transition hover:border-slate-700"
                >
                  <!-- Unread Dot Indicator -->
                  ${
                    !item.read
                      ? `<span class="absolute top-4 right-4 w-2 h-2 rounded-full bg-emerald-400 ring-4 ring-emerald-950/60"></span>`
                      : ''
                  }

                  <!-- Tag & Time -->
                  <div class="flex items-center gap-2 mb-2">
                    <span class="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      item.badgeColor === 'emerald'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                        : item.badgeColor === 'blue'
                        ? 'bg-blue-950 text-blue-400 border border-blue-800/60'
                        : item.badgeColor === 'amber'
                        ? 'bg-amber-950 text-amber-400 border border-amber-800/60'
                        : 'bg-slate-800 text-slate-400'
                    }">
                      ${item.status}
                    </span>
                    <span class="text-[11px] text-slate-500">•</span>
                    <span class="text-[11px] text-slate-400">${item.timestamp}</span>
                    <span class="text-[11px] text-slate-500">•</span>
                    <span class="text-[11px] text-slate-400 truncate max-w-[140px]">${item.company}</span>
                  </div>

                  <!-- Prompt Specified Card Template: 'Buyer [Name] wants to buy [X] Quintals of [Crop] - [Phone Number]' -->
                  <div class="bg-slate-950/80 rounded-xl p-3.5 border border-slate-800/80 mb-4">
                    <p class="text-sm font-semibold text-white leading-relaxed">
                      Buyer <span class="text-emerald-300 font-bold">${item.buyerName}</span> wants to buy <span class="text-amber-300 font-bold">${item.quantity} Quintals</span> of <span class="text-white font-bold">${item.crop}</span> — <span class="text-emerald-400 font-mono font-medium">${item.phone}</span>
                    </p>
                    
                    <div class="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                      <span>Offered Price: <strong class="text-white font-bold text-sm">₹${item.offeredPrice}</strong> / Qtl</span>
                      <span class="text-emerald-400 text-[11px] font-medium">Spot Payment Ready</span>
                    </div>
                  </div>

                  <!-- Action Buttons -->
                  <div class="flex items-center gap-3">
                    <!-- Interactive Green 'Click to Call' Call Button -->
                    <button
                      data-id="${item.id}"
                      data-name="${item.buyerName}"
                      data-phone="${item.phone}"
                      data-crop="${item.crop}"
                      data-quantity="${item.quantity}"
                      data-price="${item.offeredPrice}"
                      class="click-to-call-btn flex-1 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-950/40 active:scale-[0.98] transition flex items-center justify-center gap-2"
                    >
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path></svg>
                      <span>Click to Call</span>
                    </button>

                    <!-- Direct Tel fallback link button -->
                    <a
                      href="tel:${item.phone.replace(/\s+/g, '')}"
                      class="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5"
                      title="Direct Phone Dial"
                    >
                      <span>Dial</span>
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                    </a>
                  </div>

                </div>
              `
                    )
                    .join('')
            }
          </div>

        </main>

      </div>
    `;

    // Attach Listeners
    container.querySelector('#messages-back-btn').onclick = () => {
      router.goBack();
    };

    const markAllBtn = container.querySelector('#mark-all-read-btn');
    if (markAllBtn) {
      markAllBtn.onclick = () => {
        messages.forEach((m) => store.markMessageAsRead(m.id));
        showToast('All buyer messages marked as read.', 'info');
        renderList();
      };
    }

    container.querySelectorAll('.filter-pill').forEach((btn) => {
      btn.onclick = () => {
        filter = btn.dataset.filter;
        renderList();
      };
    });

    // Click to Call buttons
    container.querySelectorAll('.click-to-call-btn').forEach((btn) => {
      btn.onclick = () => {
        const id = btn.dataset.id;
        const name = btn.dataset.name;
        const phone = btn.dataset.phone;
        const crop = btn.dataset.crop;
        const quantity = btn.dataset.quantity;
        const offeredPrice = btn.dataset.price;

        store.markMessageAsRead(id);

        openCallModal({
          name,
          phone,
          crop,
          quantity,
          offeredPrice,
        });
      };
    });
  }

  renderList();
}

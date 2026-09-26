// js/screens/b2bMarketplace.js - Screen 8: Autonomous B2B Buy & Sell Hub
import { store } from '../store.js';
import { router } from '../router.js';
import { openCallModal } from '../components/modal.js';
import { showToast } from '../components/toast.js';

export function renderB2BMarketplaceScreen(container) {
  let state = store.getState();
  let selectedCrop = state.marketplace.selectedCrop || 'Wheat';
  let activeTab = state.marketplace.activeTab || 'SELL'; // 'SELL' or 'BUY'

  function renderView() {
    state = store.getState();
    const cropsList = state.marketplace.cropsList;

    // Filtered lists based on selected crop
    const filteredBuyerRequests = state.marketplace.buyerRequests.filter(
      (req) => req.crop.toLowerCase().includes(selectedCrop.toLowerCase()) || selectedCrop.toLowerCase().includes(req.crop.toLowerCase())
    );

    const filteredFarmerListings = state.marketplace.farmerListings.filter(
      (item) => item.crop.toLowerCase().includes(selectedCrop.toLowerCase()) || selectedCrop.toLowerCase().includes(item.crop.toLowerCase())
    );

    container.innerHTML = `
      <div class="flex-1 flex flex-col w-full pb-16">
        
        <!-- Top Bar with Back Button -->
        <header class="sticky top-0 z-20 bg-slate-900/90 border-b border-slate-800 backdrop-blur-xl px-4 py-3 flex items-center justify-between">
          <button
            id="b2b-back-btn"
            class="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
          >
            <svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
            <span>Dashboard</span>
          </button>

          <h1 class="text-sm font-bold text-white">B2B Buy & Sell Hub</h1>

          <div class="text-xs text-emerald-400 font-mono font-medium">Verified Mandi Desk</div>
        </header>

        <!-- Main Marketplace Container -->
        <main class="px-4 py-5 max-w-2xl mx-auto w-full space-y-6">

          <!-- Top Navigation Structure: Prominent 'Select Crop' dropdown on upper left, two toggle switch buttons [SELL] and [BUY] immediately next to it -->
          <div class="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            
            <!-- Upper Left: Prominent 'Select Crop' Dropdown Filter -->
            <div class="w-full sm:w-auto flex-1 flex items-center gap-2">
              <label for="b2b-crop-select" class="text-xs font-bold uppercase tracking-wider text-slate-400 shrink-0">
                Select Crop:
              </label>
              <div class="relative flex-1">
                <select
                  id="b2b-crop-select"
                  class="w-full pl-3.5 pr-8 py-2.5 bg-slate-950 border-2 border-emerald-500/50 rounded-xl text-white font-bold text-sm focus:outline-none focus:border-emerald-400 appearance-none shadow-md cursor-pointer"
                >
                  ${cropsList
                    .map(
                      (c) => `
                    <option value="${c}" ${c === selectedCrop ? 'selected' : ''}>
                      🌾 ${c}
                    </option>
                  `
                    )
                    .join('')}
                </select>
                <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-emerald-400 text-xs">
                  ▼
                </div>
              </div>
            </div>

            <!-- Immediately Next To It: Two Toggle Switch Buttons Labeled [SELL] and [BUY] -->
            <div class="flex items-center p-1 bg-slate-950 rounded-2xl border border-slate-800 shrink-0 w-full sm:w-auto">
              <!-- [SELL] Toggle Button -->
              <button
                id="toggle-sell-btn"
                class="flex-1 sm:flex-none px-6 py-2 rounded-xl text-xs font-black tracking-wider transition-all duration-200 ${
                  activeTab === 'SELL'
                    ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg shadow-emerald-950/60'
                    : 'text-slate-400 hover:text-white'
                }"
              >
                SELL
              </button>

              <!-- [BUY] Toggle Button -->
              <button
                id="toggle-buy-btn"
                class="flex-1 sm:flex-none px-6 py-2 rounded-xl text-xs font-black tracking-wider transition-all duration-200 ${
                  activeTab === 'BUY'
                    ? 'bg-gradient-to-r from-blue-600 to-sky-600 text-white shadow-lg shadow-blue-950/60'
                    : 'text-slate-400 hover:text-white'
                }"
              >
                BUY
              </button>
            </div>

          </div>

          <!-- Dynamic Behavior When [SELL] Toggle is Active -->
          ${
            activeTab === 'SELL'
              ? `
            <div class="space-y-6 animate-fade-in">
              
              <!-- Upper Form Layout Box for SELL -->
              <div class="bg-gradient-to-b from-slate-900 to-slate-950 border border-emerald-500/30 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
                
                <div class="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h2 class="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                      Farmer Harvest Listing Form
                    </h2>
                    <p class="text-[11px] text-slate-400">Broadcast your harvest to verified bulk grain buyers & millers.</p>
                  </div>
                  <span class="text-xs px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">SELL MODE</span>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  
                  <!-- Selected Crop (Auto-filled) -->
                  <div>
                    <label class="block text-xs font-semibold text-slate-300 mb-1.5">
                      Selected Crop
                    </label>
                    <input
                      type="text"
                      id="sell-crop-autofill"
                      value="${selectedCrop}"
                      readonly
                      class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-emerald-300 font-bold text-sm cursor-not-allowed"
                    />
                  </div>

                  <!-- Available Quantity (Quintals) -->
                  <div>
                    <label class="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                      <span>Available Quantity</span>
                      <span class="text-[10px] text-emerald-400 font-mono">Qtl</span>
                    </label>
                    <input
                      type="number"
                      id="sell-quantity-input"
                      placeholder="e.g. 150"
                      class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white font-medium text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <!-- Expected Price (₹ Per Quintal) -->
                  <div>
                    <label class="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                      <span>Expected Price</span>
                      <span class="text-[10px] text-emerald-400 font-mono">₹/Qtl</span>
                    </label>
                    <input
                      type="number"
                      id="sell-price-input"
                      placeholder="e.g. 2450"
                      class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white font-medium text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                </div>

                <!-- Primary Green [List Product] Button -->
                <div class="pt-2">
                  <button
                    id="list-product-btn"
                    class="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-950/50 hover:shadow-emerald-900/60 active:scale-[0.98] transition flex items-center justify-center gap-2"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                    <span>List Product</span>
                  </button>
                </div>

              </div>

              <!-- Vertical Scrollable Marketplace Feed Showcasing Active Buyer Requests for that particular crop -->
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <h3 class="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <span>🏢</span>
                    <span>Active Buyer Requests for ${selectedCrop}</span>
                  </h3>
                  <span class="text-[11px] text-slate-400">${filteredBuyerRequests.length} Verified Buyers</span>
                </div>

                <div class="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  ${
                    filteredBuyerRequests.length === 0
                      ? `
                      <div class="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 text-center text-slate-400 text-xs">
                        No active buyer requests currently logged for ${selectedCrop}. List your harvest above to attract regional millers.
                      </div>
                    `
                      : filteredBuyerRequests
                          .map(
                            (req) => `
                      <div class="bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-4 sm:p-5 shadow-lg transition space-y-3">
                        
                        <div class="flex items-start justify-between gap-2">
                          <div>
                            <div class="flex items-center gap-2 mb-0.5">
                              <h4 class="font-bold text-sm sm:text-base text-white">${req.buyerName}</h4>
                              <span class="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/60 text-[10px] font-bold">
                                Verified
                              </span>
                            </div>
                            <p class="text-xs text-slate-400 font-medium">${req.company} • ${req.location}</p>
                          </div>

                          <span class="px-2.5 py-1 rounded-lg bg-amber-950/60 text-amber-300 border border-amber-800/40 text-xs font-semibold">
                            ${req.urgency}
                          </span>
                        </div>

                        <!-- Listing Details: Quantity Needed & Target Buying Price Offered -->
                        <div class="grid grid-cols-2 gap-3 bg-slate-950/80 rounded-xl p-3 border border-slate-800/80 text-xs">
                          <div>
                            <span class="text-[10px] text-slate-500 uppercase font-semibold block">Quantity Needed</span>
                            <strong class="text-sm font-bold text-amber-300">${req.quantityNeeded} Quintals</strong>
                          </div>
                          <div>
                            <span class="text-[10px] text-slate-500 uppercase font-semibold block">Target Buying Price</span>
                            <strong class="text-sm font-bold text-emerald-400">₹${req.targetPrice} / Qtl</strong>
                          </div>
                        </div>

                        <!-- Prominent Interactive Mobile Call Button -->
                        <div class="flex items-center gap-2 pt-1">
                          <button
                            class="b2b-call-btn flex-1 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-950/30 flex items-center justify-center gap-2 transition active:scale-[0.98]"
                            data-name="${req.buyerName}"
                            data-phone="${req.phone}"
                            data-crop="${req.crop}"
                            data-quantity="${req.quantityNeeded}"
                            data-price="${req.targetPrice}"
                          >
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path></svg>
                            <span>Call Buyer (${req.phone})</span>
                          </button>
                          
                          <a
                            href="tel:${req.phone.replace(/\s+/g, '')}"
                            class="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs border border-slate-700"
                            title="Direct Dial"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                          </a>
                        </div>

                      </div>
                    `
                          )
                          .join('')
                  }
                </div>
              </div>

            </div>
          `
              : `
            <!-- Dynamic Behavior When [BUY] Toggle is Active -->
            <div class="space-y-6 animate-fade-in">
              
              <!-- Upper Requirement Box for BUY -->
              <div class="bg-gradient-to-b from-slate-900 to-slate-950 border border-blue-500/30 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
                
                <div class="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h2 class="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                      <span class="w-2 h-2 rounded-full bg-blue-400"></span>
                      Trader / Miller Requirement Box
                    </h2>
                    <p class="text-[11px] text-slate-400">Post target purchase quantity and offered price to local growers.</p>
                  </div>
                  <span class="text-xs px-2.5 py-1 rounded-full bg-blue-950 text-blue-300 border border-blue-800 font-bold">BUY MODE</span>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  
                  <!-- Selected Crop (Auto-filled) -->
                  <div>
                    <label class="block text-xs font-semibold text-slate-300 mb-1.5">
                      Selected Crop
                    </label>
                    <input
                      type="text"
                      id="buy-crop-autofill"
                      value="${selectedCrop}"
                      readonly
                      class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-blue-300 font-bold text-sm cursor-not-allowed"
                    />
                  </div>

                  <!-- Needed Quantity (Quintals) -->
                  <div>
                    <label class="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                      <span>Needed Quantity</span>
                      <span class="text-[10px] text-blue-400 font-mono">Qtl</span>
                    </label>
                    <input
                      type="number"
                      id="buy-quantity-input"
                      placeholder="e.g. 300"
                      class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white font-medium text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <!-- Target Purchase Price (₹ Per Quintal) -->
                  <div>
                    <label class="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                      <span>Target Purchase Price</span>
                      <span class="text-[10px] text-blue-400 font-mono">₹/Qtl</span>
                    </label>
                    <input
                      type="number"
                      id="buy-price-input"
                      placeholder="e.g. 2400"
                      class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white font-medium text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>

                </div>

                <!-- Primary Blue [Post Requirement] Button -->
                <div class="pt-2">
                  <button
                    id="post-requirement-btn"
                    class="w-full py-3.5 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-950/50 hover:shadow-blue-900/60 active:scale-[0.98] transition flex items-center justify-center gap-2"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                    <span>Post Requirement</span>
                  </button>
                </div>

              </div>

              <!-- Vertical Scrollable Marketplace Feed Showcasing Active Farmer Sell Listings for that specific crop -->
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <h3 class="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <span>🌾</span>
                    <span>Active Farmer Sell Listings for ${selectedCrop}</span>
                  </h3>
                  <span class="text-[11px] text-slate-400">${filteredFarmerListings.length} Active Lots</span>
                </div>

                <div class="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  ${
                    filteredFarmerListings.length === 0
                      ? `
                      <div class="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 text-center text-slate-400 text-xs">
                        No farmer listings found for ${selectedCrop}. Post your requirement above to broadcast to local farmer groups.
                      </div>
                    `
                      : filteredFarmerListings
                          .map(
                            (item) => `
                      <div class="bg-slate-900/90 border border-slate-800 hover:border-blue-500/40 rounded-2xl p-4 sm:p-5 shadow-lg transition space-y-3">
                        
                        <div class="flex items-start justify-between gap-2">
                          <div>
                            <div class="flex items-center gap-2 mb-0.5">
                              <h4 class="font-bold text-sm sm:text-base text-white">${item.farmerName}</h4>
                              <span class="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/60 text-[10px] font-bold">
                                Direct Farmer
                              </span>
                            </div>
                            <p class="text-xs text-slate-400 font-medium">${item.village}</p>
                          </div>

                          <span class="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs font-mono">
                            Moisture: ${item.moisture || '11%'}
                          </span>
                        </div>

                        <!-- Listing Details: Available Harvest Quantity & Selling Price per Quintal -->
                        <div class="grid grid-cols-2 gap-3 bg-slate-950/80 rounded-xl p-3 border border-slate-800/80 text-xs">
                          <div>
                            <span class="text-[10px] text-slate-500 uppercase font-semibold block">Available Harvest</span>
                            <strong class="text-sm font-bold text-emerald-400">${item.harvestQuantity} Quintals</strong>
                          </div>
                          <div>
                            <span class="text-[10px] text-slate-500 uppercase font-semibold block">Selling Price</span>
                            <strong class="text-sm font-bold text-amber-300">₹${item.sellingPrice} / Qtl</strong>
                          </div>
                        </div>

                        <!-- Direct Interactive Mobile Number Call Button to Negotiate Instantly -->
                        <div class="flex items-center gap-2 pt-1">
                          <button
                            class="b2b-call-btn flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-950/30 flex items-center justify-center gap-2 transition active:scale-[0.98]"
                            data-name="${item.farmerName}"
                            data-phone="${item.phone}"
                            data-crop="${item.crop}"
                            data-quantity="${item.harvestQuantity}"
                            data-price="${item.sellingPrice}"
                          >
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path></svg>
                            <span>Call Farmer to Negotiate (${item.phone})</span>
                          </button>

                          <a
                            href="tel:${item.phone.replace(/\s+/g, '')}"
                            class="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs border border-slate-700"
                            title="Direct Dial"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                          </a>
                        </div>

                      </div>
                    `
                          )
                          .join('')
                  }
                </div>
              </div>

            </div>
          `}

        </main>

      </div>
    `;

    // Attach Listeners
    container.querySelector('#b2b-back-btn').onclick = () => {
      router.goBack();
    };

    // Crop dropdown change
    const cropSelect = container.querySelector('#b2b-crop-select');
    cropSelect.onchange = (e) => {
      selectedCrop = e.target.value;
      store.setMarketplaceCrop(selectedCrop);
      renderView();
    };

    // Toggle SELL / BUY
    container.querySelector('#toggle-sell-btn').onclick = () => {
      activeTab = 'SELL';
      store.setMarketplaceTab('SELL');
      renderView();
    };

    container.querySelector('#toggle-buy-btn').onclick = () => {
      activeTab = 'BUY';
      store.setMarketplaceTab('BUY');
      renderView();
    };

    // Handle SELL: List Product button
    const listProdBtn = container.querySelector('#list-product-btn');
    if (listProdBtn) {
      listProdBtn.onclick = () => {
        const qty = container.querySelector('#sell-quantity-input').value.trim();
        const price = container.querySelector('#sell-price-input').value.trim();

        if (!qty || Number(qty) <= 0) {
          showToast('Please enter a valid available harvest quantity (Quintals).', 'warning');
          return;
        }
        if (!price || Number(price) <= 0) {
          showToast('Please enter an expected selling price per Quintal.', 'warning');
          return;
        }

        store.addFarmerListing({
          harvestQuantity: qty,
          sellingPrice: price,
        });

        showToast(`Listed ${qty} Qtl of ${selectedCrop} at ₹${price}/Qtl!`, 'success');
        renderView();
      };
    }

    // Handle BUY: Post Requirement button
    const postReqBtn = container.querySelector('#post-requirement-btn');
    if (postReqBtn) {
      postReqBtn.onclick = () => {
        const qty = container.querySelector('#buy-quantity-input').value.trim();
        const price = container.querySelector('#buy-price-input').value.trim();

        if (!qty || Number(qty) <= 0) {
          showToast('Please enter required procurement quantity in Quintals.', 'warning');
          return;
        }
        if (!price || Number(price) <= 0) {
          showToast('Please enter your target purchase price per Quintal.', 'warning');
          return;
        }

        store.addBuyerRequest({
          quantityNeeded: qty,
          targetPrice: price,
        });

        showToast(`Posted requirement for ${qty} Qtl of ${selectedCrop} at ₹${price}/Qtl!`, 'success');
        renderView();
      };
    }

    // Call buttons in feed
    container.querySelectorAll('.b2b-call-btn').forEach((btn) => {
      btn.onclick = () => {
        openCallModal({
          name: btn.dataset.name,
          phone: btn.dataset.phone,
          crop: btn.dataset.crop,
          quantity: btn.dataset.quantity,
          offeredPrice: btn.dataset.price,
        });
      };
    });
  }

  renderView();
}

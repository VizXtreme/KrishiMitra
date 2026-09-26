'use client';

import React, { useState } from 'react';
import { useAgri } from '@/context/AgriContext';

export default function B2BHubPage() {
  const {
    marketplace,
    setMarketplaceCrop,
    setMarketplaceTab,
    addFarmerListing,
    addBuyerRequest,
    openCallModal,
    addToast,
  } = useAgri();

  const selectedCrop = marketplace.selectedCrop || 'Wheat';
  const activeTab = marketplace.activeTab || 'SELL'; // 'SELL' or 'BUY'
  const cropsList = marketplace.cropsList || [];

  // Form states
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');

  const filteredBuyerRequests = (marketplace.buyerRequests || []).filter(
    (req) => req.crop.toLowerCase().includes(selectedCrop.toLowerCase()) || selectedCrop.toLowerCase().includes(req.crop.toLowerCase())
  );

  const filteredFarmerListings = (marketplace.farmerListings || []).filter(
    (item) => item.crop.toLowerCase().includes(selectedCrop.toLowerCase()) || selectedCrop.toLowerCase().includes(item.crop.toLowerCase())
  );

  const handleCropChange = (e) => {
    setMarketplaceCrop(e.target.value);
  };

  const handleSellSubmit = (e) => {
    e.preventDefault();
    if (!quantity || !price) {
      addToast('Please enter both quantity and expected price.', 'error');
      return;
    }
    addFarmerListing({
      harvestQuantity: quantity,
      sellingPrice: price,
    });
    setQuantity('');
    setPrice('');
  };

  const handleBuySubmit = (e) => {
    e.preventDefault();
    if (!quantity || !price) {
      addToast('Please enter both needed quantity and target price.', 'error');
      return;
    }
    addBuyerRequest({
      quantityNeeded: quantity,
      targetPrice: price,
    });
    setQuantity('');
    setPrice('');
  };

  return (
    <div className="flex-1 flex flex-col w-full px-3.5 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-6xl mx-auto space-y-6 animate-slide-up">
      
      {/* Top Navigation Structure: Select Crop & SELL/BUY Toggle Switch */}
      <section className="bg-[#1f1e1c] border border-[#2d2b27] rounded-3xl p-4 sm:p-5 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Upper Left: Prominent 'Select Crop' Dropdown Filter */}
        <div className="w-full sm:w-auto flex-1 flex items-center gap-2">
          <label htmlFor="b2b-crop-select" className="text-xs font-bold uppercase tracking-wider text-[#a09a93] shrink-0">
            Select Crop:
          </label>
          <div className="relative flex-1">
            <select
              id="b2b-crop-select"
              value={selectedCrop}
              onChange={handleCropChange}
              aria-label="Select Agricultural Crop"
              className="w-full pl-3.5 pr-8 py-2.5 bg-[#151413] border-2 border-[#2d2b27] hover:border-[#2e7d52]/60 rounded-xl text-[#ede9e3] font-bold text-sm focus:outline-none focus:border-[#3d9b63] appearance-none shadow-sm cursor-pointer focus-visible:ring-2 focus-visible:ring-[#3d9b63]"
            >
              {cropsList.map((c) => (
                <option key={c} value={c} className="bg-[#1f1e1c] text-[#ede9e3]">
                  🌾 {c}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#3d9b63] text-xs" aria-hidden="true">
              ▼
            </div>
          </div>
        </div>

        {/* Two Toggle Switch Buttons Labeled [SELL] and [BUY] */}
        <div className="flex items-center p-1 bg-[#151413] rounded-2xl border border-[#2d2b27] shrink-0 w-full sm:w-auto" role="tablist" aria-label="Trade Mode">
          <button
            role="tab"
            aria-selected={activeTab === 'SELL'}
            onClick={() => setMarketplaceTab('SELL')}
            className={`flex-1 sm:flex-none px-6 py-2 rounded-xl text-xs font-black tracking-wider transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#3d9b63] focus-visible:outline-none ${
              activeTab === 'SELL'
                ? 'bg-[#2e7d52] text-white shadow-md border border-[#3d9b63]/30'
                : 'text-[#a09a93] hover:text-white'
            }`}
          >
            SELL
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'BUY'}
            onClick={() => setMarketplaceTab('BUY')}
            className={`flex-1 sm:flex-none px-6 py-2 rounded-xl text-xs font-black tracking-wider transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#c99535] focus-visible:outline-none ${
              activeTab === 'BUY'
                ? 'bg-[#b8862d] text-white shadow-md border border-[#c99535]/40'
                : 'text-[#a09a93] hover:text-white'
            }`}
          >
            BUY
          </button>
        </div>

      </section>

      {/* Dynamic Behavior When [SELL] Toggle is Active */}
      {activeTab === 'SELL' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fade-in">
          
          {/* Upper Form Layout Box for SELL */}
          <section className="lg:col-span-5 bg-[#1f1e1c] border border-[#2b3325] rounded-3xl p-4 sm:p-6 shadow-xl space-y-4 lg:sticky lg:top-20">
            <div className="flex items-center justify-between border-b border-[#2d2b27] pb-3">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#5bb37d] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#3d9b63]" aria-hidden="true"></span>
                  Farmer Harvest Listing Form
                </h2>
                <p className="text-[11px] text-[#a09a93]">Broadcast your harvest to verified bulk grain buyers & millers.</p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-[#192216] text-[#5bb37d] border border-[#283524] font-bold">
                SELL MODE
              </span>
            </div>

            <form onSubmit={handleSellSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {/* Selected Crop */}
                <div>
                  <label htmlFor="sell-crop-autofill" className="block text-xs font-semibold text-[#d1cbc4] mb-1.5">
                    Selected Crop
                  </label>
                  <input
                    type="text"
                    id="sell-crop-autofill"
                    value={selectedCrop}
                    readOnly
                    className="w-full px-3.5 py-2.5 bg-[#151413] border border-[#2d2b27] rounded-xl text-[#5bb37d] font-bold text-sm cursor-not-allowed select-none"
                  />
                </div>

                {/* Available Quantity */}
                <div>
                  <label htmlFor="sell-quantity-input" className="block text-xs font-semibold text-[#d1cbc4] mb-1.5 flex items-center justify-between">
                    <span>Available Quantity</span>
                    <span className="text-[10px] text-[#5bb37d] font-mono">Qtl</span>
                  </label>
                  <input
                    type="number"
                    id="sell-quantity-input"
                    placeholder="e.g. 150"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                    min="1"
                    className="w-full px-3.5 py-2.5 bg-[#151413] border border-[#2d2b27] rounded-xl text-white font-medium text-sm focus:outline-none focus:border-[#3d9b63] focus-visible:ring-2 focus-visible:ring-[#3d9b63]"
                  />
                </div>

                {/* Expected Price */}
                <div>
                  <label htmlFor="sell-price-input" className="block text-xs font-semibold text-[#d1cbc4] mb-1.5 flex items-center justify-between">
                    <span>Expected Price</span>
                    <span className="text-[10px] text-[#d4a03c] font-mono">₹/Qtl</span>
                  </label>
                  <input
                    type="number"
                    id="sell-price-input"
                    placeholder="e.g. 2450"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    min="1"
                    className="w-full px-3.5 py-2.5 bg-[#151413] border border-[#2d2b27] rounded-xl text-white font-medium text-sm focus:outline-none focus:border-[#3d9b63] focus-visible:ring-2 focus-visible:ring-[#3d9b63]"
                  />
                </div>
              </div>

              {/* Primary Green [List Product] Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#2e7d52] hover:bg-[#266a45] text-white font-bold text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 border border-[#3d9b63]/20 active:translate-y-px focus-visible:ring-2 focus-visible:ring-white"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  <span>List Product</span>
                </button>
              </div>
            </form>
          </section>

          {/* Vertical Scrollable Feed: Active Buyer Requests */}
          <section className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#d1cbc4] flex items-center gap-1.5">
                <span aria-hidden="true">🏢</span>
                <span>Active Buyer Requests for {selectedCrop}</span>
              </h3>
              <span className="text-[11px] text-[#a09a93]">{filteredBuyerRequests.length} Verified Buyers</span>
            </div>

            <div className="space-y-3 max-h-[550px] overflow-y-auto pr-0.5">
              {filteredBuyerRequests.length === 0 ? (
                <div className="bg-[#1f1e1c]/60 border border-[#2d2b27] rounded-2xl p-6 text-center text-[#a09a93] text-xs">
                  No active buyer requests currently logged for {selectedCrop}. List your harvest above to attract regional millers.
                </div>
              ) : (
                filteredBuyerRequests.map((req) => (
                  <div
                    key={req.id}
                    className="bg-[#1f1e1c] border border-[#2d2b27] hover:border-[#353230] rounded-2xl p-4 sm:p-5 shadow-md transition space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <h4 className="font-bold text-sm sm:text-base text-white">{req.buyerName}</h4>
                          <span className="px-2 py-0.5 rounded-full bg-[#192216] text-[#5bb37d] border border-[#283524] text-[10px] font-bold">
                            Verified
                          </span>
                        </div>
                        <p className="text-xs text-[#a09a93] font-medium">{req.company} • {req.location}</p>
                      </div>

                      <span className="px-2.5 py-1 rounded-lg bg-[#271e10] text-[#ddb65a] border border-[#4d3816] text-xs font-semibold shrink-0">
                        {req.urgency}
                      </span>
                    </div>

                    {/* Listing Details */}
                    <div className="grid grid-cols-2 gap-3 bg-[#151413] rounded-xl p-3 border border-[#2d2b27] text-xs">
                      <div>
                        <span className="text-[10px] text-[#8e8880] uppercase font-semibold block">Quantity Needed</span>
                        <strong className="text-sm font-bold text-[#e8bf6a]">{req.quantityNeeded} Quintals</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#8e8880] uppercase font-semibold block">Target Buying Price</span>
                        <strong className="text-sm font-bold text-[#5bb37d]">₹{req.targetPrice} / Qtl</strong>
                      </div>
                    </div>

                    {/* Prominent Call Button */}
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => openCallModal(req)}
                        aria-label={`Call buyer ${req.buyerName} at ${req.phone}`}
                        className="flex-1 py-2.5 bg-[#2e7d52] hover:bg-[#266a45] text-white rounded-xl text-xs font-bold shadow-sm flex items-center justify-center gap-2 transition active:translate-y-px border border-[#3d9b63]/20 focus-visible:ring-2 focus-visible:ring-white"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                        <span>Call Buyer ({req.phone})</span>
                      </button>
                      
                      <a
                        href={`tel:${req.phone.replace(/\s+/g, '')}`}
                        aria-label={`Direct dial ${req.phone}`}
                        className="p-2.5 bg-[#242220] hover:bg-[#23322a] text-[#d1cbc4] rounded-xl text-xs border border-[#302d29] focus-visible:ring-2 focus-visible:ring-[#3d9b63]"
                        title="Direct Dial"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>

                  </div>
                ))
              )}
            </div>
          </section>

        </div>
      ) : (
        /* Dynamic Behavior When [BUY] Toggle is Active */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fade-in">
          
          {/* Upper Requirement Box for BUY */}
          <section className="lg:col-span-5 bg-[#1c1b14] border border-[#383214] rounded-3xl p-4 sm:p-6 shadow-xl space-y-4 lg:sticky lg:top-20">
            <div className="flex items-center justify-between border-b border-[#2a2412] pb-3">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#d4a03c] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#c99535]" aria-hidden="true"></span>
                  Trader / Miller Requirement Box
                </h2>
                <p className="text-[11px] text-[#a09a93]">Post target purchase quantity and offered price to local growers.</p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-[#261e10] text-[#ddb65a] border border-[#443210] font-bold">
                BUY MODE
              </span>
            </div>

            <form onSubmit={handleBuySubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {/* Selected Crop */}
                <div>
                  <label htmlFor="buy-crop-autofill" className="block text-xs font-semibold text-[#d1cbc4] mb-1.5">
                    Selected Crop
                  </label>
                  <input
                    type="text"
                    id="buy-crop-autofill"
                    value={selectedCrop}
                    readOnly
                    className="w-full px-3.5 py-2.5 bg-[#151413] border border-[#2d2b27] rounded-xl text-[#d4a03c] font-bold text-sm cursor-not-allowed select-none"
                  />
                </div>

                {/* Needed Quantity */}
                <div>
                  <label htmlFor="buy-quantity-input" className="block text-xs font-semibold text-[#d1cbc4] mb-1.5 flex items-center justify-between">
                    <span>Needed Quantity</span>
                    <span className="text-[10px] text-[#d4a03c] font-mono">Qtl</span>
                  </label>
                  <input
                    type="number"
                    id="buy-quantity-input"
                    placeholder="e.g. 300"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                    min="1"
                    className="w-full px-3.5 py-2.5 bg-[#151413] border border-[#2d2b27] rounded-xl text-white font-medium text-sm focus:outline-none focus:border-[#c99535] focus-visible:ring-2 focus-visible:ring-[#c99535]"
                  />
                </div>

                {/* Target Purchase Price */}
                <div>
                  <label htmlFor="buy-price-input" className="block text-xs font-semibold text-[#d1cbc4] mb-1.5 flex items-center justify-between">
                    <span>Target Purchase Price</span>
                    <span className="text-[10px] text-[#5bb37d] font-mono">₹/Qtl</span>
                  </label>
                  <input
                    type="number"
                    id="buy-price-input"
                    placeholder="e.g. 2400"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    min="1"
                    className="w-full px-3.5 py-2.5 bg-[#151413] border border-[#2d2b27] rounded-xl text-white font-medium text-sm focus:outline-none focus:border-[#c99535] focus-visible:ring-2 focus-visible:ring-[#c99535]"
                  />
                </div>
              </div>

              {/* Primary Amber [Post Requirement] Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#b8862d] hover:bg-[#9a7026] text-white font-bold text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 border border-[#c99535]/30 active:translate-y-px focus-visible:ring-2 focus-visible:ring-white"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Post Requirement</span>
                </button>
              </div>
            </form>
          </section>

          {/* Vertical Scrollable Feed: Active Farmer Sell Listings */}
          <section className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#d1cbc4] flex items-center gap-1.5">
                <span aria-hidden="true">🌾</span>
                <span>Active Farmer Sell Listings for {selectedCrop}</span>
              </h3>
              <span className="text-[11px] text-[#a09a93]">{filteredFarmerListings.length} Active Lots</span>
            </div>

            <div className="space-y-3 max-h-[550px] overflow-y-auto pr-0.5">
              {filteredFarmerListings.length === 0 ? (
                <div className="bg-[#1f1e1c]/60 border border-[#2d2b27] rounded-2xl p-6 text-center text-[#a09a93] text-xs">
                  No farmer listings found for {selectedCrop}. Post your requirement above to broadcast to local farmer groups.
                </div>
              ) : (
                filteredFarmerListings.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#1f1e1c] border border-[#2d2b27] hover:border-[#4d3c1c] rounded-2xl p-4 sm:p-5 shadow-md transition space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <h4 className="font-bold text-sm sm:text-base text-white">{item.farmerName}</h4>
                          <span className="px-2 py-0.5 rounded-full bg-[#192216] text-[#5bb37d] border border-[#283524] text-[10px] font-bold">
                            Direct Farmer
                          </span>
                        </div>
                        <p className="text-xs text-[#a09a93] font-medium">{item.village}</p>
                      </div>

                      <span className="px-2.5 py-1 rounded-lg bg-[#242220] text-[#d1cbc4] text-xs font-mono shrink-0">
                        Moisture: {item.moisture || '11%'}
                      </span>
                    </div>

                    {/* Listing Details */}
                    <div className="grid grid-cols-2 gap-3 bg-[#151413] rounded-xl p-3 border border-[#2d2b27] text-xs">
                      <div>
                        <span className="text-[10px] text-[#8e8880] uppercase font-semibold block">Available Harvest</span>
                        <strong className="text-sm font-bold text-[#5bb37d]">{item.harvestQuantity} Quintals</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#8e8880] uppercase font-semibold block">Selling Price</span>
                        <strong className="text-sm font-bold text-[#d4a03c]">₹{item.sellingPrice} / Qtl</strong>
                      </div>
                    </div>

                    {/* Call Farmer Button */}
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => openCallModal({
                          buyerName: item.farmerName,
                          phone: item.phone,
                          crop: item.crop,
                          quantity: item.harvestQuantity,
                          offeredPrice: item.sellingPrice,
                        })}
                        aria-label={`Call farmer ${item.farmerName} at ${item.phone}`}
                        className="flex-1 py-2.5 bg-[#b8862d] hover:bg-[#9a7026] text-white rounded-xl text-xs font-bold shadow-sm flex items-center justify-center gap-2 transition active:translate-y-px border border-[#c99535]/30 focus-visible:ring-2 focus-visible:ring-white"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                        <span>Call Farmer ({item.phone})</span>
                      </button>

                      <a
                        href={`tel:${item.phone.replace(/\s+/g, '')}`}
                        aria-label={`Direct dial ${item.phone}`}
                        className="p-2.5 bg-[#242220] hover:bg-[#23322a] text-[#d1cbc4] rounded-xl text-xs border border-[#302d29] focus-visible:ring-2 focus-visible:ring-[#c99535]"
                        title="Direct Dial"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>

                  </div>
                ))
              )}
            </div>
          </section>

        </div>
      )}

    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAgri } from '@/context/AgriContext';

export default function ProfilePage() {
  const router = useRouter();
  const { auth, location, updateProfile, logout, addToast, isSupabaseConfigured } = useAgri();

  const [name, setName] = useState(auth.name || '');
  const [email, setEmail] = useState(auth.email || '');
  const [landArea, setLandArea] = useState(auth.landArea || '');
  const [mandiReg, setMandiReg] = useState(auth.mandiRegNumber || '');
  const [avatar, setAvatar] = useState(auth.avatar || '');
  const [showBackendModal, setShowBackendModal] = useState(false);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newAvatar = event.target.result;
        setAvatar(newAvatar);
        updateProfile({ avatar: newAvatar });
        addToast('Avatar photo updated!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile({
      name: name.trim(),
      email: email.trim(),
      landArea: landArea.trim(),
      mandiRegNumber: mandiReg.trim(),
      avatar,
    });
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="flex-1 flex flex-col w-full px-3.5 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-5xl mx-auto space-y-6 animate-slide-up">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column on Desktop: Avatar & Identity Card */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-20">
          <section className="bg-[#1f1e1c] border border-[#2d2b27] rounded-3xl p-5 sm:p-6 shadow-lg text-center relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#2e7d52]/10 rounded-full blur-2xl pointer-events-none" aria-hidden="true"></div>

        {/* Clean Avatar Image Placeholder with upload */}
        <div className="relative w-24 h-24 mx-auto mb-4">
          <div className="w-full h-full rounded-full overflow-hidden border-4 border-[#2e7d52]/50 shadow-xl bg-[#151413] flex items-center justify-center text-4xl">
            {avatar ? (
              <img src={avatar} alt="Farmer Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-[#ede9e3]" aria-hidden="true">👤</span>
            )}
          </div>
          <label
            htmlFor="avatar-upload"
            className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#2e7d52] hover:bg-[#266a45] text-white flex items-center justify-center cursor-pointer shadow-md transition focus-within:ring-2 focus-within:ring-[#3d9b63]"
            title="Change Avatar Photo"
            aria-label="Upload New Avatar"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <input
              type="file"
              id="avatar-upload"
              className="sr-only"
              accept="image/*"
              onChange={handleAvatarChange}
            />
          </label>
        </div>

        {/* Full Name String */}
        <h2 className="text-xl font-bold text-[#ede9e3] tracking-tight">{auth.name}</h2>
        
        {/* Verified Mobile & Email String */}
        <div className="mt-2 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1c2119] border border-[#2b3325] text-[#8bcca2] font-medium">
            <span>📞 {auth.formattedPhone || auth.phone}</span>
            <svg className="w-3.5 h-3.5 text-[#5bb37d] shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#272523] border border-[#302d29] text-[#ada6a0]">
            <span>✉️ {auth.email}</span>
          </span>
        </div>

        {/* Active Location Coordinates */}
        <div className="mt-4 pt-4 border-t border-[#2d2b27] text-xs text-[#978f87]">
          <span className="text-[#978f87] font-medium block mb-1">ACTIVE LOCATION COORDINATES</span>
          <div className="inline-flex items-center gap-1.5 bg-[#151413] px-3.5 py-1.5 rounded-xl border border-[#2d2b27] font-mono text-[#5bb37d] font-medium text-[11px] sm:text-xs">
            <span>📍 Lat: {location.lat}° N, Lon: {location.lon}° E</span>
            <span className="text-[#978f87]">({location.district}, {location.state})</span>
          </div>
        </div>
      </section>

      {/* System & Cloud Backend Status Card */}
      <section className="bg-[#1f1e1c] border border-[#2d2b27] rounded-3xl p-5 shadow-lg space-y-3.5 text-xs">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#a09a93] flex items-center justify-between">
          <span>Platform & Cloud Status</span>
          <span className="font-mono text-[10px] text-[#5bb37d]">v3.0 Production</span>
        </h4>

        {/* Supabase Status Row */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-[#151413] border border-[#2d2b27]">
          <div className="flex items-center gap-2.5">
            <span className={`w-2.5 h-2.5 rounded-full ${isSupabaseConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
            <div>
              <div className="font-bold text-[#ede9e3] text-xs">
                {isSupabaseConfigured ? 'Supabase Postgres Cloud' : 'Local Demo Mode'}
              </div>
              <div className="text-[10px] text-[#978f87]">
                {isSupabaseConfigured ? 'Live Auth & Cloud DB active' : 'Offline persistent storage'}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowBackendModal(true)}
            className="px-2.5 py-1 text-[10px] font-semibold rounded-lg bg-[#272523] hover:bg-[#302d29] text-[#ede9e3] border border-[#383430] transition"
          >
            Schema & Info
          </button>
        </div>

        {/* PWA App Install Button */}
        <button
          type="button"
          onClick={() => {
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('trigger-pwa-install'));
            }
          }}
          className="w-full py-2.5 px-3 rounded-2xl bg-[#1c2119] hover:bg-[#252e24] border border-[#2b3325] text-[#8bcca2] font-semibold flex items-center justify-center gap-2 transition active:scale-[0.98]"
        >
          <span>📲</span>
          <span>Install Web App (PWA)</span>
        </button>
      </section>

      {/* Account Controls */}
      <div className="flex items-center justify-between px-2 text-xs">
        <button
          onClick={() => router.push('/location')}
          className="text-[#978f87] hover:text-[#5bb37d] transition flex items-center gap-1.5 py-1 px-2.5 rounded-lg hover:bg-[#272523] focus-visible:ring-2 focus-visible:ring-[#3d9b63]"
        >
          <span>🔄 Recalibrate GPS</span>
        </button>
        <button
          onClick={handleLogout}
          className="text-[#f87171] hover:text-[#fca5a5] transition font-medium py-1 px-2.5 rounded-lg hover:bg-[#241812] focus-visible:ring-2 focus-visible:ring-[#f87171]"
        >
          Sign Out
        </button>
      </div>

    </div>

    {/* Right Column on Desktop: Edit Profile Form */}
    <div className="lg:col-span-7 space-y-6">
      <section className="bg-[#1f1e1c] border border-[#2d2b27] rounded-3xl p-5 sm:p-6 shadow-lg space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#cdc7c0] mb-2">
          Agricultural Holding & Mandi Credentials
        </h3>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Full Name */}
          <div>
            <label htmlFor="profile-name" className="block text-xs font-semibold text-[#c5bfb8] mb-1.5">
              Full Legal Name
            </label>
            <input
              id="profile-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 bg-[#151413] border border-[#302d29] rounded-xl text-[#ede9e3] font-medium text-sm focus:outline-none focus:border-[#2e7d52] focus-visible:ring-2 focus-visible:ring-[#3d9b63]"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="profile-email" className="block text-xs font-semibold text-[#c5bfb8] mb-1.5">
              Registered Email Address
            </label>
            <input
              id="profile-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-[#151413] border border-[#302d29] rounded-xl text-[#ede9e3] font-medium text-sm focus:outline-none focus:border-[#2e7d52] focus-visible:ring-2 focus-visible:ring-[#3d9b63]"
            />
          </div>

          {/* Total Land Area */}
          <div>
            <label htmlFor="profile-land" className="text-xs font-semibold text-[#c5bfb8] mb-1.5 flex items-center justify-between">
              <span>Total Land Area (Acres/Bigha)</span>
              <span className="text-[10px] text-[#978f87] uppercase">Optional</span>
            </label>
            <div className="relative flex items-center">
              <input
                id="profile-land"
                type="text"
                placeholder="e.g. 12.5 Acres or 25 Bigha"
                value={landArea}
                onChange={(e) => setLandArea(e.target.value)}
                className="w-full px-4 py-3 bg-[#151413] border border-[#302d29] rounded-xl text-[#ede9e3] font-medium text-sm placeholder:text-[#635e58] focus:outline-none focus:border-[#2e7d52] focus-visible:ring-2 focus-visible:ring-[#3d9b63]"
              />
              <span className="absolute right-3.5 text-xs text-[#5bb37d] font-semibold pointer-events-none">
                Acres/Bigha
              </span>
            </div>
            <p className="text-[11px] text-[#7a756f] mt-1">Used to compute total expected harvest yield and fertilizer dosages.</p>
          </div>

          {/* Mandi Registration Number */}
          <div>
            <label htmlFor="profile-mandi-reg" className="text-xs font-semibold text-[#c5bfb8] mb-1.5 flex items-center justify-between">
              <span>Shop/Mandi Registration Number</span>
              <span className="text-[10px] text-[#978f87] uppercase">Optional</span>
            </label>
            <input
              id="profile-mandi-reg"
              type="text"
              placeholder="e.g. PB-LDH-APMC-94821 or Commission Agent ID"
              value={mandiReg}
              onChange={(e) => setMandiReg(e.target.value)}
              className="w-full px-4 py-3 bg-[#151413] border border-[#302d29] rounded-xl text-[#ede9e3] font-medium text-sm placeholder:text-[#635e58] focus:outline-none focus:border-[#2e7d52] font-mono focus-visible:ring-2 focus-visible:ring-[#3d9b63]"
            />
            <p className="text-[11px] text-[#7a756f] mt-1">Directly connects your APMC e-NAM trader/grower license to mandi bidding.</p>
          </div>

          {/* Green Save Changes Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 bg-[#2e7d52] hover:bg-[#266a45] text-white font-bold text-sm rounded-xl shadow-md shadow-[#2e7d52]/20 border border-[#3d9b63]/30 active:scale-[0.98] transition flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-[#3d9b63]"
            >
              <svg className="w-4 h-4 text-emerald-100" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </section>
    </div>

  </div>

  {/* Backend Architecture & Supabase Info Modal */}
  {showBackendModal && (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-[#1f1e1c] border border-[#2d2b27] rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl text-[#ede9e3] max-h-[85vh] overflow-y-auto no-scrollbar">
        <div className="flex items-center justify-between pb-3 border-b border-[#2d2b27]">
          <div className="flex items-center gap-2">
            <span className="text-xl">🗄️</span>
            <div>
              <h3 className="text-sm font-bold text-[#ede9e3]">Supabase Backend Architecture</h3>
              <p className="text-[10px] text-[#5bb37d] font-mono">PostgreSQL + Row-Level Security (RLS)</p>
            </div>
          </div>
          <button
            onClick={() => setShowBackendModal(false)}
            className="text-[#978f87] hover:text-white p-1 rounded-lg hover:bg-[#272523]"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3 text-xs text-[#c5bfb8]">
          <div className="p-3 rounded-xl bg-[#151413] border border-[#2d2b27] space-y-1.5">
            <div className="font-bold text-[#ede9e3] flex items-center justify-between">
              <span>Database Tables</span>
              <span className="text-[10px] text-[#3d9b63]">4 Relational Tables</span>
            </div>
            <ul className="text-[11px] text-[#978f87] space-y-1 list-disc list-inside">
              <li><strong className="text-[#ede9e3]">profiles:</strong> Farmer identity, land area, APMC reg, location</li>
              <li><strong className="text-[#ede9e3]">soil_health:</strong> Laboratory N-P-K, pH, organic carbon, EC</li>
              <li><strong className="text-[#ede9e3]">marketplace_listings:</strong> B2B farmer lots & buyer orders</li>
              <li><strong className="text-[#ede9e3]">messages:</strong> Direct mandi buyer bids & counteroffers</li>
            </ul>
          </div>

          <div className="p-3 rounded-xl bg-[#151413] border border-[#2d2b27] space-y-1.5">
            <div className="font-bold text-[#ede9e3]">Security & Authentication</div>
            <p className="text-[11px] text-[#978f87]">
              Each table is protected with Supabase Row Level Security (RLS). Users can only modify their own listings and records while mandi rates and listings remain queryable.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#151413] border border-[#2d2b27] space-y-1.5">
            <div className="font-bold text-[#ede9e3]">Connection Status</div>
            <p className="text-[11px] text-[#978f87]">
              {isSupabaseConfigured 
                ? '✅ Connected to live Supabase project via NEXT_PUBLIC_SUPABASE_URL.' 
                : '🟡 Currently in Demo Mode. To connect your live Supabase project, copy your URL and Anon Key into .env.local (see SUPABASE_SETUP.md).'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowBackendModal(false)}
          className="w-full py-2.5 bg-[#2e7d52] hover:bg-[#266a45] text-white font-bold text-xs rounded-xl shadow transition"
        >
          Close
        </button>
      </div>
    </div>
  )}
</div>
  );
}

// js/screens/profile.js - Screen 4: Profile Details
import { store } from '../store.js';
import { router } from '../router.js';
import { showToast } from '../components/toast.js';

export function renderProfileScreen(container) {
  const state = store.getState();
  const auth = state.auth;
  const loc = state.location;

  container.innerHTML = `
    <div class="flex-1 flex flex-col w-full pb-10">
      
      <!-- Top Bar with Back Button -->
      <header class="sticky top-0 z-20 bg-slate-900/90 border-b border-slate-800 backdrop-blur-xl px-4 py-3 flex items-center justify-between">
        <button
          id="profile-back-btn"
          class="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
        >
          <svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
          <span>Dashboard</span>
        </button>

        <h1 class="text-sm font-bold text-white">Profile Details</h1>

        <div class="w-8"></div> <!-- spacer -->
      </header>

      <!-- Main Profile Form -->
      <main class="px-4 py-6 max-w-lg mx-auto w-full space-y-6">

        <!-- Avatar & Core Identity Card -->
        <div class="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl text-center relative overflow-hidden">
          <div class="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

          <!-- Clean Avatar Image Placeholder -->
          <div class="relative w-24 h-24 mx-auto mb-4">
            <div class="w-full h-full rounded-full overflow-hidden border-4 border-emerald-500/40 shadow-xl bg-slate-800 flex items-center justify-center text-4xl">
              ${
                auth.avatar
                  ? `<img id="avatar-preview" src="${auth.avatar}" alt="Avatar" class="w-full h-full object-cover" />`
                  : `<span class="text-white">👤</span>`
              }
            </div>
            <label for="avatar-input" class="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center cursor-pointer shadow-md transition" title="Change Avatar">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            </label>
            <input type="file" id="avatar-input" class="hidden" accept="image/*" />
          </div>

          <!-- Full Name String -->
          <h2 class="text-xl font-bold text-white tracking-tight">${auth.name}</h2>
          
          <!-- Verified Mobile & Email String -->
          <div class="mt-2 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 font-medium">
              <span>📞 ${auth.formattedPhone || auth.phone}</span>
              <svg class="w-3.5 h-3.5 text-emerald-400 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
            </span>
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300">
              <span>✉️ ${auth.email}</span>
            </span>
          </div>

          <!-- Active Location Coordinates Text -->
          <div class="mt-4 pt-4 border-t border-slate-800/80 text-xs text-slate-400">
            <span class="text-slate-500 font-medium block mb-1">ACTIVE LOCATION COORDINATES</span>
            <div class="inline-flex items-center gap-1.5 bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-800 font-mono text-emerald-400 font-medium">
              <span>📍 Lat: ${loc.lat}° N, Lon: ${loc.lon}° E</span>
              <span class="text-slate-500">(${loc.district}, ${loc.state})</span>
            </div>
          </div>

        </div>

        <!-- Edit Profile Form -->
        <div class="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          
          <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Agricultural Holding & Mandi Credentials
          </h3>

          <!-- Full Name input -->
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1.5">
              Full Legal Name
            </label>
            <input
              id="name-input"
              type="text"
              value="${auth.name}"
              class="w-full px-4 py-3 bg-slate-950/80 border border-slate-700/80 rounded-xl text-white font-medium text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          <!-- Email input -->
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1.5">
              Registered Email Address
            </label>
            <input
              id="email-input"
              type="email"
              value="${auth.email}"
              class="w-full px-4 py-3 bg-slate-950/80 border border-slate-700/80 rounded-xl text-white font-medium text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          <!-- Optional Input 1: Total Land Area (Acres/Bigha) -->
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Total Land Area (Acres/Bigha)</span>
              <span class="text-[10px] text-slate-500 uppercase">Optional</span>
            </label>
            <div class="relative flex items-center">
              <input
                id="land-area-input"
                type="text"
                placeholder="e.g. 12.5 Acres or 25 Bigha"
                value="${auth.landArea || ''}"
                class="w-full px-4 py-3 bg-slate-950/80 border border-slate-700/80 rounded-xl text-white font-medium text-sm placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
              />
              <span class="absolute right-3.5 text-xs text-emerald-400 font-semibold">Acres/Bigha</span>
            </div>
            <p class="text-[11px] text-slate-500 mt-1">Used to compute total expected harvest yield and fertilizer dosages.</p>
          </div>

          <!-- Optional Input 2: Shop/Mandi Registration Number -->
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Shop/Mandi Registration Number</span>
              <span class="text-[10px] text-slate-500 uppercase">Optional</span>
            </label>
            <input
              id="mandi-reg-input"
              type="text"
              placeholder="e.g. PB-LDH-APMC-94821 or Commission Agent ID"
              value="${auth.mandiRegNumber || ''}"
              class="w-full px-4 py-3 bg-slate-950/80 border border-slate-700/80 rounded-xl text-white font-medium text-sm placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
            />
            <p class="text-[11px] text-slate-500 mt-1">Directly connects your APMC e-NAM trader/grower license to mandi bidding.</p>
          </div>

          <!-- Green Save Changes Button -->
          <div class="pt-4">
            <button
              id="save-profile-btn"
              class="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-emerald-950/50 hover:shadow-emerald-900/60 active:scale-[0.98] transition flex items-center justify-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
              <span>Save Changes</span>
            </button>
          </div>

        </div>

        <!-- Account Controls / Log out -->
        <div class="flex items-center justify-between px-2 text-xs">
          <button id="recalibrate-gps-btn" class="text-slate-400 hover:text-emerald-400 transition flex items-center gap-1.5">
            <span>🔄 Recalibrate GPS Coordinates</span>
          </button>
          <button id="logout-btn" class="text-rose-400 hover:text-rose-300 transition font-medium">
            Sign Out
          </button>
        </div>

      </main>

    </div>
  `;

  // Attach Event Handlers
  container.querySelector('#profile-back-btn').onclick = () => {
    router.goBack();
  };

  const nameInput = container.querySelector('#name-input');
  const emailInput = container.querySelector('#email-input');
  const landAreaInput = container.querySelector('#land-area-input');
  const mandiRegInput = container.querySelector('#mandi-reg-input');
  const avatarInput = container.querySelector('#avatar-input');
  const avatarPreview = container.querySelector('#avatar-preview');

  // Avatar upload preview simulation
  if (avatarInput) {
    avatarInput.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const newAvatar = event.target.result;
          if (avatarPreview) avatarPreview.src = newAvatar;
          store.updateProfile({ avatar: newAvatar });
          showToast('Avatar photo updated!', 'success');
        };
        reader.readAsDataURL(file);
      }
    };
  }

  // Save Changes Button
  container.querySelector('#save-profile-btn').onclick = () => {
    const updated = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      landArea: landAreaInput.value.trim(),
      mandiRegNumber: mandiRegInput.value.trim(),
    };

    store.updateProfile(updated);
    showToast('Profile details saved successfully!', 'success');
  };

  // Recalibrate GPS
  container.querySelector('#recalibrate-gps-btn').onclick = () => {
    router.navigateTo('screen-2');
  };

  // Logout
  container.querySelector('#logout-btn').onclick = () => {
    store.logout();
    showToast('Logged out of AgriSmart.', 'info');
    router.navigateTo('screen-1');
  };
}

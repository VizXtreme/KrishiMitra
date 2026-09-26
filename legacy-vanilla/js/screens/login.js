// js/screens/login.js - Screen 1: Login
import { store } from '../store.js';
import { router } from '../router.js';
import { openOtpModal } from '../components/modal.js';
import { showToast } from '../components/toast.js';

export function renderLoginScreen(container) {
  container.innerHTML = `
    <div class="flex-1 flex flex-col justify-center px-6 py-10 max-w-md mx-auto w-full">
      
      <!-- Top Brand Logo -->
      <div class="text-center mb-8">
        <div class="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-tr from-emerald-600 via-green-500 to-lime-400 p-0.5 shadow-xl shadow-emerald-500/20 flex items-center justify-center">
          <div class="w-full h-full bg-slate-900 rounded-[22px] flex items-center justify-center text-3xl text-emerald-400">
            🌱
          </div>
        </div>
        <h1 class="text-2xl sm:text-3xl font-black tracking-tight text-white">
          Agri<span class="text-emerald-400">Smart</span>
        </h1>
        <p class="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
          Digital Mandi, Crop Advisory & B2B Trading Hub
        </p>
      </div>

      <!-- Login Card -->
      <div class="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        
        <div class="mb-6">
          <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Enter 10-digit Mobile Number
          </label>
          <div class="relative flex items-center">
            <div class="absolute left-3.5 flex items-center gap-1.5 text-xs font-medium text-slate-400 border-r border-slate-700 pr-2.5">
              <span>🇮🇳</span>
              <span>+91</span>
            </div>
            <input
              id="phone-input"
              type="tel"
              maxlength="10"
              placeholder="98765 43210"
              value="9876543210"
              class="w-full pl-20 pr-4 py-3.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-white font-medium text-sm placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition"
            />
          </div>
          <p id="phone-error" class="text-[11px] text-rose-400 mt-1.5 hidden font-medium"></p>
        </div>

        <!-- Green Send OTP Button -->
        <button
          id="send-otp-btn"
          class="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-emerald-950/50 hover:shadow-emerald-900/60 active:scale-[0.98] transition flex items-center justify-center gap-2"
        >
          <span>Send OTP</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
        </button>

        <!-- Horizontal Divider -->
        <div class="relative my-6 flex items-center justify-center">
          <div class="border-t border-slate-800 w-full"></div>
          <span class="bg-slate-900 px-3 text-[11px] uppercase tracking-wider text-slate-500 font-semibold absolute">
            OR
          </span>
        </div>

        <!-- Continue with Google Button -->
        <button
          id="google-auth-btn"
          class="w-full py-3.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white font-medium text-sm rounded-xl transition flex items-center justify-center gap-3 active:scale-[0.98]"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"/>
            <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5.1 3.7-8.9z"/>
            <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.2s.7 5.5 1.9 7.9l3.7-2.9z"/>
            <path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.9C3.7 20.6 7.5 23.5 12 23.5z"/>
          </svg>
          <span id="google-btn-text">Continue with Google</span>
        </button>

      </div>

      <!-- Trust Badges Footer -->
      <div class="mt-8 text-center text-xs text-slate-500 flex items-center justify-center gap-4">
        <span class="flex items-center gap-1">
          <svg class="w-3.5 h-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
          Direct Mandi Sync
        </span>
        <span>•</span>
        <span class="flex items-center gap-1">
          <svg class="w-3.5 h-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
          ICAR Advisory
        </span>
      </div>

    </div>
  `;

  // Attach Event Handlers
  const phoneInput = container.querySelector('#phone-input');
  const phoneError = container.querySelector('#phone-error');
  const sendOtpBtn = container.querySelector('#send-otp-btn');
  const googleBtn = container.querySelector('#google-auth-btn');
  const googleBtnText = container.querySelector('#google-btn-text');

  phoneInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
    phoneError.classList.add('hidden');
  });

  sendOtpBtn.addEventListener('click', () => {
    const val = phoneInput.value.trim();
    if (val.length !== 10) {
      phoneError.textContent = 'Please enter a valid 10-digit mobile number.';
      phoneError.classList.remove('hidden');
      return;
    }

    // Open interactive OTP modal
    openOtpModal({
      phone: val,
      onVerify: () => {
        store.loginWithPhone(val);
        showToast('Phone number verified successfully! Routing to location setup...', 'success');
        router.navigateTo('screen-2');
      }
    });
  });

  googleBtn.addEventListener('click', () => {
    // Simulated Firebase / Supabase Google Auth Provider Flow
    googleBtn.disabled = true;
    googleBtnText.innerHTML = `
      <span class="inline-flex items-center gap-2">
        <svg class="animate-spin w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg>
        Authenticating with Google...
      </span>
    `;

    setTimeout(() => {
      // Mock OAuth credential payload
      store.loginWithGoogle({
        name: 'Rajesh Kumar Sharma',
        email: 'rajesh.sharma.farmer@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
      });
      showToast('Signed in via Google Auth successfully!', 'success');
      router.navigateTo('screen-2');
    }, 1000);
  });
}

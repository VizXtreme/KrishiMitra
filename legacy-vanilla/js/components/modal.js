// js/components/modal.js - Modals for OTP, Call Simulator & In-App Browser

let callTimerInterval = null;

export function openOtpModal({ phone, onVerify }) {
  closeModal();

  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return;

  let secondsLeft = 30;

  const content = `
    <div id="active-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div class="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl p-6 text-slate-100 relative">
        <button id="otp-close-btn" class="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <div class="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4 text-emerald-400">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
        </div>

        <h3 class="text-xl font-bold text-center text-white mb-1">Verify Mobile Number</h3>
        <p class="text-xs text-center text-slate-400 mb-6">
          Enter the 6-digit OTP sent via SMS to <span class="font-medium text-emerald-400">+91 ${phone}</span>
        </p>

        <!-- OTP 6-box input -->
        <div class="flex justify-center gap-2 mb-6">
          <input type="text" maxlength="1" class="otp-digit w-10 h-12 text-center text-xl font-bold rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-emerald-500 focus:outline-none" value="1" />
          <input type="text" maxlength="1" class="otp-digit w-10 h-12 text-center text-xl font-bold rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-emerald-500 focus:outline-none" value="2" />
          <input type="text" maxlength="1" class="otp-digit w-10 h-12 text-center text-xl font-bold rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-emerald-500 focus:outline-none" value="3" />
          <input type="text" maxlength="1" class="otp-digit w-10 h-12 text-center text-xl font-bold rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-emerald-500 focus:outline-none" value="4" />
          <input type="text" maxlength="1" class="otp-digit w-10 h-12 text-center text-xl font-bold rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-emerald-500 focus:outline-none" value="5" />
          <input type="text" maxlength="1" class="otp-digit w-10 h-12 text-center text-xl font-bold rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-emerald-500 focus:outline-none" value="6" />
        </div>

        <div class="flex items-center justify-between text-xs text-slate-400 mb-6">
          <span id="otp-timer">Resend OTP in <strong class="text-white">30s</strong></span>
          <button id="resend-btn" class="text-emerald-400 hover:text-emerald-300 font-medium disabled:opacity-40 disabled:cursor-not-allowed" disabled>Resend Code</button>
        </div>

        <button id="verify-otp-btn" class="w-full py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white rounded-xl font-semibold shadow-lg shadow-emerald-950/40 transition-all flex items-center justify-center gap-2">
          <span>Verify & Continue</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
        </button>

        <div class="mt-4 text-center">
          <span class="text-[11px] text-slate-500 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700/50">
            Demo Sandbox Code: <code class="text-emerald-400 font-mono">123456</code> (Pre-filled)
          </span>
        </div>
      </div>
    </div>
  `;

  modalRoot.innerHTML = content;

  // Auto focus and digit progression
  const digits = modalRoot.querySelectorAll('.otp-digit');
  digits.forEach((input, index) => {
    input.addEventListener('keyup', (e) => {
      if (e.key >= '0' && e.key <= '9') {
        if (index < digits.length - 1) digits[index + 1].focus();
      } else if (e.key === 'Backspace') {
        if (index > 0) digits[index - 1].focus();
      }
    });
  });

  const timerSpan = modalRoot.querySelector('#otp-timer strong');
  const resendBtn = modalRoot.querySelector('#resend-btn');
  const interval = setInterval(() => {
    secondsLeft--;
    if (timerSpan) timerSpan.textContent = `${secondsLeft}s`;
    if (secondsLeft <= 0) {
      clearInterval(interval);
      if (resendBtn) {
        resendBtn.disabled = false;
        resendBtn.onclick = () => {
          openOtpModal({ phone, onVerify });
        };
      }
    }
  }, 1000);

  modalRoot.querySelector('#otp-close-btn').onclick = () => {
    clearInterval(interval);
    closeModal();
  };

  modalRoot.querySelector('#verify-otp-btn').onclick = () => {
    clearInterval(interval);
    closeModal();
    if (typeof onVerify === 'function') onVerify();
  };
}

export function openCallModal({ name, phone, crop = 'Wheat', quantity = '', offeredPrice = '' }) {
  closeModal();

  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return;

  let seconds = 0;
  clearInterval(callTimerInterval);

  const content = `
    <div id="active-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div class="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl p-6 text-slate-100 flex flex-col items-center relative">
        
        <!-- Status -->
        <div class="text-xs uppercase tracking-wider text-emerald-400 font-semibold mb-2 flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>Outgoing Secure Call</span>
        </div>

        <div id="call-timer-text" class="text-xs text-slate-400 mb-6 font-mono">00:00</div>

        <!-- Avatar / Pulse -->
        <div class="relative mb-6">
          <div class="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 p-1 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <div class="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-3xl font-bold text-white">
              ${name ? name.charAt(0) : 'B'}
            </div>
          </div>
          <div class="absolute -inset-2 rounded-full border-2 border-emerald-500/30 animate-pulse pointer-events-none"></div>
        </div>

        <!-- Recipient Info -->
        <h3 class="text-xl font-bold text-white text-center mb-1">${name}</h3>
        <p class="text-sm text-emerald-400 font-mono mb-2">${phone}</p>
        
        <!-- Deal Context -->
        ${crop ? `
          <div class="bg-slate-800/80 border border-slate-700/60 rounded-xl px-4 py-2 text-center text-xs text-slate-300 mb-8 max-w-xs">
            Discussion: <strong class="text-white">${quantity ? quantity + ' Qtl ' : ''}${crop}</strong>
            ${offeredPrice ? `<span class="text-amber-300 font-semibold"> @ ₹${offeredPrice}/Qtl</span>` : ''}
          </div>
        ` : '<div class="mb-6"></div>'}

        <!-- In-Call Actions -->
        <div class="flex items-center justify-center gap-6 mb-8 w-full">
          <button class="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700 transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z"></path></svg>
          </button>
          <button class="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700 transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path></svg>
          </button>
          <a href="tel:${phone.replace(/\s+/g, '')}" class="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400 hover:bg-slate-700 transition" title="Open in Device Phone App">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
          </a>
        </div>

        <!-- End Call Button -->
        <button id="end-call-btn" class="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-900/50 transition transform hover:scale-105">
          <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08c-.18-.17-.29-.42-.29-.7 0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11-.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.1-.7-.28-.79-.74-1.69-1.36-2.67-1.85-.33-.16-.56-.5-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z"/></svg>
        </button>

      </div>
    </div>
  `;

  modalRoot.innerHTML = content;

  const timerEl = modalRoot.querySelector('#call-timer-text');
  callTimerInterval = setInterval(() => {
    seconds++;
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    if (timerEl) timerEl.textContent = `${m}:${s} - Connected`;
  }, 1000);

  modalRoot.querySelector('#end-call-btn').onclick = () => {
    clearInterval(callTimerInterval);
    closeModal();
  };
}

export function openInAppBrowserModal({ title, url, portalName }) {
  closeModal();

  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return;

  const content = `
    <div id="active-modal" class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div class="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl h-[90vh] max-h-[720px] flex flex-col shadow-2xl overflow-hidden">
        
        <!-- Browser Header Bar -->
        <div class="bg-slate-800/90 border-b border-slate-700 px-4 py-3 flex items-center justify-between gap-3">
          <div class="flex items-center gap-2 text-slate-400">
            <span class="w-3 h-3 rounded-full bg-rose-500/80"></span>
            <span class="w-3 h-3 rounded-full bg-amber-500/80"></span>
            <span class="w-3 h-3 rounded-full bg-emerald-500/80"></span>
          </div>

          <!-- URL bar -->
          <div class="flex-1 max-w-md bg-slate-950/70 border border-slate-700/80 rounded-lg px-3 py-1.5 flex items-center gap-2 text-xs text-slate-300">
            <svg class="w-3.5 h-3.5 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            <span class="truncate font-mono text-emerald-300">${url}</span>
          </div>

          <div class="flex items-center gap-2">
            <a href="${url}" target="_blank" rel="noopener noreferrer" class="text-xs px-2.5 py-1.5 bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 rounded-lg border border-emerald-500/30 flex items-center gap-1 font-medium transition" title="Open in External Browser">
              <span>Open External</span>
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
            </a>
            <button id="browser-close-btn" class="text-slate-400 hover:text-white p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
        </div>

        <!-- In-App Viewer Content / Portal Simulation -->
        <div class="flex-1 bg-slate-950 overflow-y-auto p-6 text-slate-200">
          <div class="max-w-xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <!-- Government Emblem / Header Mock -->
            <div class="border-b border-slate-800 pb-4 mb-5 flex items-center gap-3">
              <div class="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-2xl">
                🏛️
              </div>
              <div>
                <span class="text-[10px] tracking-wider uppercase font-semibold text-amber-400 block">Government of India • Ministry of Agriculture</span>
                <h2 class="text-base sm:text-lg font-bold text-white">${title}</h2>
              </div>
            </div>

            <!-- Portal Notice -->
            <div class="bg-emerald-950/40 border border-emerald-800/40 rounded-xl p-4 mb-6 text-xs text-emerald-200 flex items-start gap-3">
              <svg class="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
              <div>
                <strong class="font-semibold block text-emerald-300 mb-0.5">Secure Farmer Service Portal</strong>
                Official e-Governance window for DBT subsidies, claim status tracking, and registry verification.
              </div>
            </div>

            <div class="space-y-4 text-xs text-slate-300">
              <p class="leading-relaxed">
                You are securely accessing <strong class="text-white">${portalName || url}</strong>. To complete your digital registration or check DBT bank disbursement:
              </p>

              <div class="bg-slate-950/60 rounded-xl p-4 border border-slate-800 space-y-2">
                <div class="flex items-center gap-2">
                  <span class="w-5 h-5 rounded-full bg-slate-800 text-emerald-400 flex items-center justify-center text-[10px] font-bold">1</span>
                  <span>Keep your 12-digit Aadhaar Card ready.</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="w-5 h-5 rounded-full bg-slate-800 text-emerald-400 flex items-center justify-center text-[10px] font-bold">2</span>
                  <span>Verify that your bank account is Aadhaar-seeded for DBT.</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="w-5 h-5 rounded-full bg-slate-800 text-emerald-400 flex items-center justify-center text-[10px] font-bold">3</span>
                  <span>Upload your Land Record (Khata/Khasra/Patta) document.</span>
                </div>
              </div>

              <div class="pt-4 flex flex-col sm:flex-row gap-3">
                <a href="${url}" target="_blank" rel="noopener noreferrer" class="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white rounded-xl font-medium text-center shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 transition">
                  <span>Continue to Official Portal</span>
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                </a>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  `;

  modalRoot.innerHTML = content;
  modalRoot.querySelector('#browser-close-btn').onclick = closeModal;
}

export function openShareQrModal({ wifiUrl = 'http://10.54.0.247:8080', localUrl = 'http://localhost:8080' } = {}) {
  closeModal();

  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return;

  const content = `
    <div id="active-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div class="bg-slate-900 border border-emerald-500/40 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl p-6 text-slate-100 relative">
        
        <button id="qr-modal-close-btn" class="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <!-- Header -->
        <div class="text-center mb-5">
          <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-2 text-2xl text-emerald-400">
            📱
          </div>
          <h3 class="text-lg font-bold text-white">Scan QR Code to Open on Mobile</h3>
          <p class="text-xs text-slate-400 mt-0.5">
            Any phone on your Wi-Fi or Hotspot can scan and run AgriSmart instantly.
          </p>
        </div>

        <!-- QR Code Image Card -->
        <div class="bg-white p-4 rounded-2xl shadow-inner mx-auto w-64 h-64 flex items-center justify-center border-4 border-emerald-500/20 mb-5">
          <img
            id="qr-image-display"
            src="./qr-code.png"
            alt="AgriSmart Mobile QR Code"
            class="w-full h-full object-contain"
          />
        </div>

        <!-- Shareable Link Box -->
        <div class="bg-slate-950/90 border border-slate-800 rounded-2xl p-3.5 mb-4">
          <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Direct Mobile / Wi-Fi URL:
          </span>
          <div class="flex items-center justify-between gap-2">
            <span id="qr-url-text" class="text-xs font-mono text-emerald-300 truncate select-all">${wifiUrl}</span>
            <button id="copy-qr-url-btn" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shrink-0 transition flex items-center gap-1">
              <span>Copy Link</span>
            </button>
          </div>
        </div>

        <!-- Android APK / PWA Install Guide -->
        <div class="bg-emerald-950/30 border border-emerald-800/40 rounded-2xl p-3.5 text-xs text-emerald-200 space-y-1.5 mb-5">
          <div class="flex items-center gap-1.5 font-bold text-emerald-300">
            <span>🚀 Android App / APK Install:</span>
          </div>
          <p class="text-[11px] text-slate-300 leading-relaxed">
            When you open this link in Chrome or Edge on Android, tap the <strong>"Add to Home screen"</strong> or <strong>"Install App"</strong> prompt to run it full-screen just like an APK file!
          </p>
        </div>

        <!-- Close / OK -->
        <button id="qr-ok-btn" class="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition">
          Done
        </button>

      </div>
    </div>
  `;

  modalRoot.innerHTML = content;

  modalRoot.querySelector('#qr-modal-close-btn').onclick = closeModal;
  modalRoot.querySelector('#qr-ok-btn').onclick = closeModal;

  const copyBtn = modalRoot.querySelector('#copy-qr-url-btn');
  copyBtn.onclick = () => {
    navigator.clipboard.writeText(wifiUrl).then(() => {
      copyBtn.innerHTML = '<span>✓ Copied!</span>';
      setTimeout(() => {
        copyBtn.innerHTML = '<span>Copy Link</span>';
      }, 2000);
    });
  };
}

export function closeModal() {
  clearInterval(callTimerInterval);
  const modal = document.getElementById('active-modal');
  if (modal) modal.remove();
}


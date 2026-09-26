'use client';

import React, { useState, useEffect } from 'react';

export default function InstallPwaBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);

  useEffect(() => {
    // Check if already in standalone mode
    if (typeof window !== 'undefined') {
      const isStandaloneMode = 
        window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true;
      setIsStandalone(isStandaloneMode);

      if (isStandaloneMode) return;

      // Check if user dismissed banner recently
      const dismissed = localStorage.getItem('krishimitra_pwa_dismissed');
      if (dismissed && Date.now() - parseInt(dismissed) < 24 * 60 * 60 * 1000) {
        return; // Suppress for 24 hours if dismissed
      }

      const handler = (e) => {
        e.preventDefault();
        setDeferredPrompt(e);
        window.__pwaInstallPrompt = e;
        setShowBanner(true);
      };

      window.addEventListener('beforeinstallprompt', handler);

      // Listen for custom trigger from profile/header
      const triggerHandler = () => {
        if (window.__pwaInstallPrompt) {
          window.__pwaInstallPrompt.prompt();
          window.__pwaInstallPrompt.userChoice.then((choice) => {
            if (choice.outcome === 'accepted') {
              setShowBanner(false);
            }
          });
        } else {
          // Likely iOS Safari or already installed
          const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
          if (isIos) {
            setShowIosGuide(true);
          } else {
            alert('To install KrishiMitra, open this page in Chrome, Edge, or Safari, and select "Add to Home Screen" or "Install App" from the browser menu.');
          }
        }
      };

      window.addEventListener('trigger-pwa-install', triggerHandler);

      return () => {
        window.removeEventListener('beforeinstallprompt', handler);
        window.removeEventListener('trigger-pwa-install', triggerHandler);
      };
    }
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    try {
      localStorage.setItem('krishimitra_pwa_dismissed', Date.now().toString());
    } catch (e) {}
  };

  if (isStandalone) return null;

  return (
    <>
      {/* Non-intrusive Install Banner */}
      {showBanner && (
        <div 
          role="region"
          aria-label="PWA Web App Installation Banner"
          className="fixed bottom-16 lg:bottom-4 left-3 right-3 sm:left-auto sm:right-4 sm:max-w-md z-40 bg-[#1f1e1c]/95 border border-[#3d9b63]/40 rounded-2xl p-3.5 sm:p-4 shadow-2xl backdrop-blur-xl animate-slide-up flex items-center justify-between gap-3 text-[#ede9e3]"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#252e24] border border-[#383430] flex items-center justify-center text-xl shrink-0">
              🌱
            </div>
            <div className="min-w-0">
              <h4 className="text-xs sm:text-sm font-bold text-[#ede9e3] truncate">
                Install KrishiMitra App
              </h4>
              <p className="text-[11px] text-[#978f87] line-clamp-1">
                Faster loading & offline mandi rates
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleInstallClick}
              className="px-3 py-1.5 bg-[#2e7d52] hover:bg-[#266a45] text-white font-bold text-xs rounded-xl shadow-md transition active:scale-95 focus-visible:ring-2 focus-visible:ring-[#3d9b63]"
            >
              Install
            </button>
            <button
              onClick={handleDismiss}
              aria-label="Dismiss installation banner"
              className="p-1.5 text-[#978f87] hover:text-[#ede9e3] rounded-lg hover:bg-[#272523] transition focus-visible:ring-2 focus-visible:ring-[#3d9b63]"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* iOS Add to Home Screen Instructions Modal */}
      {showIosGuide && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[#1f1e1c] border border-[#2d2b27] rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl text-[#ede9e3]">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <span>📲</span> Install on iPhone / iPad
              </h3>
              <button
                onClick={() => setShowIosGuide(false)}
                className="text-[#978f87] hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>
            
            <ol className="text-xs text-[#c5bfb8] space-y-3 list-decimal list-inside leading-relaxed">
              <li>Open this website in <strong>Safari</strong>.</li>
              <li>Tap the <strong>Share</strong> button (the square with an arrow pointing up <span className="inline-block px-1 bg-[#272523] rounded">⎋</span>) at the bottom toolbar.</li>
              <li>Scroll down and select <strong>"Add to Home Screen"</strong>.</li>
              <li>Tap <strong>"Add"</strong> in the top right corner.</li>
            </ol>

            <button
              onClick={() => setShowIosGuide(false)}
              className="w-full py-2.5 bg-[#2e7d52] hover:bg-[#266a45] text-white font-bold text-xs rounded-xl shadow transition"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}

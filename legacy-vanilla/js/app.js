// js/app.js - Application Bootstrap & Screen Registration
import { store } from './store.js';
import { router } from './router.js';
import { renderLoginScreen } from './screens/login.js';
import { renderLocationScreen } from './screens/location.js';
import { renderDashboardScreen } from './screens/dashboard.js';
import { renderProfileScreen } from './screens/profile.js';
import { renderMessagesScreen } from './screens/messages.js';
import { renderWeatherScreen } from './screens/weather.js';
import { renderCropRecommendationScreen } from './screens/cropRecommendation.js';
import { renderB2BMarketplaceScreen } from './screens/b2bMarketplace.js';
import { renderSoilDataScreen } from './screens/soilData.js';
import { renderGovSchemesScreen } from './screens/govSchemes.js';
import { renderMandiPricesScreen } from './screens/mandiPrices.js';

// Register all 11 user-specified screens
router.registerScreen('screen-1', renderLoginScreen);
router.registerScreen('screen-2', renderLocationScreen);
router.registerScreen('screen-3', renderDashboardScreen);
router.registerScreen('screen-4', renderProfileScreen);
router.registerScreen('screen-5', renderMessagesScreen);
router.registerScreen('screen-6', renderWeatherScreen);
router.registerScreen('screen-7', renderCropRecommendationScreen);
router.registerScreen('screen-8', renderB2BMarketplaceScreen);
router.registerScreen('screen-9', renderSoilDataScreen);
router.registerScreen('screen-10', renderGovSchemesScreen);
router.registerScreen('screen-11', renderMandiPricesScreen);

document.addEventListener('DOMContentLoaded', () => {
  // Initialize router with main app view container
  router.init('screen-viewport');

  // Device view mode toggle (Mobile Frame vs Full Fluid)
  const viewToggleBtn = document.getElementById('view-mode-toggle');
  const appContainer = document.getElementById('app-container');

  if (viewToggleBtn && appContainer) {
    let isMobileFrame = true;
    viewToggleBtn.addEventListener('click', () => {
      isMobileFrame = !isMobileFrame;
      if (isMobileFrame) {
        appContainer.className = 'mobile-frame-mode';
        viewToggleBtn.innerHTML = `
          <span>📱 Phone Frame</span>
        `;
      } else {
        appContainer.className = 'fluid-frame-mode';
        viewToggleBtn.innerHTML = `
          <span>💻 Fluid View</span>
        `;
      }
    });
  }

  // Determine initial screen based on session state or URL hash
  const initialHash = window.location.hash.replace('#', '');
  const state = store.getState();

  if (initialHash && router.screenRenderers.has(initialHash)) {
    router.navigateTo(initialHash, false);
  } else if (state.auth.isLoggedIn) {
    if (state.location.granted) {
      router.navigateTo('screen-3', false);
    } else {
      router.navigateTo('screen-2', false);
    }
  } else {
    router.navigateTo('screen-1', false);
  }

  // Close modals on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const activeModal = document.getElementById('active-modal');
      if (activeModal) activeModal.remove();
    }
  });

  console.log('AgriSmart Web Application Initialized with 11 Screens.');
});

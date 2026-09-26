// js/router.js - Multi-screen Navigation Manager

class Router {
  constructor() {
    this.currentScreen = 'screen-1';
    this.screenHistory = ['screen-1'];
    this.screenRenderers = new Map();
    this.container = null;
  }

  init(containerElementId) {
    this.container = document.getElementById(containerElementId);
    
    // Hash change listener for browser back/forward support
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && hash !== this.currentScreen && this.screenRenderers.has(hash)) {
        this.navigateTo(hash, false);
      }
    });

    // Initial route check
    const initialHash = window.location.hash.replace('#', '');
    if (initialHash && this.screenRenderers.has(initialHash)) {
      this.currentScreen = initialHash;
    }
  }

  registerScreen(screenId, renderFunction) {
    this.screenRenderers.set(screenId, renderFunction);
  }

  navigateTo(screenId, pushToHistory = true) {
    if (!this.screenRenderers.has(screenId)) {
      console.warn(`Screen ${screenId} not registered.`);
      return;
    }

    if (pushToHistory && screenId !== this.currentScreen) {
      this.screenHistory.push(screenId);
      window.location.hash = screenId;
    }

    this.currentScreen = screenId;
    this.render();
  }

  goBack() {
    if (this.screenHistory.length > 1) {
      this.screenHistory.pop();
      const prevScreen = this.screenHistory[this.screenHistory.length - 1];
      this.currentScreen = prevScreen;
      window.location.hash = prevScreen;
      this.render();
    } else {
      // Default to Screen 3 (Dashboard) if history is shallow
      this.navigateTo('screen-3', false);
    }
  }

  render() {
    if (!this.container) return;
    
    // Scroll container to top
    this.container.scrollTop = 0;
    
    const renderer = this.screenRenderers.get(this.currentScreen);
    if (renderer) {
      this.container.innerHTML = '';
      const screenWrapper = document.createElement('div');
      screenWrapper.className = 'w-full min-h-full flex flex-col animate-fade-in';
      screenWrapper.id = `view-${this.currentScreen}`;
      this.container.appendChild(screenWrapper);
      renderer(screenWrapper);
    }

    // Scroll main window to top if needed
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getCurrentScreen() {
    return this.currentScreen;
  }
}

export const router = new Router();

// js/store.js - Central Reactive Store for AgriSmart App

const STORAGE_KEY = 'agri_smart_app_state_v1';

// Initial default state
const defaultState = {
  // Screen 1: Auth & User
  auth: {
    isLoggedIn: false,
    authProvider: null, // 'phone' | 'google'
    phone: '9876543210',
    formattedPhone: '+91 98765 43210',
    email: 'rajesh.sharma.farmer@agri.in',
    name: 'Rajesh Kumar Sharma',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    landArea: '12.5 Acres',
    mandiRegNumber: 'PB-LDH-APMC-94821',
    verified: true,
  },

  // Screen 2: Location
  location: {
    granted: false,
    lat: 30.9010,
    lon: 75.8573,
    district: 'Ludhiana',
    state: 'Punjab',
    region: 'North Agro-Climatic Zone',
    soilType: 'Alluvial Loam',
    accuracyMeters: 14,
    lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  },

  // Screen 9 & 7: Soil Health Data
  soil: {
    nitrogen: 220, // kg/ha
    phosphorus: 42, // kg/ha
    potassium: 285, // kg/ha
    ph: 6.9,
    organicCarbon: 0.68, // %
    electricalConductivity: 0.78, // dS/m
    sampleId: 'SHC-2026-LDH-4491',
    testedDate: '12 Aug 2026',
    labName: 'KVK District Soil Testing Center, Ludhiana',
    status: 'Optimal for Cereal & Pulses'
  },

  // Screen 5: Messages & Buyer Notification Log
  messages: [
    {
      id: 'msg-1',
      buyerName: 'Vikram Malhotra',
      company: 'Punjab Agro Foods Pvt Ltd',
      crop: 'Wheat (HD 2967)',
      quantity: 150,
      offeredPrice: 2450,
      phone: '+91 98140 33219',
      timestamp: '10 mins ago',
      read: false,
      status: 'High Demand',
      badgeColor: 'emerald'
    },
    {
      id: 'msg-2',
      buyerName: 'Gurpreet Singh Mann',
      company: 'Mann Grain Exporters',
      crop: 'Basmati Rice (Pusa 1121)',
      quantity: 320,
      offeredPrice: 4150,
      phone: '+91 98721 88402',
      timestamp: '45 mins ago',
      read: false,
      status: 'Export Grade',
      badgeColor: 'blue'
    },
    {
      id: 'msg-3',
      buyerName: 'Amitabh Verma',
      company: 'Shree Krishna Oil Mills',
      crop: 'Mustard (Pusa Bold)',
      quantity: 80,
      offeredPrice: 5650,
      phone: '+91 94170 55190',
      timestamp: '2 hours ago',
      read: true,
      status: 'Spot Cash',
      badgeColor: 'amber'
    },
    {
      id: 'msg-4',
      buyerName: 'Sunil Rao',
      company: 'Kisan Mart Processing',
      crop: 'Maize (Hybrid HQPM-1)',
      quantity: 200,
      offeredPrice: 2150,
      phone: '+91 97800 12344',
      timestamp: 'Yesterday',
      read: true,
      status: 'Standard',
      badgeColor: 'gray'
    }
  ],

  // Screen 8: B2B Marketplace Listings
  marketplace: {
    selectedCrop: 'Wheat',
    activeTab: 'SELL', // 'SELL' | 'BUY'
    cropsList: [
      'Wheat',
      'Basmati Rice',
      'Paddy (Normal)',
      'Cotton (Bt)',
      'Mustard',
      'Soybean',
      'Maize',
      'Potato',
      'Tomato',
      'Gram (Chana)'
    ],
    // Buyer requests (visible when farmer is in SELL mode)
    buyerRequests: [
      {
        id: 'br-1',
        crop: 'Wheat',
        buyerName: 'Adani Agri Logistics',
        company: 'Bulk Procurement Hub',
        quantityNeeded: 500,
        targetPrice: 2420,
        location: 'Khanna Mandi, PB',
        phone: '+91 98111 22334',
        urgency: 'Immediate Loading'
      },
      {
        id: 'br-2',
        crop: 'Wheat',
        buyerName: 'Rameshwar Flour Mills',
        company: 'Atta Processor',
        quantityNeeded: 120,
        targetPrice: 2480,
        location: 'Ludhiana APMC',
        phone: '+91 98450 67890',
        urgency: 'Within 48 hrs'
      },
      {
        id: 'br-3',
        crop: 'Wheat',
        buyerName: 'Kisan Super Grain',
        company: 'Retail Aggregator',
        quantityNeeded: 250,
        targetPrice: 2450,
        location: 'Jagraon Mandi',
        phone: '+91 97230 45612',
        urgency: 'Spot Payment'
      },
      {
        id: 'br-4',
        crop: 'Basmati Rice',
        buyerName: 'Kohinoor Export House',
        company: 'Grade A Exporters',
        quantityNeeded: 600,
        targetPrice: 4200,
        location: 'Amritsar Hub',
        phone: '+91 98888 12345',
        urgency: 'Top Quality Required'
      },
      {
        id: 'br-5',
        crop: 'Mustard',
        buyerName: 'Patanjali Agro Center',
        company: 'Oil Extraction Unit',
        quantityNeeded: 180,
        targetPrice: 5700,
        location: 'Bathinda APMC',
        phone: '+91 94160 99887',
        urgency: 'Within 3 days'
      },
      {
        id: 'br-6',
        crop: 'Cotton (Bt)',
        buyerName: 'Vardhman Textiles Ltd',
        company: 'Spinning Mill Division',
        quantityNeeded: 400,
        targetPrice: 7350,
        location: 'Abohar Mandi',
        phone: '+91 98150 44556',
        urgency: 'Premium Staple'
      }
    ],
    // Farmer sell listings (visible when user is in BUY mode)
    farmerListings: [
      {
        id: 'fl-1',
        crop: 'Wheat',
        farmerName: 'Baldev Singh Dhillon',
        village: 'Samrala, Dist. Ludhiana',
        harvestQuantity: 220,
        sellingPrice: 2400,
        phone: '+91 98760 11223',
        qualityGrade: 'FAQ (Fair Average Quality)',
        moisture: '11.5%'
      },
      {
        id: 'fl-2',
        crop: 'Wheat',
        farmerName: 'Harpreet Kaur Gill',
        village: 'Doraha, Dist. Ludhiana',
        harvestQuantity: 180,
        sellingPrice: 2430,
        phone: '+91 98141 77665',
        qualityGrade: 'Sharbati Premium',
        moisture: '10.8%'
      },
      {
        id: 'fl-3',
        crop: 'Wheat',
        farmerName: 'Manjit Singh Sandhu',
        village: 'Raikot, Dist. Ludhiana',
        harvestQuantity: 340,
        sellingPrice: 2390,
        phone: '+91 94630 33445',
        qualityGrade: 'Grade 1 Certified',
        moisture: '11.2%'
      },
      {
        id: 'fl-4',
        crop: 'Basmati Rice',
        farmerName: 'Karamjit Singh',
        village: 'Tarn Taran Road',
        harvestQuantity: 190,
        sellingPrice: 4050,
        phone: '+91 99140 22331',
        qualityGrade: '1121 Steam Extra Long',
        moisture: '12.0%'
      },
      {
        id: 'fl-5',
        crop: 'Mustard',
        farmerName: 'Joginder Ram',
        village: 'Moga Rural',
        harvestQuantity: 95,
        sellingPrice: 5580,
        phone: '+91 94172 88990',
        qualityGrade: 'High Oil Content (41%)',
        moisture: '8.5%'
      },
      {
        id: 'fl-6',
        crop: 'Cotton (Bt)',
        farmerName: 'Kulwinder Singh',
        village: 'Fazilka Outer',
        harvestQuantity: 150,
        sellingPrice: 7200,
        phone: '+91 98550 44332',
        qualityGrade: 'Medium-Long Staple',
        moisture: '9.0%'
      }
    ]
  },

  // Screen 11: MSP and Mandi Prices
  mandiData: {
    msp: {
      'Wheat': 2275,
      'Basmati Rice': 4000,
      'Paddy (Normal)': 2300,
      'Cotton (Bt)': 7122,
      'Mustard': 5650,
      'Soybean': 4892,
      'Maize': 2090,
      'Potato': 1450,
      'Tomato': 1600,
      'Gram (Chana)': 5440
    },
    mandis: [
      {
        id: 'm-1',
        name: 'Khanna APMC Main Mandi',
        subName: "Asia's Largest Grain Market",
        distanceKm: 18.4,
        district: 'Ludhiana',
        crop: 'Wheat',
        arrivalQty: 18400,
        minPrice: 2350,
        maxPrice: 2520,
        modalPrice: 2465,
        trend: 'up',
        trendDiff: '+₹190 above MSP'
      },
      {
        id: 'm-2',
        name: 'Ludhiana Gill Road Mandi',
        subName: 'District Central APMC Yard',
        distanceKm: 4.2,
        district: 'Ludhiana',
        crop: 'Wheat',
        arrivalQty: 9200,
        minPrice: 2310,
        maxPrice: 2475,
        modalPrice: 2420,
        trend: 'up',
        trendDiff: '+₹145 above MSP'
      },
      {
        id: 'm-3',
        name: 'Jagraon Sub-Yard APMC',
        subName: 'Rural Procurement Hub',
        distanceKm: 32.1,
        district: 'Ludhiana',
        crop: 'Wheat',
        arrivalQty: 7600,
        minPrice: 2280,
        maxPrice: 2430,
        modalPrice: 2390,
        trend: 'up',
        trendDiff: '+₹115 above MSP'
      },
      {
        id: 'm-4',
        name: 'Samrala Grain Market',
        subName: 'Block Level APMC',
        distanceKm: 26.8,
        district: 'Ludhiana',
        crop: 'Wheat',
        arrivalQty: 5100,
        minPrice: 2290,
        maxPrice: 2450,
        modalPrice: 2405,
        trend: 'up',
        trendDiff: '+₹130 above MSP'
      },
      {
        id: 'm-5',
        name: 'Sahnewal Mandi Yard',
        subName: 'Direct Railhead Mandi',
        distanceKm: 14.5,
        district: 'Ludhiana',
        crop: 'Wheat',
        arrivalQty: 6300,
        minPrice: 2320,
        maxPrice: 2480,
        modalPrice: 2435,
        trend: 'up',
        trendDiff: '+₹160 above MSP'
      }
    ]
  },

  // Screen 10: Government Schemes
  schemes: [
    {
      id: 'sch-1',
      category: 'Subsidies',
      title: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
      benefits: [
        'Direct income support of ₹6,000 per year transferred directly to bank account.',
        'Disbursed in 3 equal four-monthly installments of ₹2,000 each via DBT.'
      ],
      eligibility: 'All landholding farmer families with cultivable land up to 2 hectares (Aadhaar & land records linked).',
      url: 'https://pmkisan.gov.in',
      portalName: 'pmkisan.gov.in',
      badge: 'Direct Benefit Transfer'
    },
    {
      id: 'sch-2',
      category: 'Crop Insurance',
      title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
      benefits: [
        'Comprehensive financial risk cover against yield losses from non-preventable natural risks.',
        'Nominal uniform premium: only 2% for Kharif crops, 1.5% for Rabi, and 5% for horticultural crops.'
      ],
      eligibility: 'All farmers growing notified crops in notified areas including sharecroppers and tenant farmers.',
      url: 'https://pmfby.gov.in',
      portalName: 'pmfby.gov.in',
      badge: 'Risk Cover'
    },
    {
      id: 'sch-3',
      category: 'Subsidies',
      title: 'SMAM: Kisan Agricultural Drone Subsidy',
      benefits: [
        '50% financial assistance (up to ₹5 Lakhs) for purchase of agricultural drones for spray & analytics.',
        '100% grant (up to ₹10 Lakhs) for KVKs, ICAR institutes, and State Agricultural Universities.'
      ],
      eligibility: 'Small & Marginal farmers, Women farmers, FPOs, and registered Custom Hiring Centers.',
      url: 'https://agrimachinery.nic.in',
      portalName: 'agrimachinery.nic.in',
      badge: '50% Subsidy'
    },
    {
      id: 'sch-4',
      category: 'Soil Management',
      title: 'Soil Health Card Scheme (SHC)',
      benefits: [
        'Free 12-parameter soil fertility assessment card issued every 2 years.',
        'Dosage recommendations for secondary nutrients, micronutrients, and bio-fertilizers to cut costs by 25%.'
      ],
      eligibility: 'All farmers possessing agricultural land holding in any state/UT across India.',
      url: 'https://soilhealth.dac.gov.in',
      portalName: 'soilhealth.dac.gov.in',
      badge: 'Free Testing'
    },
    {
      id: 'sch-5',
      category: 'Soil Management',
      title: 'PMKSY - Per Drop More Crop (Micro-Irrigation)',
      benefits: [
        'Up to 55% subsidy for Small/Marginal farmers to install Drip and Sprinkler irrigation systems.',
        'Conserves up to 40% water while increasing harvest crop yield by 20-30%.'
      ],
      eligibility: 'Farmers having assured water source and land title documents or long-term registered lease.',
      url: 'https://pmksy.gov.in',
      portalName: 'pmksy.gov.in',
      badge: 'Micro-Irrigation'
    },
    {
      id: 'sch-6',
      category: 'Subsidies',
      title: 'Kisan Credit Card (KCC) Scheme',
      benefits: [
        'Flexible collateral-free institutional credit up to ₹1.6 Lakhs (expandable to ₹3 Lakhs).',
        'Effective interest rate of only 4% per annum upon timely repayment of loans.'
      ],
      eligibility: 'Individual/joint borrowers, tenant farmers, oral lessees, and Self Help Groups of farmers.',
      url: 'https://www.myscheme.gov.in/schemes/kcc',
      portalName: 'myscheme.gov.in',
      badge: '4% Low Interest'
    }
  ],

  // Screen 6: Weather & Forecast
  weather: {
    temp: 29,
    feelsLike: 31,
    condition: 'Partly Cloudy',
    humidity: 68,
    windSpeed: 16,
    precipitationChance: 35,
    uvIndex: 6,
    severeAlert: {
      active: true,
      title: 'SEVERE WEATHER ALERT: Unexpected Thunderstorm & Hail Warning',
      severity: 'high',
      validTill: 'Next 6 Hours (until 4:00 PM)',
      description: 'Localized squalls with gusts up to 55 km/h and isolated hail likely in Ludhiana & neighbouring districts. Farmers are strongly advised to postpone pesticide spraying and cover harvested produce at open APMC mandis.'
    },
    hourly: [
      { time: 'Now', temp: 29, rainProb: 35, icon: 'partly-cloudy' },
      { time: '09:00', temp: 30, rainProb: 40, icon: 'partly-cloudy' },
      { time: '11:00', temp: 32, rainProb: 50, icon: 'cloud-lightning' },
      { time: '13:00', temp: 31, rainProb: 75, icon: 'cloud-rain' },
      { time: '15:00', temp: 28, rainProb: 80, icon: 'cloud-rain' },
      { time: '17:00', temp: 27, rainProb: 45, icon: 'cloudy' },
      { time: '19:00', temp: 26, rainProb: 20, icon: 'cloudy' },
      { time: '21:00', temp: 25, rainProb: 15, icon: 'clear-night' },
      { time: '23:00', temp: 24, rainProb: 10, icon: 'clear-night' },
      { time: '02:00', temp: 23, rainProb: 10, icon: 'clear-night' },
      { time: '05:00', temp: 23, rainProb: 15, icon: 'partly-cloudy' },
      { time: '08:00', temp: 27, rainProb: 20, icon: 'sunny' }
    ],
    fourteenDayRainfall: [
      { day: 'Day 1 (Today)', rainfallMm: 14.5, prob: 75, date: '17 Sep' },
      { day: 'Day 2', rainfallMm: 18.2, prob: 80, date: '18 Sep' },
      { day: 'Day 3', rainfallMm: 6.0, prob: 45, date: '19 Sep' },
      { day: 'Day 4', rainfallMm: 1.2, prob: 20, date: '20 Sep' },
      { day: 'Day 5', rainfallMm: 0.0, prob: 10, date: '21 Sep' },
      { day: 'Day 6', rainfallMm: 0.0, prob: 5, date: '22 Sep' },
      { day: 'Day 7', rainfallMm: 3.5, prob: 30, date: '23 Sep' },
      { day: 'Day 8', rainfallMm: 8.0, prob: 50, date: '24 Sep' },
      { day: 'Day 9', rainfallMm: 12.4, prob: 65, date: '25 Sep' },
      { day: 'Day 10', rainfallMm: 5.0, prob: 40, date: '26 Sep' },
      { day: 'Day 11', rainfallMm: 0.5, prob: 15, date: '27 Sep' },
      { day: 'Day 12', rainfallMm: 0.0, prob: 10, date: '28 Sep' },
      { day: 'Day 13', rainfallMm: 2.1, prob: 25, date: '29 Sep' },
      { day: 'Day 14', rainfallMm: 4.8, prob: 35, date: '30 Sep' }
    ]
  },

  // Screen 3: Auto-sliding Ribbon Banners
  banners: [
    {
      id: 'ban-1',
      tag: 'CENTRAL GOVT SCHEME',
      title: '50% Subsidy on Kisan Ag-Drones',
      subtitle: 'Apply before Sep 30 under SMAM Portal. Approved for Spray & Soil Scan.',
      cta: 'Apply Under SMAM',
      targetScreen: 'screen-10',
      bgGradient: 'from-emerald-700 via-emerald-800 to-green-950',
      accentColor: 'text-amber-300',
      icon: 'drone'
    },
    {
      id: 'ban-2',
      tag: 'KHARIF HARVEST BONUS',
      title: 'Direct APMC Mandi Procurement Live',
      subtitle: 'Wheat & Basmati rates up to +₹190 above Central MSP. Instant DBT Transfer.',
      cta: 'Check Mandi Prices',
      targetScreen: 'screen-11',
      bgGradient: 'from-amber-700 via-amber-800 to-yellow-950',
      accentColor: 'text-yellow-200',
      icon: 'mandi'
    },
    {
      id: 'ban-3',
      tag: 'FERTILIZER ADVISORY',
      title: 'Free Digital Soil Health Card Update',
      subtitle: 'Calibrate NPK & Micronutrient dosage to increase crop yield by up to 28%.',
      cta: 'Update Soil Data',
      targetScreen: 'screen-9',
      bgGradient: 'from-teal-800 via-teal-900 to-slate-900',
      accentColor: 'text-emerald-300',
      icon: 'soil'
    },
    {
      id: 'ban-4',
      tag: 'B2B MARKETPLACE',
      title: 'Bulk Grain Buyers Offering Cash Advances',
      subtitle: 'Verified millers looking for 1,500+ Qtl wheat & oilseeds in your district.',
      cta: 'View Buyer Enquiries',
      targetScreen: 'screen-8',
      bgGradient: 'from-blue-800 via-indigo-900 to-slate-950',
      accentColor: 'text-sky-300',
      icon: 'marketplace'
    }
  ]
};

// Store Manager
class Store {
  constructor() {
    this.subscribers = new Set();
    this.state = this.loadState();
  }

  loadState() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...defaultState,
          ...parsed,
          auth: { ...defaultState.auth, ...(parsed.auth || {}) },
          location: { ...defaultState.location, ...(parsed.location || {}) },
          soil: { ...defaultState.soil, ...(parsed.soil || {}) },
          marketplace: {
            ...defaultState.marketplace,
            ...(parsed.marketplace || {}),
            buyerRequests: parsed.marketplace?.buyerRequests || defaultState.marketplace.buyerRequests,
            farmerListings: parsed.marketplace?.farmerListings || defaultState.marketplace.farmerListings
          }
        };
      }
    } catch (e) {
      console.warn('Failed to load stored state, initializing defaults:', e);
    }
    return JSON.parse(JSON.stringify(defaultState));
  }

  saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.warn('Failed to save state to localStorage:', e);
    }
    this.notify();
  }

  notify() {
    for (const sub of this.subscribers) {
      try {
        sub(this.state);
      } catch (err) {
        console.error('Error notifying subscriber:', err);
      }
    }
  }

  subscribe(listener) {
    this.subscribers.add(listener);
    return () => this.subscribers.delete(listener);
  }

  getState() {
    return this.state;
  }

  // --- Actions ---

  // Screen 1: Auth
  loginWithPhone(phoneNumber) {
    const clean = phoneNumber.replace(/\D/g, '');
    this.state.auth.isLoggedIn = true;
    this.state.auth.authProvider = 'phone';
    this.state.auth.phone = clean;
    this.state.auth.formattedPhone = `+91 ${clean.slice(0, 5)} ${clean.slice(5)}`;
    this.saveState();
  }

  loginWithGoogle(userData = null) {
    this.state.auth.isLoggedIn = true;
    this.state.auth.authProvider = 'google';
    if (userData) {
      this.state.auth.name = userData.name || this.state.auth.name;
      this.state.auth.email = userData.email || this.state.auth.email;
      this.state.auth.avatar = userData.avatar || this.state.auth.avatar;
    }
    this.saveState();
  }

  logout() {
    this.state.auth.isLoggedIn = false;
    this.saveState();
  }

  // Screen 2: Location
  setLocation(lat, lon, district = 'Ludhiana', state = 'Punjab') {
    this.state.location.granted = true;
    this.state.location.lat = parseFloat(Number(lat).toFixed(4));
    this.state.location.lon = parseFloat(Number(lon).toFixed(4));
    this.state.location.district = district;
    this.state.location.state = state;
    this.state.location.lastUpdated = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Calibrate soil baseline according to region
    if (district.toLowerCase().includes('pune') || state.toLowerCase().includes('maharashtra')) {
      this.state.location.soilType = 'Black Cotton Soil (Regur)';
      this.state.soil.ph = 7.4;
      this.state.soil.nitrogen = 180;
      this.state.soil.phosphorus = 32;
      this.state.soil.potassium = 310;
    } else {
      this.state.location.soilType = 'Indo-Gangetic Alluvial Loam';
      this.state.soil.ph = 6.9;
      this.state.soil.nitrogen = 220;
      this.state.soil.phosphorus = 42;
      this.state.soil.potassium = 285;
    }
    this.saveState();
  }

  // Screen 4: Profile Details
  updateProfile({ name, email, landArea, mandiRegNumber, avatar }) {
    if (name !== undefined) this.state.auth.name = name;
    if (email !== undefined) this.state.auth.email = email;
    if (landArea !== undefined) this.state.auth.landArea = landArea;
    if (mandiRegNumber !== undefined) this.state.auth.mandiRegNumber = mandiRegNumber;
    if (avatar !== undefined) this.state.auth.avatar = avatar;
    this.saveState();
  }

  // Screen 5: Messages
  markMessageAsRead(messageId) {
    const msg = this.state.messages.find(m => m.id === messageId);
    if (msg) {
      msg.read = true;
      this.saveState();
    }
  }

  getUnreadMessagesCount() {
    return this.state.messages.filter(m => !m.read).length;
  }

  // Screen 8: Marketplace
  setMarketplaceCrop(crop) {
    this.state.marketplace.selectedCrop = crop;
    this.saveState();
  }

  setMarketplaceTab(tab) {
    this.state.marketplace.activeTab = tab; // 'SELL' or 'BUY'
    this.saveState();
  }

  addFarmerListing(listing) {
    const newListing = {
      id: 'fl-' + Date.now(),
      crop: this.state.marketplace.selectedCrop,
      farmerName: this.state.auth.name || 'Local Farmer',
      village: `${this.state.location.district} Rural`,
      harvestQuantity: Number(listing.harvestQuantity),
      sellingPrice: Number(listing.sellingPrice),
      phone: this.state.auth.formattedPhone || '+91 98765 43210',
      qualityGrade: 'FAQ Grade',
      moisture: '11.0%'
    };
    this.state.marketplace.farmerListings.unshift(newListing);
    this.saveState();
    return newListing;
  }

  addBuyerRequest(request) {
    const newRequest = {
      id: 'br-' + Date.now(),
      crop: this.state.marketplace.selectedCrop,
      buyerName: this.state.auth.name || 'Verified Trader',
      company: 'Local Procurement Desk',
      quantityNeeded: Number(request.quantityNeeded),
      targetPrice: Number(request.targetPrice),
      location: `${this.state.location.district} APMC`,
      phone: this.state.auth.formattedPhone || '+91 98765 43210',
      urgency: 'Active Requirement'
    };
    this.state.marketplace.buyerRequests.unshift(newRequest);
    this.saveState();
    return newRequest;
  }

  // Screen 9: Soil Profile
  saveSoilProfile(soilData) {
    this.state.soil = {
      ...this.state.soil,
      nitrogen: Number(soilData.nitrogen),
      phosphorus: Number(soilData.phosphorus),
      potassium: Number(soilData.potassium),
      ph: parseFloat(Number(soilData.ph).toFixed(2)),
      organicCarbon: parseFloat(Number(soilData.organicCarbon).toFixed(2)),
      electricalConductivity: parseFloat(Number(soilData.electricalConductivity).toFixed(2)),
      testedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };
    this.saveState();
  }

  // Reset to sample defaults
  resetAll() {
    this.state = JSON.parse(JSON.stringify(defaultState));
    this.saveState();
  }
}

export const store = new Store();

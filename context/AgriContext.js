'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  isSupabaseConfigured, 
  supabase, 
  signInWithGoogle, 
  signOut as supabaseSignOut,
  upsertProfile,
  getProfile,
  saveSoilData,
  createListing 
} from '@/lib/supabase';

const STORAGE_KEY = 'krishimitra_app_state_v3';

const defaultState = {
  auth: {
    isLoggedIn: true,
    authProvider: 'phone',
    phone: '9876543210',
    formattedPhone: '+91 98765 43210',
    email: 'rajesh.sharma.farmer@agri.in',
    name: 'Rajesh Kumar Sharma',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    landArea: '12.5 Acres',
    mandiRegNumber: 'PB-LDH-APMC-94821',
    verified: true,
  },
  location: {
    granted: true,
    lat: 30.9010,
    lon: 75.8573,
    district: 'Ludhiana',
    state: 'Punjab',
    region: 'North Agro-Climatic Zone',
    soilType: 'Indo-Gangetic Alluvial Loam',
    accuracyMeters: 14,
    lastUpdated: '09:41 AM',
  },
  soil: {
    nitrogen: 220,
    phosphorus: 42,
    potassium: 285,
    ph: 6.9,
    organicCarbon: 0.68,
    electricalConductivity: 0.78,
    sampleId: 'SHC-2026-LDH-4491',
    testedDate: '12 Aug 2026',
    labName: 'KVK District Soil Testing Center, Ludhiana',
    status: 'Optimal for Cereal & Pulses',
  },
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
      badgeColor: 'emerald',
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
      badgeColor: 'blue',
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
      badgeColor: 'amber',
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
      badgeColor: 'gray',
    },
  ],
  marketplace: {
    selectedCrop: 'Wheat',
    activeTab: 'SELL',
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
      'Gram (Chana)',
    ],
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
        urgency: 'Immediate Loading',
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
        urgency: 'Within 48 hrs',
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
        urgency: 'Spot Payment',
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
        urgency: 'Top Quality Required',
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
        urgency: 'Within 3 days',
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
        urgency: 'Premium Staple',
      },
    ],
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
        moisture: '11.5%',
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
        moisture: '10.8%',
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
        moisture: '11.2%',
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
        moisture: '12.0%',
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
        moisture: '8.5%',
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
        moisture: '9.0%',
      },
    ],
  },
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
      'Gram (Chana)': 5440,
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
        trendDiff: '+₹190 above MSP',
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
        trendDiff: '+₹145 above MSP',
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
        trendDiff: '+₹115 above MSP',
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
        trendDiff: '+₹130 above MSP',
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
        trendDiff: '+₹160 above MSP',
      },
    ],
  },
  schemes: [
    {
      id: 'sch-1',
      category: 'Subsidies',
      title: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
      benefits: [
        'Direct income support of ₹6,000 per year transferred directly to bank account.',
        'Disbursed in 3 equal four-monthly installments of ₹2,000 each via DBT.',
      ],
      eligibility: 'All landholding farmer families with cultivable land up to 2 hectares (Aadhaar & land records linked).',
      url: 'https://pmkisan.gov.in',
      portalName: 'pmkisan.gov.in',
      badge: 'Direct Benefit Transfer',
    },
    {
      id: 'sch-2',
      category: 'Crop Insurance',
      title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
      benefits: [
        'Comprehensive financial risk cover against yield losses from non-preventable natural risks.',
        'Nominal uniform premium: only 2% for Kharif crops, 1.5% for Rabi, and 5% for horticultural crops.',
      ],
      eligibility: 'All farmers growing notified crops in notified areas including sharecroppers and tenant farmers.',
      url: 'https://pmfby.gov.in',
      portalName: 'pmfby.gov.in',
      badge: 'Risk Cover',
    },
    {
      id: 'sch-3',
      category: 'Subsidies',
      title: 'SMAM: Kisan Agricultural Drone Subsidy',
      benefits: [
        '50% financial assistance (up to ₹5 Lakhs) for purchase of agricultural drones for spray & analytics.',
        '100% grant (up to ₹10 Lakhs) for KVKs, ICAR institutes, and State Agricultural Universities.',
      ],
      eligibility: 'Small & Marginal farmers, Women farmers, FPOs, and registered Custom Hiring Centers.',
      url: 'https://agrimachinery.nic.in',
      portalName: 'agrimachinery.nic.in',
      badge: '50% Subsidy',
    },
    {
      id: 'sch-4',
      category: 'Soil Management',
      title: 'Soil Health Card Scheme (SHC)',
      benefits: [
        'Free 12-parameter soil fertility assessment card issued every 2 years.',
        'Dosage recommendations for secondary nutrients, micronutrients, and bio-fertilizers to cut costs by 25%.',
      ],
      eligibility: 'All farmers possessing agricultural land holding in any state/UT across India.',
      url: 'https://soilhealth.dac.gov.in',
      portalName: 'soilhealth.dac.gov.in',
      badge: 'Free Testing',
    },
    {
      id: 'sch-5',
      category: 'Soil Management',
      title: 'PMKSY - Per Drop More Crop (Micro-Irrigation)',
      benefits: [
        'Up to 55% subsidy for Small/Marginal farmers to install Drip and Sprinkler irrigation systems.',
        'Conserves up to 40% water while increasing harvest crop yield by 20-30%.',
      ],
      eligibility: 'Farmers having assured water source and land title documents or long-term registered lease.',
      url: 'https://pmksy.gov.in',
      portalName: 'pmksy.gov.in',
      badge: 'Micro-Irrigation',
    },
    {
      id: 'sch-6',
      category: 'Subsidies',
      title: 'Kisan Credit Card (KCC) Scheme',
      benefits: [
        'Flexible collateral-free institutional credit up to ₹1.6 Lakhs (expandable to ₹3 Lakhs).',
        'Effective interest rate of only 4% per annum upon timely repayment of loans.',
      ],
      eligibility: 'Individual/joint borrowers, tenant farmers, oral lessees, and Self Help Groups of farmers.',
      url: 'https://www.myscheme.gov.in/schemes/kcc',
      portalName: 'myscheme.gov.in',
      badge: '4% Low Interest',
    },
  ],
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
      title: 'SEVERE WEATHER ALERT: Thunderstorm & Hail Warning',
      severity: 'high',
      validTill: 'Next 6 Hours (until 4:00 PM)',
      description: 'Localized squalls with gusts up to 55 km/h and isolated hail likely in Ludhiana & neighbouring districts. Farmers are strongly advised to postpone pesticide spraying and cover harvested produce at open APMC mandis.',
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
      { time: '08:00', temp: 27, rainProb: 20, icon: 'sunny' },
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
      { day: 'Day 14', rainfallMm: 4.8, prob: 35, date: '30 Sep' },
    ],
  },
  banners: [
    {
      id: 'ban-1',
      tag: 'CENTRAL GOVT SCHEME',
      title: '50% Subsidy on Kisan Ag-Drones',
      subtitle: 'Apply before Sep 30 under SMAM Portal. Approved for Spray & Soil Scan.',
      cta: 'Apply Under SMAM',
      targetHref: '/schemes',
      bgGradient: 'from-[#1a2b1d] via-[#152014] to-[#0f120c]',
      accentColor: 'text-[#8bcca2]',
      icon: '🚁',
    },
    {
      id: 'ban-2',
      tag: 'KHARIF HARVEST BONUS',
      title: 'Direct APMC Mandi Procurement Live',
      subtitle: 'Wheat & Basmati rates up to +₹190 above Central MSP. Instant DBT Transfer.',
      cta: 'Check Mandi Prices',
      targetHref: '/mandi',
      bgGradient: 'from-[#33250f] via-[#261e10] to-[#140f08]',
      accentColor: 'text-[#e8bf6a]',
      icon: '🌾',
    },
    {
      id: 'ban-3',
      tag: 'FERTILIZER ADVISORY',
      title: 'Free Digital Soil Health Card Update',
      subtitle: 'Calibrate NPK & Micronutrient dosage to increase crop yield by up to 28%.',
      cta: 'Update Soil Data',
      targetHref: '/soil-health',
      bgGradient: 'from-[#1a2b1d] via-[#152014] to-[#0f120c]',
      accentColor: 'text-[#8bcca2]',
      icon: '🧪',
    },
    {
      id: 'ban-4',
      tag: 'B2B MARKETPLACE',
      title: 'Bulk Grain Buyers Offering Cash Advances',
      subtitle: 'Verified millers looking for 1,500+ Qtl wheat & oilseeds in your district.',
      cta: 'View Buyer Enquiries',
      targetHref: '/b2b-hub',
      bgGradient: 'from-[#2a200e] via-[#1e1a0c] to-[#110e08]',
      accentColor: 'text-[#e8bf6a]',
      icon: '🚜',
    },
  ],
};

const AgriContext = createContext(null);

export function AgriProvider({ children }) {
  const [state, setState] = useState(defaultState);
  const [toasts, setToasts] = useState([]);
  const [callModal, setCallModal] = useState({ isOpen: false, data: null });
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('agrismart_app_state_v3');
      if (stored) {
        const parsed = JSON.parse(stored);
        setState((prev) => ({
          ...prev,
          ...parsed,
          auth: { ...prev.auth, ...(parsed.auth || {}) },
          location: { ...prev.location, ...(parsed.location || {}) },
          soil: { ...prev.soil, ...(parsed.soil || {}) },
          marketplace: {
            ...prev.marketplace,
            ...(parsed.marketplace || {}),
            buyerRequests: parsed.marketplace?.buyerRequests || prev.marketplace.buyerRequests,
            farmerListings: parsed.marketplace?.farmerListings || prev.marketplace.farmerListings,
          },
        }));
      }
    } catch (e) {
      console.warn('Failed to load local storage state:', e);
    }
    setMounted(true);
  }, []);

  // Supabase session & real-time sync (active if configured)
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    // Check active session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        getProfile(session.user.id).then(({ data: profile }) => {
          if (profile) {
            setState((prev) => ({
              ...prev,
              auth: {
                ...prev.auth,
                isLoggedIn: true,
                id: session.user.id,
                name: profile.name || prev.auth.name,
                email: profile.email || session.user.email || prev.auth.email,
                phone: profile.phone || prev.auth.phone,
                landArea: profile.land_area || prev.auth.landArea,
                mandiRegNumber: profile.mandi_reg_number || prev.auth.mandiRegNumber,
                avatar: profile.avatar_url || prev.auth.avatar,
                verified: profile.verified ?? prev.auth.verified,
              },
            }));
          }
        });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const { data: profile } = await getProfile(session.user.id);
        setState((prev) => ({
          ...prev,
          auth: {
            ...prev.auth,
            isLoggedIn: true,
            id: session.user.id,
            name: profile?.name || session.user.user_metadata?.full_name || prev.auth.name,
            email: session.user.email || prev.auth.email,
            phone: profile?.phone || prev.auth.phone,
            avatar: profile?.avatar_url || session.user.user_metadata?.avatar_url || prev.auth.avatar,
          },
        }));
      } else if (event === 'SIGNED_OUT') {
        setState((prev) => ({
          ...prev,
          auth: {
            ...prev.auth,
            isLoggedIn: false,
          },
        }));
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Save state on changes
  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (e) {
        console.warn('Failed to save state to localStorage:', e);
      }
    }
  }, [state, mounted]);

  const addToast = (message, type = 'success') => {
    setToasts((prev) => {
      // Don't show duplicates
      if (prev.some((t) => t.message === message)) return prev;
      const id = Date.now() + Math.random().toString();
      setTimeout(() => {
        setToasts((curr) => curr.filter((t) => t.id !== id));
      }, 2200);
      return [{ id, message, type }];
    });
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const openCallModal = (data) => {
    setCallModal({ isOpen: true, data });
  };

  const closeCallModal = () => {
    setCallModal({ isOpen: false, data: null });
  };

  // Actions
  const loginWithPhone = (phoneNumber) => {
    const clean = phoneNumber.replace(/\D/g, '');
    setState((prev) => ({
      ...prev,
      auth: {
        ...prev.auth,
        isLoggedIn: true,
        authProvider: 'phone',
        phone: clean,
        formattedPhone: `+91 ${clean.slice(0, 5)} ${clean.slice(5)}`,
      },
    }));
  };

  const loginWithGoogle = (userData = null) => {
    setState((prev) => ({
      ...prev,
      auth: {
        ...prev.auth,
        isLoggedIn: true,
        authProvider: 'google',
        name: userData?.name || prev.auth.name,
        email: userData?.email || prev.auth.email,
        avatar: userData?.avatar || prev.auth.avatar,
      },
    }));
  };

  const logout = () => {
    if (isSupabaseConfigured && supabase) {
      supabaseSignOut().catch(() => {});
    }
    setState((prev) => ({
      ...prev,
      auth: {
        ...prev.auth,
        isLoggedIn: false,
      },
    }));
  };

  const setLocation = (latOrObj, lon, district = 'Ludhiana', stateName = 'Punjab') => {
    // Support both setLocation(lat, lon, district, state) and setLocation({lat, lon, district, state, ...})
    let lat, finalDistrict, finalState, soilType, region, granted;
    if (typeof latOrObj === 'object' && latOrObj !== null) {
      lat = latOrObj.lat;
      lon = latOrObj.lon;
      finalDistrict = latOrObj.district || 'Ludhiana';
      finalState = latOrObj.state || 'Punjab';
      soilType = latOrObj.soilType;
      region = latOrObj.region;
      granted = latOrObj.granted !== undefined ? latOrObj.granted : true;
    } else {
      lat = latOrObj;
      finalDistrict = district;
      finalState = stateName;
      granted = true;
    }

    const isMH = finalDistrict.toLowerCase().includes('pune') || finalState.toLowerCase().includes('maharashtra');
    setState((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        granted: granted,
        lat: parseFloat(Number(lat).toFixed(4)),
        lon: parseFloat(Number(lon).toFixed(4)),
        district: finalDistrict,
        state: finalState,
        region: region || (isMH ? 'Western Agro-Climatic Zone' : 'North Agro-Climatic Zone'),
        soilType: soilType || (isMH ? 'Black Cotton Soil (Regur)' : 'Indo-Gangetic Alluvial Loam'),
        lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
      soil: {
        ...prev.soil,
        ph: isMH ? 7.4 : 6.9,
        nitrogen: isMH ? 180 : 220,
        phosphorus: isMH ? 32 : 42,
        potassium: isMH ? 310 : 285,
      },
    }));
  };

  const updateProfile = (profileData) => {
    setState((prev) => ({
      ...prev,
      auth: {
        ...prev.auth,
        ...profileData,
      },
    }));
    if (isSupabaseConfigured && supabase && state.auth?.id) {
      upsertProfile({
        id: state.auth.id,
        name: profileData.name || state.auth.name,
        email: profileData.email || state.auth.email,
        phone: profileData.phone || state.auth.phone,
        avatar_url: profileData.avatar || state.auth.avatar,
        land_area: profileData.landArea || state.auth.landArea,
        mandi_reg_number: profileData.mandiRegNumber || state.auth.mandiRegNumber,
        district: state.location.district,
        state: state.location.state,
      }).catch((err) => console.warn('Supabase profile sync warning:', err));
    }
    addToast('Farmer profile details updated successfully', 'success');
  };

  const markMessageAsRead = (messageId) => {
    setState((prev) => ({
      ...prev,
      messages: prev.messages.map((m) => (m.id === messageId ? { ...m, read: true } : m)),
    }));
  };

  const setMarketplaceCrop = (crop) => {
    setState((prev) => ({
      ...prev,
      marketplace: {
        ...prev.marketplace,
        selectedCrop: crop,
      },
    }));
  };

  const setMarketplaceTab = (tab) => {
    setState((prev) => ({
      ...prev,
      marketplace: {
        ...prev.marketplace,
        activeTab: tab,
      },
    }));
  };

  const addFarmerListing = (listing) => {
    const newListing = {
      id: 'fl-' + Date.now(),
      crop: state.marketplace.selectedCrop,
      farmerName: state.auth.name || 'Local Farmer',
      village: `${state.location.district} Rural`,
      harvestQuantity: Number(listing.harvestQuantity),
      sellingPrice: Number(listing.sellingPrice),
      phone: state.auth.formattedPhone || '+91 98765 43210',
      qualityGrade: listing.qualityGrade || 'FAQ Grade',
      moisture: listing.moisture || '11.0%',
    };
    setState((prev) => ({
      ...prev,
      marketplace: {
        ...prev.marketplace,
        farmerListings: [newListing, ...prev.marketplace.farmerListings],
      },
    }));
    if (isSupabaseConfigured && supabase && state.auth?.id) {
      createListing({
        user_id: state.auth.id,
        listing_type: 'sell',
        crop: state.marketplace.selectedCrop,
        quantity: Number(listing.harvestQuantity),
        price: Number(listing.sellingPrice),
        quality_grade: listing.qualityGrade || 'FAQ Grade',
        moisture: listing.moisture || '11.0%',
        phone: state.auth.formattedPhone || '+91 98765 43210',
        location: `${state.location.district}, ${state.location.state}`,
      }).catch((err) => console.warn('Supabase listing sync warning:', err));
    }
    addToast(`Broadcasted ${listing.harvestQuantity} Qtl ${state.marketplace.selectedCrop} harvest to all Mandi buyers!`, 'success');
    return newListing;
  };

  const addBuyerRequest = (request) => {
    const newRequest = {
      id: 'br-' + Date.now(),
      crop: state.marketplace.selectedCrop,
      buyerName: state.auth.name || 'Verified Trader',
      company: 'Local Procurement Desk',
      quantityNeeded: Number(request.quantityNeeded),
      targetPrice: Number(request.targetPrice),
      location: `${state.location.district} APMC`,
      phone: state.auth.formattedPhone || '+91 98765 43210',
      urgency: request.urgency || 'Active Requirement',
    };
    setState((prev) => ({
      ...prev,
      marketplace: {
        ...prev.marketplace,
        buyerRequests: [newRequest, ...prev.marketplace.buyerRequests],
      },
    }));
    if (isSupabaseConfigured && supabase && state.auth?.id) {
      createListing({
        user_id: state.auth.id,
        listing_type: 'buy',
        crop: state.marketplace.selectedCrop,
        quantity: Number(request.quantityNeeded),
        price: Number(request.targetPrice),
        urgency: request.urgency || 'Active Requirement',
        phone: state.auth.formattedPhone || '+91 98765 43210',
        location: `${state.location.district} APMC`,
      }).catch((err) => console.warn('Supabase request sync warning:', err));
    }
    addToast(`Buyer procurement order posted for ${request.quantityNeeded} Qtl ${state.marketplace.selectedCrop}!`, 'success');
    return newRequest;
  };

  const saveSoilProfile = (soilData) => {
    setState((prev) => ({
      ...prev,
      soil: {
        ...prev.soil,
        nitrogen: Number(soilData.nitrogen),
        phosphorus: Number(soilData.phosphorus),
        potassium: Number(soilData.potassium),
        ph: parseFloat(Number(soilData.ph).toFixed(2)),
        organicCarbon: parseFloat(Number(soilData.organicCarbon).toFixed(2)),
        electricalConductivity: parseFloat(Number(soilData.electricalConductivity).toFixed(2)),
        testedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      },
    }));
    if (isSupabaseConfigured && supabase && state.auth?.id) {
      saveSoilData(state.auth.id, {
        nitrogen: Number(soilData.nitrogen),
        phosphorus: Number(soilData.phosphorus),
        potassium: Number(soilData.potassium),
        ph: parseFloat(Number(soilData.ph).toFixed(2)),
        organic_carbon: parseFloat(Number(soilData.organicCarbon).toFixed(2)),
        electrical_conductivity: parseFloat(Number(soilData.electricalConductivity).toFixed(2)),
      }).catch((err) => console.warn('Supabase soil sync warning:', err));
    }
    addToast('Soil Health Profile updated & N-P-K recalibrated!', 'success');
  };

  const resetAll = () => {
    setState(JSON.parse(JSON.stringify(defaultState)));
    localStorage.removeItem(STORAGE_KEY);
    addToast('Reset application data to sample default state', 'info');
  };

  const unreadMessagesCount = state.messages.filter((m) => !m.read).length;

  return (
    <AgriContext.Provider
      value={{
        ...state,
        unreadMessagesCount,
        isSupabaseConfigured,
        loginWithPhone,
        loginWithGoogle,
        logout,
        setLocation,
        updateProfile,
        markMessageAsRead,
        setMarketplaceCrop,
        setMarketplaceTab,
        addFarmerListing,
        addBuyerRequest,
        saveSoilProfile,
        resetAll,
        addToast,
        openCallModal,
        closeCallModal,
        callModal,
        toasts,
        removeToast,
      }}
    >
      {children}
    </AgriContext.Provider>
  );
}

export function useAgri() {
  const context = useContext(AgriContext);
  if (!context) {
    throw new Error('useAgri must be used within an AgriProvider');
  }
  return context;
}

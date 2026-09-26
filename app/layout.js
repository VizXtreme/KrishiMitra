import './globals.css';
import { AgriProvider } from '@/context/AgriContext';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import BottomNav from '@/components/BottomNav';
import CallModal from '@/components/CallModal';
import ToastContainer from '@/components/ToastContainer';
import ServiceWorkerRegistrar from '@/components/ServiceWorkerRegistrar';
import InstallPwaBanner from '@/components/InstallPwaBanner';
import FloatingAiButton from '@/components/FloatingAiButton';

export const metadata = {
  title: 'KrishiMitra — Kisan Advisory & B2B Mandi Platform',
  description: 'Real-time APMC Mandi prices, AI crop recommendations, weather alerts, soil health cards, government schemes, and B2B grain trading hub for Indian farmers.',
  manifest: '/manifest.json',
  icons: {
    icon: '/icon-192.png',
    apple: '/icon-192.png',
  },
  keywords: 'agriculture, krishimitra, mandi prices, crop recommendation, weather, soil health, B2B marketplace, farmer, kisan, APMC',
  authors: [{ name: 'KrishiMitra Team' }],
  openGraph: {
    title: 'KrishiMitra — Kisan Advisory & B2B Mandi',
    description: 'Real-time APMC Mandi prices, AI crop advisory, weather alerts, and B2B grain trading for Indian farmers.',
    type: 'website',
    locale: 'en_IN',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: '#2e7d52',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark h-full bg-[#111110]">
      <head>
        <meta name="theme-color" content="#2e7d52" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="h-full bg-[#111110] text-[#ede9e3] flex flex-col antialiased selection:bg-[#2e7d52] selection:text-white overflow-x-hidden">
        {/* Accessible Skip Link */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-[#2e7d52] focus:text-white focus:rounded-xl focus:shadow-2xl focus:outline-none focus:ring-2 focus:ring-white font-medium"
        >
          Skip to main content
        </a>

        <AgriProvider>
          {/* PWA Service Worker Registration & Install Banner */}
          <ServiceWorkerRegistrar />
          <InstallPwaBanner />

          {/* Responsive Shell: Mobile centered container, Desktop full-width max-w-7xl with persistent Sidebar */}
          <div className="flex-1 flex flex-col w-full min-h-screen bg-[#111110] text-[#ede9e3] relative">
            <div className="w-full max-w-7xl mx-auto flex flex-1 min-h-screen bg-[#191917] border-x border-[#2d2b27]/40 shadow-2xl">
              {/* Desktop Persistent Left Navigation */}
              <Sidebar />

              {/* Main App Content Viewport */}
              <div className="flex-1 flex flex-col min-w-0 w-full">
                <Header />
                <main id="main-content" className="flex-1 w-full flex flex-col pb-20 lg:pb-8 overflow-x-hidden animate-fade-in">
                  {children}
                </main>
              </div>
            </div>

            {/* Mobile Bottom Navigation */}
            <BottomNav />
          </div>

          <CallModal />
          <ToastContainer />
          <FloatingAiButton />
        </AgriProvider>
      </body>
    </html>
  );
}

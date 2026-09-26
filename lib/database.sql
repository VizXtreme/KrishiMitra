-- ============================================
-- KrishiMitra Database Schema for Supabase
-- ============================================
-- Run this SQL in your Supabase SQL Editor:
-- Dashboard → SQL Editor → New Query → Paste & Run
-- ============================================

-- 1. Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  phone TEXT,
  email TEXT,
  avatar_url TEXT,
  land_area TEXT,
  mandi_reg_number TEXT,
  district TEXT DEFAULT 'Ludhiana',
  state TEXT DEFAULT 'Punjab',
  latitude DECIMAL(10, 4),
  longitude DECIMAL(10, 4),
  soil_type TEXT,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, phone, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.email, ''),
    COALESCE(NEW.phone, ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 2. Soil Health Data table
CREATE TABLE IF NOT EXISTS public.soil_health (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  nitrogen INTEGER DEFAULT 220,
  phosphorus INTEGER DEFAULT 42,
  potassium INTEGER DEFAULT 285,
  ph DECIMAL(4, 2) DEFAULT 6.90,
  organic_carbon DECIMAL(4, 2) DEFAULT 0.68,
  electrical_conductivity DECIMAL(4, 2) DEFAULT 0.78,
  sample_id TEXT,
  lab_name TEXT,
  tested_date DATE,
  status TEXT DEFAULT 'Optimal for Cereal & Pulses',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.soil_health ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own soil data" ON public.soil_health
  FOR ALL USING (auth.uid() = user_id);


-- 3. Marketplace Listings table (both farmer sell & buyer requests)
CREATE TABLE IF NOT EXISTS public.marketplace_listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  listing_type TEXT NOT NULL CHECK (listing_type IN ('sell', 'buy')),
  crop TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price INTEGER NOT NULL,
  quality_grade TEXT,
  moisture TEXT,
  urgency TEXT,
  company TEXT,
  location TEXT,
  phone TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.marketplace_listings ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read listings
CREATE POLICY "Authenticated users can read listings" ON public.marketplace_listings
  FOR SELECT TO authenticated USING (TRUE);

-- Users can manage their own listings
CREATE POLICY "Users can manage own listings" ON public.marketplace_listings
  FOR ALL USING (auth.uid() = user_id);


-- 4. Messages / Buyer Inquiries table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  recipient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  buyer_name TEXT NOT NULL,
  company TEXT,
  crop TEXT NOT NULL,
  quantity INTEGER,
  offered_price INTEGER,
  phone TEXT,
  status TEXT DEFAULT 'Standard',
  badge_color TEXT DEFAULT 'gray',
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Users can read their own messages
CREATE POLICY "Users can read own messages" ON public.messages
  FOR SELECT USING (auth.uid() = recipient_id);

-- Users can update their own messages (mark as read)
CREATE POLICY "Users can update own messages" ON public.messages
  FOR UPDATE USING (auth.uid() = recipient_id);

-- Any authenticated user can send messages
CREATE POLICY "Authenticated users can send messages" ON public.messages
  FOR INSERT TO authenticated WITH CHECK (TRUE);


-- 5. Updated-at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply auto-update triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_soil_health_updated_at
  BEFORE UPDATE ON public.soil_health
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_listings_updated_at
  BEFORE UPDATE ON public.marketplace_listings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

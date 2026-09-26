import { createClient } from '@supabase/supabase-js';

// Supabase Configuration
// ----------------------
// To connect to your Supabase project:
// 1. Go to https://supabase.com and create a project
// 2. Copy your project URL and anon key from Settings → API
// 3. Create a .env.local file in the project root with:
//    NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
//    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
//
// The app works in DEMO MODE without Supabase (uses localStorage).

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Check if Supabase is configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

// Create Supabase client (only if configured)
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

// ========================================
// Auth Helpers
// ========================================

/**
 * Sign in with Phone OTP (sends SMS)
 * @param {string} phone - 10-digit Indian mobile number
 */
export async function signInWithPhone(phone) {
  if (!supabase) return { data: null, error: { message: 'Demo mode - Supabase not configured' } };
  
  const { data, error } = await supabase.auth.signInWithOtp({
    phone: `+91${phone}`,
  });
  return { data, error };
}

/**
 * Verify Phone OTP
 * @param {string} phone - 10-digit Indian mobile number
 * @param {string} token - 6-digit OTP code
 */
export async function verifyPhoneOtp(phone, token) {
  if (!supabase) return { data: null, error: null };
  
  const { data, error } = await supabase.auth.verifyOtp({
    phone: `+91${phone}`,
    token,
    type: 'sms',
  });
  return { data, error };
}

/**
 * Sign in with Google OAuth
 */
export async function signInWithGoogle() {
  if (!supabase) return { data: null, error: { message: 'Demo mode - Supabase not configured' } };
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/location`,
    },
  });
  return { data, error };
}

/**
 * Sign out current user
 */
export async function signOut() {
  if (!supabase) return { error: null };
  const { error } = await supabase.auth.signOut();
  return { error };
}

/**
 * Get current authenticated session
 */
export async function getSession() {
  if (!supabase) return { data: { session: null }, error: null };
  return await supabase.auth.getSession();
}

/**
 * Get current user profile
 */
export async function getCurrentUser() {
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// ========================================
// Database Helpers
// ========================================

/**
 * Upsert user profile in the profiles table
 */
export async function upsertProfile(profileData) {
  if (!supabase) return { data: null, error: null };
  
  const { data, error } = await supabase
    .from('profiles')
    .upsert(profileData, { onConflict: 'id' })
    .select()
    .single();
  return { data, error };
}

/**
 * Get user profile by ID
 */
export async function getProfile(userId) {
  if (!supabase) return { data: null, error: null };
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
}

/**
 * Save soil health data
 */
export async function saveSoilData(userId, soilData) {
  if (!supabase) return { data: null, error: null };
  
  const { data, error } = await supabase
    .from('soil_health')
    .upsert({ user_id: userId, ...soilData }, { onConflict: 'user_id' })
    .select()
    .single();
  return { data, error };
}

/**
 * Get soil health data for a user
 */
export async function getSoilData(userId) {
  if (!supabase) return { data: null, error: null };
  
  const { data, error } = await supabase
    .from('soil_health')
    .select('*')
    .eq('user_id', userId)
    .single();
  return { data, error };
}

/**
 * Create a marketplace listing (farmer sell or buyer request)
 */
export async function createListing(listingData) {
  if (!supabase) return { data: null, error: null };
  
  const { data, error } = await supabase
    .from('marketplace_listings')
    .insert(listingData)
    .select()
    .single();
  return { data, error };
}

/**
 * Get marketplace listings with optional filters
 */
export async function getListings({ crop, type, limit = 20 } = {}) {
  if (!supabase) return { data: [], error: null };
  
  let query = supabase
    .from('marketplace_listings')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (crop) query = query.eq('crop', crop);
  if (type) query = query.eq('listing_type', type);
  
  const { data, error } = await query;
  return { data: data || [], error };
}

/**
 * Get buyer messages/inquiries for a user
 */
export async function getMessages(userId) {
  if (!supabase) return { data: [], error: null };
  
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('recipient_id', userId)
    .order('created_at', { ascending: false });
  return { data: data || [], error };
}

/**
 * Mark a message as read
 */
export async function markMessageRead(messageId) {
  if (!supabase) return { data: null, error: null };
  
  const { data, error } = await supabase
    .from('messages')
    .update({ read: true })
    .eq('id', messageId)
    .select()
    .single();
  return { data, error };
}

export default supabase;

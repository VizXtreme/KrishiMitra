# 🌾 KrishiMitra — Supabase Backend Setup Guide (SIH Hackathon)

This guide shows you how to connect **Supabase** (PostgreSQL cloud database & authentication) to KrishiMitra in under 3 minutes with **zero backend coding required**.

---

## ⚡ Quick 3-Step Setup

### Step 1: Create a Free Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and click **"Start your project"** (Sign in with GitHub or email).
2. Click **"New project"**.
3. Choose a name (e.g. `KrishiMitra-SIH`), set a database password (remember this password), and choose the region closest to you (e.g. `South Asia (Mumbai)`).
4. Click **"Create new project"** (takes ~1-2 minutes to initialize).

---

### Step 2: Run the Database Schema (1-Click)
1. In your Supabase project dashboard, click on **SQL Editor** in the left sidebar (the icon that looks like `>_`).
2. Click **"New query"**.
3. Open the file [`lib/database.sql`](file:///d:/AgriSmart/lib/database.sql) from this project.
4. Copy the entire contents of `database.sql` and paste it into the Supabase SQL Editor.
5. Click **"Run"** (or press `Ctrl+Enter`).
6. You will see `Success. No rows returned`. All 4 tables, Row Level Security (RLS) policies, and triggers are now active!

---

### Step 3: Add Credentials to KrishiMitra
1. In Supabase, click on **Project Settings** (gear icon at the bottom of the left sidebar).
2. Click on **API** under Configuration.
3. You will see:
   - **Project URL**: `https://xxxxxxxxxxxx.supabase.co`
   - **Project API keys** -> `anon` / `public`: `eyJhbGciOi...`
4. In your project root (`d:\AgriSmart`), create a file named `.env.local` (or copy `.env.example`):
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-here
   ```
5. Restart your dev server (`npm run dev`) or build for production (`npm run build`).
6. That's it! KrishiMitra will automatically detect the credentials and switch from **Local Demo Mode** to **Supabase Cloud Active**!

---

## 🗄️ Database Architecture (For SIH Judges)

KrishiMitra utilizes PostgreSQL on Supabase with Row Level Security (RLS) ensuring enterprise-grade data protection:

| Table | Description | RLS Policy |
|---|---|---|
| `profiles` | Farmer profile, land area, APMC registration number, coordinates, soil type | Users can read & update their own profile |
| `soil_health` | Lab N-P-K readings, pH, organic carbon, electrical conductivity, card ID | Protected per farmer ID |
| `marketplace_listings` | B2B dual-market: farmer harvest lots for sale & buyer procurement requests | Authenticated users can browse all; sellers edit only their lots |
| `messages` | Direct APMC buyer bids, price counteroffers, contact details | Recipient and sender restricted |

---

## 🛡️ Fallback Demo Mode (Zero Risk during Hackathon)

If you don't have internet access during a judging demo or don't want to set up Supabase right away:
- KrishiMitra has a **full built-in offline demo mode**!
- All features (Crop AI, Mandi rates, B2B Hub, Soil Card, Profile, Weather) persist seamlessly using local browser storage.
- You can freely present without worrying about network lag or third-party outages.

---

## 📱 Progressive Web App (PWA) Mobile Features

- **Installable on any mobile phone**:
  - **Android (Chrome/Edge)**: Tap the "Install Web App" banner or browser menu "Install App".
  - **iOS (Safari)**: Tap Share icon -> "Add to Home Screen".
- **Offline Service Worker (`sw.js`)**: Caches static assets, stylesheets, and shell for offline resilience.
- **Fast First Load**: Shared bundle is lean (< 88 kB), compliant with 2G/3G rural Indian mobile networks.

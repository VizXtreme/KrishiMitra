# AgriSmart - Android APK & Mobile Installation Guide

This guide provides 3 distinct methods to run and install **AgriSmart** as an Android App (.apk):

---

## Method 1: Instant 1-Click Mobile Installation (PWA APK) - Recommended

AgriSmart is already configured as a **Progressive Web App (PWA)** with a `manifest.json` and `sw.js` Service Worker. On Android, this behaves identical to an APK without needing manual installation permissions:

1. Connect your Android phone to the **same Wi-Fi or Mobile Hotspot** as your PC.
2. Open Chrome or your mobile browser.
3. Scan the **QR Code** on your PC screen or open:
   👉 **`http://10.54.0.247:8080`**
4. Chrome will display a banner at the bottom: **"Add AgriSmart to Home screen"** or **"Install App"**.
   *(If not shown automatically, tap the 3 dots menu ⋮ at the top right of Chrome and select **"Add to Home screen"** / **"Install App"**)*.
5. **Result**: An **AgriSmart** app icon appears on your Android phone's home screen. When you tap it, it launches full-screen with no browser address bar, exactly like an APK!

---

## Method 2: Convert to Standalone `.apk` using 1-Click Free Web-to-APK Builders

If you need a physical `.apk` file to share over WhatsApp or Bluetooth:

1. **PWABuilder (Official Microsoft Open Source PWA to APK)**:
   - Visit: [https://www.pwabuilder.com](https://www.pwabuilder.com)
   - Paste your app link or upload the project folder.
   - Click **"Package for Android"**.
   - Download the signed `AgriSmart.apk` file.

2. **WebIntoApp**:
   - Visit: [https://www.webintoapp.com](https://www.webintoapp.com)
   - Select "HTML / Files" (zip this folder) or enter your network URL.
   - App Name: `AgriSmart`
   - Package Name: `com.agrismart.kisan`
   - Click **"Generate APK"** & Download.

---

## Method 3: Native Android Studio WebView Project

Included in this folder:
- `AndroidManifest.xml` (With INTERNET, ACCESS_FINE_LOCATION, and CALL_PHONE permissions)
- `MainActivity.java` (WebView with JavaScript, Geolocation, and phone calling enabled)
- `build.gradle`

To build:
1. Open Android Studio.
2. Create New Project &rarr; "Empty Views Activity".
3. Replace `MainActivity.java` and `AndroidManifest.xml` with the templates in this folder.
4. Set the WebView URL to your hosted link or place the web files inside `app/src/main/assets/`.
5. Select **Build &rarr; Build Bundle(s) / APK(s) &rarr; Build APK(s)**.
6. The compiled `app-debug.apk` will be in `app/build/outputs/apk/debug/`.

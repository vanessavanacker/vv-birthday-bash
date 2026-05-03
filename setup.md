# Bruges & Côte d'Azur Trip App — Setup Guide

This guide takes about 15–20 minutes and requires no coding.
After completing it you'll have a live URL to share with guests, a dashboard to manage submissions,
a live activity editor, and the ability to send push notifications.

---

## STEP 1 — Create a free Firebase project (5 mins)

Firebase stores all your guest submissions and lets the organiser edit activities live.

1. Go to **https://console.firebase.google.com**
2. Click **"Add project"** → name it `bruges-trip-2026` → click through to create it
3. Once created, click the **Web icon `</>`** to add a web app
4. Give it a nickname (e.g. `trip-app`) → click **"Register app"**
5. You'll see a code block containing your `firebaseConfig`. **Copy it** — it looks like:
   ```js
   const firebaseConfig = {
     apiKey: "AIza...",
     authDomain: "bruges-trip-2026.firebaseapp.com",
     databaseURL: "https://bruges-trip-2026-default-rtdb.firebaseio.com",
     projectId: "bruges-trip-2026",
     storageBucket: "bruges-trip-2026.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123..."
   };
   ```
6. In the Firebase console sidebar, go to **Build → Realtime Database** → click **"Create database"**
7. Choose **"Start in test mode"** (allows all reads/writes — fine for a private trip tool) → click **Enable**

---

## STEP 2 — Paste your Firebase config into index.html (2 mins)

1. Open `index.html` in any text editor (Notepad on Windows, TextEdit on Mac, or VS Code)
2. Find the section near the top that says:
   ```
   const FIREBASE_CONFIG = {
     apiKey: "",
     ...
   ```
3. Replace the empty strings with the values from Step 1. For example:
   ```js
   const FIREBASE_CONFIG = {
     apiKey:            "AIza...",
     authDomain:        "bruges-trip-2026.firebaseapp.com",
     databaseURL:       "https://bruges-trip-2026-default-rtdb.firebaseio.com",
     projectId:         "bruges-trip-2026",
     storageBucket:     "bruges-trip-2026.appspot.com",
     messagingSenderId: "123456789",
     appId:             "1:123..."
   };
   ```
4. (Optional) Change the organiser password from `bruges2026` to something of your choice:
   ```js
   const ORG_PASSWORD = 'YourPasswordHere';
   ```
5. Save the file.

---

## STEP 3 — Deploy to Netlify (3 mins)

Netlify gives you a free live URL (like `https://bruges-trip-abc123.netlify.app`).

1. Go to **https://netlify.com** and sign up for a free account
2. From your dashboard, click **"Add new site" → "Deploy manually"**
3. **Drag the entire `bruges-trip` folder** onto the upload area
4. Wait ~10 seconds — Netlify will give you a URL like `https://your-site-name.netlify.app`
5. (Optional) Click **"Site configuration → Change site name"** to get a prettier URL
   like `https://bruges2026.netlify.app`

✅ **You're live!** Share this URL with your guests.

> **To update the site later:** Make your changes to `index.html`, then go back to Netlify,
> go to **Deploys → drag a new folder** to re-deploy. Takes 10 seconds. All guest data
> (stored in Firebase) is unaffected.

---

## STEP 4 — Set up push notifications with OneSignal (5 mins, optional)

OneSignal lets you send push notifications to guests' phones from a simple dashboard.

1. Go to **https://onesignal.com** and create a free account
2. Click **"New App/Website"** → name it `Bruges Trip 2026`
3. Select **"Web"** as the platform
4. Fill in:
   - **Site URL**: your Netlify URL (e.g. `https://bruges2026.netlify.app`)
   - **Site Name**: `Bruges & Côte d'Azur 2026`
   - **Default Notification Icon**: skip for now
5. Click **"Save & Continue"** → **"Finish"**
6. Copy your **OneSignal App ID** from the dashboard
7. Go to **Settings → Keys & IDs** → copy the **REST API Key**

### Add to your app:
Either paste them directly into `index.html`:
```js
let ONESIGNAL_APP_ID  = "your-app-id-here";
let ONESIGNAL_API_KEY = "your-rest-api-key-here";
```
...and re-deploy to Netlify.

OR enter them in the **Organiser Dashboard → Push Alerts** tab — they'll be saved locally
in that browser session.

### Sending a push notification:
- From the app: go to **Organiser → Push Alerts → Send a Push Notification**
- Or directly from the OneSignal dashboard under **Messages → New Push**

---

## STEP 5 — Install as a phone app (optional)

### On iPhone (Safari):
1. Open the site URL in Safari
2. Tap the **Share button** (box with arrow pointing up)
3. Scroll down and tap **"Add to Home Screen"**
4. Name it `Trip 2026` → tap **Add**

### On Android (Chrome):
1. Open the site URL in Chrome
2. Tap the **three-dot menu** → **"Add to Home Screen"** or **"Install App"**
3. Tap **Add**

The app will appear on the home screen with a dark icon and opens full-screen,
just like a native app.

---

## STEP 6 — Future native app (React Native)

When you're ready to publish to the App Store / Google Play, the codebase
is fully portable to **React Native** or **Expo**. The main additions needed:
- Swap Firebase web SDK for `@react-native-firebase/app` and `@react-native-firebase/database`
- Replace Web Push with `expo-notifications` (built-in Expo SDK)
- Add `react-navigation` for tabs

This is a future step — the PWA installed via "Add to Home Screen" works
identically for guests in the meantime.

---

## Editing the activity schedule

Once deployed, you can edit the schedule from anywhere:

1. Open the app URL
2. Click **Organiser** tab
3. Enter the password
4. Go to **Edit Schedule** tab
5. Click ✏️ next to any activity to edit it, or **+ Add** to create a new one
6. Click **💾 Save & Publish**

All guests who have the page open will see a banner saying the schedule was updated.
Anyone who opens it fresh gets the new version automatically.

---

## File structure

```
bruges-trip/
├── index.html              ← main app (edit Firebase config here)
├── manifest.json           ← PWA config
├── sw.js                   ← service worker (offline + push)
├── OneSignalSDKWorker.js   ← OneSignal push worker
├── icons/
│   ├── icon-192.png        ← app icon
│   └── icon-512.png        ← app icon (large)
└── setup.md                ← this file
```

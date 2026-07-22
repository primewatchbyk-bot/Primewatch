# Deployment Checklist for PrimeWatch by Kayode

This project is fully configured for zero-config one-click deployment on **Vercel** or any standard static/Node web host.

---

## 🚀 Pre-Launch Setup Checklist for Kayode

1. **Verify WhatsApp Contact Number**
   - Log into the **Admin Dashboard** (via discreet link in footer or password entry `kayode2026`).
   - Go to the **Settings** tab.
   - Enter your real WhatsApp phone number with country code (e.g., `2348123456789` for Nigeria without `+`).

2. **Update Social & Location Details**
   - Update your Instagram (`@primewatch_by_kayode`), TikTok, Email, Showroom location, and Business Hours.

3. **Change Admin Password**
   - In **Admin Dashboard > Settings**, update the default password (`kayode2026`) to your custom private password.

4. **Upload Real Watch Catalog & Photos**
   - In **Admin Dashboard > Products**, edit existing items or add your real stock.
   - You can upload high-resolution photos directly from your phone/computer (they are compressed automatically in-browser for fast loading).

---

## ⚡ Deployment Instructions to Vercel

### Option A: Import from GitHub (Recommended)
1. Push this project repository to your GitHub account (`git push origin main`).
2. Log into [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Select your `primewatch-by-kayode` repository.
4. Framework Preset will automatically detect **Vite**.
5. Click **Deploy**. Vercel will build and assign your live URL (e.g., `primewatchbykayode.vercel.app`).

### Option B: Deploy via Vercel CLI
```bash
npm install -g vercel
vercel
```

---

## 🛡️ Technical Architecture Notes
- **Framework**: Vite + React 19 with Tailwind CSS v4.
- **Data Persistence**: LocalStorage with auto-retry write safety.
- **Media**: In-browser Canvas image compression (~1200px max width JPEG encoding) + external image URL support.
- **Routing**: Client-side view state machine with full mobile-first drawer support.

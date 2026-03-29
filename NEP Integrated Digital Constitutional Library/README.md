# NEP Integrated Digital Constitutional Library
**Created by Dr. Mateen Yousuf**  
Teacher — School Education Department, Jammu & Kashmir

---

## About
A structured offline Progressive Web App (PWA) containing official policy documents from:
- NEP 2020
- NCF 2023
- NIPUN Bharat
- PARAKH
- Samagra Shiksha
- NCERT Position Papers
- UGC Regulations
- NIEPA Governance Texts
- SCERT J&K Academic Framework
- JKBOSE Examination Framework

---

## File Structure
```
nep-library/
├── index.html          ← Complete app (single file)
├── manifest.json       ← PWA manifest
├── service-worker.js   ← Offline caching
├── mateen.jpg          ← Author photo
└── README.md           ← This file
```

---

## How to Run Locally

### Option 1 — VS Code Live Server (Recommended)
1. Open the `nep-library` folder in VS Code
2. Install "Live Server" extension
3. Right-click `index.html` → **Open with Live Server**
4. App opens at `http://127.0.0.1:5500`

### Option 2 — Python Local Server
```bash
cd nep-library
python3 -m http.server 8080
# Open: http://localhost:8080
```

### Option 3 — Node.js
```bash
npx serve nep-library
# Open the URL shown in terminal
```

> ⚠️ Do NOT open `index.html` directly as a file:// URL — the service worker requires HTTP/HTTPS.

---

## Install as Mobile App (PWA)

**Android (Chrome):**
1. Open the app URL in Chrome
2. Tap ⋮ Menu → "Add to Home Screen"
3. App installs like a native app, works offline

**Desktop (Chrome/Edge):**
1. Open the URL
2. Click the install icon (⊕) in the address bar
3. Click "Install"

---

## How to Host for Free

### GitHub Pages
```bash
git init
git add .
git commit -m "NEP Library"
git remote add origin https://github.com/YOUR_USERNAME/nep-library.git
git push -u origin main
# Enable GitHub Pages in Settings → Pages → Branch: main
```

### Netlify
1. Go to [netlify.com](https://netlify.com)
2. Drag and drop the `nep-library` folder
3. Your app is live instantly

### Cloudflare Pages
1. Go to [pages.cloudflare.com](https://pages.cloudflare.com)
2. Connect GitHub repo or upload directly
3. Deploy

---

## Features
- ✅ Fully offline after first load
- ✅ Installable as Android/Desktop app
- ✅ Global search across all documents
- ✅ Bookmarking with localStorage
- ✅ Dark mode toggle
- ✅ Reading progress indicator
- ✅ Responsive (mobile, tablet, desktop)
- ✅ Print-friendly
- ✅ No external APIs, no backend
- ✅ SVG diagrams (5+3+3+4, Assessment Cycle, Governance Pyramid)
- ✅ Constitutional institutional design theme

---

*A Structured Digital Library of India's Education Reform Architecture*

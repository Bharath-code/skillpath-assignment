# Skillpath — Avant-Garde Creator Learning Platform

> A production-grade landing page and Framer React Code Component built for the Junior Frontend Developer role assignment.

[![Framer Live](https://img.shields.io/badge/Framer-Live_Demo-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://wise-status-853448.framer.app/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Bharath-code/skillpath-assignment)

---

## 🔗 Submission Links

- **Published Framer URL:** [https://wise-status-853448.framer.app/](https://wise-status-853448.framer.app/)
- **GitHub Repository:** [https://github.com/Bharath-code/skillpath-assignment](https://github.com/Bharath-code/skillpath-assignment)
- **Compliance Verification Checklist:** [`ASSIGNMENT_CHECKLIST.md`](./ASSIGNMENT_CHECKLIST.md)
- **Submission Reflection Notes:** [`SUBMISSION_NOTES.md`](./SUBMISSION_NOTES.md)
- **Complete AI Chat History Transcript:** [`CHAT_HISTORY.md`](./CHAT_HISTORY.md)

---

## 🎨 Design Philosophy: Swiss Editorial Brutalism

The interface rejects generic purple gradient templates in favor of **Swiss Editorial Brutalism & Tactical Monochrome**:

- **Typography:** High-editorial **Instrument Serif** display headlines paired with **Space Mono** technical metadata and **Plus Jakarta Sans** body copy.
- **Palette:** Deep Void Charcoal (`#0B0C10`) canvas with high-voltage **Acid Lime** (`#CCFF00`) accents and `#F4F4F0` Alabaster text.
- **Visual Texture:** Grid-line background architecture with sharp, tactile offset box shadows.

---

## ⚡ Technical Architecture & Key Features

### 1. Isolated Dual-Endpoint Fetching & Error Handling
The backend API (`https://syncsphere-hiv6.onrender.com`) is deliberately flaky (approx. 1 in 3 requests fail with HTTP 404 or 500).
- **Independent Endpoint Execution:** Uses `Promise.allSettled` to isolate `/assignment/course-data` from `/assignment/country-code`.
- **API Error Detail Parsing:** Reads JSON error payloads (`{"detail": "this aint working dawg"}` or `{"detail": "FAAAAAAAAAAA"}`) and surfaces exact server messages inside an accessible error boundary.
- **Graceful Country API Fallback:** If `/country-code` fails while `/course-data` succeeds, the catalog **does NOT crash**; it silently defaults tuition to INR (`pricePaise`) and displays a non-intrusive warning tag (`COUNTRY_API_OFFLINE`).

### 2. Precise Currency Math & Formatting
- **Rupees (`pricePaise`):** `199900` paise $\div 100 =$ `₹1,999` (formatted via `Intl.NumberFormat('en-IN')`).
- **Dollars (`priceUsdCents`):** `3999` cents $\div 100 =$ `$39.99` (formatted via `Intl.NumberFormat('en-US')`).

### 3. State Machine Architecture
Uses a discriminated union type (`FetchState`) to eliminate boolean state soup:
```typescript
type FetchState =
  | { status: "loading" }
  | { status: "error"; message: string; apiDetail?: string; statusCode?: number }
  | { status: "success"; data: Course[] }
```

### 4. Framer Property Controls
Registered via Framer's `addPropertyControls` API:
- `accentColor`: Color control for primary button and badge themes (`#CCFF00`).
- `showRefundableBadge`: Boolean toggle for displaying the green "Refundable" tag.

### 5. Mobile Responsiveness & WCAG AAA Accessibility
- **Responsive Grid:** 3 columns on Desktop (`lg:grid-cols-3`), 2 on Tablet (`md:grid-cols-2`), 1 on Mobile (`grid-cols-1`).
- **Accessibility:** Text contrast ratio exceeding 15:1, `focus-visible` focus rings for keyboard navigation, and minimum 44px touchscreen tap targets (`min-h-[44px]`).

---

## 📁 Repository Structure

```
ankur-warriko-assignment/
├── ASSIGNMENT_CHECKLIST.md           # 7-part requirement verification checklist
├── SUBMISSION_NOTES.md               # 200-word reflection & live-coding defense guide
├── CHAT_HISTORY.md                   # Full AI transcript log
├── assignment.md                     # Original assignment requirements prompt
├── index.html                        # Google Fonts (Instrument Serif & Space Mono)
├── package.json                      # Dependencies & build scripts
├── tailwind.config.js                # Swiss Editorial design system configuration
├── vite.config.ts                    # Vite build config with Framer externalization
└── src/
    ├── App.tsx                       # Main page layout & tactical navigation header
    ├── index.css                     # Grid lines & tactile offset utilities
    ├── components/
    │   ├── HeroSection.tsx           # Editorial serif headline & hero section
    │   ├── SkillpathCourses.tsx      # Accessible course catalog grid
    │   └── FooterSection.tsx         # Monospace footer section
    ├── hooks/
    │   └── useCourseCatalog.ts       # Extracted custom hook for state & fetching logic
    └── framer/
        ├── SkillpathCoursesFramer.tsx   # Framer grid Code Component
        └── SkillpathLandingPageFramer.tsx # Unified full landing page Framer component
```

---

## 🚀 Local Setup & Running Locally

1. **Clone the repository:**
   ```bash
   git clone git@github.com:Bharath-code/skillpath-assignment.git
   cd skillpath-assignment
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start local dev server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

4. **Verify TypeScript & Production Build:**
   ```bash
   npm run build
   ```

---

## 📋 Developer Reflection (< 200 words)

> **What I'd fix with two more days:** I would implement a client-side caching mechanism (Stale-While-Revalidate with localStorage) so previously loaded courses display instantly while background revalidations fire. I would also add card entrance stagger animations using Framer Motion and an interactive price range slider.
>
> **Where I got stuck:** Deciding the failure recovery behavior when `/assignment/country-code` returns 404/500 while `/assignment/course-data` succeeds. I settled on gracefully defaulting to INR (`pricePaise`) with a non-intrusive UI badge and manual currency toggle so users never face broken rates or unhandled errors.
>
> **What I'm not happy with:** The native `<select>` dropdown rendering in Framer canvas can look inconsistent across OS defaults; custom glassmorphic dropdown popovers would make it pixel-perfect across all platforms.

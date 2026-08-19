# Skillpath Assignment Compliance Checklist

> **Target Project:** Skillpath Landing Page & Framer React Code Component  
> **Source Requirements:** `assignment.md`  
> **Repository:** `/Users/bharath/Desktop/pet_tinker_projects/ankur-warriko-assignment`

---

## 1. Page Architecture & Layout
- [x] **Hero Section:** Headline, one-line subtitle, and one CTA button (`src/components/HeroSection.tsx`).
- [x] **Footer Section:** Three links (*Privacy Policy, Terms of Service, Support*) and copyright line (`src/components/FooterSection.tsx`).
- [x] **Framer React Code Component:** Pure React Code Component fetching live data (`src/framer/SkillpathCoursesFramer.tsx`).
- [x] **Distinctive Visual Identity:** Swiss Editorial Brutalism (Instrument Serif + Space Mono + Acid Lime accent).

---

## 2. Courses Section Data & Logic
- [x] **Dynamic API Fetching:** Fetches live data from `https://syncsphere-hiv6.onrender.com/assignment/course-data` (not hardcoded).
- [x] **Dynamic Grid Sizing:** Supports variable card array sizes (5 to 10 courses dynamically).
- [x] **GET Method Only:** Uses strictly `GET` requests (prevents HTTP 405 error).
- [x] **Card Field Requirements:**
  - [x] **Course Name:** Prominently rendered (`courseName`).
  - [x] **Clean 2-Line Description:** Styled with CSS line-clamping (`line-clamp-2`).
  - [x] **Accurate Price Formatting:**
    - [x] **INR (`pricePaise`):** `199900` paise $\div 100 =$ `₹1,999` (using `Intl.NumberFormat('en-IN')`).
    - [x] **USD (`priceUsdCents`):** `3999` cents $\div 100 =$ `$39.99` (using `Intl.NumberFormat('en-US')`).
  - [x] **Chosen 4th Field:** Rendered `mainCategory` badge (`"Content Creation"`, `"Social Media"`, etc.).

---

## 3. Flaky API & Four State Machine Requirements
- [x] **Loading State:** Displays custom layout skeleton loaders (`shimmer-bg`).
- [x] **Error State:** Catches HTTP 404/500 errors and surfaces parsed API error detail (`{"detail": "FAAAAAAAAAAA"}`).
- [x] **Zero Results State:** Handles empty catalog arrays or unmatched search filters.
- [x] **Working State:** Renders responsive card grid.
- [x] **Isolated Country Code Error Recovery:** If `/assignment/country-code` fails while `/course-data` succeeds, the catalog remains **100% operational**, defaulting to INR (`pricePaise`) with a non-intrusive warning tag (`COUNTRY_API_OFFLINE`).

---

## 4. Framer Property Controls
- [x] **Control 1 (`accentColor`):** Color control allowing non-coders to adjust primary button/badge themes (`#CCFF00`).
- [x] **Control 2 (`showRefundableBadge`):** Boolean toggle control allowing non-coders to show/hide the green "Refundable" badge.

---

## 5. Mobile Responsiveness & Accessibility
- [x] **3 Columns on Desktop:** `lg:grid-cols-3` / `minmax(300px, 1fr)`.
- [x] **2 Columns on Tablet:** `md:grid-cols-2`.
- [x] **1 Column on Mobile:** `grid-cols-1`.
- [x] **WCAG AAA Compliance:** High text contrast ratios (>15:1), `focus-visible` rings, and 44px touch targets.

---

## 6. Bonus / Finishing Early Features (All 5 Completed)
- [x] **Search Box:** Client-side live search filtering by course name, category, or description.
- [x] **Sort by Price:** Dropdown sorting (Low $\rightarrow$ High, High $\rightarrow$ Low).
- [x] **Skeleton Loaders:** Replaced generic spinner with layout skeleton grid.
- [x] **Retry Connection Button:** Interactive button to re-trigger API fetches after error states.
- [x] **Refundable Badge:** Conditional badge displayed only when `refundable === true`.

---

## 7. Final Submission Package
- [x] **Developer Note (< 200 words):** Complete in `SUBMISSION_NOTES.md`.
- [x] **AI Usage Disclosure:** Outlined prompt workflow & code ownership in `SUBMISSION_NOTES.md`.
- [x] **Git Repository:** Committed to `main` branch.

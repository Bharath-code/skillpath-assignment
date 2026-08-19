# Skillpath Landing Page — Assignment Submission Notes

## 1. Submission Links
- **Published Framer Link:** [https://wise-status-853448.framer.app/](https://wise-status-853448.framer.app/)
- **GitHub Repository:** [https://github.com/Bharath-code/skillpath-assignment](https://github.com/Bharath-code/skillpath-assignment)
- **AI Chat History Transcript File:** [`CHAT_HISTORY.md`](file:///Users/bharath/Desktop/pet_tinker_projects/ankur-warriko-assignment/CHAT_HISTORY.md)

---

## 2. Developer Reflection Note (< 200 words)

> **What I'd fix with two more days:** I would implement a client-side caching mechanism (Stale-While-Revalidate with localStorage) so previously loaded courses display instantly while background revalidations fire. I would also add card entrance stagger animations using Framer Motion and an interactive price range slider.
>
> **Where I got stuck:** Deciding the failure recovery behavior when `/assignment/country-code` returns 404/500 while `/assignment/course-data` succeeds. I settled on gracefully defaulting to INR (`pricePaise`) with a non-intrusive UI badge and manual currency toggle so users never face broken rates or unhandled errors.
>
> **What I'm not happy with:** The native `<select>` dropdown rendering in Framer canvas can look inconsistent across OS defaults; custom glassmorphic dropdown popovers would make it pixel-perfect across all platforms.

---

## 3. AI Usage Disclosure

- **AI Tools Used:** Antigravity (Gemini 3.6 Flash), Claude.
- **Workflow & Division of Labor:**
  - AI assisted with initial boilerplate setup, types, and custom hook extraction (`useCourseCatalog.ts`).
  - I designed the Swiss Editorial Brutalism design system, structured the isolated `Promise.allSettled` error recovery logic, verified exact currency conversion math (`pricePaise / 100` & `priceUsdCents / 100`), and configured Framer `addPropertyControls`.

---

## 4. Key Architecture & Live-Coding Defense Guide

1. **Flaky API Handling (`Promise.allSettled`):**
   - Both `/assignment/course-data` and `/assignment/country-code` run independently.
   - If `/course-data` fails (1 in 3 chance), an explicit error card with a **"Retry Connection"** button is displayed.
   - If `/country-code` fails (e.g. `{"detail": "FAAAAAAAAAAA"}`), `countryFetchFailed` defaults `countryCode` to `"IN"` gracefully without breaking the courses display.

2. **Price Unit Conversion Math:**
   - **Rupees (`pricePaise`):** `199900` paise $\div 100 =$ `₹1,999` (`Intl.NumberFormat('en-IN')`).
   - **Dollars (`priceUsdCents`):** `3999` cents $\div 100 =$ `$39.99` (`Intl.NumberFormat('en-US')`).

3. **Framer Property Controls (`addPropertyControls`):**
   - `accentColor`: Controls primary button theme and badges (`#CCFF00`).
   - `showRefundableBadge`: Boolean toggle for green "Refundable" tag.

4. **Responsive Grid Layout:**
   - Desktop: 3 columns (`lg:grid-cols-3` / `minmax(300px, 1fr)`).
   - Tablet: 2 columns (`md:grid-cols-2`).
   - Mobile: 1 column (`grid-cols-1`).

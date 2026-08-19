# Skillpath Landing Page — Assignment Submission Notes

## 1. Submission Links
- **Published Framer Link:** [Insert your published Framer link here]
- **GitHub Repository / Gist:** [Insert your public repo or Gist URL here]
- **AI Chat Link:** [Insert shared chat URL from Claude/Cursor/ChatGPT here]

---

## 2. Developer Reflection Note (< 200 words)

> **What I'd fix with two more days:** I would implement a client-side caching mechanism (Stale-While-Revalidate with localStorage) so previously loaded courses display instantly while background revalidations fire. I would also add animations for card entrances using Framer Motion and an interactive filter drawer for price ranges.
>
> **Where I got stuck:** Deciding the failure recovery behavior when `/assignment/country-code` returns 404/500 while `/assignment/course-data` succeeds. I settled on gracefully defaulting to INR (`pricePaise`) with a non-intrusive UI badge and manual currency switcher so users never face broken prices or blank states.
>
> **What I'm not happy with:** The native `<select>` dropdown styling in Framer canvas can look inconsistent across OS defaults; custom glassmorphic dropdown popovers would make it pixel-perfect across all platforms.

---

## 3. AI Usage Disclosure

- **AI Tools Used:** Antigravity (Gemini 3.6 Flash), Claude.
- **Workflow & Division of Labor:**
  - AI generated the initial boilerplate structure and fetch logic setup.
  - I personally designed the error boundary strategy, isolated `Promise.allSettled` execution to handle flaky APIs, implemented the precise currency conversion math (`pricePaise / 100` & `priceUsdCents / 100`), and defined the Framer `addPropertyControls` configuration.

---

## 4. Key Architecture & Live-Coding Cheat Sheet

If asked to modify or explain the code during the 20-minute follow-up call:

1. **Flaky API Handling (`Promise.allSettled`):**
   - Both `/assignment/course-data` and `/assignment/country-code` are fetched independently.
   - If `course-data` fails (1 in 3 chance), an explicit error state card with a **"Retry Connection"** button is displayed.
   - If `country-code` fails, `countryFetchFailed` flag sets `countryCode` to `"IN"` gracefully without crashing the courses view.

2. **Price Conversion Math:**
   - **Rupees (`pricePaise`):** `199900` paise $\div 100 =$ `₹1,999` (`Intl.NumberFormat('en-IN')`).
   - **Dollars (`priceUsdCents`):** `3999` cents $\div 100 =$ `$39.99` (`Intl.NumberFormat('en-US')`).

3. **Property Controls (`addPropertyControls`):**
   - `accentColor`: Controls primary buttons, badges, and highlights.
   - `showRefundableBadge`: Boolean toggle for displaying the green "Refundable" tag.

4. **Responsive Layout:**
   - Desktop: 3 columns (`lg:grid-cols-3`).
   - Tablet: 2 columns (`md:grid-cols-2`).
   - Mobile: 1 column (`grid-cols-1`).

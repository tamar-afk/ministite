# Minisite — UPDATED (monday work management)

**This folder is the updated version. Do not overwrite or mix with the other minisite.**

The **original** version (Glean, static HTML/CSS) lives in the sibling folder **`minisite-original`**. Keep this folder for the monday-style app only.

---

# monday work management — Landing Page

A high-fidelity, animated marketing landing page for **monday work management**, built with React, Tailwind CSS, and Framer Motion.

## Open in browser (no install)

**Double-click or open this file in your browser:**  
`open-in-browser.html`

It’s a static preview of the page (no animations or interactivity). Use it if the React app won’t run.

## Run the full React app locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (e.g. **http://127.0.0.1:5173**). We use `127.0.0.1` instead of `localhost` so auth extensions (e.g. Cerby) are less likely to intercept and blank the page.

**If you still get "Authentication required":** In Cerby (or your identity extension), check settings for excluding domains or "development URLs" and add `127.0.0.1` or `localhost`. Or use Chrome/Safari in a private/incognito window (extensions are usually disabled there).

## Build

```bash
npm run build
npm run preview
```

## Stack

- **React** (hooks)
- **Tailwind CSS** + `src/animations.css` for keyframes and design tokens
- **Framer Motion** for scroll and in-view animations
- **Lucide React** for icons
- **Fonts**: Instrument Serif (headings), Geist (body) — loaded via Google Fonts + Vercel Geist CDN

## Sections

1. Navbar (sticky, blur on scroll)
2. Hero (eyebrow, headline, CTAs, animated browser demo, logo marquee)
3. Solutions for every team (tabs: PMO, Legal, HR, Product, Marketing, IT, Operations)
4. From intent to outcome (scroll-synced lifecycle; stepper on mobile)
5. You set the guardrails (4 pillars + interactive AI governance panel)
6. Organizational intelligence (node graph; simplified 3-node on mobile)
7. Why monday — differentiators (4 editorial rows, count-up numbers)
8. Social proof (50% countUp, quote, G2 badges)
9. Trusted & recognized (logo placeholders)
10. Final CTA (star particles, two buttons)
11. Footer

All copy matches the brief; no `localStorage`/`sessionStorage`. Marquee pauses on hover.

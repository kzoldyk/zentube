# Zentube UI Redesign: Minimalist & Airy

**Date:** 2026-05-16
**Status:** Approved
**Vision:** Transform Zentube into a "calmer" YouTube experience using a minimalist, high-polish aesthetic inspired by Apple and Linear.

## 1. Visual Foundation
- **Typography:** Utilize Geist (Sans and Mono) with `tracking-tight` and optimized `leading` (line-height).
- **Color Palette:**
  - Light: Pure `#FFFFFF` background, `zinc-100/200` for hairline borders.
  - Dark: Deep matte `#09090b` background.
  - Accents: Minimal use of `zinc-900` (light) / `zinc-100` (dark) for primary actions.
- **Atmosphere:** High whitespace, subtle "hairline" borders (0.5px or 1px with low opacity), and soft shadows only on active/elevated states.

## 2. Component Language

### Video Cards
- **Structure:** Balanced Metadata (Thumbnail + Title + Channel Avatar/Name).
- **Shape:** `rounded-2xl` (16px) corners for thumbnails.
- **Interactions:**
  - Hover: 1.02x scale up with spring animation.
  - "Quiet" UI: Action buttons (Save/Bookmark) are hidden by default and fade in on hover.
- **Masonry Layout:** An organic, multi-column grid where card heights vary based on description snippets or topic tags.

### Navigation (Sidebar & Header)
- **Floating Sidebar:** Slim, glassmorphism-ready (`backdrop-blur-md`). Links use weight changes and dot indicators rather than heavy background blocks.
- **Adaptive Header:** Develops a subtle blur and border upon scroll.

## 3. Motion & Polish (Framer Motion)
- **Staggered Entry:** Cards slide up and fade in sequentially when the feed loads.
- **Page Transitions:** Smooth cross-fades between routes.
- **Focus Mode:** The watch page minimizes surrounding UI elements to prioritize the video.

## 4. Implementation Strategy
- **Framework:** Next.js App Router.
- **Styling:** Tailwind CSS 4.
- **Animation:** Framer Motion.
- **Layout:** `react-masonry-css` or a CSS-column based approach for the organic grid.
- **States:** Skeleton loaders that mirror the masonry structure.

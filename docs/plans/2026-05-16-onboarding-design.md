# Zentube Onboarding: Interest Selection Design

**Date:** 2026-05-16
**Status:** Approved
**Goal:** Create a high-polish, distraction-free onboarding experience where users select their interests to seed their personalized feed.

## 1. User Journey
- **Trigger:** Unauthenticated users are redirected to Sign-In. Authenticated users with 0 interests are redirected to `/onboarding`.
- **Experience:** A clean, full-screen UI (no sidebar/header) presenting a grid of curated topics.
- **Action:** User selects 3+ topics and clicks "Start Watching".
- **Outcome:** Interests are saved to the database, and the user is redirected to the `/feed`.

## 2. Visual & Component Design
- **Layout:** Centered container with a "Welcome to Zentube" heading in `tracking-tight` Geist Bold.
- **Interest Cards:**
  - Size: Large, square-ish cards (`aspect-square` or `aspect-[4/5]`).
  - Shape: `rounded-3xl` (24px).
  - Content: Centered Lucide icon + Topic Label.
  - States:
    - Default: `border-hairline` with a very subtle hover lift.
    - Selected: Subtle glowing border (`ring-2 ring-primary`) and a scale-up pop.
- **Primary Action:** A floating, fixed "Start Watching" button at the bottom center.

## 3. Data & Logic
- **Topic Set:** A curated list of 12-16 high-quality topics (e.g., Coding, Lofi, Science, Architecture).
- **Persistence:** Next.js Server Action `saveUserInterests(topics: string[])` using Prisma.
- **Auth Guard:** Middleware or Layout-level check to ensure users don't skip this step.

## 4. Technical Implementation
- **Route:** `src/app/onboarding/page.tsx` (Separate from `(app)` group to avoid sidebar).
- **State Management:** Local React state for tracking selections before final submission.
- **Animations:** `framer-motion` for the grid entry and card selection feedback.

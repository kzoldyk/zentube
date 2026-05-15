# Zentube UI Redesign Implementation Plan

> **For Gemini:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement the "Minimalist & Airy" navigation foundation (Slim Sidebar and Adaptive Header) for Zentube.

**Architecture:** We will refactor the existing layout to use a glassmorphism-ready header and a slim, high-polish sidebar. We'll use Framer Motion for subtle transitions and weight-based active states.

**Tech Stack:** Next.js App Router, Tailwind CSS 4, Framer Motion, Lucide React.

---

### Task 1: Refactor Global CSS for Hairline Borders

**Files:**
- Modify: `src/app/globals.css`

**Step 1: Add custom utility for hairline borders**
Add a utility class or CSS variable to support 0.5px borders in dark/light modes.

**Step 2: Commit**
```bash
git add src/app/globals.css
git commit -m "style: add hairline border utilities"
```

---

### Task 2: Implement the "Floating" Adaptive Header

**Files:**
- Modify: `src/app/layout.tsx`
- Create: `src/components/main-header.tsx`

**Step 1: Extract Header into a Client Component**
Move header logic to `src/components/main-header.tsx` to support scroll-based styling.

**Step 2: Add Backdrop Blur and Scroll Logic**
Use Framer Motion's `useScroll` and `useTransform` or a simple window listener to add `backdrop-blur-md` and a hairline border when `y > 0`.

**Step 3: Update Root Layout**
Replace the static header with `<MainHeader />`.

**Step 4: Commit**
```bash
git add src/components/main-header.tsx src/app/layout.tsx
git commit -m "feat: add adaptive floating header"
```

---

### Task 3: Implement the Slim "Glass" Sidebar

**Files:**
- Modify: `src/app/(app)/layout.tsx`
- Create: `src/components/sidebar-nav.tsx`

**Step 1: Create SidebarNav Component**
Create a component that uses Lucide icons and weight-based active states.

**Step 2: Apply Glassmorphism & Hairline Border**
Ensure the sidebar has `border-r border-zinc-200/50` (light) or `border-zinc-800/50` (dark).

**Step 3: Update App Layout**
Integrate the new sidebar into `src/app/(app)/layout.tsx`.

**Step 4: Commit**
```bash
git add src/components/sidebar-nav.tsx src/app/(app)/layout.tsx
git commit -m "feat: implement slim glass sidebar"
```

---

### Task 4: Polish & Refine Global Typography

**Files:**
- Modify: `src/app/layout.tsx`

**Step 1: Adjust Geist Font Tracking**
Ensure `Geist` is applied with `tracking-tight` globally for that "premium" feel.

**Step 2: Commit**
```bash
git add src/app/layout.tsx
git commit -m "style: adjust global typography tracking"
```

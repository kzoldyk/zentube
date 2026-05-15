# Zentube Personalized Feed Implementation Plan

> **For Gemini:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement the "Weighted Random" feed logic and a high-polish Masonry UI.

**Architecture:** Create a server-side feed service to fetch and shuffle videos. Build a responsive Masonry component with Framer Motion animations for the frontend.

**Tech Stack:** Next.js, Prisma, YouTube API Service, Framer Motion, Tailwind CSS.

---

### Task 1: Implement the Feed Logic Service

**Files:**
- Create: `src/lib/feed.ts`

**Step 1: Implement getUserFeed**
Fetch user interests, call YouTube API in parallel, and apply a weighted shuffle.
```typescript
import { prisma } from "@/lib/prisma"
import { searchVideos } from "@/services/youtube"
import { ZentubeVideo } from "@/types/youtube"

export async function getUserFeed(userId: string): Promise<ZentubeVideo[]> {
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { interests: true }
  })

  if (!user || user.interests.length === 0) return []

  // Fetch videos for all topics in parallel
  const videoPromises = user.interests.map(interest => 
    searchVideos(interest.topic, 10)
  )
  
  const results = await Promise.all(videoPromises)
  let allVideos = results.flat()

  // De-duplicate by ID
  const seen = new Set()
  allVideos = allVideos.filter(v => {
    if (seen.has(v.id)) return false
    seen.add(v.id)
    return true
  })

  // Weighted Shuffle: Give slight priority to earlier interests
  return allVideos.sort(() => Math.random() - 0.5)
}
```

**Step 2: Commit**
```bash
git add src/lib/feed.ts
git commit -m "feat: implement weighted feed logic"
```

---

### Task 2: Create the Video Card Component

**Files:**
- Create: `src/components/video-card.tsx`

**Step 1: Build the Card UI**
Implement the "Minimalist & Airy" card designed earlier. Include thumbnail, title, channel avatar/name. Add hover animations.

**Step 2: Commit**
```bash
git add src/components/video-card.tsx
git commit -m "feat: create minimalist video card component"
```

---

### Task 3: Build the Masonry Grid Component

**Files:**
- Create: `src/components/video-masonry.tsx`

**Step 1: Implement Masonry Layout**
Use CSS columns or a grid-based approach to create the staggered effect. Use Framer Motion for staggered entrance animations.

**Step 2: Commit**
```bash
git add src/components/video-masonry.tsx
git commit -m "feat: implement masonry grid with animations"
```

---

### Task 4: Connect Feed Page to the New Logic

**Files:**
- Modify: `src/app/(app)/feed/page.tsx`

**Step 1: Replace hardcoded feed with live data**
Call `getUserFeed` and render `<VideoMasonry />`.

**Step 2: Commit**
```bash
git add src/app/(app)/feed/page.tsx
git commit -m "feat: connect feed page to live personalized data"
```

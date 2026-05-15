# Zentube Watch Experience & Interactions Implementation Plan

> **For Gemini:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement a distraction-free watch page, YouTube player with progress tracking, and bookmark functionality.

**Architecture:** We will use Server Actions for all database mutations (bookmarks, progress). The Watch Page will be a server component that fetches metadata, while the player will be a client component using `react-player` or a raw iframe to track `onProgress`.

**Tech Stack:** Next.js, Prisma, YouTube API, Lucide React, Tailwind CSS, Framer Motion.

---

### Task 1: Create Interaction Server Actions

**Files:**
- Create: `src/lib/actions/interactions.ts`

**Step 1: Implement toggleBookmark and updateProgress**
```typescript
"use server"

import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function toggleBookmark(videoId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  // Find user internal ID first
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { id: true }
  })
  if (!user) throw new Error("User not found")

  const existing = await prisma.bookmark.findUnique({
    where: { userId_videoId: { userId: user.id, videoId } }
  })

  if (existing) {
    await prisma.bookmark.delete({
      where: { id: existing.id }
    })
  } else {
    await prisma.bookmark.create({
      data: { userId: user.id, videoId }
    })
  }

  revalidatePath("/bookmarks")
  revalidatePath("/feed")
}

export async function updateProgress(videoId: string, progress: number) {
  const { userId } = await auth()
  if (!userId) return

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { id: true }
  })
  if (!user) return

  await prisma.watchProgress.upsert({
    where: { userId_videoId: { userId: user.id, videoId } },
    update: { progress },
    create: { userId: user.id, videoId, progress }
  })
}
```

**Step 2: Commit**
```bash
git add src/lib/actions/interactions.ts
git commit -m "feat: add interaction server actions for bookmarks and progress"
```

---

### Task 2: Build the YouTube Player Component

**Files:**
- Create: `src/components/video-player.tsx`

**Step 1: Implement the Player with Progress Tracking**
Create a client component that embeds the YouTube video and calls `updateProgress` periodically.

**Step 2: Commit**
```bash
git add src/components/video-player.tsx
git commit -m "feat: create youtube player component with progress tracking"
```

---

### Task 3: Build the Watch Page

**Files:**
- Modify: `src/app/(app)/watch/[id]/page.tsx`

**Step 1: Implement the Watch Page UI**
Fetch video details using `getVideoDetails` and render the player along with metadata and interaction buttons.

**Step 2: Commit**
```bash
git add src/app/(app)/watch/[id]/page.tsx
git commit -m "feat: implement high-polish watch page UI"
```

---

### Task 4: Connect Bookmarks UI

**Files:**
- Modify: `src/components/video-card.tsx`
- Modify: `src/app/(app)/bookmarks/page.tsx`

**Step 1: Update VideoCard to use toggleBookmark**
Wire up the bookmark button to the server action. Use `useTransition` for a smooth UI update.

**Step 2: Implement the Bookmarks Page**
Fetch the user's bookmarked videos and render them using `VideoMasonry`.

**Step 3: Commit**
```bash
git add src/components/video-card.tsx src/app/(app)/bookmarks/page.tsx
git commit -m "feat: connect bookmarks UI across feed and bookmarks page"
```

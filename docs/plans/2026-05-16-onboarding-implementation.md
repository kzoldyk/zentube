# Zentube Onboarding Implementation Plan

> **For Gemini:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement a dedicated onboarding page for interest selection with database persistence.

**Architecture:** Create a new `/onboarding` route outside the `(app)` group. Use a Client Component for the grid UI and a Server Action to save interests to Prisma. Update the `(app)` layout to redirect users to onboarding if they have no interests.

**Tech Stack:** Next.js, Prisma, Framer Motion, Lucide React, Tailwind CSS.

---

### Task 1: Create the Server Action for Saving Interests

**Files:**
- Create: `src/lib/actions/user.ts`

**Step 1: Implement saveUserInterests action**
```typescript
"use server"

import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function saveUserInterests(topics: string[]) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  // Create or update user and their interests
  await prisma.user.upsert({
    where: { clerkId: userId },
    update: {
      interests: {
        deleteMany: {},
        create: topics.map(topic => ({ topic }))
      }
    },
    create: {
      clerkId: userId,
      interests: {
        create: topics.map(topic => ({ topic }))
      }
    }
  })

  revalidatePath("/")
}
```

**Step 2: Commit**
```bash
git add src/lib/actions/user.ts
git commit -m "feat: add saveUserInterests server action"
```

---

### Task 2: Build the Onboarding Page UI

**Files:**
- Create: `src/app/onboarding/page.tsx`

**Step 1: Implement the Grid and Selection Logic**
Create the page with a list of curated topics and a multi-select grid. Use `framer-motion` for entrance animations.

**Step 2: Commit**
```bash
git add src/app/onboarding/page.tsx
git commit -m "feat: implement onboarding interest selection UI"
```

---

### Task 3: Implement Onboarding Redirect Guard

**Files:**
- Modify: `src/app/(app)/layout.tsx`

**Step 1: Add Interest Check and Redirect**
Check if the user has any interests. If not, redirect to `/onboarding`.

**Step 2: Commit**
```bash
git add src/app/(app)/layout.tsx
git commit -m "feat: add onboarding redirect guard to app layout"
```

---

### Task 4: Verify Full Flow

**Step 1: Test the transition**
1. Sign in with a new user.
2. Verify redirect to `/onboarding`.
3. Select 3 topics and click "Start Watching".
4. Verify redirect to `/feed` and that database is updated.

**Step 2: Commit**
```bash
git commit --allow-empty -m "test: verify onboarding flow end-to-end"
```

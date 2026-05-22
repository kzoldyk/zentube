"use server"

import { and, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { getDb } from "@/db"
import { bookmarks, videos, watchProgress } from "@/db/schema"
import { createId, getCurrentUser, requireUser } from "@/lib/auth"
import { getVideoDetails } from "@/services/youtube"

async function ensureVideo(youtubeId: string) {
  const db = await getDb()
  const existing = await db.select().from(videos).where(eq(videos.youtubeId, youtubeId)).limit(1)

  if (existing[0]) {
    return existing[0]
  }

  const [details] = await getVideoDetails(youtubeId)
  if (!details) {
    throw new Error("Video not found on YouTube")
  }

  await db.insert(videos).values({
    youtubeId: details.id,
    title: details.title,
    description: details.description,
    thumbnailUrl: details.thumbnailUrl,
    channelId: details.channelId,
    channelTitle: details.channelTitle,
    duration: details.duration,
    viewCount: details.viewCount,
    publishedAt: details.publishedAt ? new Date(details.publishedAt) : null,
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  const inserted = await db.select().from(videos).where(eq(videos.youtubeId, youtubeId)).limit(1)
  return inserted[0]
}

export async function toggleBookmark(youtubeId: string) {
  const user = await requireUser()
  const db = await getDb()

  await ensureVideo(youtubeId)

  const existing = await db
    .select()
    .from(bookmarks)
    .where(and(eq(bookmarks.userId, user.id), eq(bookmarks.youtubeId, youtubeId)))
    .limit(1)

  if (existing[0]) {
    await db.delete(bookmarks).where(eq(bookmarks.id, existing[0].id))
  } else {
    await db.insert(bookmarks).values({
      id: createId(),
      userId: user.id,
      youtubeId,
      createdAt: new Date(),
    })
  }

  revalidatePath("/bookmarks")
  revalidatePath("/feed")
  revalidatePath(`/watch/${youtubeId}`)
}

export async function updateProgress(youtubeId: string, progress: number) {
  try {
    const user = await getCurrentUser()
    if (!user) return

    const db = await getDb()
    await ensureVideo(youtubeId)

    const existing = await db
      .select()
      .from(watchProgress)
      .where(and(eq(watchProgress.userId, user.id), eq(watchProgress.youtubeId, youtubeId)))
      .limit(1)

    if (existing[0]) {
      await db
        .update(watchProgress)
        .set({ progress, updatedAt: new Date() })
        .where(eq(watchProgress.id, existing[0].id))
    } else {
      await db.insert(watchProgress).values({
        id: createId(),
        userId: user.id,
        youtubeId,
        progress,
        updatedAt: new Date(),
      })
    }
  } catch (error) {
    console.error(`Failed to update watch progress for ${youtubeId}:`, error)
  }
}

export async function getWatchState(youtubeId: string) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { isBookmarked: false, progress: 0 }
    }

    const db = await getDb()
    const [bookmark, progress] = await Promise.all([
      db
        .select()
        .from(bookmarks)
        .where(and(eq(bookmarks.userId, user.id), eq(bookmarks.youtubeId, youtubeId)))
        .limit(1),
      db
        .select()
        .from(watchProgress)
        .where(and(eq(watchProgress.userId, user.id), eq(watchProgress.youtubeId, youtubeId)))
        .limit(1),
    ])

    return {
      isBookmarked: Boolean(bookmark[0]),
      progress: progress[0]?.progress ?? 0,
    }
  } catch (error) {
    console.error(`Failed to get watch state for ${youtubeId}:`, error)
    return { isBookmarked: false, progress: 0 }
  }
}

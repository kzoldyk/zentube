"use server"

import { auth } from "@clerk/nextjs/server"
import { getPrisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { getVideoDetails } from "@/services/youtube"

/**
 * Ensures a video exists in our database, fetching from YouTube if necessary.
 */
async function ensureVideo(youtubeId: string) {
  const prisma = await getPrisma()
  let video = await prisma.video.findUnique({
    where: { youtubeId }
  })

  if (!video) {
    const [details] = await getVideoDetails(youtubeId)
    if (!details) throw new Error("Video not found on YouTube")

    video = await prisma.video.create({
      data: {
        youtubeId: details.id,
        title: details.title,
        description: details.description,
        thumbnailUrl: details.thumbnailUrl,
        channelId: details.channelId,
        channelTitle: details.channelTitle,
        publishedAt: details.publishedAt ? new Date(details.publishedAt) : null,
      }
    })
  }

  return video
}

export async function toggleBookmark(youtubeId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const prisma = await getPrisma()
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { id: true }
  })
  if (!user) throw new Error("User not found")

  const video = await ensureVideo(youtubeId)

  const existing = await prisma.bookmark.findUnique({
    where: { userId_videoId: { userId: user.id, videoId: video.id } }
  })

  if (existing) {
    await prisma.bookmark.delete({
      where: { id: existing.id }
    })
  } else {
    await prisma.bookmark.create({
      data: { userId: user.id, videoId: video.id }
    })
  }

  revalidatePath("/bookmarks")
  revalidatePath("/feed")
  revalidatePath(`/watch/${youtubeId}`)
}

export async function updateProgress(youtubeId: string, progress: number) {
  try {
    const { userId } = await auth()
    if (!userId) return

    const prisma = await getPrisma()
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true }
    })
    if (!user) return

    const video = await ensureVideo(youtubeId)

    await prisma.watchProgress.upsert({
      where: { userId_videoId: { userId: user.id, videoId: video.id } },
      update: { progress },
      create: { userId: user.id, videoId: video.id, progress }
    })
  } catch (error) {
    console.error(`Failed to update watch progress for ${youtubeId}:`, error)
  }
}

export async function getWatchState(youtubeId: string) {
  try {
    const { userId } = await auth()
    if (!userId) return { isBookmarked: false, progress: 0 }

    const prisma = await getPrisma()
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true }
    })
    if (!user) return { isBookmarked: false, progress: 0 }

    const video = await prisma.video.findUnique({
      where: { youtubeId }
    })

    if (!video) return { isBookmarked: false, progress: 0 }

    const [bookmark, progress] = await Promise.all([
      prisma.bookmark.findUnique({
        where: { userId_videoId: { userId: user.id, videoId: video.id } }
      }),
      prisma.watchProgress.findUnique({
        where: { userId_videoId: { userId: user.id, videoId: video.id } }
      })
    ])

    return {
      isBookmarked: !!bookmark,
      progress: progress?.progress || 0
    }
  } catch (error) {
    console.error(`Failed to get watch state for ${youtubeId}:`, error)
    return { isBookmarked: false, progress: 0 }
  }
}

"use server"

import { searchVideos } from "@/services/youtube"
import { ZentubeVideo } from "@/types/youtube"
import { auth } from "@clerk/nextjs/server"
import { getPrisma } from "@/lib/prisma"
import { getUserFeed } from "@/lib/feed"

export async function loadMoreSearch(query: string, pageToken: string): Promise<{ 
  videos: (ZentubeVideo & { isBookmarked?: boolean })[]; 
  nextPageToken?: string 
}> {
  const { userId } = await auth()
  const result = await searchVideos(query, 24, pageToken)
  
  let bookmarkedYoutubeIds = new Set<string>()
  if (userId) {
    const prisma = await getPrisma()
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { 
        bookmarks: {
          include: { video: true }
        }
      }
    })
    if (user) {
      bookmarkedYoutubeIds = new Set(user.bookmarks.map(b => b.video.youtubeId))
    }
  }

  return {
    videos: result.videos.map(v => ({
      ...v,
      isBookmarked: bookmarkedYoutubeIds.has(v.id)
    })),
    nextPageToken: result.nextPageToken
  }
}

export async function loadMoreFeed(pageToken: string): Promise<{ 
  videos: (ZentubeVideo & { isBookmarked?: boolean })[]; 
  nextPageToken?: string 
}> {
  const { userId } = await auth()
  if (!userId) return { videos: [], nextPageToken: undefined }

  const page = parseInt(pageToken, 10) || 1
  const result = await getUserFeed(userId)
  
  return {
    videos: result.videos,
    // Since we don't have a token for combined feed yet, we'll just use the page number as a string
    nextPageToken: result.hasMore ? (page + 1).toString() : undefined
  }
}

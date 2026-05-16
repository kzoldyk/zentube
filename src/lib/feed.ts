import { getPrisma } from "@/lib/prisma"
import { searchVideos, getRelatedVideos } from "@/services/youtube"
import { ZentubeVideo } from "@/types/youtube"

export async function getUserFeed(userId: string): Promise<{ videos: (ZentubeVideo & { isBookmarked?: boolean })[], hasMore: boolean }> {
  const prisma = await getPrisma()
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { 
      interests: true,
      bookmarks: {
        include: {
          video: true
        }
      }
    }
  })

  if (!user || user.interests.length === 0) return { videos: [], hasMore: false }

  const bookmarkedYoutubeIds = new Set(user.bookmarks.map((b: any) => b.video.youtubeId))

  // 1. Fetch videos based on static interests
  const interestPromises = user.interests.map((interest: any) => 
    searchVideos(interest.topic, 12) 
  )

  // 2. Fetch related videos based on a random bookmark (Smart Recommendations)
  let recommendationPromise = Promise.resolve({ videos: [] as ZentubeVideo[] })
  if (user.bookmarks.length > 0) {
    const randomBookmark = user.bookmarks[Math.floor(Math.random() * user.bookmarks.length)]
    // Map internal Video to ZentubeVideo type
    const seedVideo: ZentubeVideo = {
      id: randomBookmark.video.youtubeId,
      title: randomBookmark.video.title,
      description: randomBookmark.video.description || "",
      thumbnailUrl: randomBookmark.video.thumbnailUrl || "",
      channelId: randomBookmark.video.channelId || "",
      channelTitle: randomBookmark.video.channelTitle || "",
      publishedAt: randomBookmark.video.publishedAt?.toISOString() || new Date().toISOString()
    }
    recommendationPromise = getRelatedVideos(seedVideo, 12)
  }
  
  const [interestResults, recommendationResult] = await Promise.all([
    Promise.allSettled(interestPromises),
    recommendationPromise
  ])
  
  // Combine interest results with base weights
  const weightedVideos = interestResults.flatMap((result: PromiseSettledResult<ZentubeVideo[]>, index) => {
    if (result.status === 'fulfilled') {
      const weight = 1 / (index + 1)
      return result.value.videos.map((video: ZentubeVideo) => ({
        video,
        score: Math.random() * weight
      }))
    }
    return []
  })

  // Add recommendations with a higher fixed weight (0.8) to make them surface
  const recommendedVideos = recommendationResult.videos.map((video: ZentubeVideo) => ({
    video,
    score: Math.random() * 0.8
  }))

  const allWeightedVideos = [...weightedVideos, ...recommendedVideos]

  // De-duplicate by video ID and sort by score
  const seen = new Set<string>()
  const feed = allWeightedVideos
    .filter(item => {
      if (seen.has(item.video.id)) return false
      seen.add(item.video.id)
      return true
    })
    .sort((a, b) => b.score - a.score) // Sort by descending score
    .map(item => ({
      ...item.video,
      isBookmarked: bookmarkedYoutubeIds.has(item.video.id)
    }))
    .slice(0, 48) // Apply global limit

  return {
    videos: feed,
    hasMore: feed.length > 0
  }
}

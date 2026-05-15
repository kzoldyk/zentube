import { prisma } from "@/lib/prisma"
import { searchVideos } from "@/services/youtube"
import { ZentubeVideo } from "@/types/youtube"

export async function getUserFeed(userId: string): Promise<(ZentubeVideo & { isBookmarked?: boolean })[]> {
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

  if (!user || user.interests.length === 0) return []

  const bookmarkedYoutubeIds = new Set(user.bookmarks.map(b => b.video.youtubeId))

  // Fetch videos for all topics in parallel
  const videoPromises = user.interests.map(interest => 
    searchVideos(interest.topic, 12) // Slightly more per topic to ensure we hit 48
  )
  
  const results = await Promise.allSettled(videoPromises)
  
  // Combine successful results and apply weights based on topic order
  const weightedVideos = results.flatMap((result, index) => {
    if (result.status === 'fulfilled') {
      // Weight decreases as index increases (1, 0.5, 0.33...)
      const weight = 1 / (index + 1)
      return result.value.map(video => ({
        video,
        // Calculate a random score skewed by the topic's weight
        score: Math.random() * weight
      }))
    }
    return []
  })

  // De-duplicate by video ID and sort by score
  const seen = new Set<string>()
  const feed = weightedVideos
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

  return feed
}

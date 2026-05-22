import { eq } from "drizzle-orm"
import { getDb } from "@/db"
import { bookmarks, userInterests } from "@/db/schema"
import { searchVideos } from "@/services/youtube"
import { ZentubeVideo } from "@/types/youtube"

export async function getUserFeed(
  userId: string
): Promise<(ZentubeVideo & { isBookmarked?: boolean })[]> {
  const db = await getDb()
  const [interests, userBookmarks] = await Promise.all([
    db.select().from(userInterests).where(eq(userInterests.userId, userId)),
    db.select().from(bookmarks).where(eq(bookmarks.userId, userId)),
  ])

  if (interests.length === 0) return []

  const bookmarkedYoutubeIds = new Set(userBookmarks.map((bookmark) => bookmark.youtubeId))

  const videoPromises = interests.map((interest) => searchVideos(interest.topic, 12))
  const results = await Promise.allSettled(videoPromises)

  const weightedVideos = results.flatMap((result, index) => {
    if (result.status === "fulfilled") {
      const weight = 1 / (index + 1)
      return result.value.map((video) => ({
        video,
        score: Math.random() * weight,
      }))
    }

    return []
  })

  const seen = new Set<string>()
  return weightedVideos
    .filter((item) => {
      if (seen.has(item.video.id)) return false
      seen.add(item.video.id)
      return true
    })
    .sort((a, b) => b.score - a.score)
    .map((item) => ({
      ...item.video,
      isBookmarked: bookmarkedYoutubeIds.has(item.video.id),
    }))
    .slice(0, 48)
}

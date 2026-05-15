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

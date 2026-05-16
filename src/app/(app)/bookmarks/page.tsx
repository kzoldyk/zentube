import { auth } from "@clerk/nextjs/server"
import { getPrisma } from "@/lib/prisma"
import { getVideoDetails } from "@/services/youtube"
import { VideoMasonry } from "@/components/video-masonry"
import { redirect } from "next/navigation"
import { ZentubeVideo } from "@/types/youtube"

export default async function BookmarksPage() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect("/sign-in")
  }

  const prisma = await getPrisma()
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      bookmarks: {
        include: {
          video: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  })

  if (!user) {
    return null
  }

  const bookmarkedVideoIds = user.bookmarks.map(b => b.video.youtubeId)
  
  let videos: (ZentubeVideo & { isBookmarked: boolean })[] = []
  if (bookmarkedVideoIds.length > 0) {
    // Fetch fresh metadata from YouTube as requested
    const details = await getVideoDetails(bookmarkedVideoIds)
    videos = details.map(v => ({
      ...v,
      isBookmarked: true
    }))
  }

  return (
    <div className="flex flex-1 flex-col p-6">
      <div className="max-w-4xl mb-8">
        <h2 className="text-2xl font-semibold tracking-tight">Bookmarks</h2>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          Your saved videos for later viewing.
        </p>
      </div>

      {videos.length > 0 ? (
        <VideoMasonry videos={videos} />
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center py-20 text-center">
          <div className="rounded-full bg-zinc-100 p-6 dark:bg-zinc-800">
            <svg
              className=" h-10 w-10 text-zinc-400"
              fill="none"
              height="24"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-medium">No bookmarks yet</h3>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Click the bookmark icon on any video to save it here.
          </p>
        </div>
      )}
    </div>
  )
}

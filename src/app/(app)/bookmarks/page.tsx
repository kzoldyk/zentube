import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { getVideoDetails } from "@/services/youtube"
import { VideoMasonry } from "@/components/video-masonry"
import { redirect } from "next/navigation"
import { ZentubeVideo } from "@/types/youtube"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bookmark, Clock3 } from "lucide-react"

export default async function BookmarksPage() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect("/sign-in")
  }

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
    <div className="flex flex-1 flex-col p-4 sm:p-6">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <Card className="border border-border/80 bg-card/95 shadow-sm">
          <CardHeader className="gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-3">
              <Badge variant="outline" className="rounded-full px-2.5 py-1">
                <Bookmark className="size-3" />
                Saved library
              </Badge>
              <div className="space-y-1.5">
                <CardTitle className="text-3xl">Bookmarks</CardTitle>
                <CardDescription className="max-w-2xl">
                  Keep the videos worth returning to in one focused place.
                </CardDescription>
              </div>
            </div>

            <Card className="min-w-44 border border-border/70 bg-background py-0 shadow-none">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="rounded-2xl border bg-muted p-2.5">
                  <Clock3 className="size-4" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Saved videos
                  </p>
                  <p className="text-lg font-medium">{videos.length}</p>
                </div>
              </CardContent>
            </Card>
          </CardHeader>
        </Card>

        {videos.length > 0 ? (
          <VideoMasonry videos={videos} />
        ) : (
          <Card className="border-dashed py-0">
            <CardContent className="flex min-h-72 flex-col items-center justify-center gap-3 p-8 text-center">
              <div className="rounded-3xl border bg-muted p-4">
                <Bookmark className="size-6" />
              </div>
              <div className="space-y-1">
                <p className="text-lg font-medium">No bookmarks yet</p>
                <p className="text-sm text-muted-foreground">
                  Save videos from your feed and they will appear here.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

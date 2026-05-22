import { auth } from "@clerk/nextjs/server"
import Link from "next/link"
import { searchVideos } from "@/services/youtube"
import { prisma } from "@/lib/prisma"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search } from "lucide-react"
import { VideoMasonry } from "@/components/video-masonry"

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { userId } = await auth()
  if (!userId) return null

  const { q } = await searchParams
  const query = q?.trim() ?? ""

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      interests: true,
      bookmarks: {
        include: {
          video: true,
        },
      },
    },
  })

  const bookmarkedYoutubeIds = new Set(user?.bookmarks.map((bookmark) => bookmark.video.youtubeId) ?? [])
  const results = query ? await searchVideos(query, 24) : []
  const videos = results.map((video) => ({
    ...video,
    isBookmarked: bookmarkedYoutubeIds.has(video.id),
  }))

  return (
    <div className="flex flex-1 flex-col p-4 sm:p-6">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <Card className="border border-border/80 bg-card/95 shadow-sm">
          <CardHeader className="gap-3">
            <Badge variant="outline" className="w-fit rounded-full px-2.5 py-1">
              <Search className="size-3" />
              Search
            </Badge>
            <div className="space-y-1">
              <CardTitle className="text-2xl">
                {query ? `Results for "${query}"` : "Search for a video or topic"}
              </CardTitle>
              <CardDescription>
                Use the top search bar or press `Cmd/Ctrl + K` to start quickly.
              </CardDescription>
            </div>
          </CardHeader>
          {!query && user?.interests.length ? (
            <CardContent className="flex flex-wrap gap-2 pt-0">
              {user.interests.map((interest) => (
                <Badge key={interest.id} variant="secondary" className="rounded-full px-3 py-1.5">
                  <Link href={`/search?q=${encodeURIComponent(interest.topic)}`}>{interest.topic}</Link>
                </Badge>
              ))}
            </CardContent>
          ) : null}
        </Card>

        {query ? (
          videos.length ? (
            <VideoMasonry videos={videos} />
          ) : (
            <Card className="border-dashed py-0">
              <CardContent className="flex min-h-64 flex-col items-center justify-center gap-3 p-8 text-center">
                <div className="rounded-3xl border bg-muted p-4">
                  <Search className="size-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-medium">No results found</p>
                  <p className="text-sm text-muted-foreground">
                    Try a broader topic or search for one of your saved interests.
                  </p>
                </div>
              </CardContent>
            </Card>
          )
        ) : (
          <Card className="border-dashed py-0">
            <CardContent className="flex min-h-64 flex-col items-center justify-center gap-3 p-8 text-center">
              <div className="rounded-3xl border bg-muted p-4">
                <Search className="size-6" />
              </div>
              <div className="space-y-1">
                <p className="text-lg font-medium">Start with a search</p>
                <p className="text-sm text-muted-foreground">
                  The top bar now works globally, just like a proper watch app search flow.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

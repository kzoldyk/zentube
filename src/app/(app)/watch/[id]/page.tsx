import { getVideoDetails } from "@/services/youtube";
import { searchVideos } from "@/services/youtube";
import { VideoPlayer } from "@/components/video-player";
import { getWatchState } from "@/lib/actions/interactions";
import { notFound } from "next/navigation";
import { BookmarkButton } from "./bookmark-button";
import { CollectionButton } from "./collection-button";
import { VideoDescription } from "./video-description";
import { formatDate, formatViews } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Bookmark, Clock3, LayoutGrid, PlayCircle, Sparkles } from "lucide-react";

function formatProgress(seconds: number) {
  if (!seconds) return "Not started";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")} watched`;
}

export default async function WatchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const [videos, watchState] = await Promise.all([
    getVideoDetails(id),
    getWatchState(id)
  ]);

  const video = videos[0];

  if (!video) {
    notFound();
  }

  const recommendationQuery = `${video.channelTitle} ${video.title.split(" ").slice(0, 3).join(" ")}`
  const recommendedVideos = (await searchVideos(recommendationQuery, 6)).filter(
    (recommendedVideo) => recommendedVideo.id !== id
  )

  return (
    <div className="flex flex-1 flex-col pb-16">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-4 sm:px-6 sm:py-6">
        <Card className="overflow-hidden border border-border/80 bg-card/95 py-0 shadow-sm">
          <div className="border-b bg-muted/30 px-4 py-3 sm:px-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="rounded-full px-2.5 py-1">
                <PlayCircle className="size-3" />
                Watching now
              </Badge>
              <Badge variant="secondary" className="rounded-full px-2.5 py-1">
                <Clock3 className="size-3" />
                {formatProgress(watchState.progress)}
              </Badge>
            </div>
          </div>
          <div className="bg-black/5 p-0 dark:bg-black/30 md:p-5">
            <VideoPlayer videoId={id} initialProgress={watchState.progress} />
          </div>
        </Card>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="min-w-0 space-y-6">
            <Card className="border border-border/80 bg-card/95 shadow-sm">
              <CardHeader className="gap-5">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="rounded-full px-2.5 py-1">
                      <Sparkles className="size-3" />
                      Distraction-reduced
                    </Badge>
                    <Badge variant="secondary" className="rounded-full px-2.5 py-1">
                      {formatDate(video.publishedAt)}
                    </Badge>
                  </div>
                  <CardTitle className="text-3xl md:text-4xl">{video.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {formatViews(video.viewCount)} • {video.channelTitle}
                  </CardDescription>
                </div>

                <div className="flex flex-col gap-4 rounded-3xl border bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-center gap-4">
                    <Avatar className="size-14 border bg-background">
                      <AvatarFallback className="bg-muted text-base font-semibold text-foreground">
                        {video.channelTitle?.charAt(0) || "C"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-lg font-medium">{video.channelTitle}</p>
                      <p className="truncate text-sm text-muted-foreground">
                        Progress is saved automatically while you watch.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <BookmarkButton videoId={id} initialIsBookmarked={watchState.isBookmarked} />
                    <CollectionButton />
                  </div>
                </div>
              </CardHeader>
            </Card>

            <VideoDescription description={video.description} />
          </div>

          <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <Card className="border border-border/80 bg-card/95 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Current session</CardTitle>
                <CardDescription>
                  Your progress and saved actions stay attached to this video.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between rounded-2xl border bg-background px-4 py-3">
                  <div>
                    <p className="text-sm font-medium">Bookmark status</p>
                    <p className="text-sm text-muted-foreground">
                      {watchState.isBookmarked ? "Saved to bookmarks" : "Not saved yet"}
                    </p>
                  </div>
                  <Bookmark className="size-4 text-muted-foreground" />
                </div>
                <div className="flex items-center justify-between rounded-2xl border bg-background px-4 py-3">
                  <div>
                    <p className="text-sm font-medium">Playback progress</p>
                    <p className="text-sm text-muted-foreground">
                      {formatProgress(watchState.progress)}
                    </p>
                  </div>
                  <Clock3 className="size-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border/80 bg-card/95 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Recommended next</CardTitle>
                <CardDescription>
                  A quieter side rail based on this video and creator.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {recommendedVideos.slice(0, 5).map((recommendedVideo) => (
                  <Link
                    key={recommendedVideo.id}
                    href={`/watch/${recommendedVideo.id}`}
                    className="group flex gap-3 rounded-2xl border border-transparent p-2 transition-colors hover:border-border hover:bg-muted/30"
                  >
                    <div className="relative aspect-video w-36 shrink-0 overflow-hidden rounded-2xl border bg-muted">
                      <Image
                        src={recommendedVideo.thumbnailUrl}
                        alt={recommendedVideo.title}
                        fill
                        className="object-cover"
                        sizes="144px"
                      />
                    </div>
                    <div className="min-w-0 space-y-1">
                      <p className="line-clamp-2 text-sm font-medium leading-snug group-hover:text-foreground">
                        {recommendedVideo.title}
                      </p>
                      <p className="text-sm text-muted-foreground">{recommendedVideo.channelTitle}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(recommendedVideo.publishedAt)}</p>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>

            <Card className="border border-border/80 bg-card/95 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Quick navigation</CardTitle>
                <CardDescription>
                  Jump back into your library without leaving the current flow.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2">
                <Link
                  href="/feed"
                  className={buttonVariants({
                    variant: "outline",
                    className: "justify-start rounded-2xl",
                  })}
                >
                  <PlayCircle className="size-4" />
                  Back to feed
                </Link>
                <Link
                  href="/bookmarks"
                  className={buttonVariants({
                    variant: "outline",
                    className: "justify-start rounded-2xl",
                  })}
                >
                  <Bookmark className="size-4" />
                  Open bookmarks
                </Link>
                <Link
                  href="/collections"
                  className={buttonVariants({
                    variant: "outline",
                    className: "justify-start rounded-2xl",
                  })}
                >
                  <LayoutGrid className="size-4" />
                  View collections
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

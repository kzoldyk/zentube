import { getVideoDetails, getRelatedVideos } from "@/services/youtube";
import { VideoPlayer } from "@/components/video-player";
import { getWatchState } from "@/lib/actions/interactions";
import { notFound } from "next/navigation";
import { BookmarkButton } from "./bookmark-button";
import { CollectionButton } from "./collection-button";
import { VideoDescription } from "./video-description";
import { formatDate, formatViews } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { VideoMasonry } from "@/components/video-masonry";

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

  // Fetch related videos
  const { videos: relatedVideos } = await getRelatedVideos(video, 12);

  return (
    <div className="flex flex-1 flex-col items-center pb-20">
      {/* Player Section - Full width on mobile, container on desktop */}
      <div className="w-full bg-black/5 dark:bg-black/40">
        <div className="mx-auto max-w-6xl px-0 md:px-6 md:py-8 lg:py-12">
           <VideoPlayer videoId={id} initialProgress={watchState.progress} />
        </div>
      </div>

      {/* Metadata Section */}
      <div className="mx-auto w-full max-w-6xl px-6 py-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-1 space-y-4">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl text-balance">
              {video.title}
            </h1>
            
            <div className="flex items-center gap-4">
              <Avatar className="size-12 border">
                <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 font-semibold">
                  {video.channelTitle?.charAt(0) || "C"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-lg font-medium leading-none">
                  {video.channelTitle}
                </span>
                <div className="mt-1.5 flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{formatViews(video.viewCount)}</span>
                  <span className="opacity-50">•</span>
                  <span>{formatDate(video.publishedAt)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <BookmarkButton videoId={id} initialIsBookmarked={watchState.isBookmarked} />
            <CollectionButton />
          </div>
        </div>

        <VideoDescription description={video.description} />

        {/* Discovery Section */}
        <div className="mt-20 space-y-8">
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-bold tracking-tight">Recommended Discovery</h3>
            <p className="text-muted-foreground">More videos similar to this one, distilled for your focus.</p>
          </div>
          <VideoMasonry videos={relatedVideos} />
        </div>
      </div>
    </div>
  );
}

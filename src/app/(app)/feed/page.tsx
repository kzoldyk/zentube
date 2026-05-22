import { auth } from "@clerk/nextjs/server";
import { getUserFeed } from "@/lib/feed";
import { VideoMasonry } from "@/components/video-masonry";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default async function FeedPage() {
  const { userId } = await auth();
  
  if (!userId) {
    return null;
  }

  const videos = await getUserFeed(userId)

  return (
    <div className="flex flex-1 flex-col p-4 sm:p-6">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <Card className="border border-border/80 bg-card/95 shadow-sm">
          <CardHeader className="gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-3">
              <Badge variant="outline" className="rounded-full px-2.5 py-1">
                <Sparkles className="size-3" />
                Personalized feed
              </Badge>
              <div className="space-y-1.5">
                <CardTitle className="text-2xl">Your feed</CardTitle>
                <CardDescription className="max-w-2xl text-sm">
                  Clean recommendations shaped by what you selected, without extra noise.
                </CardDescription>
              </div>
            </div>
            <Link
              href="/settings"
              className={buttonVariants({
                variant: "outline",
                className: "rounded-full px-4",
              })}
            >
              Feed settings
            </Link>
          </CardHeader>
        </Card>

        {videos.length > 0 ? (
          <VideoMasonry videos={videos} />
        ) : (
          <Card className="border-dashed py-0">
            <CardContent className="flex min-h-72 flex-col items-center justify-center gap-3 p-8 text-center">
              <div className="rounded-3xl border bg-muted p-4">
                <Sparkles className="size-6" />
              </div>
              <div className="space-y-1">
                <p className="text-lg font-medium">No videos found yet</p>
                <p className="text-sm text-muted-foreground">
                  Update your interests to refresh the feed with better matches.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

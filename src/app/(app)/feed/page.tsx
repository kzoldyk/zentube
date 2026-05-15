import { auth } from "@clerk/nextjs/server";
import { getUserFeed } from "@/lib/feed";
import { VideoMasonry } from "@/components/video-masonry";

export default async function FeedPage() {
  const { userId } = await auth();
  
  if (!userId) {
    return null;
  }

  const videos = await getUserFeed(userId);

  return (
    <div className="flex flex-1 flex-col p-6">
      <div className="max-w-4xl mb-8">
        <h2 className="text-2xl font-semibold tracking-tight">Your Feed</h2>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          Showing curated videos for your interests.
        </p>
      </div>

      <VideoMasonry videos={videos} />
      
      {videos.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-zinc-500">No videos found based on your interests.</p>
          <p className="text-sm text-zinc-400 mt-1">Try updating your interests in settings.</p>
        </div>
      )}
    </div>
  );
}

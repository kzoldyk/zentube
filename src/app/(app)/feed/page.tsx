import { auth } from "@clerk/nextjs/server";
import { getUserFeed } from "@/lib/feed";
import { PaginatedMasonry } from "@/components/paginated-masonry";
import { loadMoreFeed } from "@/lib/actions/pagination";

export default async function FeedPage() {
  const { userId } = await auth();
  
  if (!userId) {
    return null;
  }

  const { videos, hasMore } = await getUserFeed(userId);

  return (
    <div className="flex flex-1 flex-col p-6">
      <div className="max-w-4xl mb-8">
        <h2 className="text-2xl font-semibold tracking-tight">Your Feed</h2>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          Showing curated videos for your interests.
        </p>
      </div>

      {videos.length > 0 ? (
        <PaginatedMasonry 
          initialVideos={videos} 
          initialNextPageToken={hasMore ? "1" : undefined}
          fetchNextPage={loadMoreFeed}
        />
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-zinc-500">No videos found based on your interests.</p>
          <p className="text-sm text-zinc-400 mt-1">Try updating your interests in settings.</p>
        </div>
      )}
    </div>
  );
}

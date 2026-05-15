import { searchVideos } from "@/services/youtube";
import { VideoCard } from "@/components/video-card";

export default async function FeedPage() {
  const videos = await searchVideos("Lofi hip hop mix", 12);

  return (
    <div className="flex flex-1 flex-col p-6">
      <h2 className="text-2xl font-semibold tracking-tight">Your Feed</h2>
      <p className="mt-2 text-zinc-500 dark:text-zinc-400">
        Showing curated videos for your interests.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {videos.map((video, index) => (
          <VideoCard 
            key={video.id} 
            video={video} 
            priority={index < 4}
          />
        ))}
      </div>
    </div>
  );
}

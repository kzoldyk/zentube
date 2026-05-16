import { 
  YouTubeSearchResponse, 
  YouTubeVideoListResponse, 
  ZentubeVideo 
} from "@/types/youtube";

const YOUTUBE_API_BASE_URL = "https://www.googleapis.com/youtube/v3";
const API_KEY = process.env.YOUTUBE_API_KEY;

/**
 * Generic fetch wrapper for YouTube API with caching
 */
async function youtubeFetch<T>(
  endpoint: string,
  params: Record<string, string>,
  revalidate = 3600 // Cache for 1 hour by default
): Promise<T> {
  if (!API_KEY) {
    throw new Error("YOUTUBE_API_KEY is not defined in environment variables");
  }

  const queryParams = new URLSearchParams({
    ...params,
    key: API_KEY,
  });

  const url = `${YOUTUBE_API_BASE_URL}${endpoint}?${queryParams.toString()}`;

  const response = await fetch(url, {
    next: { revalidate },
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("YouTube API Error:", error);
    throw new Error(`YouTube API error: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Search for videos based on a query with pagination support
 */
export async function searchVideos(
  query: string,
  maxResults = 12,
  pageToken?: string
): Promise<{ videos: ZentubeVideo[]; nextPageToken?: string }> {
  const params: Record<string, string> = {
    part: "snippet",
    q: query,
    type: "video",
    maxResults: maxResults.toString(),
    safeSearch: "moderate",
  }

  if (pageToken) {
    params.pageToken = pageToken
  }

  const data = await youtubeFetch<YouTubeSearchResponse>("/search", params)

  const videos = data.items
    .filter((item) => item.id.videoId) // Ensure it's a video
    .map((item) => ({
      id: item.id.videoId!,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnailUrl: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url || "",
      channelId: item.snippet.channelId,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
    }))

  return {
    videos,
    nextPageToken: data.nextPageToken,
  }
}

/**
 * Get full details for a specific video (or multiple videos)
 */
export async function getVideoDetails(
  videoIds: string | string[]
): Promise<ZentubeVideo[]> {
  const ids = Array.isArray(videoIds) ? videoIds.join(",") : videoIds;
  
  const data = await youtubeFetch<YouTubeVideoListResponse>("/videos", {
    part: "snippet,contentDetails,statistics",
    id: ids,
  });

  return data.items.map((item) => ({
    id: item.id,
    title: item.snippet.title,
    description: item.snippet.description,
    thumbnailUrl: item.snippet.thumbnails.maxres?.url || item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url || "",
    channelId: item.snippet.channelId,
    channelTitle: item.snippet.channelTitle,
    publishedAt: item.snippet.publishedAt,
    duration: item.contentDetails.duration,
    viewCount: item.statistics.viewCount,
  }));
}

/**
 * Get related videos based on title and channel (Fallback for deprecated relatedToVideoId)
 */
export async function getRelatedVideos(
  video: ZentubeVideo,
  maxResults = 12
): Promise<{ videos: ZentubeVideo[]; nextPageToken?: string }> {
  // Use first 5 words of title + channel title for a relevant search
  const keywords = video.title.split(" ").slice(0, 5).join(" ")
  const query = `${keywords} ${video.channelTitle}`
  
  return searchVideos(query, maxResults)
}

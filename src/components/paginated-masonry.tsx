"use client"

import * as React from "react"
import { ZentubeVideo } from "@/types/youtube"
import { VideoMasonry } from "@/components/video-masonry"
import { InfiniteScrollObserver } from "@/components/infinite-scroll-observer"

interface PaginatedMasonryProps {
  initialVideos: (ZentubeVideo & { isBookmarked?: boolean })[]
  initialNextPageToken?: string
  fetchNextPage: (pageToken: string) => Promise<{ 
    videos: (ZentubeVideo & { isBookmarked?: boolean })[]; 
    nextPageToken?: string 
  }>
}

export function PaginatedMasonry({
  initialVideos,
  initialNextPageToken,
  fetchNextPage,
}: PaginatedMasonryProps) {
  const [videos, setVideos] = React.useState(initialVideos)
  const [nextPageToken, setNextPageToken] = React.useState(initialNextPageToken)
  const [isLoading, setIsLoading] = React.useState(false)

  const handleLoadMore = async () => {
    if (!nextPageToken || isLoading) return

    setIsLoading(true)
    try {
      const result = await fetchNextPage(nextPageToken)
      
      // Filter out any potential duplicates by ID just in case
      const existingIds = new Set(videos.map(v => v.id))
      const newVideos = result.videos.filter(v => !existingIds.has(v.id))
      
      setVideos(prev => [...prev, ...newVideos])
      setNextPageToken(result.nextPageToken)
    } catch (error) {
      console.error("Failed to fetch next page:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col w-full">
      <VideoMasonry videos={videos} />
      <InfiniteScrollObserver
        onIntersect={handleLoadMore}
        isLoading={isLoading}
        hasMore={!!nextPageToken}
      />
    </div>
  )
}

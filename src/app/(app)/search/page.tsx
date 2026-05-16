import { Suspense } from "react"
import { searchVideos } from "@/services/youtube"
import { PaginatedMasonry } from "@/components/paginated-masonry"
import { ZentubeVideo } from "@/types/youtube"
import { SearchInput } from "./search-input"
import { loadMoreSearch } from "@/lib/actions/pagination"

interface SearchPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams
  const query = typeof q === "string" ? q : undefined

  let videos: ZentubeVideo[] = []
  let nextPageToken: string | undefined = undefined

  if (query) {
    const result = await searchVideos(query, 24)
    videos = result.videos
    nextPageToken = result.nextPageToken
  }

  return (
    <div className="flex flex-1 flex-col p-6 overflow-y-auto">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex flex-col mb-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight">Discover</h2>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">
            Search for your favorite topics without the noise.
          </p>
        </div>

        <Suspense fallback={<div className="h-12 w-full max-w-2xl mx-auto bg-zinc-100 dark:bg-zinc-900 rounded-2xl animate-pulse mb-8" />}>
          <SearchInput />
        </Suspense>

        {query ? (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between border-b-hairline pb-4">
              <h3 className="text-lg font-semibold">
                Results for &quot;{query}&quot;
              </h3>
              <p className="text-sm text-muted-foreground">
                Showing top results
              </p>
            </div>
            
            {videos.length > 0 ? (
              <PaginatedMasonry 
                initialVideos={videos} 
                initialNextPageToken={nextPageToken}
                fetchNextPage={loadMoreSearch.bind(null, query)}
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-lg font-medium">No videos found.</p>
                <p className="text-muted-foreground mt-1">Try a different search term.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="size-20 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mb-6">
              <span className="text-4xl text-zinc-300 dark:text-zinc-700">🔍</span>
            </div>
            <p className="text-lg font-medium">Ready to explore?</p>
            <p className="text-muted-foreground mt-1 text-balance max-w-md mx-auto">
              Type anything above to find high-quality content across YouTube, distilled for your focus.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

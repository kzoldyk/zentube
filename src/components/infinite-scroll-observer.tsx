"use client"

import * as React from "react"

interface InfiniteScrollObserverProps {
  onIntersect: () => void
  isLoading?: boolean
  hasMore?: boolean
}

export function InfiniteScrollObserver({
  onIntersect,
  isLoading,
  hasMore,
}: InfiniteScrollObserverProps) {
  const observerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!hasMore || isLoading) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onIntersect()
        }
      },
      { threshold: 0.1, rootMargin: "200px" }
    )

    if (observerRef.current) {
      observer.observe(observerRef.current)
    }

    return () => observer.disconnect()
  }, [onIntersect, hasMore, isLoading])

  if (!hasMore) return null

  return (
    <div ref={observerRef} className="flex items-center justify-center py-10 w-full h-20">
      {isLoading && (
        <div className="flex gap-2 items-center text-zinc-500 animate-pulse">
          <div className="size-2 rounded-full bg-zinc-300 dark:bg-zinc-700" />
          <div className="size-2 rounded-full bg-zinc-400 dark:bg-zinc-600" />
          <div className="size-2 rounded-full bg-zinc-300 dark:bg-zinc-700" />
          <span className="text-sm font-medium ml-2">Loading more curated content...</span>
        </div>
      )}
    </div>
  )
}

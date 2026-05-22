"use client"

import { useState, useTransition } from "react"
import { Bookmark, BookmarkCheck, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toggleBookmark } from "@/lib/actions/interactions"
import { cn } from "@/lib/utils"

interface BookmarkButtonProps {
  videoId: string
  initialIsBookmarked: boolean
}

export function BookmarkButton({ videoId, initialIsBookmarked }: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked)
  const [isPending, startTransition] = useTransition()

  const handleToggle = async () => {
    // Optimistic update
    setIsBookmarked(!isBookmarked)
    
    startTransition(async () => {
      try {
        await toggleBookmark(videoId)
      } catch (error) {
        // Revert on error
        setIsBookmarked(isBookmarked)
        console.error("Failed to toggle bookmark:", error)
      }
    })
  }

  return (
    <Button
      variant={isBookmarked ? "secondary" : "outline"}
      size="lg"
      className={cn("min-w-[140px] gap-2 rounded-full px-4 transition-all duration-300")}
      onClick={handleToggle}
      disabled={isPending}
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isBookmarked ? (
        <BookmarkCheck className="h-4 w-4" />
      ) : (
        <Bookmark className="h-4 w-4" />
      )}
      {isBookmarked ? "Bookmarked" : "Bookmark"}
    </Button>
  )
}

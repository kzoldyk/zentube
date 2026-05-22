"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Bookmark, Play, Sparkles } from "lucide-react"
import { ZentubeVideo } from "@/types/youtube"
import { cn, formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { toggleBookmark } from "@/lib/actions/interactions"
import { useOptimistic, useTransition } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { buttonVariants } from "@/components/ui/button"

interface VideoCardProps {
  video: ZentubeVideo
  className?: string
  priority?: boolean
  isBookmarked?: boolean
  featured?: boolean
}

export function VideoCard({
  video,
  className,
  priority,
  isBookmarked = false,
  featured = false,
}: VideoCardProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [optimisticBookmarked, setOptimisticBookmarked] = useOptimistic(
    isBookmarked,
    (state, newState: boolean) => newState
  )

  const handleToggleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    startTransition(async () => {
      const newState = !optimisticBookmarked
      setOptimisticBookmarked(newState)
      try {
        await toggleBookmark(video.id)
      } catch (error) {
        console.error("Failed to toggle bookmark:", error)
      }
    })
  }

  const handleOpenVideo = () => {
    router.push(`/watch/${video.id}`)
  }

  const handleCardKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      handleOpenVideo()
    }
  }

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 280, damping: 24 }}
      className={cn("group", className)}
    >
      <Card
        role="link"
        tabIndex={0}
        onClick={handleOpenVideo}
        onKeyDown={handleCardKeyDown}
        className="cursor-pointer overflow-hidden border border-border/80 bg-card/95 py-0 shadow-sm transition-shadow duration-200 group-hover:shadow-md"
      >
        <div
          className={cn(
            "relative overflow-hidden",
            featured ? "aspect-[16/9] md:aspect-[21/9]" : "aspect-video"
          )}
        >
          <Link
            href={`/watch/${video.id}`}
            className="relative block h-full w-full"
            tabIndex={-1}
            aria-hidden="true"
          >
            <Image
              src={video.thumbnailUrl}
              alt={video.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              sizes={
                featured
                  ? "(max-width: 768px) 100vw, (max-width: 1280px) 66vw, 50vw"
                  : "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              }
              priority={priority}
            />
          </Link>

          <div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/10 to-transparent" />

          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
            <Badge variant="secondary" className="rounded-full border border-white/15 bg-black/35 text-white backdrop-blur-md">
              <Sparkles className="size-3" />
              Curated
            </Badge>
            <Button
              variant="outline"
              size="icon-sm"
              aria-label={optimisticBookmarked ? "Remove from bookmarks" : "Save to bookmarks"}
              className={cn(
                "rounded-full border-white/15 bg-black/35 text-white backdrop-blur-md hover:bg-black/50 hover:text-white",
                optimisticBookmarked && "bg-white text-foreground hover:bg-white/90 hover:text-foreground"
              )}
              onClick={handleToggleBookmark}
              disabled={isPending}
            >
              <Bookmark className={cn("size-4", optimisticBookmarked && "fill-current")} />
            </Button>
          </div>

          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 text-white">
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-[0.18em] text-white/70">
                {video.channelTitle}
              </p>
              <h3
                className={cn(
                  "mt-1 line-clamp-2 font-medium tracking-tight",
                  featured ? "text-2xl md:text-3xl" : "text-lg"
                )}
              >
                {video.title}
              </h3>
            </div>
            <div className="hidden rounded-full border border-white/15 bg-white/10 p-3 backdrop-blur-md sm:block">
              <Play className="size-4 fill-current" />
            </div>
          </div>
        </div>

        <CardContent className="space-y-4 px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <Avatar className="size-10 border bg-muted">
                <AvatarFallback className="bg-muted text-sm font-medium text-foreground">
                  {video.channelTitle?.charAt(0) ?? "Y"}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{video.channelTitle}</p>
                <p className="truncate text-sm text-muted-foreground">
                  {formatDate(video.publishedAt)}
                </p>
              </div>
            </div>

            <Link
              href={`/watch/${video.id}`}
              className={buttonVariants({
                variant: "ghost",
                size: "sm",
                className: "rounded-full px-3",
              })}
            >
              Watch
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.article>
  )
}

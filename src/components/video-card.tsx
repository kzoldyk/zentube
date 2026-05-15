"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Bookmark } from "lucide-react"
import { ZentubeVideo } from "@/types/youtube"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface VideoCardProps {
  video: ZentubeVideo
  className?: string
}

export function VideoCard({ video, className }: VideoCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn("group flex flex-col gap-2", className)}
    >
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800">
        <Link href={`/watch/${video.id}`} className="block h-full w-full">
          <Image
            src={video.thumbnailUrl}
            alt={video.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>
        
        <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button
            variant="ghost"
            size="icon-sm"
            className="h-8 w-8 rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm hover:bg-white dark:hover:bg-zinc-900"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
          >
            <Bookmark className="size-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-1 px-1">
        <Link href={`/watch/${video.id}`}>
          <h3 className="text-sm font-medium tracking-tight leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {video.title}
          </h3>
        </Link>
        <p className="text-xs text-zinc-500 line-clamp-1">
          {video.channelTitle}
        </p>
      </div>
    </motion.div>
  )
}

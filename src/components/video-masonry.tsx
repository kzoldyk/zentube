"use client"

import { motion } from "framer-motion"
import { ZentubeVideo } from "@/types/youtube"
import { VideoCard } from "@/components/video-card"

interface VideoMasonryProps {
  videos: ZentubeVideo[]
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  },
}

export function VideoMasonry({ videos }: VideoMasonryProps) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6"
    >
      {videos.map((video) => (
        <motion.div
          key={video.id}
          variants={item}
          className="break-inside-avoid mb-6"
        >
          <VideoCard video={video} />
        </motion.div>
      ))}
    </motion.div>
  )
}

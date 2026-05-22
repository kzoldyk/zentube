"use client"

import { motion, Variants } from "framer-motion"
import { ZentubeVideo } from "@/types/youtube"
import { VideoCard } from "@/components/video-card"

interface VideoMasonryProps {
  videos: (ZentubeVideo & { isBookmarked?: boolean })[]
}

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
}

const item: Variants = {
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
      className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3"
    >
      {videos.map((video, index) => (
        <motion.div
          key={video.id}
          variants={item}
          className={index === 0 ? "md:col-span-2 2xl:col-span-2" : undefined}
        >
          <VideoCard 
            video={video} 
            isBookmarked={video.isBookmarked}
            priority={index < 4}
            featured={index === 0}
          />
        </motion.div>
      ))}
    </motion.div>
  )
}

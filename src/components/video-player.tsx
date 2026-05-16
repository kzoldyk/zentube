"use client"

import { useEffect, useRef } from "react"
import { updateProgress } from "@/lib/actions/interactions"

interface VideoPlayerProps {
  videoId: string
  initialProgress?: number
}

interface YTPlayer {
  destroy(): void
  getCurrentTime(): number
  getPlayerState(): number
}

interface YTPlayerOptions {
  videoId: string
  width: string | number
  height: string | number
  playerVars?: {
    start?: number
    autoplay?: number
    modestbranding?: number
    rel?: number
  }
  events?: {
    onStateChange?: (event: { data: number }) => void
  }
}

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void
    YT: {
      Player: new (element: HTMLElement | null, options: YTPlayerOptions) => YTPlayer
      PlayerState: {
        PLAYING: number
        PAUSED: number
        ENDED: number
        BUFFERING: number
        CUED: number
      }
    }
  }
}

// Global flag to track if the YouTube API script has been loaded
let isApiLoaded = false
// Queue of initialization functions to run when the API is ready
const apiReadyQueue: (() => void)[] = []

export function VideoPlayer({ videoId, initialProgress = 0 }: VideoPlayerProps) {
  const playerRef = useRef<YTPlayer | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const lastSavedTime = useRef<number>(initialProgress)

  useEffect(() => {
    const initPlayer = () => {
      if (!containerRef.current) return

      // If a player already exists, destroy it before creating a new one
      if (playerRef.current && typeof playerRef.current.destroy === "function") {
        playerRef.current.destroy()
      }

      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId: videoId,
        width: "100%",
        height: "100%",
        playerVars: {
          start: Math.floor(initialProgress),
          autoplay: 1,
          modestbranding: 1,
          rel: 0,
        },
        events: {
          onStateChange: (event: { data: number }) => {
            // YT.PlayerState.PAUSED = 2
            if (event.data === window.YT.PlayerState.PAUSED) {
              saveProgress()
            }
          },
        },
      })
    }

    const saveProgress = () => {
      if (playerRef.current && typeof playerRef.current.getCurrentTime === "function") {
        const currentTime = Math.floor(playerRef.current.getCurrentTime())
        if (currentTime !== lastSavedTime.current) {
          updateProgress(videoId, currentTime)
          lastSavedTime.current = currentTime
        }
      }
    }

    const onApiReady = () => {
      isApiLoaded = true
      while (apiReadyQueue.length > 0) {
        const cb = apiReadyQueue.shift()
        if (cb) cb()
      }
    }

    if (!isApiLoaded) {
      if (!window.onYouTubeIframeAPIReady) {
        const tag = document.createElement('script')
        tag.src = "https://www.youtube.com/iframe_api"
        const firstScriptTag = document.getElementsByTagName('script')[0]
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)
        window.onYouTubeIframeAPIReady = onApiReady
      }
      apiReadyQueue.push(initPlayer)
    } else if (window.YT && window.YT.Player) {
      initPlayer()
    } else {
      // API script is loading but not yet finished
      apiReadyQueue.push(initPlayer)
    }

    const intervalId = setInterval(() => {
      if (playerRef.current && typeof playerRef.current.getPlayerState === "function") {
        // Only save if the video is currently playing
        if (playerRef.current.getPlayerState() === window.YT.PlayerState.PLAYING) {
          saveProgress()
        }
      }
    }, 10000)

    return () => {
      clearInterval(intervalId)
      saveProgress()
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        playerRef.current.destroy()
        playerRef.current = null
      }
    }
  }, [videoId, initialProgress])

  return (
    <div className="relative aspect-video w-full bg-black overflow-hidden rounded-xl shadow-2xl border border-white/10 group">
      <div ref={containerRef} className="w-full h-full" />
      {/* Overlay to catch clicks if needed or for custom UI, but we want YT controls for now */}
    </div>
  )
}

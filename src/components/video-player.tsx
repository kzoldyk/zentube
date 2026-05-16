"use client"

import { useEffect, useRef, useState } from "react"
import { updateProgress } from "@/lib/actions/interactions"

interface VideoPlayerProps {
  videoId: string
  initialProgress?: number
}

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void
    YT: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Player: any
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

// Track script loading globally to prevent duplicate tags
let isScriptLoading = false

export function VideoPlayer({ videoId, initialProgress = 0 }: VideoPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null)
  const [isApiReady, setIsApiReady] = useState(false)
  const [mounted, setMounted] = useState(false)
  const lastSavedTime = useRef<number>(initialProgress)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    let isComponentMounted = true

    const initPlayer = () => {
      // Check if we have everything needed and haven't already initialized
      if (!isComponentMounted || !iframeRef.current || !window.YT?.Player || playerRef.current) return

      try {
        console.log("Upgrading YouTube Player with API for tracking...")
        playerRef.current = new window.YT.Player(iframeRef.current, {
          events: {
            onReady: () => {
              if (isComponentMounted) {
                console.log("YouTube API Connected")
                setIsApiReady(true)
              }
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onStateChange: (event: any) => {
              if (event.data === window.YT.PlayerState.PAUSED) {
                saveProgress()
              }
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onError: (err: any) => {
              console.error("YouTube Player Error Code:", err.data)
            },
          },
        })
      } catch (err) {
        console.error("Error attaching YouTube API:", err)
      }
    }

    const saveProgress = () => {
      const currentPlayer = playerRef.current
      if (currentPlayer && typeof currentPlayer.getCurrentTime === "function") {
        try {
          const currentTime = Math.floor(currentPlayer.getCurrentTime())
          if (currentTime !== lastSavedTime.current) {
            updateProgress(videoId, currentTime)
            lastSavedTime.current = currentTime
          }
        } catch {
          // Ignore errors
        }
      }
    }

    // Script Loading & API Ready Handling
    if (!window.YT) {
      if (!isScriptLoading) {
        isScriptLoading = true
        const tag = document.createElement("script")
        tag.src = "https://www.youtube.com/iframe_api"
        const firstScriptTag = document.getElementsByTagName("script")[0]
        if (firstScriptTag?.parentNode) {
          firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
        } else {
          document.head.appendChild(tag)
        }
      }

      const prevCallback = window.onYouTubeIframeAPIReady
      window.onYouTubeIframeAPIReady = () => {
        if (prevCallback) prevCallback()
        if (isComponentMounted) initPlayer()
      }
    } else if (window.YT && window.YT.Player) {
      initPlayer()
    }

    const intervalId = setInterval(() => {
      const currentPlayer = playerRef.current
      if (currentPlayer && typeof currentPlayer.getPlayerState === "function") {
        try {
          if (currentPlayer.getPlayerState() === window.YT.PlayerState.PLAYING) {
            saveProgress()
          }
        } catch {
          // Ignore
        }
      }
    }, 10000)

    return () => {
      isComponentMounted = false
      clearInterval(intervalId)
      saveProgress()
      if (playerRef.current && typeof playerRef.current.destroy === "function") {
        try {
          playerRef.current.destroy()
        } catch {
          // Ignore
        }
        playerRef.current = null
      }
    }
  }, [videoId, mounted])

  if (!mounted) {
    return (
      <div className="relative aspect-video w-full bg-zinc-950 overflow-hidden rounded-2xl shadow-2xl border border-white/5" />
    )
  }

  // Construct URL with necessary parameters
  const params = new URLSearchParams({
    enablejsapi: "1",
    origin: window.location.origin,
    start: Math.floor(initialProgress).toString(),
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
    autoplay: "0",
  })

  // Use youtube-nocookie.com for better privacy and compatibility with Chrome settings
  const videoUrl = `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`

  return (
    <div className="relative aspect-video w-full bg-zinc-950 overflow-hidden rounded-2xl shadow-2xl border border-white/5 group">
      <iframe
        ref={iframeRef}
        src={videoUrl}
        className="w-full h-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        title="YouTube video player"
      />
      
      {/* Visual indicator of API connection status (optional, subtle) */}
      {!isApiReady && (
        <div className="absolute top-4 right-4 flex items-center gap-2 px-2 py-1 rounded bg-black/50 backdrop-blur-sm border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="size-2 bg-zinc-500 rounded-full animate-pulse" />
          <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-tighter">
            Basic Mode
          </span>
        </div>
      )}
    </div>
  )
}

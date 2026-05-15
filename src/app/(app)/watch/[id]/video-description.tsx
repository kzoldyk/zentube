"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface VideoDescriptionProps {
  description: string
}

export function VideoDescription({ description }: VideoDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!description) return null

  const lines = description.split('\n')
  const shouldTruncate = lines.length > 3 || description.length > 200

  return (
    <div className="mt-6 rounded-xl bg-muted/50 p-4 transition-colors hover:bg-muted/80">
      <div className={`whitespace-pre-wrap text-sm leading-relaxed ${!isExpanded && shouldTruncate ? "line-clamp-3" : ""}`}>
        {description}
      </div>
      {shouldTruncate && (
        <Button
          variant="ghost"
          size="sm"
          className="mt-2 h-auto p-0 font-medium hover:bg-transparent"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "Show less" : "Read more"}
        </Button>
      )}
    </div>
  )
}

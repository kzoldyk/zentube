"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface VideoDescriptionProps {
  description: string
}

export function VideoDescription({ description }: VideoDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!description) return null

  const lines = description.split('\n')
  const shouldTruncate = lines.length > 3 || description.length > 200

  return (
    <Card className="mt-6 border border-border/80 bg-card/95 shadow-sm">
      <CardHeader className="pb-0">
        <CardTitle className="text-base">About this video</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className={`whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground ${!isExpanded && shouldTruncate ? "line-clamp-4" : ""}`}>
          {description}
        </div>
        {shouldTruncate && (
          <Button
            variant="ghost"
            size="sm"
            className="h-auto rounded-full px-0 font-medium hover:bg-transparent"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Show less" : "Read more"}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

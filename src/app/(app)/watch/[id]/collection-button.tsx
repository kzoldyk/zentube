"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CollectionButton() {
  return (
    <Button
      variant="outline"
      size="lg"
      className="gap-2"
      onClick={() => alert("Collections feature coming soon!")}
    >
      <Plus className="h-4 w-4" />
      Add to Collection
    </Button>
  )
}

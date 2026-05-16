"use client"

import * as React from "react"
import { Search } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"

export function SearchInput() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = React.useState(searchParams.get("q") || "")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    router.push(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-2xl mx-auto mb-8">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search for videos on YouTube..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-10 h-12 rounded-2xl bg-zinc-100/50 border-hairline focus-visible:ring-1 focus-visible:ring-primary dark:bg-zinc-900/50"
      />
    </form>
  )
}

"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Command, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"

const quickLinks = [
  { label: "Design systems", href: "/search?q=design%20systems" },
  { label: "Deep work", href: "/search?q=deep%20work" },
  { label: "Photography", href: "/search?q=photography" },
]

export function GlobalSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeQuery = searchParams.get("q") ?? ""

  const [isOpen, setIsOpen] = React.useState(false)
  const paletteInputRef = React.useRef<HTMLInputElement | null>(null)

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        setIsOpen(true)
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  React.useEffect(() => {
    if (!isOpen) return

    const frame = window.requestAnimationFrame(() => {
      paletteInputRef.current?.focus()
      paletteInputRef.current?.select()
    })

    return () => window.cancelAnimationFrame(frame)
  }, [isOpen])

  const runSearch = (query: string) => {
    const trimmed = query.trim()
    if (!trimmed) {
      router.push("/search")
      return
    }

    router.push(`/search?q=${encodeURIComponent(trimmed)}`)
  }

  const handleInlineSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    runSearch(String(formData.get("q") ?? ""))
  }

  const handlePaletteSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsOpen(false)
    const formData = new FormData(event.currentTarget)
    runSearch(String(formData.get("q") ?? ""))
  }

  return (
    <>
      <form
        key={`inline-${activeQuery}`}
        onSubmit={handleInlineSubmit}
        className="hidden w-full max-w-xl items-center gap-2 lg:flex"
        role="search"
      >
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            name="q"
            defaultValue={activeQuery}
            placeholder="Search videos"
            className="h-10 rounded-full border-border/80 bg-card pl-10 pr-24"
          />
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="absolute top-1/2 right-2 inline-flex -translate-y-1/2 items-center gap-1 rounded-full border bg-background px-2 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <Command className="size-3" />
            K
          </button>
        </div>
        <Button type="submit" variant="outline" className="rounded-full px-4">
          Search
        </Button>
      </form>

      <Button
        variant="outline"
        size="icon-sm"
        className="rounded-full lg:hidden"
        onClick={() => setIsOpen(true)}
        aria-label="Open search"
      >
        <Search className="size-4" />
      </Button>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="top" className="mx-auto mt-4 w-[min(52rem,calc(100vw-2rem))] rounded-3xl border p-0 shadow-2xl">
          <SheetHeader className="border-b px-5 pt-5 pb-4">
            <SheetTitle>Search Zentube</SheetTitle>
            <SheetDescription>
              Jump to any topic or video with the same quick flow you expect from a watch app.
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-5 p-5">
            <form
              key={`palette-${activeQuery}`}
              onSubmit={handlePaletteSubmit}
              className="flex items-center gap-3"
              role="search"
            >
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  ref={paletteInputRef}
                  name="q"
                  defaultValue={activeQuery}
                  placeholder="Search for videos, creators, or topics"
                  className="h-12 rounded-2xl bg-card pl-11 text-base"
                />
              </div>
              <Button type="submit" className="rounded-2xl px-5">
                Search
              </Button>
            </form>

            <div className="space-y-3">
              <p className="text-sm font-medium">Quick picks</p>
              <div className="flex flex-wrap gap-2">
                {quickLinks.map((link) => (
                  <Badge key={link.href} variant="secondary" className="rounded-full px-3 py-1.5">
                    <Link href={link.href} onClick={() => setIsOpen(false)}>
                      {link.label}
                    </Link>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}

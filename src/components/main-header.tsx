"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs"
import { Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { SidebarNav } from "@/components/sidebar-nav"
import { useAppShell } from "@/components/app-shell-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import { GlobalSearch } from "@/components/global-search"

const routeMeta: Record<string, { label: string; description: string }> = {
  "/": { label: "Home", description: "Minimal video watching." },
  "/feed": { label: "Feed", description: "Focused picks based on your interests." },
  "/bookmarks": { label: "Bookmarks", description: "Saved videos only." },
  "/collections": { label: "Collections", description: "Organize your library." },
  "/search": { label: "Search", description: "Explore intentionally." },
  "/settings": { label: "Settings", description: "Your feed inputs and preferences." },
}

export function MainHeader() {
  const pathname = usePathname()
  const currentRoute = routeMeta[pathname] ?? {
    label: "Zentube",
    description: "A calmer way to watch.",
  }
  const { sidebarCollapsed, setSidebarCollapsed } = useAppShell()

  return (
    <header className="sticky top-0 z-50 border-b-hairline bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-[1600px] items-center gap-3 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-2">
          <Sheet>
            <SheetTrigger
              render={
                <Button
                  variant="outline"
                  size="icon-sm"
                  className="rounded-full md:hidden"
                  aria-label="Open navigation"
                />
              }
            >
              <Menu className="size-4" />
            </SheetTrigger>
            <SheetContent side="left" className="w-full max-w-xs p-0">
              <SheetHeader className="border-b">
                <SheetTitle>Zentube</SheetTitle>
                <SheetDescription>
                  Browse, search, and save without the usual clutter.
                </SheetDescription>
              </SheetHeader>
              <div className="p-4">
                <SidebarNav mobile />
              </div>
            </SheetContent>
          </Sheet>

          <Button
            variant="outline"
            size="icon-sm"
            className="hidden rounded-full md:inline-flex"
            onClick={() => setSidebarCollapsed((current) => !current)}
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {sidebarCollapsed ? (
              <PanelLeftOpen className="size-4" />
            ) : (
              <PanelLeftClose className="size-4" />
            )}
          </Button>

          <Link href="/" className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-2xl border bg-card text-sm font-semibold shadow-sm">
              Z
            </div>
            <div className="hidden min-w-0 lg:block">
              <p className="text-sm font-semibold leading-none">Zentube</p>
              <p className="text-xs text-muted-foreground">{currentRoute.label}</p>
            </div>
          </Link>
        </div>

        <div className="min-w-0 flex-1">
          <GlobalSearch />
        </div>

        <div className="hidden items-center gap-2 xl:flex">
          <Badge variant="secondary" className="rounded-full px-3 py-1.5">
            {currentRoute.description}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Show when="signed-out">
            <SignInButton mode="modal">
              <Button variant="ghost" size="sm" className="rounded-full">
                Sign in
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button size="sm" className="rounded-full">
                Sign up
              </Button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>
        </div>
      </div>
    </header>
  )
}

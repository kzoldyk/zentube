"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Bookmark,
  Compass,
  LayoutGrid,
  Library,
  Search,
  Settings,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAppShell } from "@/components/app-shell-provider"

const navItems = [
  { name: "Feed", href: "/feed", icon: Compass },
  { name: "Bookmarks", href: "/bookmarks", icon: Bookmark },
  { name: "Collections", href: "/collections", icon: Library },
  { name: "Search", href: "/search", icon: Search },
  { name: "Settings", href: "/settings", icon: Settings },
]

interface SidebarNavProps {
  mobile?: boolean
}

export function SidebarNav({ mobile = false }: SidebarNavProps) {
  const pathname = usePathname()
  const { sidebarCollapsed } = useAppShell()

  const collapsed = mobile ? false : sidebarCollapsed

  return (
    <aside
      className={cn(
        "border-r-hairline bg-background/95 transition-[width] duration-200",
        mobile
          ? "w-full border-none bg-transparent"
          : collapsed
            ? "hidden w-[84px] md:block"
            : "hidden w-[230px] md:block"
      )}
    >
      <div className={cn("flex h-full flex-col gap-4 py-4", collapsed ? "px-3" : "px-4")}>
        <div
          className={cn(
            "rounded-3xl border bg-card/70 py-3 text-sm shadow-sm",
            collapsed ? "px-2 text-center" : "px-4"
          )}
        >
          {collapsed ? (
            <LayoutGrid className="mx-auto size-4 text-muted-foreground" />
          ) : (
            <>
              <p className="font-medium">Library</p>
              <p className="mt-1 text-muted-foreground">Keep only the actions you need.</p>
            </>
          )}
        </div>

        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-label={collapsed ? item.name : undefined}
                className={cn(
                  "group flex items-center rounded-2xl border text-sm transition-all duration-200",
                  collapsed ? "justify-center px-0 py-3" : "gap-3 px-3 py-3",
                  isActive
                    ? "border-border bg-card text-foreground shadow-sm"
                    : "border-transparent text-muted-foreground hover:border-border/60 hover:bg-muted/40 hover:text-foreground"
                )}
              >
                <item.icon className="size-4 shrink-0" />
                {!collapsed ? <span className="font-medium">{item.name}</span> : null}
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}

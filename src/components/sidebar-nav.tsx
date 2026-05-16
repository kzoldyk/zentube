"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Bookmark, 
  Library, 
  Search, 
  Settings 
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"

const navItems = [
  { name: "Feed", href: "/feed", icon: LayoutDashboard },
  { name: "Bookmarks", href: "/bookmarks", icon: Bookmark },
  { name: "Collections", href: "/collections", icon: Library },
  { name: "Search", href: "/search", icon: Search },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function SidebarNav() {
  const pathname = usePathname()

  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-64px)] w-64 border-r-hairline bg-background/50 backdrop-blur-md md:block">
      <div className="flex h-full flex-col justify-between p-4">
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-accent/50",
                  isActive ? "text-foreground" : "text-muted-foreground"
                )}
              >
                <item.icon className={cn("h-4 w-4 shrink-0 transition-colors", isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground")} />
                <span className={cn("transition-all", isActive ? "font-semibold text-foreground" : "font-medium text-muted-foreground group-hover:text-foreground")}>
                  {item.name}
                </span>
                {isActive && (
                  <div className="absolute left-0 h-4 w-1 rounded-r-full bg-primary" />
                )}
              </Link>
            )
          })}
        </nav>
        
        <div className="border-t-hairline pt-4">
          <ThemeToggle />
        </div>
      </div>
    </aside>
  )
}

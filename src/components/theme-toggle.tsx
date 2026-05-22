"use client"

import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAppShell } from "@/components/app-shell-provider"

export function ThemeToggle() {
  const { theme, toggleTheme } = useAppShell()

  return (
    <Button
      variant="outline"
      size="icon-sm"
      className="rounded-full"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  )
}

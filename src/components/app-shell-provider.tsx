"use client"

import * as React from "react"

type ThemeMode = "light" | "dark"

interface AppShellContextValue {
  sidebarCollapsed: boolean
  setSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>
  theme: ThemeMode
  toggleTheme: () => void
}

const SIDEBAR_STORAGE_KEY = "zentube-sidebar-collapsed"
const THEME_STORAGE_KEY = "zentube-theme"

const AppShellContext = React.createContext<AppShellContextValue | null>(null)

function applyTheme(theme: ThemeMode) {
  const root = document.documentElement
  root.classList.toggle("dark", theme === "dark")
  root.style.colorScheme = theme
}

export function AppShellProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(() => {
    if (typeof window === "undefined") return true
    const savedSidebar = window.localStorage.getItem(SIDEBAR_STORAGE_KEY)
    return savedSidebar === null ? true : savedSidebar === "true"
  })

  const [theme, setTheme] = React.useState<ThemeMode>(() => {
    if (typeof window === "undefined") return "dark"
    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)
    return savedTheme === "light" || savedTheme === "dark" ? savedTheme : "dark"
  })

  React.useEffect(() => {
    window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(sidebarCollapsed))
  }, [sidebarCollapsed])

  React.useEffect(() => {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
    applyTheme(theme)
  }, [theme])

  const value = React.useMemo<AppShellContextValue>(
    () => ({
      sidebarCollapsed,
      setSidebarCollapsed,
      theme,
      toggleTheme: () => {
        setTheme((current) => (current === "dark" ? "light" : "dark"))
      },
    }),
    [sidebarCollapsed, theme]
  )

  return <AppShellContext.Provider value={value}>{children}</AppShellContext.Provider>
}

export function useAppShell() {
  const context = React.useContext(AppShellContext)

  if (!context) {
    throw new Error("useAppShell must be used within AppShellProvider")
  }

  return context
}

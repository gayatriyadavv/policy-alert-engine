"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  FileSearch, 
  FileText, 
  MessageSquareText, 
  Bell,
  Moon,
  Sun,
  PawPrint
} from "lucide-react"
import { useState, useEffect } from "react"

const navItems = [
  { 
    href: "/", 
    label: "Dashboard", 
    icon: LayoutDashboard,
    animal: "Lion",
    description: "Overview of all activity"
  },
  { 
    href: "/bills", 
    label: "Bill Monitor", 
    icon: FileSearch,
    animal: "Owl",
    description: "Search legislation"
  },
  { 
    href: "/analysis", 
    label: "Bill Analysis", 
    icon: FileText,
    animal: "Fox",
    description: "Deep dive into bills"
  },
  { 
    href: "/comments", 
    label: "Comment Draft", 
    icon: MessageSquareText,
    animal: "Parrot",
    description: "Generate responses"
  },
  { 
    href: "/alerts", 
    label: "Alerts Center", 
    icon: Bell,
    animal: "Meerkat",
    description: "Priority notifications"
  },
]

export function AnimalSidebar() {
  const pathname = usePathname()
  const [isDark, setIsDark] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark')
    setIsDark(isDarkMode)
  }, [])

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar text-sidebar-foreground transition-all duration-300",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sidebar-primary">
            <PawPrint className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-sm">Wild Policy Watch</span>
              <span className="text-xs text-sidebar-foreground/60">Animal Alert Engine</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-sidebar-primary text-sidebar-primary-foreground" 
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className={cn(
                  "h-5 w-5 shrink-0 transition-transform duration-200",
                  !isActive && "group-hover:scale-110"
                )} />
                {!isCollapsed && (
                  <div className="flex flex-col">
                    <span>{item.label}</span>
                    <span className={cn(
                      "text-xs",
                      isActive ? "text-sidebar-primary-foreground/70" : "text-sidebar-foreground/50"
                    )}>
                      {item.animal} Guide
                    </span>
                  </div>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Animal mascot section */}
        {!isCollapsed && (
          <div className="border-t border-sidebar-border p-4">
            <div className="rounded-lg bg-sidebar-accent p-3">
              <p className="text-xs text-sidebar-accent-foreground/80">
                Tip from the Pack
              </p>
              <p className="mt-1 text-sm text-sidebar-accent-foreground">
                Track wildlife legislation and protect animal habitats!
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-sidebar-border p-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="rounded-lg p-2 text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <svg 
                className={cn("h-5 w-5 transition-transform", isCollapsed && "rotate-180")} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={toggleTheme}
              className="rounded-lg p-2 text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}

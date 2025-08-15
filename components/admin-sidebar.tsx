"use client"

import { BarChart3, BookOpenCheck, LayoutDashboard, ListChecks, Settings, User2 } from "lucide-react"
import { usePathname } from "next/navigation"

import type { MainNavItem } from "@/types"

interface SidebarProps {
  items?: MainNavItem[]
}

export function AdminSidebar({ items }: SidebarProps) {
  const pathname = usePathname()

  const routes = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      current: pathname === "/admin",
    },
    {
      name: "Users",
      href: "/admin/users",
      icon: User2,
      current: pathname === "/admin/users",
    },
    {
      name: "Courses",
      href: "/admin/courses",
      icon: BookOpenCheck,
      current: pathname === "/admin/courses",
    },
    {
      name: "Categories",
      href: "/admin/categories",
      icon: ListChecks,
      current: pathname === "/admin/categories",
    },
    {
      name: "Analytics",
      href: "/admin/analytics",
      icon: BarChart3,
      current: pathname === "/admin/analytics",
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: Settings,
      current: pathname === "/admin/settings",
    },
  ]

  if (!routes?.length) {
    return null
  }

  return (
    <div className="space-y-4 py-4">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Admin</h2>
        <div className="space-y-1">
          {routes.map((route) => (
            <div key={route.href} className="group flex items-center rounded-md">
              <a
                href={route.href}
                className="flex w-full items-center space-x-2 rounded-md p-2 text-sm font-medium hover:bg-secondary hover:text-accent"
              >
                <route.icon className="h-4 w-4" />
                <span>{route.name}</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

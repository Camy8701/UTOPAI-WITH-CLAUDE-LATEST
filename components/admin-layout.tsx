"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAdminAuth } from "@/components/admin-auth-context"
import { AdminPermissionGuard } from "@/components/admin-permission-guard"
import { Bell, Settings, User, LogOut, Shield, Menu } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { isAdminLoggedIn, adminUser, adminLogout, isLoading } = useAdminAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAdminLoggedIn && pathname !== "/admin/login") {
      router.push("/admin/login")
    }
  }, [isAdminLoggedIn, isLoading, pathname, router])

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  // Don't render layout for login page
  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  // Don't render if not authenticated
  if (!isAdminLoggedIn || !adminUser) {
    return null
  }

  const navigation = [
    { name: "Dashboard", href: "/admin", permission: null },
    { name: "Content", href: "/admin/content", permission: "content.view" as const },
    { name: "Posts", href: "/admin/posts", permission: "content.create" as const },
    { name: "Users", href: "/admin/users", permission: "users.view" as const },
    { name: "Comments", href: "/admin/comments", permission: "content.moderate" as const },
    { name: "Analytics", href: "/admin/analytics", permission: "analytics.view" as const },
    { name: "Media", href: "/admin/media", permission: "media.manage" as const },
    { name: "Settings", href: "/admin/settings", permission: "settings.view" as const },
  ]

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-center h-16 px-4 bg-blue-600">
          <Shield className="w-8 h-8 text-white mr-2" />
          <span className="text-white font-bold text-lg">Admin Panel</span>
        </div>

        <nav className="mt-8">
          {navigation.map((item) => {
            const isActive = pathname === item.href

            if (item.permission) {
              return (
                <AdminPermissionGuard key={item.name} permission={item.permission} showError={false}>
                  <Link
                    href={item.href}
                    className={`block px-4 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-r-2 border-blue-700"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    {item.name}
                  </Link>
                </AdminPermissionGuard>
              )
            }

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`block px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-r-2 border-blue-700"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* User Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{adminUser.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{adminUser.role.replace("_", " ")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="ml-4 text-xl font-semibold text-gray-900 dark:text-white">Admin Dashboard</h1>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                <Bell className="w-5 h-5" />
              </button>

              <AdminPermissionGuard permission="settings.view" showError={false}>
                <Link href="/admin/settings" className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                  <Settings className="w-5 h-5" />
                </Link>
              </AdminPermissionGuard>

              <button
                onClick={adminLogout}
                className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}

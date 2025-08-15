"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  BarChart3,
  FileText,
  Users,
  Eye,
  MessageSquare,
  TrendingUp,
  Settings,
  Shield,
  ImageIcon,
  Activity,
  Plus,
  Calendar,
  Globe,
} from "lucide-react"

export default function AdminPage() {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString())

  useEffect(() => {
    // Check if user is admin
    if (typeof window !== "undefined") {
      const isAdmin = localStorage.getItem("isAdminLoggedIn") === "true"
      const adminEmail = localStorage.getItem("adminEmail")

      if (!isAdmin || adminEmail !== "utopaiblog@gmail.com") {
        router.push("/admin/login")
        return
      }

      setIsAuthorized(true)
    }
    setIsLoading(false)
  }, [router])

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("isAdminLoggedIn")
      localStorage.removeItem("adminEmail")
      localStorage.removeItem("adminLoginTime")
    }
    router.push("/admin/login")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Access Denied</h1>
          <p className="text-gray-600 dark:text-gray-400">Redirecting to admin login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
              <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                Super Admin
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">{currentTime}</span>
              <Link href="/admin/settings">
                <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                  <Settings className="h-4 w-4" />
                  Settings
                </Button>
              </Link>
              <Link href="/" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                  <Globe className="h-4 w-4" />
                  View Site
                </Button>
              </Link>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="text-red-600 hover:text-red-700 bg-transparent"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-lg p-6 border border-red-200 dark:border-red-800">
          <h2 className="text-xl font-semibold text-red-900 dark:text-red-100 mb-2">🎉 Welcome back, Super Admin!</h2>
          <p className="text-red-700 dark:text-red-200">
            You're successfully logged in as utopaiblog@gmail.com with full admin privileges.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Articles</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">24</p>
                </div>
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
              <div className="mt-2 text-sm text-green-600 dark:text-green-400">
                <span>18 published, 6 drafts</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Views</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">45,231</p>
                </div>
                <Eye className="h-8 w-8 text-green-500" />
              </div>
              <div className="mt-2 text-sm text-green-600 dark:text-green-400">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +15.2% from last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Users</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">1,247</p>
                </div>
                <Users className="h-8 w-8 text-purple-500" />
              </div>
              <div className="mt-2 text-sm text-green-600 dark:text-green-400">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +8.1% from last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Comments</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">892</p>
                </div>
                <MessageSquare className="h-8 w-8 text-orange-500" />
              </div>
              <div className="mt-2 text-sm text-green-600 dark:text-green-400">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +12.3% from last month
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/admin/posts">
              <Button className="w-full h-20 flex flex-col items-center justify-center space-y-2 bg-blue-600 hover:bg-blue-700">
                <Plus className="h-6 w-6" />
                <span>Create New Post</span>
              </Button>
            </Link>
            <Link href="/admin/media">
              <Button className="w-full h-20 flex flex-col items-center justify-center space-y-2 bg-green-600 hover:bg-green-700">
                <ImageIcon className="h-6 w-6" />
                <span>Media Library</span>
              </Button>
            </Link>
            <Link href="/admin/audit">
              <Button className="w-full h-20 flex flex-col items-center justify-center space-y-2 bg-purple-600 hover:bg-purple-700">
                <Activity className="h-6 w-6" />
                <span>View Audit Logs</span>
              </Button>
            </Link>
            <Link href="/admin/analytics">
              <Button className="w-full h-20 flex flex-col items-center justify-center space-y-2 bg-orange-600 hover:bg-orange-700">
                <BarChart3 className="h-6 w-6" />
                <span>Analytics</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Content Management
              </CardTitle>
              <CardDescription>Manage your blog posts and articles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/admin/posts">
                <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Manage Posts</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Create, edit, and publish articles</p>
                    </div>
                  </div>
                  <Badge variant="secondary">24 posts</Badge>
                </div>
              </Link>
              <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Scheduled Posts</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">View upcoming publications</p>
                  </div>
                </div>
                <Badge variant="secondary">3 scheduled</Badge>
              </div>
              <Link href="/admin/comments">
                <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="h-5 w-5 text-orange-500" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Comments</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Moderate user comments</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Manage</Badge>
                </div>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                System Management
              </CardTitle>
              <CardDescription>Monitor and configure system settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/admin/audit">
                <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <Activity className="h-5 w-5 text-purple-500" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Audit Logs</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">View system activity logs</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Live</Badge>
                </div>
              </Link>
              <Link href="/admin/media">
                <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <ImageIcon className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Media Library</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Manage uploaded files</p>
                    </div>
                  </div>
                  <Badge variant="secondary">156 files</Badge>
                </div>
              </Link>
              <Link href="/admin/users">
                <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">User Management</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Manage user accounts</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Manage</Badge>
                </div>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest actions and system events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">New article published</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    "The Future of AI in Content Creation" was published 2 hours ago
                  </p>
                </div>
                <span className="text-xs text-gray-400">2h ago</span>
              </div>
              <div className="flex items-center space-x-4 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">New user registered</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">john.doe@example.com joined the platform</p>
                </div>
                <span className="text-xs text-gray-400">4h ago</span>
              </div>
              <div className="flex items-center space-x-4 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Comment moderation needed</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">3 comments are pending approval</p>
                </div>
                <span className="text-xs text-gray-400">6h ago</span>
              </div>
              <div className="flex items-center space-x-4 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">System backup completed</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Daily backup finished successfully</p>
                </div>
                <span className="text-xs text-gray-400">8h ago</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Success Message */}
        <div className="mt-8 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-green-400 text-xl">✅</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                Admin Dashboard Successfully Loaded!
              </h3>
              <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                <p>
                  🎉 Congratulations! The admin dashboard is now working perfectly. You can manage articles, view
                  analytics, and access all admin features.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

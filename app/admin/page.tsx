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
import { useFirebaseAuth } from "@/components/firebase-auth-provider"
import { BlogPostsAdmin, CommentsAdmin, BlogPost, Comment } from "@/lib/firebase-admin"
import { collection, getCountFromServer } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface DashboardStats {
  totalPosts: number
  publishedPosts: number
  draftPosts: number
  totalComments: number
  pendingComments: number
  approvedComments: number
  totalViews: number
  totalUsers: number
}

export default function AdminPage() {
  const router = useRouter()
  const { user } = useFirebaseAuth()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString())
  const [stats, setStats] = useState<DashboardStats>({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalComments: 0,
    pendingComments: 0,
    approvedComments: 0,
    totalViews: 0,
    totalUsers: 0
  })
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([])

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
      loadDashboardData()
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

  const loadDashboardData = async () => {
    try {
      // Load posts data
      const posts = await BlogPostsAdmin.getAllPosts()
      const comments = await CommentsAdmin.getAllComments()
      
      // Get user count from Firebase Auth (approximate)
      let userCount = 0
      try {
        const usersSnapshot = await getCountFromServer(collection(db, 'users'))
        userCount = usersSnapshot.data().count
      } catch (error) {
        console.log('Users collection not found, using default')
      }

      // Calculate stats
      const totalViews = posts.reduce((sum, post) => sum + (post.view_count || 0), 0)
      const publishedPosts = posts.filter(p => p.published).length
      const draftPosts = posts.filter(p => !p.published).length
      const pendingComments = comments.filter(c => c.status === 'pending').length
      const approvedComments = comments.filter(c => c.status === 'approved').length

      setStats({
        totalPosts: posts.length,
        publishedPosts,
        draftPosts,
        totalComments: comments.length,
        pendingComments,
        approvedComments,
        totalViews,
        totalUsers: userCount
      })

      // Set recent posts (last 3)
      setRecentPosts(posts.slice(0, 3))

    } catch (error) {
      console.error('Error loading dashboard data:', error)
    }
  }

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

        {/* Real-time Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Articles</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalPosts}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
              <div className="mt-2 text-sm text-green-600 dark:text-green-400">
                <span>{stats.publishedPosts} published, {stats.draftPosts} drafts</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Views</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalViews.toLocaleString()}</p>
                </div>
                <Eye className="h-8 w-8 text-green-500" />
              </div>
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                <span>From {stats.publishedPosts} published posts</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Registered Users</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalUsers}</p>
                </div>
                <Users className="h-8 w-8 text-purple-500" />
              </div>
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                <span>Firebase authenticated users</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Comments</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalComments}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-orange-500" />
              </div>
              <div className="mt-2 text-sm text-yellow-600 dark:text-yellow-400">
                {stats.pendingComments > 0 ? (
                  <span>{stats.pendingComments} pending approval</span>
                ) : (
                  <span>{stats.approvedComments} approved comments</span>
                )}
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
            <Link href="/admin/comments">
              <Button className="w-full h-20 flex flex-col items-center justify-center space-y-2 bg-green-600 hover:bg-green-700 relative">
                <MessageSquare className="h-6 w-6" />
                <span>Moderate Comments</span>
                {stats.pendingComments > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs">
                    {stats.pendingComments}
                  </Badge>
                )}
              </Button>
            </Link>
            <Link href="/admin/analytics">
              <Button className="w-full h-20 flex flex-col items-center justify-center space-y-2 bg-purple-600 hover:bg-purple-700">
                <Activity className="h-6 w-6" />
                <span>View Analytics</span>
              </Button>
            </Link>
            <Button 
              onClick={loadDashboardData}
              className="w-full h-20 flex flex-col items-center justify-center space-y-2 bg-orange-600 hover:bg-orange-700"
            >
              <BarChart3 className="h-6 w-6" />
              <span>Refresh Data</span>
            </Button>
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
                  <Badge variant="secondary">{stats.totalPosts} posts</Badge>
                </div>
              </Link>
              <Link href="/admin/comments">
                <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="h-5 w-5 text-orange-500" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Comments</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Moderate user comments</p>
                    </div>
                  </div>
                  <Badge variant="secondary">
                    {stats.pendingComments > 0 ? `${stats.pendingComments} pending` : `${stats.totalComments} total`}
                  </Badge>
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
              <Link href="/admin/users">
                <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">User Management</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Manage user accounts</p>
                    </div>
                  </div>
                  <Badge variant="secondary">{stats.totalUsers} users</Badge>
                </div>
              </Link>
              <Link href="/admin/analytics">
                <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <Activity className="h-5 w-5 text-purple-500" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Analytics</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">View detailed statistics</p>
                    </div>
                  </div>
                  <Badge variant="secondary">{stats.totalViews} views</Badge>
                </div>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Posts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Posts
            </CardTitle>
            <CardDescription>Your latest blog posts</CardDescription>
          </CardHeader>
          <CardContent>
            {recentPosts.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 mb-4">No posts found</p>
                <Link href="/admin/posts">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Post
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentPosts.map((post) => (
                  <div key={post.id} className="flex items-center space-x-4 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className={`w-2 h-2 rounded-full ${post.published ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{post.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {post.published ? 'Published' : 'Draft'} • {post.category} • {post.view_count || 0} views
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {post.content_type}
                      </Badge>
                      <span className="text-xs text-gray-400">
                        {post.created_at ? new Date(post.created_at.seconds * 1000).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                ))}
                <div className="text-center pt-4">
                  <Link href="/admin/posts">
                    <Button variant="outline">View All Posts</Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Firebase Status */}
        <div className="mt-8 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-green-400 text-xl">🔥</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                Firebase Dashboard Active
              </h3>
              <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                <p>
                  Real-time data from Firebase • {stats.totalPosts} posts • {stats.totalComments} comments • Last updated: {new Date().toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
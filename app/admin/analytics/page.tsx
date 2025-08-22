"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  BarChart3,
  TrendingUp, 
  TrendingDown,
  Users, 
  FileText, 
  MessageSquare, 
  Eye,
  Calendar,
  Globe,
  ArrowLeft,
  Clock,
  Star,
  Share2
} from 'lucide-react'
import Link from 'next/link'

interface AnalyticsData {
  totalPosts: number
  publishedPosts: number
  draftPosts: number
  totalComments: number
  approvedComments: number
  pendingComments: number
  totalUsers: number
  totalLikes: number
  recentPosts: Array<{
    title: string
    created_at: string
    status: string
    slug: string
    like_count?: number
    comment_count?: number
  }>
  topPosts: Array<{
    title: string
    slug: string
    like_count: number
    comment_count: number
  }>
  recentUsers: Array<{
    email: string
    full_name: string | null
    created_at: string
  }>
}

export default function AdminAnalyticsPage() {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalComments: 0,
    approvedComments: 0,
    pendingComments: 0,
    totalUsers: 0,
    totalLikes: 0,
    recentPosts: [],
    topPosts: [],
    recentUsers: []
  })

  useEffect(() => {
    // Check if user is admin
    if (typeof window !== 'undefined') {
      const isAdmin = localStorage.getItem('isAdminLoggedIn') === 'true'
      const adminEmail = localStorage.getItem('adminEmail')

      if (!isAdmin || adminEmail !== 'utopaiblog@gmail.com') {
        router.push('/admin/login')
        return
      }

      setIsAuthorized(true)
    }
    setIsLoading(false)
  }, [router])

  useEffect(() => {
    if (isAuthorized) {
      loadAnalytics()
    }
  }, [isAuthorized])

  const loadAnalytics = async () => {
    try {
      // TODO: Load analytics from Firebase
      // For now, show dummy data to prevent build errors
      setAnalytics({
        totalPosts: 0,
        publishedPosts: 0,
        draftPosts: 0,
        totalComments: 0,
        approvedComments: 0,
        pendingComments: 0,
        totalUsers: 0,
        totalLikes: 0,
        recentPosts: [],
        topPosts: [],
        recentUsers: []
      })
    } catch (error) {
      console.error('Error loading analytics:', error)
    }
  }

  const getPostStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-100 text-green-800">Published</Badge>
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading analytics...</p>
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
              <Link href="/admin">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                Real-time Data
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Posts</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.totalPosts}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="text-green-600">{analytics.publishedPosts} published</span>
                {analytics.draftPosts > 0 && (
                  <span className="text-gray-500 ml-2">{analytics.draftPosts} drafts</span>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Comments</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.totalComments}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-orange-500" />
              </div>
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="text-green-600">{analytics.approvedComments} approved</span>
                {analytics.pendingComments > 0 && (
                  <span className="text-yellow-600 ml-2">{analytics.pendingComments} pending</span>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.totalUsers}</p>
                </div>
                <Users className="h-8 w-8 text-purple-500" />
              </div>
              <div className="mt-2 text-sm text-green-600 dark:text-green-400">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                Growing community
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Likes</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.totalLikes}</p>
                </div>
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
              <div className="mt-2 text-sm text-green-600 dark:text-green-400">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                High engagement
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Posts by Engagement */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Top Posts by Engagement
              </CardTitle>
              <CardDescription>Posts ranked by likes + comments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.topPosts.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No posts with engagement yet</p>
                ) : (
                  analytics.topPosts.map((post, index) => (
                    <div key={post.slug} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link 
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            className="font-medium text-gray-900 dark:text-white hover:text-blue-600 truncate block"
                          >
                            {post.title}
                          </Link>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-xs text-gray-500 flex items-center">
                              <Star className="h-3 w-3 mr-1" />
                              {post.like_count} likes
                            </span>
                            <span className="text-xs text-gray-500 flex items-center">
                              <MessageSquare className="h-3 w-3 mr-1" />
                              {post.comment_count} comments
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-purple-600">
                        {post.like_count + post.comment_count} total
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Posts
              </CardTitle>
              <CardDescription>Latest published and draft posts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.recentPosts.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No recent posts</p>
                ) : (
                  analytics.recentPosts.map((post) => (
                    <div key={post.slug} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <Link 
                            href={post.status === 'published' ? `/blog/${post.slug}` : `/admin/posts`}
                            target={post.status === 'published' ? '_blank' : '_self'}
                            className="font-medium text-gray-900 dark:text-white hover:text-blue-600 truncate"
                          >
                            {post.title}
                          </Link>
                          {getPostStatusBadge(post.status)}
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-xs text-gray-500">
                            {new Date(post.created_at).toLocaleDateString()}
                          </span>
                          {post.status === 'published' && (
                            <>
                              <span className="text-xs text-gray-500 flex items-center">
                                <Star className="h-3 w-3 mr-1" />
                                {post.like_count || 0}
                              </span>
                              <span className="text-xs text-gray-500 flex items-center">
                                <MessageSquare className="h-3 w-3 mr-1" />
                                {post.comment_count || 0}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Users */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Recent Users
            </CardTitle>
            <CardDescription>Latest user registrations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analytics.recentUsers.length === 0 ? (
                <div className="col-span-full text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No users registered yet</p>
                </div>
              ) : (
                analytics.recentUsers.map((user) => (
                  <div key={user.email} className="flex items-center space-x-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                      {user.full_name?.[0] || user.email[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">
                        {user.full_name || 'Anonymous'}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {user.email}
                      </p>
                      <p className="text-xs text-gray-500">
                        Joined {new Date(user.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Refresh Button */}
        <div className="mt-8 text-center">
          <Button onClick={loadAnalytics} className="bg-purple-600 hover:bg-purple-700">
            <BarChart3 className="h-4 w-4 mr-2" />
            Refresh Analytics
          </Button>
        </div>
      </main>
    </div>
  )
}
"use client"

import { useAuth } from '@/components/auth-provider'
import { useActivity } from '@/components/activity-context'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  User, 
  Heart, 
  Bookmark, 
  Trophy, 
  MessageSquare,
  TrendingUp,
  Calendar,
  Star,
  ArrowLeft,
  Home,
  LogOut,
  Settings
} from 'lucide-react'

interface UserStats {
  totalLikes: number
  totalComments: number
  savedPosts: number
  quizScore: number
  joinedDate: string
}

export default function Dashboard() {
  const { user, profile, loading, signOut } = useAuth()
  const { getRecentActivities } = useActivity()
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loadingStats, setLoadingStats] = useState(true)

  useEffect(() => {
    if (user) {
      loadUserStats()
    }
  }, [user, profile])

  const loadUserStats = async () => {
    try {
      const response = await fetch('/api/user-stats', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        setStats({
          totalLikes: data.likes_given || 0,
          totalComments: data.comments_posted || 0,
          savedPosts: data.saved_posts || 0,
          quizScore: profile?.quiz_points || 0,
          joinedDate: new Date(user!.created_at).toLocaleDateString()
        })
      } else {
        // Fallback to empty stats if API fails
        setStats({
          totalLikes: 0,
          totalComments: 0,
          savedPosts: 0,
          quizScore: profile?.quiz_points || 0,
          joinedDate: new Date(user!.created_at).toLocaleDateString()
        })
      }
    } catch (error) {
      console.error('Error loading user stats:', error)
      setStats({
        totalLikes: 0,
        totalComments: 0,
        savedPosts: 0,
        quizScore: profile?.quiz_points || 0,
        joinedDate: new Date(user!.created_at).toLocaleDateString()
      })
    } finally {
      setLoadingStats(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please sign in to view your dashboard
          </p>
          <Link 
            href="/"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Go to Home
          </Link>
        </div>
      </div>
    )
  }

  const displayName = profile?.full_name || user.email?.split('@')[0] || 'User'

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back to Blog Button */}
        <div className="mb-6">
          <Link 
            href="/"
            className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Blog
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center">
                {profile?.avatar_url ? (
                  <img 
                    src={profile.avatar_url} 
                    alt={displayName}
                    className="h-16 w-16 rounded-full"
                  />
                ) : (
                  <User className="h-8 w-8 text-white" />
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Welcome back, {displayName}!
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {user.email}
                </p>
                {stats && (
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    Member since {stats.joinedDate}
                  </p>
                )}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <Link
                href="/settings"
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Link>
              
              <button
                onClick={signOut}
                className="inline-flex items-center px-4 py-2 border border-red-300 dark:border-red-600 rounded-md shadow-sm text-sm font-medium text-red-700 dark:text-red-400 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/20">
                <Heart className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Likes Given
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {loadingStats ? '...' : stats?.totalLikes || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/20">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Comments Posted
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {loadingStats ? '...' : stats?.totalComments || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/20">
                <Bookmark className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Saved Posts
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {loadingStats ? '...' : stats?.savedPosts || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900/20">
                <Trophy className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Quiz Points
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {stats?.quizScore || profile?.quiz_points || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <Heart className="h-6 w-6 text-red-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Liked Posts
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              View all the posts you've liked and shared your appreciation for.
            </p>
            <Link 
              href="/liked-posts"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              View Liked Posts →
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <Bookmark className="h-6 w-6 text-green-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Saved Posts
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Access your saved posts to read later or reference again.
            </p>
            <Link 
              href="/saved-posts"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              View Saved Posts →
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <Trophy className="h-6 w-6 text-yellow-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Quiz Scores
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Track your AI knowledge progress and compare with others.
            </p>
            <Link 
              href="/quiz-scores"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              View Quiz History →
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Activity
            </h3>
            <Link 
              href="/activities"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View All →
            </Link>
          </div>
          <div className="space-y-4">
            {getRecentActivities(5).length > 0 ? (
              getRecentActivities(5).map((activity) => (
                <div key={activity.id} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center">
                    {activity.type === 'story_liked' && <Heart className="h-4 w-4 mr-2 text-red-500" />}
                    {activity.type === 'story_saved' && <Bookmark className="h-4 w-4 mr-2 text-green-500" />}
                    {activity.type === 'story_shared' && <Star className="h-4 w-4 mr-2 text-blue-500" />}
                    {activity.type === 'story_read' && <Calendar className="h-4 w-4 mr-2 text-purple-500" />}
                    {activity.type === 'login' && <User className="h-4 w-4 mr-2 text-gray-500" />}
                    {activity.type === 'profile_updated' && <User className="h-4 w-4 mr-2 text-orange-500" />}
                    <span>
                      {activity.description}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-500 py-8">
                <TrendingUp className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Your activity will appear here as you interact with posts and take quizzes.</p>
                <p className="text-sm mt-2">Start by liking a story or taking a quiz!</p>
              </div>
            )}
          </div>
        </div>

        {/* Debug Info */}
        <div className="mt-8 bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
            🔧 Debug Info
          </h4>
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <p><strong>User ID:</strong> {user.id}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Profile loaded:</strong> {profile ? 'Yes' : 'No'}</p>
            {profile && (
              <>
                <p><strong>Full Name:</strong> {profile.full_name || 'Not set'}</p>
                <p><strong>Quiz Points:</strong> {profile.quiz_points}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
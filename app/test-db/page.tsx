"use client"

import { useEffect, useState } from 'react'
import { LikeButton } from '@/components/like-button'
import { useAuth } from '@/components/auth-provider'

interface BlogPost {
  id: string
  title: string
  content: string
  excerpt: string
  slug: string
  category: string
  section: string
  like_count: number
  view_count: number
  comment_count: number
  created_at: string
  thumbnail_url: string | null
  featured: boolean
  profiles?: {
    full_name: string | null
    avatar_url: string | null
  }
}

export default function TestDbPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [migrating, setMigrating] = useState(false)
  const [migrationResult, setMigrationResult] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/blog-posts?limit=10')
      
      if (!response.ok) {
        throw new Error('Failed to fetch posts')
      }

      const data = await response.json()
      setPosts(data.posts || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const runMigration = async () => {
    if (!user) {
      setMigrationResult('Please log in first')
      return
    }

    try {
      setMigrating(true)
      setMigrationResult(null)
      
      const response = await fetch('/api/migrate-simple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          authorId: user.id
        })
      })

      const data = await response.json()

      if (response.ok) {
        setMigrationResult(`✅ ${data.message} Created ${data.created_posts || 0} posts.`)
        // Refresh the posts list
        await fetchPosts()
      } else {
        setMigrationResult(`❌ Migration failed: ${data.error}${data.details ? ` - ${data.details}` : ''}`)
      }
    } catch (err) {
      setMigrationResult(`❌ Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setMigrating(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-8"></div>
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <h1 className="text-xl font-bold text-red-800 dark:text-red-200 mb-2">
              Database Connection Test Failed
            </h1>
            <p className="text-red-600 dark:text-red-300 mb-4">{error}</p>
            <button 
              onClick={fetchPosts}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            🎉 Database Connection Successful!
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Found {posts.length} posts in your database. 
            {user ? ` Logged in as ${user.email}` : ' (Not logged in)'}
          </p>

          {posts.length === 0 && user && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
                📚 Import Your Content
              </h3>
              <p className="text-blue-600 dark:text-blue-300 mb-4">
                Your database is empty. Click the button below to import your existing blog posts and AI tools.
              </p>
              <button
                onClick={runMigration}
                disabled={migrating}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg font-medium"
              >
                {migrating ? '⏳ Importing...' : '📥 Import Content'}
              </button>
              
              {migrationResult && (
                <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded border">
                  <p className="text-sm">{migrationResult}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {post.title}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                      {post.category}
                    </span>
                    <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                      {post.section}
                    </span>
                    {post.featured && (
                      <span className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">
                        ⭐ Featured
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                {post.excerpt}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <span>👀 {post.view_count} views</span>
                  <span>💬 {post.comment_count} comments</span>
                  <span>📅 {new Date(post.created_at).toLocaleDateString()}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <LikeButton 
                    postId={post.id}
                    initialLikeCount={post.like_count}
                    size="sm"
                  />
                </div>
              </div>

              {post.profiles && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    By {post.profiles.full_name || 'Anonymous'}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <h3 className="text-lg font-bold text-green-800 dark:text-green-200 mb-2">
            ✅ All Systems Working!
          </h3>
          <ul className="text-green-600 dark:text-green-300 space-y-1">
            <li>✓ Authentication: {user ? 'Logged in' : 'Working (not logged in)'}</li>
            <li>✓ Database: Connected to Supabase</li>
            <li>✓ API Routes: Blog posts API working</li>
            <li>✓ Like System: {user ? 'Ready to use' : 'Login to test likes'}</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
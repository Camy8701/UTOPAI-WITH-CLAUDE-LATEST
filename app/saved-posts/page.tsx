"use client"

import { useState, useEffect } from 'react'
import { useFirebaseAuth } from '@/components/firebase-auth-provider'
import Link from 'next/link'
import Image from 'next/image'
import { 
  ArrowLeft, 
  Bookmark, 
  MessageCircle, 
  Clock,
  User,
  Calendar,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { savedPostsAPI } from '@/lib/api-client'

interface SavedPost {
  id: string
  saved_at: string
  post: {
    id: string
    title: string
    excerpt: string
    slug: string
    thumbnail_url: string | null
    created_at: string
    content_type: string
    section: string
    like_count: number
    comment_count: number
    read_time: string | null
    author_name: string
    author_avatar: string | null
  }
}

export default function SavedPostsPage() {
  const { user, loading } = useFirebaseAuth()
  const [savedPosts, setSavedPosts] = useState<SavedPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const postsPerPage = 12

  useEffect(() => {
    if (user) {
      loadSavedPosts()
    } else if (!loading) {
      setIsLoading(false)
    }
  }, [user, loading, currentPage])

  const loadSavedPosts = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Temporarily return empty array to prevent database errors
      // TODO: Fix database schema and restore functionality
      setSavedPosts([])
      setTotalPages(0)
      
      // const data = await savedPostsAPI.getSavedPosts(currentPage, postsPerPage)
      // setSavedPosts(data.saved_posts || [])
      // setTotalPages(Math.ceil((data.total || 0) / postsPerPage))
    } catch (error) {
      console.error('Error loading saved posts:', error)
      setError('Saved posts feature temporarily disabled')
      setSavedPosts([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleUnsave = async (postId: string) => {
    try {
      await savedPostsAPI.toggleSave(postId, 'unsave')
      // Remove from local state
      setSavedPosts(prev => prev.filter(item => item.post.id !== postId))
    } catch (error) {
      console.error('Error unsaving post:', error)
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
          <Bookmark className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Sign In Required
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please sign in to view your saved posts
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/dashboard"
            className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors group mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>

          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
              <Bookmark className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Saved Posts</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Posts and stories you've saved for later
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 dark:text-red-400 text-lg mb-4">{error}</p>
            <Button onClick={loadSavedPosts} variant="outline">
              Try Again
            </Button>
          </div>
        ) : savedPosts.length === 0 ? (
          <div className="text-center py-12">
            <Bookmark className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Saved Posts Yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start exploring stories and articles to build your reading list
            </p>
            <Link 
              href="/"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
            >
              Explore Content
            </Link>
          </div>
        ) : (
          <>
            {/* Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {savedPosts.map((item) => (
                <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  {/* Thumbnail */}
                  {item.post.thumbnail_url && (
                    <div className="relative aspect-video">
                      <Image
                        src={item.post.thumbnail_url}
                        alt={item.post.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                          SAVED
                        </span>
                      </div>
                      <div className="absolute top-2 left-2">
                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                          {item.post.content_type.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {item.post.title}
                    </h3>
                    
                    {item.post.excerpt && (
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                        {item.post.excerpt}
                      </p>
                    )}

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
                      <div className="flex items-center gap-2">
                        <User className="h-3 w-3" />
                        <span>{item.post.author_name}</span>
                      </div>
                      {item.post.read_time && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{item.post.read_time}</span>
                        </div>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Bookmark className="h-4 w-4 text-green-500" />
                          <span>Saved</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4" />
                          <span>{item.post.comment_count}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <Calendar className="h-3 w-3" />
                        <span>Saved {new Date(item.saved_at).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link
                        href={`/stories/${item.post.slug}`}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium text-center transition-colors"
                      >
                        Read
                      </Link>
                      <button
                        onClick={() => handleUnsave(item.post.id)}
                        className="px-4 py-2 border border-green-300 dark:border-green-600 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-md text-sm font-medium transition-colors"
                      >
                        Unsave
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      onClick={() => setCurrentPage(page)}
                      className="w-10 h-10"
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
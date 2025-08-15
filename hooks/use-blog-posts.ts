import { useState, useEffect } from 'react'
import type { Database } from '@/types/database'

type BlogPost = Database['public']['Tables']['blog_posts']['Row'] & {
  profiles?: {
    full_name: string | null
    avatar_url: string | null
  }
}

interface UseBlogPostsOptions {
  section?: string
  category?: string
  featured?: boolean
  published?: boolean
  limit?: number
}

interface UseBlogPostsReturn {
  posts: BlogPost[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useBlogPosts(options: UseBlogPostsOptions = {}): UseBlogPostsReturn {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPosts = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (options.section) params.append('section', options.section)
      if (options.category) params.append('category', options.category)
      if (options.featured !== undefined) params.append('featured', options.featured.toString())
      if (options.published !== undefined) params.append('published', options.published.toString())
      if (options.limit) params.append('limit', options.limit.toString())

      const response = await fetch(`/api/blog-posts?${params}`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.statusText}`)
      }

      const data = await response.json()
      setPosts(data.posts || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch posts')
      console.error('Error fetching posts:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [options.section, options.category, options.featured, options.published, options.limit])

  return {
    posts,
    loading,
    error,
    refetch: fetchPosts
  }
}

export function useBlogPost(id: string) {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPost = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/blog-posts/${id}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Post not found')
        }
        throw new Error(`Failed to fetch post: ${response.statusText}`)
      }

      const data = await response.json()
      setPost(data.post)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch post')
      console.error('Error fetching post:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchPost()
    }
  }, [id])

  return {
    post,
    loading,
    error,
    refetch: fetchPost
  }
}
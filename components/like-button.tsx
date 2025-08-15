"use client"

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { Button } from './ui/button'
import { useAuth } from './auth-provider'
import { cn } from '@/lib/utils'
import { likesAPI } from '@/lib/api-client'

interface LikeButtonProps {
  postId?: string
  commentId?: string
  initialLikeCount?: number
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showCount?: boolean
}

export function LikeButton({
  postId,
  commentId,
  initialLikeCount = 0,
  className,
  size = 'md',
  showCount = true
}: LikeButtonProps) {
  const { user, loading } = useAuth()
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(initialLikeCount)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check if user has liked this item
  useEffect(() => {
    if (loading || !user || (!postId && !commentId)) return

    const checkLikeStatus = async () => {
      try {
        const data = await likesAPI.getLikeStatus(postId, commentId)
        setIsLiked(data.liked)
        setLikeCount(data.like_count || initialLikeCount)
      } catch (error) {
        console.error('Error checking like status:', error)
        // Don't show error for like status check, just log it
      }
    }

    checkLikeStatus()
  }, [user, loading, postId, commentId, initialLikeCount])

  const handleLike = async () => {
    if (!user) {
      setError('Please sign in to like posts')
      return
    }

    if (!postId && !commentId) {
      setError('Invalid item to like')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const action = isLiked ? 'unlike' : 'like'
      const data = await likesAPI.toggleLike(postId, commentId, action)
      
      setIsLiked(data.liked)
      setLikeCount(data.like_count)
    } catch (error) {
      console.error('Error toggling like:', error)
      setError(error instanceof Error ? error.message : 'Failed to update like')
    } finally {
      setIsLoading(false)
    }
  }

  const sizeClasses = {
    sm: 'h-8 px-2 text-xs',
    md: 'h-9 px-3 text-sm',
    lg: 'h-10 px-4 text-base'
  }

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  }

  return (
    <div className="flex flex-col gap-1">
      <Button
        variant={isLiked ? "default" : "outline"}
        size="sm"
        onClick={handleLike}
        disabled={isLoading || !user}
        className={cn(
          sizeClasses[size],
          isLiked ? 'bg-red-600 hover:bg-red-700 text-white' : 'hover:bg-red-50 hover:text-red-600',
          className
        )}
      >
        <Heart 
          className={cn(
            iconSizes[size],
            'mr-1.5',
            isLiked ? 'fill-current' : ''
          )} 
        />
        {showCount && likeCount > 0 && (
          <span className="font-medium">
            {likeCount.toLocaleString()}
          </span>
        )}
        {(!showCount || likeCount === 0) && (
          <span className="font-medium">
            {isLiked ? 'Liked' : 'Like'}
          </span>
        )}
      </Button>
      
      {error && (
        <p className="text-xs text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
      
      {!user && !loading && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Sign in to like posts
        </p>
      )}
    </div>
  )
}
"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, MessageCircle, Share2, Bookmark } from 'lucide-react'
import { useFirebaseAuth } from './firebase-auth-provider'
import { LikeButton } from './like-button'

interface StoryActionButtonsProps {
  postId: string
  slug?: string
  title: string
  description?: string
  initialLikeCount?: number
  commentCount?: number
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showCounts?: boolean
  layout?: 'horizontal' | 'vertical'
}

export function StoryActionButtons({
  postId,
  slug,
  title,
  description = '',
  initialLikeCount = 0,
  commentCount = 0,
  className = '',
  size = 'md',
  showCounts = true,
  layout = 'horizontal'
}: StoryActionButtonsProps) {
  const { user } = useFirebaseAuth()
  const [isSaved, setIsSaved] = useState(false)

  const handleComment = () => {
    if (slug) {
      window.open(`/stories/${slug}#comments`, '_blank')
    } else {
      alert('Comments not available for this story')
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: title,
        text: description,
        url: slug ? `${window.location.origin}/stories/${slug}` : window.location.href,
      }).catch((error) => {
        console.log('Error sharing:', error)
        copyToClipboard()
      })
    } else {
      copyToClipboard()
    }
  }

  const copyToClipboard = () => {
    const url = slug ? `${window.location.origin}/stories/${slug}` : window.location.href
    navigator.clipboard.writeText(url).then(() => {
      alert('Link copied to clipboard!')
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = url
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      alert('Link copied to clipboard!')
    })
  }

  const handleSave = async () => {
    if (!user) {
      alert('Please sign in to save stories!')
      return
    }
    
    try {
      // This would integrate with the actual save API
      setIsSaved(!isSaved)
      alert(isSaved ? 'Story removed from favorites' : 'Story saved to favorites!')
    } catch (error) {
      console.error('Error saving story:', error)
      alert('Failed to save story')
    }
  }

  const buttonClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  }

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4', 
    lg: 'h-5 w-5'
  }

  const baseButtonClasses = `flex items-center gap-2 rounded-xl font-medium bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600 shadow-md transition-all duration-200 ${buttonClasses[size]}`

  const containerClasses = layout === 'horizontal' 
    ? `flex gap-2 ${className}` 
    : `flex flex-col gap-2 ${className}`

  return (
    <div className={containerClasses}>
      {/* Like Button - Using the database-integrated component */}
      <LikeButton
        postId={postId}
        initialLikeCount={initialLikeCount}
        size={size}
        showCount={showCounts}
        className="border border-gray-200 dark:border-gray-600 shadow-md"
      />

      {/* Comment Button */}
      <motion.button
        className={baseButtonClasses}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
        onClick={handleComment}
      >
        <MessageCircle className={iconSizes[size]} />
        {showCounts && commentCount > 0 && <span>{commentCount}</span>}
        {(!showCounts || commentCount === 0) && <span>Comment</span>}
      </motion.button>

      {/* Share Button */}
      <motion.button
        className={baseButtonClasses}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
        onClick={handleShare}
      >
        <Share2 className={iconSizes[size]} />
        {!showCounts && <span>Share</span>}
      </motion.button>

      {/* Save Button */}
      <motion.button
        className={`${baseButtonClasses} ${isSaved ? 'bg-green-50 border-green-200 text-green-600 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400' : ''}`}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
        onClick={handleSave}
      >
        <Bookmark className={`${iconSizes[size]} ${isSaved ? 'fill-current' : ''}`} />
        {!showCounts && <span>{isSaved ? 'Saved' : 'Save'}</span>}
      </motion.button>
    </div>
  )
}
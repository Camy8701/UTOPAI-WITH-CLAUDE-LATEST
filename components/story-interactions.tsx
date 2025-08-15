"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth-provider'
import { LikeButton } from '@/components/like-button'
import { StoryActionButtons } from '@/components/story-action-buttons'
import { AuthModal } from '@/components/auth-modal'
import { Button } from '@/components/ui/button'
import { 
  MessageCircle, 
  Send,
  User,
  Reply,
  Heart,
  Bookmark,
  MoreVertical,
  Share2
} from 'lucide-react'
import { commentsAPI, savedPostsAPI } from '@/lib/api-client'

interface Comment {
  id: string
  content: string
  created_at: string
  user_id: string
  post_id: string
  parent_id: string | null
  like_count: number
  profiles: {
    full_name: string | null
    avatar_url: string | null
  }
  replies?: Comment[]
}

interface StoryInteractionsProps {
  postId: string
  initialLikeCount?: number
}

export function StoryInteractions({ postId, initialLikeCount = 0 }: StoryInteractionsProps) {
  const { user, loading } = useAuth()
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const [isLoadingComments, setIsLoadingComments] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [isLoadingSave, setIsLoadingSave] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')

  // Load comments on mount
  useEffect(() => {
    loadComments()
  }, [postId])

  const loadComments = async () => {
    try {
      setIsLoadingComments(true)
      const data = await commentsAPI.getComments(postId)
      setComments(data.comments || [])
    } catch (error) {
      console.error('Error loading comments:', error)
      setComments([])
    } finally {
      setIsLoadingComments(false)
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user || !newComment.trim()) return
    
    setIsSubmitting(true)
    try {
      const data = await commentsAPI.createComment(postId, newComment.trim())
      // Add the new comment to the beginning of the list
      setComments(prev => [data.comment, ...prev])
      setNewComment('')
    } catch (error) {
      console.error('Error submitting comment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user || !replyContent.trim() || !replyTo) return
    
    setIsSubmitting(true)
    try {
      const data = await commentsAPI.createComment(postId, replyContent.trim(), replyTo)
      // Add the new reply to the beginning of the list
      setComments(prev => [data.comment, ...prev])
      setReplyContent('')
      setReplyTo(null)
    } catch (error) {
      console.error('Error submitting reply:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSavePost = async () => {
    if (!user) return
    
    setIsLoadingSave(true)
    try {
      await savedPostsAPI.toggleSave(postId)
      setIsSaved(!isSaved)
    } catch (error) {
      console.error('Error saving post:', error)
    } finally {
      setIsLoadingSave(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: document.title,
        url: window.location.href,
      }).catch((error) => {
        console.log('Error sharing:', error)
        copyToClipboard()
      })
    } else {
      copyToClipboard()
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      alert('Link copied to clipboard!')
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = window.location.href
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      alert('Link copied to clipboard!')
    })
  }

  return (
    <div className="mt-12 border-t border-gray-200 dark:border-gray-800 pt-8">
      {/* Interaction Buttons - Like, Comment, Share, Save */}
      <div className="mb-8">
        <StoryActionButtons
          postId={postId}
          title={document.title || 'Story'}
          description="Read this amazing story"
          initialLikeCount={initialLikeCount}
          commentCount={comments.length}
          size="lg"
          showCounts={true}
          className="justify-start"
        />
      </div>

      {/* Comments Section */}
      <div id="comments-section" className="space-y-6">
        <h3 className="text-xl font-bold dark:text-white">Comments</h3>

        {/* Comment Form */}
        {loading ? (
          <div className="animate-pulse">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700"></div>
              <div className="flex-1">
                <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg mb-2"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
              </div>
            </div>
          </div>
        ) : user ? (
          <form onSubmit={handleSubmitComment} className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                {user.user_metadata?.avatar_url ? (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt="Your avatar"
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts about this story..."
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
                <div className="flex justify-end mt-2">
                  <Button
                    type="submit"
                    disabled={!newComment.trim() || isSubmitting}
                    className="flex items-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    {isSubmitting ? 'Posting...' : 'Post Comment'}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Sign in to join the conversation and share your thoughts on this story.
            </p>
            <div className="flex justify-center gap-3">
              <Button 
                variant="outline"
                onClick={() => {
                  setAuthMode('signin')
                  setShowAuthModal(true)
                }}
              >
                Sign In to Comment
              </Button>
              <Button 
                onClick={() => {
                  setAuthMode('signup')
                  setShowAuthModal(true)
                }}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Sign Up
              </Button>
            </div>
          </div>
        )}

        {/* Comments List */}
        {isLoadingComments ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-1"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : comments.length > 0 ? (
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="space-y-3">
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    {comment.profiles.avatar_url ? (
                      <img
                        src={comment.profiles.avatar_url}
                        alt={`${comment.profiles.full_name}'s avatar`}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                        <User className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {comment.profiles.full_name || 'Anonymous'}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(comment.created_at)}
                      </span>
                    </div>
                    <p className="text-gray-800 dark:text-gray-200 mb-3">
                      {comment.content}
                    </p>
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                        <Heart className="h-4 w-4" />
                        {comment.like_count}
                      </button>
                      {user && (
                        <button
                          onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                          className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          <Reply className="h-4 w-4" />
                          Reply
                        </button>
                      )}
                    </div>

                    {/* Reply Form */}
                    {replyTo === comment.id && (
                      <form onSubmit={handleSubmitReply} className="mt-3 ml-4 space-y-3">
                        <textarea
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          placeholder={`Reply to ${comment.profiles.full_name}...`}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows={2}
                        />
                        <div className="flex gap-2">
                          <Button
                            type="submit"
                            size="sm"
                            disabled={!replyContent.trim() || isSubmitting}
                          >
                            {isSubmitting ? 'Replying...' : 'Reply'}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setReplyTo(null)
                              setReplyContent('')
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
      />
    </div>
  )
}
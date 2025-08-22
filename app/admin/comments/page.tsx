"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { 
  MessageSquare, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Edit, 
  Trash2,
  Flag,
  Clock,
  User,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'
import { useFirebaseAuth } from '@/components/firebase-auth-provider'
import { CommentsAdmin, Comment } from '@/lib/firebase-admin'
import { toast } from 'sonner'

export default function AdminCommentsPage() {
  const router = useRouter()
  const { user } = useFirebaseAuth()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [comments, setComments] = useState<Comment[]>([])
  const [filteredComments, setFilteredComments] = useState<Comment[]>([])
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  const [editingComment, setEditingComment] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')

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
      loadComments()
    }
  }, [isAuthorized])

  useEffect(() => {
    // Filter comments
    let filtered = comments
    if (filter !== 'all') {
      filtered = comments.filter(comment => comment.status === filter)
    }
    setFilteredComments(filtered)
  }, [comments, filter])

  const loadComments = async () => {
    try {
      setIsLoading(true)
      const firebaseComments = await CommentsAdmin.getAllComments()
      setComments(firebaseComments)
    } catch (error) {
      console.error('Error loading comments:', error)
      toast.error('Failed to load comments')
    } finally {
      setIsLoading(false)
    }
  }

  const updateCommentStatus = async (commentId: string, status: 'approved' | 'rejected') => {
    try {
      await CommentsAdmin.updateCommentStatus(commentId, status)
      toast.success(`Comment ${status} successfully!`)
      
      // Update local state
      setComments(comments.map(comment => 
        comment.id === commentId 
          ? { ...comment, status }
          : comment
      ))
    } catch (error) {
      console.error('Error updating comment status:', error)
      toast.error('Failed to update comment status')
    }
  }

  const deleteComment = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment? This action cannot be undone.')) {
      return
    }

    try {
      await CommentsAdmin.deleteComment(commentId)
      toast.success('Comment deleted successfully!')
      
      // Update local state
      setComments(comments.filter(comment => comment.id !== commentId))
    } catch (error) {
      console.error('Error deleting comment:', error)
      toast.error('Failed to delete comment')
    }
  }

  const updateCommentContent = async (commentId: string, newContent: string) => {
    try {
      await CommentsAdmin.updateComment(commentId, newContent)
      toast.success('Comment updated successfully!')
      
      // Update local state
      setComments(comments.map(comment => 
        comment.id === commentId 
          ? { ...comment, content: newContent }
          : comment
      ))
      
      setEditingComment(null)
      setEditContent('')
    } catch (error) {
      console.error('Error updating comment:', error)
      toast.error('Failed to update comment')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const stats = {
    total: comments.length,
    pending: comments.filter(c => c.status === 'pending').length,
    approved: comments.filter(c => c.status === 'approved').length,
    rejected: comments.filter(c => c.status === 'rejected').length
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading comments...</p>
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
              <div className="w-8 h-8 bg-orange-600 rounded flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Comment Moderation</h1>
              <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                {stats.pending} Pending
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilter('all')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Comments</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilter('pending')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Review</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilter('approved')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Approved</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.approved}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilter('rejected')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Rejected</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.rejected}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-4 mb-6">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
            <Button
              key={status}
              variant={filter === status ? 'default' : 'outline'}
              onClick={() => setFilter(status)}
              className="capitalize"
            >
              {status} ({status === 'all' ? stats.total : stats[status]})
            </Button>
          ))}
        </div>

        {/* Comments List */}
        <div className="space-y-6">
          {filteredComments.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No {filter !== 'all' ? filter : ''} comments found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {filter === 'pending' 
                    ? 'All comments have been reviewed.'
                    : 'No comments match the current filter.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredComments.map((comment) => (
              <Card key={comment.id}>
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={comment.user_avatar || undefined} />
                        <AvatarFallback>
                          {comment.user_name?.[0] || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {comment.user_name || 'Anonymous'}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {comment.created_at ? new Date(comment.created_at.seconds * 1000).toLocaleDateString() : 'N/A'} at{' '}
                          {comment.created_at ? new Date(comment.created_at.seconds * 1000).toLocaleTimeString() : 'N/A'}
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(comment.status)}>
                      {comment.status}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  {/* Post Reference */}
                  <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Comment on Post ID:
                    </p>
                    <p className="text-blue-600 hover:text-blue-700 font-medium">
                      {comment.post_id}
                    </p>
                  </div>

                  {/* Comment Content */}
                  {editingComment === comment.id ? (
                    <div className="space-y-3">
                      <Textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="min-h-[100px]"
                        placeholder="Edit comment content..."
                      />
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          onClick={() => updateCommentContent(comment.id!, editContent)}
                        >
                          Save Changes
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setEditingComment(null)
                            setEditContent('')
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="prose dark:prose-invert max-w-none">
                      <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                        {comment.content}
                      </p>
                    </div>
                  )}

                  {/* Comment Metadata */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      {comment.updated_at && comment.updated_at !== comment.created_at && (
                        <span className="text-xs">
                          (edited {comment.updated_at ? new Date(comment.updated_at.seconds * 1000).toLocaleDateString() : 'N/A'})
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2">
                      {comment.status === 'pending' && (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-green-600 hover:text-green-700"
                            onClick={() => updateCommentStatus(comment.id!, 'approved')}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => updateCommentStatus(comment.id!, 'rejected')}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                      
                      {comment.status === 'approved' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => updateCommentStatus(comment.id!, 'rejected')}
                        >
                          <Flag className="h-4 w-4 mr-1" />
                          Flag
                        </Button>
                      )}

                      {comment.status === 'rejected' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-green-600 hover:text-green-700"
                          onClick={() => updateCommentStatus(comment.id!, 'approved')}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Restore
                        </Button>
                      )}

                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setEditingComment(comment.id!)
                          setEditContent(comment.content)
                        }}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>

                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => deleteComment(comment.id!)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
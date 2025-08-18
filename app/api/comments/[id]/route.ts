import { NextRequest, NextResponse } from 'next/server'
import { createAPIClient } from '@/lib/supabase-client-server'

// GET /api/comments/[id] - Get a specific comment
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: commentId } = await params

    if (!commentId) {
      return NextResponse.json(
        { error: 'Comment ID is required' },
        { status: 400 }
      )
    }

    const supabase = createAPIClient(request)

    const { data: comment, error } = await supabase
      .from('comments')
      .select(`
        id,
        content,
        created_at,
        updated_at,
        parent_id,
        post_id,
        like_count,
        user_id,
        profiles!comments_user_id_fkey (
          full_name,
          avatar_url
        )
      `)
      .eq('id', commentId)
      .single()

    if (error || !comment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      )
    }

    const responseComment = {
      ...comment,
      author_name: Array.isArray(comment.profiles) ? comment.profiles[0]?.full_name || 'Anonymous' : (comment.profiles as any)?.full_name || 'Anonymous',
      author_avatar: Array.isArray(comment.profiles) ? comment.profiles[0]?.avatar_url || null : (comment.profiles as any)?.avatar_url || null
    }

    return NextResponse.json({ comment: responseComment })

  } catch (error) {
    console.error('Comment GET API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/comments/[id] - Update a comment
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: commentId } = await params
    const body = await request.json()
    const { content } = body

    if (!commentId) {
      return NextResponse.json(
        { error: 'Comment ID is required' },
        { status: 400 }
      )
    }

    if (!content || content.trim().length < 1) {
      return NextResponse.json(
        { error: 'Comment content cannot be empty' },
        { status: 400 }
      )
    }

    if (content.length > 2000) {
      return NextResponse.json(
        { error: 'Comment too long (max 2000 characters)' },
        { status: 400 }
      )
    }

    const supabase = createAPIClient(request)

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Check if comment exists and user owns it
    const { data: existingComment, error: fetchError } = await supabase
      .from('comments')
      .select('id, user_id, created_at')
      .eq('id', commentId)
      .single()

    if (fetchError || !existingComment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      )
    }

    if (existingComment.user_id !== user.id) {
      return NextResponse.json(
        { error: 'You can only edit your own comments' },
        { status: 403 }
      )
    }

    // Check if comment is not too old (allow editing within 24 hours)
    const createdAt = new Date(existingComment.created_at)
    const now = new Date()
    const hoursDiff = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60)

    if (hoursDiff > 24) {
      return NextResponse.json(
        { error: 'Comments can only be edited within 24 hours' },
        { status: 403 }
      )
    }

    // Update the comment
    const { data: updatedComment, error: updateError } = await supabase
      .from('comments')
      .update({
        content: content.trim(),
        updated_at: new Date().toISOString()
      })
      .eq('id', commentId)
      .select(`
        id,
        content,
        created_at,
        updated_at,
        parent_id,
        like_count,
        profiles!comments_user_id_fkey (
          full_name,
          avatar_url
        )
      `)
      .single()

    if (updateError) {
      console.error('Error updating comment:', updateError)
      return NextResponse.json(
        { error: 'Failed to update comment' },
        { status: 500 }
      )
    }

    const responseComment = {
      ...updatedComment,
      author_name: Array.isArray(updatedComment.profiles) 
        ? updatedComment.profiles[0]?.full_name || 'Anonymous'
        : (updatedComment.profiles as any)?.full_name || 'Anonymous',
      author_avatar: Array.isArray(updatedComment.profiles)
        ? updatedComment.profiles[0]?.avatar_url || null
        : (updatedComment.profiles as any)?.avatar_url || null
    }

    return NextResponse.json({
      comment: responseComment,
      message: 'Comment updated successfully'
    })

  } catch (error) {
    console.error('Comment PUT API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/comments/[id] - Delete a comment
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: commentId } = await params

    if (!commentId) {
      return NextResponse.json(
        { error: 'Comment ID is required' },
        { status: 400 }
      )
    }

    const supabase = createAPIClient(request)

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Check if comment exists and user owns it
    const { data: existingComment, error: fetchError } = await supabase
      .from('comments')
      .select('id, user_id')
      .eq('id', commentId)
      .single()

    if (fetchError || !existingComment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      )
    }

    if (existingComment.user_id !== user.id) {
      return NextResponse.json(
        { error: 'You can only delete your own comments' },
        { status: 403 }
      )
    }

    // Delete the comment (cascade will handle replies)
    const { error: deleteError } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId)

    if (deleteError) {
      console.error('Error deleting comment:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete comment' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Comment deleted successfully'
    })

  } catch (error) {
    console.error('Comment DELETE API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
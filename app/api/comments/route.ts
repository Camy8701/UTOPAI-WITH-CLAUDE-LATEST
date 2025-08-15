import { NextRequest, NextResponse } from 'next/server'
import { createAPIClient } from '@/lib/supabase-client-server'

// GET /api/comments?post_id=xxx - Get all comments for a post
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const post_id = searchParams.get('post_id')

    if (!post_id) {
      return NextResponse.json(
        { error: 'post_id is required' },
        { status: 400 }
      )
    }

    const supabase = createAPIClient(request)

    // Get comments with user profile data and like counts
    const { data: comments, error } = await supabase
      .from('comments')
      .select(`
        id,
        content,
        created_at,
        updated_at,
        parent_id,
        like_count,
        user_id,
        profiles!comments_user_id_fkey (
          full_name,
          avatar_url
        )
      `)
      .eq('post_id', post_id)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching comments:', error)
      return NextResponse.json(
        { error: 'Failed to fetch comments' },
        { status: 500 }
      )
    }

    // Organize comments into nested structure
    const commentMap = new Map()
    const rootComments: any[] = []

    // First pass: create all comment objects
    comments?.forEach(comment => {
      commentMap.set(comment.id, {
        ...comment,
        author_name: Array.isArray(comment.profiles) ? comment.profiles[0]?.full_name || 'Anonymous' : (comment.profiles as any)?.full_name || 'Anonymous',
        author_avatar: Array.isArray(comment.profiles) ? comment.profiles[0]?.avatar_url || null : (comment.profiles as any)?.avatar_url || null,
        replies: []
      })
    })

    // Second pass: organize into tree structure
    comments?.forEach(comment => {
      const commentObj = commentMap.get(comment.id)
      if (comment.parent_id) {
        const parent = commentMap.get(comment.parent_id)
        if (parent) {
          parent.replies.push(commentObj)
        }
      } else {
        rootComments.push(commentObj)
      }
    })

    return NextResponse.json({
      comments: rootComments,
      total: comments?.length || 0
    })

  } catch (error) {
    console.error('Comments API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/comments - Create a new comment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { post_id, content, parent_id = null } = body

    if (!post_id || !content) {
      return NextResponse.json(
        { error: 'post_id and content are required' },
        { status: 400 }
      )
    }

    if (content.trim().length < 1) {
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
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Verify the post exists
    const { data: post, error: postError } = await supabase
      .from('blog_posts')
      .select('id')
      .eq('id', post_id)
      .single()

    if (postError || !post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // If replying to a comment, verify parent comment exists
    if (parent_id) {
      const { data: parentComment, error: parentError } = await supabase
        .from('comments')
        .select('id, post_id')
        .eq('id', parent_id)
        .single()

      if (parentError || !parentComment) {
        return NextResponse.json(
          { error: 'Parent comment not found' },
          { status: 404 }
        )
      }

      if (parentComment.post_id !== post_id) {
        return NextResponse.json(
          { error: 'Parent comment is not for this post' },
          { status: 400 }
        )
      }
    }

    // Create the comment
    const { data: comment, error: insertError } = await supabase
      .from('comments')
      .insert({
        post_id,
        user_id: user.id,
        content: content.trim(),
        parent_id
      })
      .select(`
        id,
        content,
        created_at,
        parent_id,
        like_count,
        profiles!comments_user_id_fkey (
          full_name,
          avatar_url
        )
      `)
      .single()

    if (insertError) {
      console.error('Error creating comment:', insertError)
      return NextResponse.json(
        { error: 'Failed to create comment' },
        { status: 500 }
      )
    }

    // Return the created comment with user info
    const responseComment = {
      ...comment,
      author_name: Array.isArray(comment.profiles) ? comment.profiles[0]?.full_name || 'Anonymous' : (comment.profiles as any)?.full_name || 'Anonymous',
      author_avatar: Array.isArray(comment.profiles) ? comment.profiles[0]?.avatar_url || null : (comment.profiles as any)?.avatar_url || null,
      replies: []
    }

    return NextResponse.json(
      { 
        comment: responseComment,
        message: 'Comment created successfully' 
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Comments POST API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
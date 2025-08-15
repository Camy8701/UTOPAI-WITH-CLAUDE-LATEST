import { NextRequest, NextResponse } from 'next/server'
import { createAPIClient } from '@/lib/supabase-client-server'

// GET /api/saved-posts - Get all saved posts for authenticated user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    const supabase = createAPIClient(request)

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get saved posts with blog post details
    const { data: savedPosts, error, count } = await supabase
      .from('saved_posts')
      .select(`
        id,
        created_at,
        blog_posts!saved_posts_post_id_fkey (
          id,
          title,
          excerpt,
          slug,
          thumbnail_url,
          created_at,
          content_type,
          section,
          like_count,
          comment_count,
          read_time,
          profiles!blog_posts_author_id_fkey (
            full_name,
            avatar_url
          )
        )
      `, { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Error fetching saved posts:', error)
      return NextResponse.json(
        { error: 'Failed to fetch saved posts' },
        { status: 500 }
      )
    }

    // Format the response
    const formattedPosts = savedPosts?.map(savedPost => ({
      id: savedPost.id,
      saved_at: savedPost.created_at,
      post: {
        ...savedPost.blog_posts,
        author_name: savedPost.blog_posts?.profiles?.full_name || 'Anonymous',
        author_avatar: savedPost.blog_posts?.profiles?.avatar_url || null
      }
    })) || []

    return NextResponse.json({
      saved_posts: formattedPosts,
      pagination: {
        page,
        limit,
        total: count || 0,
        total_pages: Math.ceil((count || 0) / limit)
      }
    })

  } catch (error) {
    console.error('Saved Posts GET API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/saved-posts - Save or unsave a post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { post_id, action = 'toggle' } = body

    if (!post_id) {
      return NextResponse.json(
        { error: 'post_id is required' },
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

    // Verify the post exists
    const { data: post, error: postError } = await supabase
      .from('blog_posts')
      .select('id, title')
      .eq('id', post_id)
      .single()

    if (postError || !post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // Check if post is already saved
    const { data: existingSavedPost } = await supabase
      .from('saved_posts')
      .select('id')
      .eq('user_id', user.id)
      .eq('post_id', post_id)
      .single()

    let saved = false
    let message = ''

    if (existingSavedPost) {
      if (action === 'save') {
        return NextResponse.json({
          saved: true,
          message: 'Post already saved',
          post_title: post.title
        })
      }

      // Unsave - remove the saved post
      const { error: deleteError } = await supabase
        .from('saved_posts')
        .delete()
        .eq('id', existingSavedPost.id)

      if (deleteError) {
        console.error('Error removing saved post:', deleteError)
        return NextResponse.json(
          { error: 'Failed to remove saved post' },
          { status: 500 }
        )
      }

      saved = false
      message = 'Post removed from saved'
    } else {
      if (action === 'unsave') {
        return NextResponse.json({
          saved: false,
          message: 'Post not saved yet',
          post_title: post.title
        })
      }

      // Save - add the saved post
      const { error: insertError } = await supabase
        .from('saved_posts')
        .insert({
          user_id: user.id,
          post_id: post_id
        })

      if (insertError) {
        console.error('Error saving post:', insertError)
        return NextResponse.json(
          { error: 'Failed to save post' },
          { status: 500 }
        )
      }

      saved = true
      message = 'Post saved successfully'
    }

    return NextResponse.json({
      saved,
      message,
      post_title: post.title,
      action: saved ? 'saved' : 'unsaved'
    })

  } catch (error) {
    console.error('Saved Posts POST API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
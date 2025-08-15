import { NextRequest, NextResponse } from 'next/server'
import { createAPIClient } from '@/lib/supabase-client-server'

// GET /api/likes?post_id=xxx or /api/likes?comment_id=xxx - Check if user liked something
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const post_id = searchParams.get('post_id')
    const comment_id = searchParams.get('comment_id')

    if (!post_id && !comment_id) {
      return NextResponse.json(
        { error: 'post_id or comment_id is required' },
        { status: 400 }
      )
    }

    const supabase = createAPIClient(request)

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({
        liked: false,
        like_count: 0,
        message: 'Not authenticated'
      })
    }

    // Build query based on what we're checking likes for
    let query = supabase
      .from('likes')
      .select('id, user_id')

    if (post_id) {
      query = query.eq('post_id', post_id).is('comment_id', null)
    } else if (comment_id) {
      query = query.eq('comment_id', comment_id).is('post_id', null)
    }

    // Check if current user has liked this item
    const { data: userLike } = await query.eq('user_id', user.id).single()

    // Get total like count
    let countQuery = supabase
      .from('likes')
      .select('id', { count: 'exact' })

    if (post_id) {
      countQuery = countQuery.eq('post_id', post_id).is('comment_id', null)
    } else if (comment_id) {
      countQuery = countQuery.eq('comment_id', comment_id).is('post_id', null)
    }

    const { count } = await countQuery

    return NextResponse.json({
      liked: !!userLike,
      like_count: count || 0,
      user_id: user.id
    })

  } catch (error) {
    console.error('Likes GET API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/likes - Like/Unlike a post or comment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { post_id, comment_id, action = 'toggle' } = body

    if (!post_id && !comment_id) {
      return NextResponse.json(
        { error: 'post_id or comment_id is required' },
        { status: 400 }
      )
    }

    if (post_id && comment_id) {
      return NextResponse.json(
        { error: 'Cannot like both post and comment simultaneously' },
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

    // Verify the post or comment exists
    if (post_id) {
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
    }

    if (comment_id) {
      const { data: comment, error: commentError } = await supabase
        .from('comments')
        .select('id')
        .eq('id', comment_id)
        .single()

      if (commentError || !comment) {
        return NextResponse.json(
          { error: 'Comment not found' },
          { status: 404 }
        )
      }
    }

    // Check if user has already liked this item
    let existingLikeQuery = supabase
      .from('likes')
      .select('id')
      .eq('user_id', user.id)

    if (post_id) {
      existingLikeQuery = existingLikeQuery.eq('post_id', post_id).is('comment_id', null)
    } else {
      existingLikeQuery = existingLikeQuery.eq('comment_id', comment_id).is('post_id', null)
    }

    const { data: existingLike } = await existingLikeQuery.single()

    let liked = false
    let message = ''

    if (existingLike) {
      if (action === 'like') {
        return NextResponse.json({
          liked: true,
          message: 'Already liked',
          like_count: await getLikeCount(supabase, post_id, comment_id)
        })
      }
      
      // Unlike - remove the like
      const { error: deleteError } = await supabase
        .from('likes')
        .delete()
        .eq('id', existingLike.id)

      if (deleteError) {
        console.error('Error removing like:', deleteError)
        return NextResponse.json(
          { error: 'Failed to remove like' },
          { status: 500 }
        )
      }

      liked = false
      message = 'Like removed'
    } else {
      if (action === 'unlike') {
        return NextResponse.json({
          liked: false,
          message: 'Not liked yet',
          like_count: await getLikeCount(supabase, post_id, comment_id)
        })
      }

      // Like - add the like
      const likeData: any = {
        user_id: user.id
      }

      if (post_id) {
        likeData.post_id = post_id
      } else {
        likeData.comment_id = comment_id
      }

      const { error: insertError } = await supabase
        .from('likes')
        .insert(likeData)

      if (insertError) {
        console.error('Error adding like:', insertError)
        return NextResponse.json(
          { error: 'Failed to add like' },
          { status: 500 }
        )
      }

      liked = true
      message = 'Like added'
    }

    // Get updated like count
    const like_count = await getLikeCount(supabase, post_id, comment_id)

    return NextResponse.json({
      liked,
      like_count,
      message,
      action: liked ? 'liked' : 'unliked'
    })

  } catch (error) {
    console.error('Likes POST API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper function to get like count
async function getLikeCount(supabase: any, post_id: string | null, comment_id: string | null): Promise<number> {
  let countQuery = supabase
    .from('likes')
    .select('id', { count: 'exact' })

  if (post_id) {
    countQuery = countQuery.eq('post_id', post_id).is('comment_id', null)
  } else if (comment_id) {
    countQuery = countQuery.eq('comment_id', comment_id).is('post_id', null)
  }

  const { count } = await countQuery
  return count || 0
}
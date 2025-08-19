import { NextRequest, NextResponse } from 'next/server'
import { createAPIClient } from '@/lib/supabase-client-server'

// GET /api/user-stats - Get user statistics for dashboard
export async function GET(request: NextRequest) {
  try {
    const supabase = createAPIClient(request)

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get user profile data
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, quiz_points, total_quiz_attempts, created_at')
      .eq('id', user.id)
      .single()

    // Parallel queries for all statistics
    const [
      likesGiven,
      commentsPosted,
      savedPosts,
      postsLiked,
      recentActivity
    ] = await Promise.all([
      // Count likes given by user
      supabase
        .from('likes')
        .select('id', { count: 'exact' })
        .eq('user_id', user.id),

      // Count comments posted by user
      supabase
        .from('comments')
        .select('id', { count: 'exact' })
        .eq('user_id', user.id),

      // Count saved posts
      supabase
        .from('saved_posts')
        .select('id', { count: 'exact' })
        .eq('user_id', user.id),

      // Count posts user has liked
      supabase
        .from('likes')
        .select('blog_posts!likes_post_id_fkey(id)', { count: 'exact' })
        .eq('user_id', user.id)
        .not('post_id', 'is', null),

      // Get recent activity (last 10 actions)
      supabase
        .from('likes')
        .select(`
          created_at,
          blog_posts!likes_post_id_fkey(title, slug),
          comments!likes_comment_id_fkey(id, blog_posts!comments_post_id_fkey(title, slug))
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)
    ])

    // Get recent comments for activity
    const { data: recentComments } = await supabase
      .from('comments')
      .select(`
        created_at,
        content,
        blog_posts!comments_post_id_fkey(title, slug)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5)

    // Get recent saved posts for activity
    const { data: recentSaves } = await supabase
      .from('saved_posts')
      .select(`
        created_at,
        blog_posts!saved_posts_post_id_fkey(title, slug)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5)

    // Combine and format recent activity
    const activities: any[] = []

    // Add likes to activity
    recentActivity.data?.forEach(like => {
      const blogPost = Array.isArray(like.blog_posts) ? like.blog_posts[0] : like.blog_posts
      
      if (blogPost) {
        activities.push({
          type: 'like',
          timestamp: like.created_at,
          title: blogPost.title,
          slug: blogPost.slug,
          description: `Liked "${blogPost.title}"`
        })
      } else if (like.comments) {
        const comment = Array.isArray(like.comments) ? like.comments[0] : like.comments
        const commentBlogPost = Array.isArray(comment?.blog_posts) 
          ? comment.blog_posts[0] 
          : comment?.blog_posts
          
        if (commentBlogPost) {
          activities.push({
            type: 'like_comment',
            timestamp: like.created_at,
            title: commentBlogPost.title,
            slug: commentBlogPost.slug,
            description: `Liked a comment on "${commentBlogPost.title}"`
          })
        }
      }
    })

    // Add comments to activity
    recentComments?.forEach(comment => {
      const commentBlogPost = Array.isArray(comment.blog_posts) 
        ? comment.blog_posts[0] 
        : comment.blog_posts
        
      if (commentBlogPost) {
        activities.push({
          type: 'comment',
          timestamp: comment.created_at,
          title: commentBlogPost.title,
          slug: commentBlogPost.slug,
          description: `Commented on "${commentBlogPost.title}"`,
          preview: comment.content.substring(0, 100) + (comment.content.length > 100 ? '...' : '')
        })
      }
    })

    // Add saves to activity
    recentSaves?.forEach(save => {
      const saveBlogPost = Array.isArray(save.blog_posts) 
        ? save.blog_posts[0] 
        : save.blog_posts
        
      if (saveBlogPost) {
        activities.push({
          type: 'save',
          timestamp: save.created_at,
          title: saveBlogPost.title,
          slug: saveBlogPost.slug,
          description: `Saved "${saveBlogPost.title}"`
        })
      }
    })

    // Sort activities by timestamp
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    // Calculate engagement stats
    const totalEngagements = (likesGiven.count || 0) + (commentsPosted.count || 0) + (savedPosts.count || 0)
    const averageEngagementsPerDay = profile?.created_at 
      ? totalEngagements / Math.max(1, Math.ceil((Date.now() - new Date(profile.created_at).getTime()) / (1000 * 60 * 60 * 24)))
      : 0

    // Build response
    const stats = {
      user_info: {
        id: user.id,
        email: user.email,
        full_name: profile?.full_name || null,
        member_since: profile?.created_at || user.created_at,
        quiz_points: profile?.quiz_points || 0,
        total_quiz_attempts: profile?.total_quiz_attempts || 0
      },
      activity_stats: {
        likes_given: likesGiven.count || 0,
        comments_posted: commentsPosted.count || 0,
        posts_saved: savedPosts.count || 0,
        posts_liked: postsLiked.count || 0,
        total_engagements: totalEngagements,
        avg_engagements_per_day: Math.round(averageEngagementsPerDay * 10) / 10
      },
      recent_activity: activities.slice(0, 10),
      quiz_stats: {
        points: profile?.quiz_points || 0,
        attempts: profile?.total_quiz_attempts || 0,
        average_score: profile?.total_quiz_attempts 
          ? Math.round(((profile?.quiz_points || 0) / (profile?.total_quiz_attempts || 1)) * 10) / 10
          : 0
      }
    }

    return NextResponse.json(stats)

  } catch (error) {
    console.error('User Stats API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
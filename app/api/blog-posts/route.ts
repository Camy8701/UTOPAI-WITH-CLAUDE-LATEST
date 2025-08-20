import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'

type BlogPost = Database['public']['Tables']['blog_posts']['Row']
type BlogPostInsert = Database['public']['Tables']['blog_posts']['Insert']

async function createSupabaseServer() {
  try {
    const cookieStore = await cookies()
    
    // Check environment variables
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!url || !key) {
      console.error('Missing Supabase environment variables:', { hasUrl: !!url, hasKey: !!key })
      throw new Error('Supabase configuration is missing')
    }
    
    return createServerClient<Database>(
      url,
      key,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: any) {
            cookieStore.delete({ name, ...options })
          },
        },
      }
    )
  } catch (error) {
    console.error('Failed to create Supabase server client:', error)
    throw error
  }
}

// GET /api/blog-posts - Get all blog posts with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const section = searchParams.get('section')
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const published = searchParams.get('published')
    const limit = searchParams.get('limit')

    const supabase = await createSupabaseServer()
    
    let query = supabase
      .from('blog_posts')
      .select(`
        *,
        profiles!blog_posts_author_id_fkey(full_name, avatar_url)
      `)
      .order('created_at', { ascending: false })

    // Apply filters
    if (section) query = query.eq('section', section)
    if (category) query = query.eq('category', category)
    if (featured) query = query.eq('featured', featured === 'true')
    if (published !== null) query = query.eq('published', published !== 'false')
    if (limit) query = query.limit(parseInt(limit))

    const { data, error } = await query

    if (error) {
      console.error('Error fetching blog posts:', error)
      
      // Check if it's a table not found error (database not set up)
      if (error.code === 'PGRST116') {
        console.log('Blog posts table not found, returning empty array')
        return NextResponse.json({ posts: [] })
      }
      
      return NextResponse.json(
        { error: 'Failed to fetch blog posts', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ posts: data || [] })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/blog-posts - Create a new blog post
export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer()
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // Validate required fields
    const { title, content, section, category, content_type } = body
    if (!title || !content || !section || !category || !content_type) {
      return NextResponse.json(
        { error: 'Missing required fields: title, content, section, category, content_type' },
        { status: 400 }
      )
    }

    // Create slug from title
    const slug = title.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-')

    const postData: BlogPostInsert = {
      title,
      content,
      excerpt: body.excerpt || content.substring(0, 200) + '...',
      slug: `${slug}-${Date.now()}`, // Add timestamp to ensure uniqueness
      author_id: user.id,
      category,
      content_type,
      section,
      published: body.published || false,
      featured: body.featured || false,
      thumbnail_url: body.thumbnail_url || null,
      audio_url: body.audio_url || null,
      video_url: body.video_url || null,
      read_time: body.read_time || null,
      published_at: body.published && body.published_at ? body.published_at : null,
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .insert(postData)
      .select()
      .single()

    if (error) {
      console.error('Error creating blog post:', error)
      return NextResponse.json(
        { error: 'Failed to create blog post' },
        { status: 500 }
      )
    }

    return NextResponse.json({ post: data }, { status: 201 })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
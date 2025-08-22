import { NextRequest, NextResponse } from 'next/server'

// Temporary static blog posts data until we decide on final data strategy
const STATIC_BLOG_POSTS = [
  {
    id: "1",
    title: "The Future of AI: Beyond ChatGPT",
    excerpt: "Exploring the next generation of artificial intelligence and what it means for humanity.",
    content: "Artificial intelligence has come a long way since the early days of rule-based systems...",
    slug: "future-of-ai-beyond-chatgpt",
    author_id: "1",
    category: "AI Trends",
    content_type: "story",
    section: "featured-stories",
    published: true,
    featured: true,
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
    image_url: "/ai-consciousness-story.png",
    read_time: 8,
    tags: ["AI", "Technology", "Future"],
    view_count: 1234,
    like_count: 89,
    comment_count: 23
  },
  {
    id: "2", 
    title: "Google's Gemini: The AI Revolution Continues",
    excerpt: "A deep dive into Google's latest AI breakthrough and its implications.",
    content: "Google's Gemini represents a significant leap forward in AI capabilities...",
    slug: "google-gemini-ai-breakthrough",
    author_id: "1",
    category: "AI News",
    content_type: "news",
    section: "best-ai-tools", 
    published: true,
    featured: false,
    created_at: "2024-01-14T15:30:00Z",
    updated_at: "2024-01-14T15:30:00Z",
    image_url: "/google-gemini-news.png",
    read_time: 6,
    tags: ["Google", "Gemini", "AI"],
    view_count: 892,
    like_count: 67,
    comment_count: 15
  },
  {
    id: "3",
    title: "Meta's AI Breaking Language Barriers", 
    excerpt: "How Meta's new AI is preserving rare languages and connecting cultures.",
    content: "Meta's latest AI initiative focuses on preserving endangered languages...",
    slug: "meta-ai-language-preservation",
    author_id: "1",
    category: "AI Impact",
    content_type: "story",
    section: "featured-stories",
    published: true,
    featured: true,
    created_at: "2024-01-13T09:15:00Z",
    updated_at: "2024-01-13T09:15:00Z", 
    image_url: "/meta-ai-rare-languages.png",
    read_time: 7,
    tags: ["Meta", "Languages", "Culture"],
    view_count: 756,
    like_count: 94,
    comment_count: 18
  },
  {
    id: "4",
    title: "NVIDIA's AI Chip Revolution",
    excerpt: "How NVIDIA's latest AI chips are transforming computing power worldwide.",
    content: "NVIDIA continues to lead the AI hardware revolution with groundbreaking chip designs...",
    slug: "nvidia-ai-chip-revolution",
    author_id: "1",
    category: "Hardware",
    content_type: "news",
    section: "best-ai-tools",
    published: true,
    featured: false,
    created_at: "2024-01-12T14:20:00Z",
    updated_at: "2024-01-12T14:20:00Z",
    image_url: "/nvidia-ai-chip.png",
    read_time: 5,
    tags: ["NVIDIA", "Hardware", "AI Chips"],
    view_count: 654,
    like_count: 45,
    comment_count: 12
  },
  {
    id: "5",
    title: "UK's New AI Safety Policies",
    excerpt: "Examining the UK's latest approach to AI regulation and safety standards.",
    content: "The United Kingdom has announced comprehensive AI safety policies...",
    slug: "uk-ai-safety-policies",
    author_id: "1", 
    category: "Policy",
    content_type: "news",
    section: "best-ai-tools",
    published: true,
    featured: false,
    created_at: "2024-01-11T11:45:00Z",
    updated_at: "2024-01-11T11:45:00Z",
    image_url: "/uk-ai-safety-policy.png",
    read_time: 6,
    tags: ["Policy", "Safety", "UK"],
    view_count: 432,
    like_count: 38,
    comment_count: 9
  }
]

// GET /api/blog-posts - Get all blog posts with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const section = searchParams.get('section')
    const featured = searchParams.get('featured') === 'true'
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')

    let filteredPosts = [...STATIC_BLOG_POSTS]

    // Filter by section
    if (section) {
      filteredPosts = filteredPosts.filter(post => post.section === section)
    }

    // Filter by featured
    if (featured) {
      filteredPosts = filteredPosts.filter(post => post.featured === true)
    }

    // Filter by category
    if (category) {
      filteredPosts = filteredPosts.filter(post => post.category === category)
    }

    // Apply limit
    filteredPosts = filteredPosts.slice(0, limit)

    return NextResponse.json({
      posts: filteredPosts,
      total: filteredPosts.length
    })

  } catch (error) {
    console.error('Blog posts API error:', error)
    return NextResponse.json(
      { 
        posts: [],
        total: 0,
        error: 'Failed to fetch blog posts'
      },
      { status: 500 }
    )
  }
}

// POST /api/blog-posts - Create a new blog post (admin only)
export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: 'Blog post creation not implemented yet' },
    { status: 501 }
  )
}
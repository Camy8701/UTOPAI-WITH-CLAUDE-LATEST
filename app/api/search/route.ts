import { NextRequest, NextResponse } from 'next/server'
import { createAPIClient } from '@/lib/supabase-client-server'

interface SearchResult {
  id: string
  title: string
  description?: string
  category: 'story' | 'news' | 'quiz' | 'tool'
  url: string
  image?: string
  excerpt?: string
  created_at?: string
  match_score?: number
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const limit = parseInt(searchParams.get('limit') || '20')
    const category = searchParams.get('category')

    if (!query || query.trim().length < 2) {
      return NextResponse.json({
        success: true,
        results: [],
        suggestions: [],
        query: query || ''
      })
    }

    const supabase = createAPIClient(request)
    const searchTerm = query.trim()
    
    let results: SearchResult[] = []

    // Search blog posts (stories and news)
    let postsQuery = supabase
      .from('blog_posts')
      .select(`
        id,
        title,
        excerpt,
        slug,
        thumbnail_url,
        content_type,
        created_at
      `)
      .eq('published', true)
      .limit(limit)

    // Apply category filter for posts
    if (category === 'story') {
      postsQuery = postsQuery.eq('content_type', 'story')
    } else if (category === 'news') {
      postsQuery = postsQuery.eq('content_type', 'news')
    }

    // Use full-text search if available, otherwise use ILIKE
    const { data: posts } = await postsQuery.or(`title.ilike.%${searchTerm}%,excerpt.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`)

    // Transform blog posts to search results
    if (posts) {
      const postResults: SearchResult[] = posts.map(post => ({
        id: post.id,
        title: post.title,
        description: post.excerpt || undefined,
        category: post.content_type as 'story' | 'news',
        url: `/${post.content_type === 'story' ? 'stories' : 'news'}/${post.slug}`,
        image: post.thumbnail_url || undefined,
        excerpt: post.excerpt || undefined,
        created_at: post.created_at
      }))
      
      results.push(...postResults)
    }

    // Search quiz data if not filtering by category or filtering by quiz
    if (!category || category === 'quiz') {
      const quizzes = [
        {
          id: 'ai-fundamentals',
          title: 'AI Fundamentals Quiz',
          description: 'Test your basic knowledge of artificial intelligence concepts and history',
          category: 'quiz' as const,
          url: '/quiz/ai-fundamentals'
        },
        {
          id: 'ai-intermediate', 
          title: 'AI Intermediate Quiz',
          description: 'Dive deeper into machine learning, neural networks, and AI applications',
          category: 'quiz' as const,
          url: '/quiz/ai-intermediate'
        },
        {
          id: 'ai-ethics',
          title: 'AI Advanced Quiz', 
          description: 'Advanced concepts, technical details, and cutting-edge AI research',
          category: 'quiz' as const,
          url: '/quiz/ai-ethics'
        }
      ]

      const matchingQuizzes = quizzes.filter(quiz => 
        quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quiz.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        'quiz'.includes(searchTerm.toLowerCase()) ||
        'ai'.includes(searchTerm.toLowerCase())
      )

      results.push(...matchingQuizzes)
    }

    // Add static tools if searching for tools
    if (!category || category === 'tool') {
      const tools = [
        {
          id: 'tip-calculator',
          title: 'Tip Calculator',
          description: 'Smart tip calculator with multiple currency support',
          category: 'tool' as const,
          url: '/tip-calculator'
        },
        {
          id: 'character-counter',
          title: 'Character Counter', 
          description: 'Count characters, words, and lines in your text',
          category: 'tool' as const,
          url: '/character-counter'
        },
        {
          id: 'file-converter',
          title: 'File Converter',
          description: 'Convert files between different formats',
          category: 'tool' as const,
          url: '/file-converter'
        }
      ]

      const matchingTools = tools.filter(tool =>
        tool.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchTerm.toLowerCase())
      )

      results.push(...matchingTools)
    }

    // Sort results by relevance (title matches first, then description matches)
    results.sort((a, b) => {
      const aTitle = a.title.toLowerCase().includes(searchTerm.toLowerCase()) ? 1 : 0
      const bTitle = b.title.toLowerCase().includes(searchTerm.toLowerCase()) ? 1 : 0
      
      if (aTitle !== bTitle) return bTitle - aTitle
      
      // Secondary sort by creation date for posts
      if (a.created_at && b.created_at) {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
      
      return a.title.localeCompare(b.title)
    })

    // Limit final results
    results = results.slice(0, limit)

    // Generate search suggestions based on results
    const suggestions: string[] = []
    const addedSuggestions = new Set<string>()

    // Add titles that partially match
    results.forEach(result => {
      if (result.title.toLowerCase().includes(searchTerm.toLowerCase()) && !addedSuggestions.has(result.title)) {
        suggestions.push(result.title)
        addedSuggestions.add(result.title)
      }
    })

    // Add common search terms
    const commonTerms = ['AI', 'artificial intelligence', 'machine learning', 'neural networks', 'quiz', 'stories', 'tools']
    commonTerms.forEach(term => {
      if (term.toLowerCase().includes(searchTerm.toLowerCase()) && !addedSuggestions.has(term)) {
        suggestions.push(term)
        addedSuggestions.add(term)
      }
    })

    return NextResponse.json({
      success: true,
      results,
      suggestions: suggestions.slice(0, 5),
      query: searchTerm,
      total: results.length,
      filters: {
        category,
        limit
      }
    })

  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    )
  }
}
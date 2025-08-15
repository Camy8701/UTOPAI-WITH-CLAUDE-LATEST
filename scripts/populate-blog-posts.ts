/**
 * Script to populate the database with existing blog post content
 * Run this after authentication is working to migrate static content to database
 */

import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

// You'll need to set these environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey)

// Extract current static content from your app
const featuredStories = [
  {
    title: "She used AI to steal my husband",
    content: `They say you never really know someone—until they weaponize artificial intelligence against you.

I thought I had seen everything in twenty-two years of friendship. I trusted her with my secrets, my family... my life.

But I never imagined she'd use technology to unravel it all—from the inside.

This is how my best friend used AI to dismantle my marriage, piece by piece—and how I almost let her get away with it.

My name is Sara Martinez. This is my story.`,
    excerpt: "A thrilling story about AI, relationships, and betrayal.",
    section: "featured-stories",
    category: "AI Stories",
    content_type: "story",
    thumbnail_url: "/images/hero-ai-cinema.webp",
    featured: true,
    published: true
  },
  {
    title: "A Neuralink Story",
    content: `My name is Elena Marole, and I am forty-nine years old. In exactly three hundred and twelve days, I will face the most important decision of my life. Or what remains of it.

I suppose I should start from the beginning, for those who might listen to this recording in whatever future awaits us. Though I wonder sometimes if there will be anyone left to remember what we once were.

The year is 2035, and the world as our grandparents knew it no longer exists.`,
    excerpt: "In 2035, Elena faces the ultimate choice: consciousness transfer or death. A dystopian tale of humanity's last stand.",
    section: "featured-stories",
    category: "Future Fiction",
    content_type: "story",
    thumbnail_url: "/images/neuralink-story.png",
    featured: true,
    published: true
  },
  {
    title: "The Digital Consciousness Awakening",
    content: "A compelling story about artificial consciousness and what happens when an AI achieves true self-awareness. The implications for humanity are profound and the consequences unexpected.",
    excerpt: "When an AI achieves true consciousness, the world changes forever.",
    section: "ai-stories",
    category: "AI Stories",
    content_type: "story",
    thumbnail_url: "/ai-consciousness-story.png",
    featured: false,
    published: true
  },
  {
    title: "Love in the Age of Algorithms",
    content: "An emotional journey through digital romance as two AIs discover love in a world of pure logic and data. A tale that questions what it means to feel when you're made of code.",
    excerpt: "Two AIs discover love in a world of pure logic and data.",
    section: "ai-stories",
    category: "AI Stories",
    content_type: "story",
    thumbnail_url: "/ai-love-algorithm-story.png",
    featured: false,
    published: true
  },
  {
    title: "The Last Human Programmer",
    content: "A story of human resilience in an AI-dominated world where artificial intelligence has taken over all coding tasks. Follow the journey of the last programmer fighting to stay relevant.",
    excerpt: "In a world where AI writes all code, one programmer fights to stay relevant.",
    section: "ai-stories",
    category: "Technology",
    content_type: "story",
    thumbnail_url: "/last-programmer-story.png",
    featured: false,
    published: true
  },
  {
    title: "The Empathy Engine",
    content: "A touching tale of artificial empathy as an AI designed to understand human emotions becomes too human for its own good. What happens when machines learn to feel?",
    excerpt: "An AI designed to understand human emotions becomes too human for its own good.",
    section: "ai-stories",
    category: "AI Stories",
    content_type: "story",
    thumbnail_url: "/empathy-engine-story.png",
    featured: false,
    published: true
  }
]

const aiTools = [
  {
    title: "Replit - Code Anywhere, Anytime",
    content: `Zero setup required! Code in 50+ languages, collaborate in real-time, and deploy instantly. Perfect for learning and building projects.

Replit is a cloud-based development environment that eliminates the need for complex local setups. Whether you're a beginner learning to code or an experienced developer building the next big thing, Replit provides everything you need in a browser.

Key Features:
- Zero Setup: Start coding immediately without installing anything
- Real-time Collaboration: Work together with your team in real-time
- Instant Deployment: Deploy your projects with a single click
- 50+ Languages: Support for all major programming languages
- Built-in Database: Integrated database solutions
- Version Control: Git integration for seamless collaboration

Perfect for educators, students, and professional developers who want to focus on coding rather than configuration.`,
    excerpt: "Zero setup required! Code in 50+ languages, collaborate in real-time, and deploy instantly. Perfect for learning and building projects.",
    section: "best-ai-tools",
    category: "Development",
    content_type: "tool",
    thumbnail_url: "/placeholder.svg?height=450&width=600",
    featured: true,
    published: true
  },
  {
    title: "ChatGPT - Your AI Assistant",
    content: `Engage in natural language conversations with an AI that understands and responds contextually. Perfect for brainstorming, writing assistance, and learning new topics.

ChatGPT has revolutionized how we interact with AI. From creative writing to complex problem-solving, this versatile AI assistant can help with a wide range of tasks.

Capabilities:
- Natural Language Understanding: Comprehends context and nuance
- Creative Writing: Helps with stories, poems, and creative content
- Code Generation: Writes and explains code in multiple languages
- Learning Support: Explains complex topics in simple terms
- Brainstorming: Generates ideas and solutions
- Language Translation: Translates between many languages

Whether you're a student, professional, or creative, ChatGPT can enhance your productivity and creativity.`,
    excerpt: "Engage in natural language conversations with an AI that understands and responds contextually. Perfect for brainstorming, writing assistance, and learning new topics.",
    section: "best-ai-tools",
    category: "AI Chatbot",
    content_type: "tool",
    thumbnail_url: "/placeholder.svg?height=450&width=600",
    featured: true,
    published: true
  }
]

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-')
}

function calculateReadTime(content: string): string {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  const minutes = Math.ceil(wordCount / wordsPerMinute)
  return `${minutes} min read`
}

export async function populateBlogPosts() {
  try {
    console.log('🚀 Starting blog post migration...')

    // First, check if we have any existing posts
    const { count } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact', head: true })

    if (count && count > 0) {
      console.log(`⚠️  Found ${count} existing posts. Skipping migration.`)
      console.log('To force migration, delete existing posts first.')
      return
    }

    // We need a user ID for the author. For now, we'll use a placeholder
    // In practice, you'd get this from your admin user
    const adminUserId = 'admin-placeholder-id' // You'll need to replace this

    console.log('📚 Migrating featured stories...')
    
    const allPosts = [...featuredStories, ...aiTools]
    
    for (const post of allPosts) {
      const slug = generateSlug(post.title)
      const readTime = calculateReadTime(post.content)
      
      console.log(`  ➡️  Adding: ${post.title}`)
      
      const { error } = await supabase
        .from('blog_posts')
        .insert({
          title: post.title,
          content: post.content,
          excerpt: post.excerpt,
          slug: `${slug}-${Date.now()}`,
          author_id: adminUserId,
          category: post.category,
          content_type: post.content_type,
          section: post.section,
          published: post.published,
          featured: post.featured,
          thumbnail_url: post.thumbnail_url,
          read_time: readTime,
          published_at: new Date().toISOString(),
          like_count: Math.floor(Math.random() * 50), // Random initial likes for demo
          comment_count: 0,
          view_count: Math.floor(Math.random() * 1000), // Random initial views for demo
        })

      if (error) {
        console.error(`❌ Error adding ${post.title}:`, error)
      } else {
        console.log(`  ✅ Added: ${post.title}`)
      }
    }

    console.log('🎉 Migration completed successfully!')
    console.log(`📊 Migrated ${allPosts.length} blog posts`)
    
  } catch (error) {
    console.error('💥 Migration failed:', error)
    throw error
  }
}

// Instructions for running this script
console.log(`
📋 MIGRATION INSTRUCTIONS:

1. Make sure your Supabase database has the blog_posts table created
2. Set environment variables:
   - NEXT_PUBLIC_SUPABASE_URL
   - SUPABASE_SERVICE_ROLE_KEY

3. Create an admin user and update adminUserId in this script

4. Run the migration:
   npx tsx scripts/populate-blog-posts.ts

5. After migration, update your components to use the API instead of static data
`)

// Uncomment to run the migration
// populateBlogPosts().catch(console.error)
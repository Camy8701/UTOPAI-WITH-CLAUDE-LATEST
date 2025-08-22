import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"
import { StoryInteractions } from "@/components/story-interactions"

interface BlogPost {
  id: string
  title: string
  content: string
  excerpt: string | null
  slug: string
  thumbnail_url: string | null
  created_at: string
  content_type: string
  author_id: string
  profiles: {
    full_name: string | null
  } | null
}

// TODO: Fetch story from Firebase/static data
async function getStory(slug: string): Promise<BlogPost & { like_count?: number } | null> {
  // For now, return null to show 404 - Firebase integration coming soon
  console.log('Story lookup not implemented yet for slug:', slug)
  return null
}

// Generate metadata for the page
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const story = await getStory(slug)

  if (!story) {
    return {
      title: "Story Not Found - utopai.blog",
      description: "The requested story could not be found.",
    }
  }

  return {
    title: `${story.title} - utopai.blog`,
    description: story.excerpt || "A captivating AI story from utopai.blog",
    openGraph: {
      title: story.title,
      description: story.excerpt || "A captivating AI story from utopai.blog",
      url: `https://utopai.blog/stories/${story.slug}`,
      siteName: "utopai.blog",
      images: [
        {
          url: story.thumbnail_url || `https://utopai.blog/api/og?title=${encodeURIComponent(story.title)}&description=${encodeURIComponent(story.excerpt || '')}&type=story`,
          width: 1200,
          height: 630,
          alt: story.title,
        },
      ],
      locale: "en_US",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: story.title,
      description: story.excerpt || "A captivating AI story from utopai.blog",
      images: [
        story.thumbnail_url || `https://utopai.blog/api/og?title=${encodeURIComponent(story.title)}&description=${encodeURIComponent(story.excerpt || '')}&type=story`,
      ],
    },
  }
}

export default async function StoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const story = await getStory(slug)

  if (!story) {
    notFound()
  }

  const authorName = story.profiles?.full_name || "AI Storyteller"
  const storyDate = new Date(story.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to home
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
          {story.thumbnail_url && (
            <div className="relative aspect-video">
              <Image 
                src={story.thumbnail_url} 
                alt={story.title} 
                fill 
                className="object-cover" 
                priority 
              />
            </div>
          )}

          <div className="p-8">
            <div className="flex items-center justify-between mb-4">
              <span className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full">AI STORY</span>
              <span className="text-gray-500 dark:text-gray-400 text-sm">{storyDate}</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">{story.title}</h1>
            
            {story.excerpt && (
              <p className="text-gray-600 dark:text-gray-400 mb-6">{story.excerpt}</p>
            )}

            <div className="flex items-center mb-8">
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 mr-3"></div>
              <span className="text-gray-700 dark:text-gray-300">By {authorName}</span>
            </div>

            <div className="prose dark:prose-invert max-w-none">
              {story.content.split("\n\n").map((paragraph, i) => {
                if (paragraph.startsWith("# ")) {
                  return (
                    <h1 key={i} className="text-2xl font-bold mt-8 mb-4">
                      {paragraph.substring(2)}
                    </h1>
                  )
                }
                if (paragraph.startsWith("## ")) {
                  return (
                    <h2 key={i} className="text-xl font-bold mt-6 mb-3">
                      {paragraph.substring(3)}
                    </h2>
                  )
                }
                return (
                  <p key={i} className="mb-4 text-gray-800 dark:text-gray-200 leading-relaxed">
                    {paragraph}
                  </p>
                )
              })}
            </div>

            {/* Story Interactions - Like, Save, Comments */}
            <StoryInteractions 
              postId={story.id} 
              initialLikeCount={story.like_count || 0}
              title={story.title}
            />

            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
              <h3 className="text-xl font-bold mb-4 dark:text-white">Share this story</h3>
              <div className="flex gap-4">
                <button className="bg-[#1877F2] text-white px-4 py-2 rounded-md hover:bg-[#166fe5] transition-colors">
                  Facebook
                </button>
                <button className="bg-[#1DA1F2] text-white px-4 py-2 rounded-md hover:bg-[#1a94da] transition-colors">
                  Twitter
                </button>
                <button className="bg-[#0A66C2] text-white px-4 py-2 rounded-md hover:bg-[#095bb2] transition-colors">
                  LinkedIn
                </button>
                <button className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                  Copy Link
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
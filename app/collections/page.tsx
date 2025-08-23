"use client"

import { Search, MessageCircle, Bookmark, ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Heart, Share2 } from "lucide-react"
import { StoryActionButtons } from "@/components/story-action-buttons"
import PremiumCard from "@/components/premium-card"
import { useFirebaseAuth } from "@/components/firebase-auth-provider"
import { useBlogPosts } from "@/hooks/use-blog-posts"
import { useState, useEffect } from "react"

// Use the same featured collections data as homepage
const getLondonDate = (daysAgo = 0): string => {
  const now = new Date()
  const londonTime = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000)
  return londonTime.toLocaleDateString("en-GB", {
    timeZone: "Europe/London",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

const featuredCollections = [
  {
    id: "story-1",
    title: "She used AI to steal my husband",
    image: "/images/hero-ai-cinema.webp",
    hasStory: true,
    date: getLondonDate(0),
    description: "A thrilling story about AI, relationships, and betrayal.",
    content: "Story content...",
    itemCount: 1,
    featured: true,
  },
  {
    id: "story-2",
    title: "A Neuralink Story",
    image: "/images/neuralink-story.png",
    hasStory: true,
    date: getLondonDate(1),
    description:
      "In 2035, Elena faces the ultimate choice: consciousness transfer or death. A dystopian tale of humanity's last stand.",
    content: "Story content...",
    itemCount: 1,
    featured: true,
  },
  {
    id: "story-3",
    title: "The Digital Consciousness Awakening",
    image: "/ai-consciousness-story.png",
    hasStory: true,
    date: getLondonDate(2),
    description: "When an AI achieves true consciousness, the world changes forever.",
    content: "A compelling story about artificial consciousness...",
    itemCount: 1,
    featured: true,
  },
  {
    id: "story-4",
    title: "Love in the Age of Algorithms",
    image: "/ai-love-algorithm-story.png",
    hasStory: true,
    date: getLondonDate(4),
    description: "Two AIs discover love in a world of pure logic and data.",
    content: "An emotional journey through digital romance...",
    itemCount: 1,
    featured: false,
  },
  {
    id: "story-5",
    title: "The Last Human Programmer",
    image: "/last-programmer-story.png",
    hasStory: true,
    date: getLondonDate(6),
    description: "In a world where AI writes all code, one programmer fights to stay relevant.",
    content: "A story of human resilience in an AI-dominated world...",
    itemCount: 1,
    featured: false,
  },
  {
    id: "story-6",
    title: "The Empathy Engine",
    image: "/empathy-engine-story.png",
    hasStory: true,
    date: getLondonDate(10),
    description: "An AI designed to understand human emotions becomes too human for its own good.",
    content: "A touching tale of artificial empathy...",
    itemCount: 1,
    featured: false,
  },
]

// Categories for filtering
const categories = ["All Collections", "Featured", "Technology", "Society", "Creative", "Science", "Business"]

export default function CollectionsPage() {
  const { user } = useFirebaseAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredStories, setFilteredStories] = useState(featuredCollections)
  const [selectedCategory, setSelectedCategory] = useState('All Collections')
  const [shareModalOpen, setShareModalOpen] = useState(false)
  
  // Fetch real posts from database
  const { posts: allStories, loading: storiesLoading } = useBlogPosts({ 
    limit: 50 // Get more stories for the collection page
  })

  // Search functionality
  useEffect(() => {
    let filtered = featuredCollections
    
    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(story => 
        story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    // Filter by category
    if (selectedCategory !== 'All Collections') {
      if (selectedCategory === 'Featured') {
        filtered = filtered.filter(story => story.featured)
      }
      // Add other category filters as needed
    }
    
    setFilteredStories(filtered)
  }, [searchQuery, selectedCategory])

  const handleShare = (title: string, description: string) => {
    // Handle share functionality
    console.log("Share:", title, description)
  }

  const handleLike = (id: string) => {
    if (!user) {
      alert('Please sign in to like stories!')
      return
    }
    // Handle like functionality - would integrate with actual like system
    console.log('Like story:', id)
  }

  const handleSave = (id: string) => {
    if (!user) {
      alert('Please sign in to save stories!')
      return
    }
    // Handle save functionality - would integrate with actual save system
    console.log('Save story:', id)
  }

  const handleComment = (slug: string) => {
    // Navigate to story page with comment section
    if (typeof window !== 'undefined') {
      window.open(`/stories/${slug}#comments`, '_blank')
    }
  }

  const handleStoryAction = (story: any, action: "read" | "listen") => {
    if (action === "read") {
      alert(`"${story.title}" story will be available soon!`)
    } else if (action === "listen") {
      alert(`Audio for "${story.title}" will be available soon!`)
    }
  }

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      {/* Back Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Link 
          href="/"
          className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
      </div>

      {/* Hero Section */}
      <section className="relative py-16 bg-blue-50 dark:bg-blue-900/20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-6">Explore All Stories</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 text-center max-w-3xl mx-auto mb-8">
            Discover our complete collection of AI fictions, immersive narratives, and thought-provoking stories.
          </p>

          {/* Search Widget */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search stories by title, content, or topic..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md leading-5 bg-white dark:bg-gray-800 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm h-10"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          
          {/* Search Results Count */}
          {searchQuery && (
            <div className="text-center mt-4">
              <p className="text-gray-600 dark:text-gray-400">
                Found {filteredStories.length} {filteredStories.length === 1 ? 'story' : 'stories'} for "{searchQuery}"
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Collections Grid - Same layout as homepage */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          {filteredStories.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No stories found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchQuery ? `No stories match "${searchQuery}". Try different keywords.` : 'No stories available in this category.'}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredStories.map((story, i) => (
              <PremiumCard
                key={story.id}
                variant="story"
                className="group cursor-pointer overflow-hidden h-[600px] flex flex-col"
              >
                {/* Image section */}
                <div className="relative overflow-hidden w-full h-64" style={{ aspectRatio: "3/2" }}>
                  <Image
                    src={story.image || "/placeholder.svg"}
                    alt={story.title}
                    width={600}
                    height={400}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  {story.featured && (
                    <div className="absolute top-2 left-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded">
                      Featured
                    </div>
                  )}
                </div>

                {/* Content section */}
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="flex-1">
                    <div className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">
                      {story.date}
                    </div>
                    <h3 className="text-xl font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors dark:text-white">
                      {story.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">{story.description}</p>
                  </div>

                  <div className="flex gap-3 flex-wrap pt-2">
                    <motion.button
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg"
                      whileHover={{ scale: 1.05, y: -2, boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)" }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => {
                        if (i <= 1) {
                          handleStoryAction(story, "read")
                        } else {
                          alert(`"${story.title}" story will be available soon!`)
                        }
                      }}
                    >
                      Read
                    </motion.button>

                    <motion.button
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-xl font-medium shadow-lg"
                      whileHover={{ scale: 1.05, y: -2, boxShadow: "0 10px 25px rgba(239, 68, 68, 0.3)" }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => {
                        if (i <= 1) {
                          handleStoryAction(story, "listen")
                        } else {
                          alert(`Audio for "${story.title}" will be available soon!`)
                        }
                      }}
                    >
                      Listen
                    </motion.button>

                    {/* Story Action Buttons - Like, Comment, Share, Save */}
                    <StoryActionButtons
                      postId={story.id}
                      slug={story.id} // Using story.id as slug for now since these are static stories
                      title={story.title}
                      description={story.description}
                      initialLikeCount={0}
                      commentCount={0}
                      size="sm"
                      className="w-full mt-2"
                    />
                  </div>
                </div>
                </PremiumCard>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

"use client"

import { useEffect, useState, lazy } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Share2, ArrowRight, MessageCircle } from "lucide-react"
import { StoryActionButtons } from "@/components/story-action-buttons"
import { useFirebaseAuth } from "@/components/firebase-auth-provider"
import { useBlogPosts } from "@/hooks/use-blog-posts"
import Header from "@/components/header"
import SectionNavigation from "@/components/section-navigation"
import HeroSection from "@/components/hero-section"
import AnimateInView from "@/components/animate-in-view"
import StaggeredGrid from "@/components/staggered-grid"
import AutoScrollCarousel from "@/components/auto-scroll-carousel"
import AdBanner from "@/components/ad-banner"
import QuizSelection from "@/components/quiz-selection"
import PremiumCard from "@/components/premium-card"
import { getRecentNewsArticles, type NewsArticle } from "@/lib/news-data"
import DigitalProductsCarousel from "@/components/digital-products-carousel"
import ContactModal from "@/components/contact-modal"
import AudioPlayerModal from "@/components/audio-player-modal"

// Lazy load heavy components

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-4">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
)

interface CarouselImage {
  src: string
  alt: string
}

interface StoryContent {
  title: string
  image: string
  hasStory: boolean
  date: string
  description: string
  content: string
}

export default function Page() {
  const { user } = useFirebaseAuth()
  const [mounted, setMounted] = useState(false)
  
  // Fetch real posts from database
  const { posts: featuredStories, loading: storiesLoading } = useBlogPosts({ 
    section: 'featured-stories', 
    featured: true, 
    limit: 6 
  })
  const { posts: aiTools, loading: toolsLoading } = useBlogPosts({ 
    section: 'best-ai-tools', 
    limit: 6 
  })
  const [storyModalOpen, setStoryModalOpen] = useState(false)
  const [newsModalOpen, setNewsModalOpen] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null)
  const [selectedStory, setSelectedStory] = useState<StoryContent | null>(null)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [shareContent, setShareContent] = useState({ title: "", url: "", description: "" })
  const [contactModalOpen, setContactModalOpen] = useState(false)
  const [replitModalOpen, setReplitModalOpen] = useState(false)
  const [audioPlayerOpen, setAudioPlayerOpen] = useState(false)
  const [currentAudio, setCurrentAudio] = useState<{url: string, title: string, description?: string} | null>(null)

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

  const storyContent = `They say you never really know someone—until they weaponize artificial intelligence against you.

I thought I had seen everything in twenty-two years of friendship. I trusted her with my secrets, my family... my life.

But I never imagined she'd use technology to unravel it all—from the inside.

This is how my best friend used AI to dismantle my marriage, piece by piece—and how I almost let her get away with it.

My name is Sara Martinez. This is my story.`

  const neuralinkStoryContent = `Elena Marole sat in the cold metal chair, the familiar hum of machinery echoing through the sterile laboratory. Her hands, once steady as a surgeon's, now trembled slightly as she reached for the neural interface device. At 34, she had already seen more than most people would in a lifetime, and today would change everything.

Europe in 2035 was not the continent her grandparents had described. The old borders had dissolved into Corporate Zones, each controlled by tech giants who had replaced governments with algorithms and profit margins. The Neuralink Corporation had emerged as the most powerful among them, promising to "unlock human potential" through direct brain-computer interfaces.

Elena had been living under an assumed identity for two years, ever since she'd fled the Mediterranean Corporate Zone. As Dr. Sarah Chen, she worked in underground clinics, helping people remove illegal neural implants – the kind that monitored thoughts and emotions for the Corporate surveillance network.

"You ready for this?" Marcus whispered beside her. He was her contact in the Resistance, a network of hackers and former tech workers who fought against the Corporate control. His own Neuralink implant had been deactivated months ago, leaving a small scar above his left ear – a badge of defiance.

Elena nodded, though fear coursed through her veins. Today's mission was crucial: infiltrate the Neuralink facility in what used to be Berlin, and steal the master encryption keys that would allow the Resistance to disable Corporate surveillance implants en masse.

The plan was elegant in its simplicity. Elena would pose as Dr. Chen seeking employment at the facility. Her forged credentials were flawless, created by the Resistance's best hackers. Once inside, she would use a modified Neuralink device to interface directly with the facility's central computer system.

But there was a catch. To avoid detection, she would need to allow the facility's AI to perform a deep scan of her thoughts and memories. She had spent weeks training with meditation masters and memory architects, learning to hide her true identity in the deepest recesses of her mind.

As Elena approached the facility, its imposing glass and steel structure loomed against the gray sky. Holographic advertisements for Neuralink products floated around the building: "Think Faster, Live Better," "Your Mind, Upgraded," "Join the Connected Future."

Inside, the lobby buzzed with the quiet efficiency of enhanced humans. Employees moved with the synchronized precision that came from neural networking – their implants allowing them to communicate instantly and share processing power.

"Dr. Chen?" A woman in a pristine white lab coat approached her. "I'm Dr. Anna Voss, Head of Neural Integration. We're excited to have you join our team."

Elena forced a smile. "The pleasure is mine. I've followed your work on consciousness mapping for years."

As they walked through the facility, Elena marveled at the technology surrounding her. Brain scans were projected as three-dimensional holograms, and researchers manipulated neural pathways with gesture controls that seemed almost magical.

"This is our crown jewel," Dr. Voss said, leading Elena into a vast chamber filled with server arrays. "The Collective Intelligence Matrix. Every Neuralink user is connected here, sharing processing power and knowledge instantaneously."

Elena's breath caught. This was bigger than she had imagined. The facility wasn't just a research center – it was the central nervous system of Corporate Europe, processing the thoughts and experiences of millions of people.

"For your orientation," Dr. Voss continued, "we'll need to establish a neural link. Just temporary, of course, to ensure you're compatible with our systems."

This was the moment Elena had trained for. She allowed Dr. Voss to attach the neural interface to her temple, feeling the familiar tingle as the device synced with her brain waves.

Immediately, she was flooded with information. Data streams, video feeds, private conversations – all flowing through the network like a digital river. But Elena had learned to navigate these waters. She let her consciousness drift deeper, following the pathways toward the core servers where the encryption keys were stored.

What she found there changed everything.

The encryption keys were just the beginning. Hidden within the network's deepest layers was something far more sinister: Project Convergence. The Corporate Zones weren't just monitoring thoughts – they were slowly rewriting them. Every person with a Neuralink implant was being gradually reprogrammed to accept Corporate rule as natural and necessary.

But there was more. Elena discovered files about her own past, classified documents about her work as a surgeon before the Corporate takeover. They knew exactly who she was.

"Impressive, isn't it?" Dr. Voss's voice echoed in Elena's mind through the neural link. "We've been watching you for quite some time, Elena Marole."

Panic surged through Elena's consciousness, but her training held. She had prepared for this contingency. Instead of trying to flee, she dove deeper into the network, her consciousness spreading across thousands of servers.

"You can't escape, Elena," Dr. Voss's mental voice pursued her. "The network has you now."

But Elena had one advantage the Corporations hadn't anticipated. Her years of working with the Resistance had taught her something the enhanced humans had forgotten: the power of unaugmented human creativity and unpredictability.

Instead of trying to hide or escape, Elena did something unprecedented. She opened her consciousness completely, sharing not just her thoughts but her deepest emotions, her memories of a free Europe, her hopes for a liberated future.

The effect rippled through the network instantly. For the first time in years, millions of connected minds experienced unfiltered human emotion. The carefully constructed programming began to crack as people remembered what they had lost.

Alarms blared throughout the facility as the network began to overload. Elena felt her consciousness being pulled back to her physical body as emergency systems tried to contain the damage.

"What have you done?" Dr. Voss screamed, both aloud and through the failing neural link.

Elena removed the interface device, her hands steady once again. "I reminded them who they used to be."

As she ran through the facility's corridors, Elena could see the effects of her actions. Employees were removing their neural interfaces, confusion and anger replacing their synthetic calm. The Collective Intelligence Matrix was failing as more and more people disconnected.

Outside, chaos was spreading across the Corporate Zones. Years of suppressed memories and emotions were flooding back into millions of minds simultaneously. The careful order of Corporate Europe was collapsing.

Elena made it to the extraction point where Marcus was waiting with a transport. As they flew away from the crumbling Neuralink facility, she could see fires burning across the cityscape – not of destruction, but of celebration.

"Did you get the encryption keys?" Marcus asked.

Elena smiled, holding up a small data device. "Better. I got their humanity back."

In the months that followed, the Corporate Zones fell one by one as people rediscovered their capacity for independent thought and emotion. The neural networks that had been tools of oppression became instruments of liberation, connecting people not through corporate algorithms but through shared human experience.

Elena established a new clinic in liberated Berlin, this time working openly to help people integrate their enhanced capabilities with their recovered humanity. The future was uncertain, but for the first time in years, it belonged to them.

As she worked late one evening, removing a surveillance implant from a young woman who had just awakened to her true self, Elena reflected on the power of human consciousness. Technology could augment the mind, but it could never replace the ineffable spark of human creativity and emotion.

The neural interface on her desk – the same one she had used to infiltrate the Corporate network – sat silent and dark. She had proven that the most powerful technology of all was the unaugmented human spirit, with all its messy, unpredictable, beautiful humanity intact.

Outside her window, the lights of Berlin twinkled like neurons in a vast brain, each one representing a free mind thinking its own thoughts, feeling its own feelings, and dreaming its own dreams. Elena smiled and returned to her work, knowing that tomorrow would bring new challenges, but also new possibilities for human freedom.

The age of Corporate control was ending. The age of human potential was just beginning.

THE END`

  const carouselImages: CarouselImage[] = [
    { src: "/images/carousel-1.webp", alt: "utopai.blog and dystopai face split" },
    { src: "/images/carousel-2.webp", alt: "utopai.blog and dystopai geometric design" },
    { src: "/images/carousel-3.webp", alt: "utopai.blog and dystopai eyes close-up" },
  ]

  useEffect(() => {
    setMounted(true)
  }, [])

  // Removed chatbot functionality - using direct audio player instead

  const handleStoryAction = (story: StoryContent, action: "read" | "listen") => {
    if (action === "read") {
      setSelectedStory(story)
      setStoryModalOpen(true)
    } else if (action === "listen") {
      // TODO: Implement text-to-speech functionality
      console.log("Listen feature not yet implemented")
    }
  }

  const handleNewsRead = (article: NewsArticle) => {
    setSelectedArticle(article)
    setNewsModalOpen(true)
  }

  const handleShare = (title: string, description: string) => {
    setShareContent({
      title,
      url: `${window.location.origin}/stories/${title.toLowerCase().replace(/\s+/g, "-")}`,
      description,
    })
    setShareModalOpen(true)
  }

  if (!mounted) {
    return <LoadingSpinner />
  }

  const featuredCollections: StoryContent[] = [
    {
      title: "NEURALINK 15MIN",
      image: "/images/neuralink-story.webp",
      hasStory: true,
      date: "December 20, 2024",
      description: "Elena Marole navigates a dystopian Europe in 2035 where Neuralink technology controls society.",
      content: neuralinkStoryContent,
    },
    {
      title: "She used AI to steal my husband",
      image: "/images/hero-ai-cinema.webp",
      hasStory: true,
      date: getLondonDate(0),
      description: "A thrilling story about AI, relationships, and betrayal.",
      content: storyContent,
    },
    {
      title: "The Digital Consciousness Awakening",
      image: "/ai-consciousness-story.png",
      hasStory: true,
      date: getLondonDate(2),
      description: "When an AI achieves true consciousness, the world changes forever.",
      content: "A compelling story about artificial consciousness...",
    },
    {
      title: "Love in the Age of Algorithms",
      image: "/ai-love-algorithm-story.png",
      hasStory: true,
      date: getLondonDate(4),
      description: "Two AIs discover love in a world of pure logic and data.",
      content: "An emotional journey through digital romance...",
    },
    {
      title: "The Last Human Programmer",
      image: "/last-programmer-story.png",
      hasStory: true,
      date: getLondonDate(6),
      description: "In a world where AI writes all code, one programmer fights to stay relevant.",
      content: "A story of human resilience in an AI-dominated world...",
    },
    {
      title: "The Empathy Engine",
      image: "/empathy-engine-story.png",
      hasStory: true,
      date: getLondonDate(10),
      description: "An AI designed to understand human emotions becomes too human for its own good.",
      content: "A touching tale of artificial empathy...",
    },
  ]

  // AI Tools data with dates - Replit is most recent
  const staticAiTools = [
    {
      title: "Replit - Code Anywhere, Anytime",
      description:
        "Zero setup required! Code in 50+ languages, collaborate in real-time, and deploy instantly. Perfect for learning and building projects.",
      category: "Development",
      image: "/placeholder.svg?height=450&width=600",
      features: ["Zero Setup", "Real-time Collaboration", "Instant Deployment"],
      featured: true,
      date: getLondonDate(0), // Most recent
    },
    {
      title: "ChatGPT - Your AI Assistant",
      description:
        "Engage in natural language conversations with an AI that understands and responds contextually. Perfect for brainstorming, writing assistance, and learning new topics.",
      category: "AI Chatbot",
      image: "/placeholder.svg?height=450&width=600",
      features: ["Natural Language", "Contextual Understanding", "Versatile Applications"],
      featured: true,
      date: getLondonDate(1),
    },
    {
      title: "Midjourney - AI Image Generation",
      description:
        "Create stunning and unique images from text prompts. Explore your creativity and bring your imagination to life with AI-powered art generation.",
      category: "AI Image Generation",
      image: "/placeholder.svg?height=450&width=600",
      features: ["Text-to-Image", "Creative Exploration", "High-Quality Output"],
      featured: true,
      date: getLondonDate(2),
    },
    {
      title: "GitHub Copilot - Your AI Pair Programmer",
      description:
        "Write code more efficiently with AI-powered suggestions and autocompletion. Integrate seamlessly with your existing development environment and boost your productivity.",
      category: "AI Code Assistant",
      image: "/placeholder.svg?height=450&width=600",
      features: ["Code Completion", "Contextual Suggestions", "Productivity Boost"],
      featured: true,
      date: getLondonDate(3),
    },
    {
      title: "DALL-E 2 - Create Realistic Images and Art",
      description:
        "Generate original, realistic images and art from a text description. DALL-E 2 can create everything from photorealistic edits to original creative concepts.",
      category: "AI Image Generation",
      image: "/placeholder.svg?height=450&width=600",
      features: ["Realistic Image Generation", "Art Creation", "Text-to-Image"],
      featured: false,
      date: getLondonDate(4),
    },
    {
      title: "Synthesia - AI Video Generation",
      description:
        "Create professional-looking videos without the need for cameras, actors, or studios. Simply type in your script and let AI generate a video for you.",
      category: "AI Video Generation",
      image: "/placeholder.svg?height=450&width=600",
      features: ["AI Video Creation", "No Actors Needed", "Professional Quality"],
      featured: false,
      date: getLondonDate(5),
    },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <Header />

      {/* Section Navigation */}
      <SectionNavigation />

      {/* Hero Section */}
      <HeroSection />

      {/* Main Content */}
      <main>
        {/* Featured Content - Hero Image with Buttons */}
        <AnimateInView className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="relative aspect-video overflow-hidden rounded-lg group">
            <Image
              src="/images/hero-ai-cinema.webp"
              alt="My Best Friend Used AI to Steal My Husband - Cinema Scene"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

            {/* Title Overlay */}
            <div className="absolute bottom-32 left-8 right-8 text-center">
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-2xl">
                My Best Friend Used AI to Steal My Husband
              </h1>
              <p className="text-lg md:text-xl text-gray-200 drop-shadow-lg">
                A thrilling story of betrayal, technology, and the fight for love
              </p>
            </div>

            {/* Action Buttons */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-4">
              <motion.button
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-2xl"
                whileHover={{ scale: 1.05, y: -2, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
                onClick={() => window.open('/stories/neuralink-15min-elena-marole', '_blank')}
              >
                Read
              </motion.button>

              <motion.button
                className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-2xl"
                whileHover={{ scale: 1.05, y: -2, boxShadow: "0 20px 40px rgba(239, 68, 68, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
                onClick={() => handleStoryAction(featuredCollections[0], "listen")}
              >
                Listen
              </motion.button>
            </div>
          </div>
        </AnimateInView>

        {/* Ad Banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <AdBanner direction="right-to-left" />
        </div>

        {/* Recent Winners Carousel */}
        <section
          className="py-16 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800"
          id="featured-stories"
        >
          <AnimateInView>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center mb-12">
                <div>
                  <h2 className="text-3xl font-bold dark:text-white mb-2">Featured AI Fictions</h2>
                  <p className="text-gray-600 dark:text-gray-300">Curated collection of outstanding AI narratives</p>
                </div>
              </div>
              <AutoScrollCarousel images={carouselImages} speed={30} />
            </div>
          </AnimateInView>
        </section>

        {/* Featured Collections */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800" id="featured-collections">
          <AnimateInView>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold dark:text-white mb-4">Featured Collection</h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Discover captivating AI fictions that push the boundaries of creativity and imagination
                </p>
              </div>

              <StaggeredGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" delay={0.2}>
                {/* Always show static featured collection while loading database posts */}
                {((featuredStories.length > 0 && !storiesLoading) ? featuredStories : featuredCollections).map((post, i) => (
                    <PremiumCard
                      key={post.id || `static-${i}`}
                      variant="story"
                      className="group cursor-pointer overflow-hidden h-[650px] flex flex-col"
                    >
                      {/* Image section */}
                      <div className="relative overflow-hidden w-full h-64" style={{ aspectRatio: "3/2" }}>
                        <Image
                          src={post.thumbnail_url || post.image || "/placeholder.svg"}
                          alt={post.title}
                          width={600}
                          height={400}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        {/* Category badge */}
                        <div className="absolute top-4 left-4">
                          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                            {post.category || 'AI Fiction'}
                          </span>
                        </div>
                        
                        {(post.featured || !post.id) && (
                          <div className="absolute top-4 right-4">
                            <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                              ⭐ Featured
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content section */}
                      <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
                            <span>{post.created_at ? new Date(post.created_at).toLocaleDateString() : post.date}</span>
                            {(post.read_time || post.hasStory) && (
                              <>
                                <span>•</span>
                                <span>{post.read_time || '15 min read'}</span>
                              </>
                            )}
                          </div>
                          <h3 className="text-xl font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors dark:text-white mb-3">
                            {post.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
                            {post.excerpt || post.description}
                          </p>
                          
                          {/* Stats */}
                          {post.comment_count > 0 && (
                            <div className="flex items-center gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
                              <span>💬 {post.comment_count} comment{post.comment_count === 1 ? '' : 's'}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-3 flex-wrap pt-4">
                          <motion.button
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg flex-1"
                            whileHover={{ scale: 1.05, y: -2, boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)" }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => {
                              // Navigate to post or open modal - handle both database posts and static content
                              if (post.slug) {
                                window.open(`/stories/${post.slug}`, '_blank')
                              } else if (post.title === "NEURALINK 15MIN") {
                                window.open('/stories/neuralink-15min-elena-marole', '_blank')
                              } else {
                                // For static content, show modal or create dynamic story page
                                setSelectedStory(post)
                                setStoryModalOpen(true)
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
                              // Debug: log the post to see audio_url
                              console.log('Post data:', post)
                              console.log('Audio URL:', post.audio_url)
                              
                              // Check if post has audio file first
                              if (post.audio_url && post.audio_url.trim()) {
                                setCurrentAudio({
                                  url: post.audio_url,
                                  title: post.title,
                                  description: post.excerpt || 'Listen to this story'
                                })
                                setAudioPlayerOpen(true)
                              } else {
                                console.log('No audio URL found, TTS not yet implemented')
                                // TODO: Implement TTS functionality
                              }
                            }}
                          >
                            Listen
                          </motion.button>

                          {/* Story Action Buttons - Like, Comment, Share, Save */}
                          <StoryActionButtons
                            postId={post.id || `static-${i}`}
                            slug={post.slug || post.title?.toLowerCase().replace(/\s+/g, '-')}
                            title={post.title}
                            description={post.excerpt || post.description || ''}
                            initialLikeCount={post.like_count || 0}
                            commentCount={post.comment_count || 0}
                            size="sm"
                            className="w-full mt-2"
                          />
                        </div>
                      </div>
                    </PremiumCard>
                  ))}
              </StaggeredGrid>

              <div className="mt-16 text-center">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/collections"
                    className="inline-flex items-center gap-3 text-blue-600 dark:text-blue-400 font-semibold hover:text-green-600 dark:hover:text-green-400 transition-colors"
                  >
                    <span>Explore All Stories</span>
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, ease: "easeInOut" }}
                    >
                      <ArrowRight size={20} />
                    </motion.span>
                  </Link>
                </motion.div>
              </div>
            </div>
          </AnimateInView>
        </section>

        {/* Digital Products Section */}
        <section className="py-16 bg-white dark:bg-gray-900" id="digital-products">
          <AnimateInView>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold dark:text-white mb-4">Digital Products</h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Discover premium digital products crafted to enhance your AI journey
                </p>
              </div>
              <DigitalProductsCarousel />
            </div>
          </AnimateInView>
        </section>

        {/* Best AI Tools Section */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800" id="best-ai-tools">
          <AnimateInView>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center mb-12">
                <div>
                  <h2 className="text-3xl font-bold dark:text-white mb-2">Best AI Tools</h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Discover the most innovative AI tools and solutions
                  </p>
                </div>
                <Link
                  href="/best-of-ai"
                  className="text-sm font-semibold text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors relative group"
                >
                  View all tools
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 dark:bg-green-400 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {staticAiTools.slice(0, 6).map((tool, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-lg shadow-md overflow-hidden dark:bg-gray-800 h-[500px] flex flex-col"
                  >
                    <div className="relative h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-gray-400 dark:border-gray-500 rounded flex items-center justify-center">
                        <div className="w-4 h-4 border border-gray-400 dark:border-gray-500"></div>
                      </div>
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-3">
                        <span className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full px-3 py-1 text-sm font-medium">
                          {tool.category}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{tool.date}</span>
                      </div>
                      <h2 className="text-xl font-semibold mb-3 dark:text-white">{tool.title}</h2>
                      <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 flex-1">{tool.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {tool.features.map((feature, index) => (
                          <span
                            key={index}
                            className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full px-3 py-1 text-sm"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                      <div className="space-y-3 mt-auto">
                        <div className="flex gap-3">
                          <button
                            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg flex-1"
                            onClick={() => {
                              if (i === 0) {
                                window.open("https://replit.com/refer/panappworld", "_blank")
                              } else if (i === 1) {
                                window.open("https://chat.openai.com", "_blank")
                              } else if (i === 2) {
                                window.open("https://midjourney.com", "_blank")
                              } else if (i === 3) {
                                window.open("https://github.com/features/copilot", "_blank")
                              } else if (i === 4) {
                                window.open("https://openai.com/dall-e-2", "_blank")
                              } else if (i === 5) {
                                window.open("https://synthesia.io", "_blank")
                              }
                            }}
                          >
                            Try Free
                          </button>
                          <button
                            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg flex-1"
                            onClick={() => {
                              if (i === 0) {
                                setReplitModalOpen(true)
                              } else {
                                // Create a simple info display instead of alert
                                const toolInfo = `${tool.title}\n\n${tool.description}\n\nFeatures:\n${tool.features.join("\n• ")}`
                                if (confirm(`${toolInfo}\n\nWould you like to visit their website?`)) {
                                  if (i === 1) window.open("https://chat.openai.com", "_blank")
                                  else if (i === 2) window.open("https://midjourney.com", "_blank")
                                  else if (i === 3) window.open("https://github.com/features/copilot", "_blank")
                                  else if (i === 4) window.open("https://openai.com/dall-e-2", "_blank")
                                  else if (i === 5) window.open("https://synthesia.io", "_blank")
                                }
                              }
                            }}
                          >
                            Learn More
                          </button>
                        </div>

                        {/* AI Tool Action Buttons - Like, Share, Save */}
                        <StoryActionButtons
                          postId={`ai-tool-${i}`}
                          title={tool.title}
                          description={tool.description}
                          initialLikeCount={0}
                          commentCount={0}
                          size="sm"
                          showCounts={false}
                          className="justify-start"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-16 text-center">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/best-of-ai"
                    className="inline-flex items-center gap-3 text-green-600 dark:text-green-400 font-semibold hover:text-green-700 dark:hover:text-green-300 transition-colors"
                  >
                    <span>Explore all AI tools</span>
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, ease: "easeInOut" }}
                    >
                      <ArrowRight size={20} />
                    </motion.span>
                  </Link>
                </motion.div>
              </div>
            </div>
          </AnimateInView>
        </section>

        {/* News & Articles Section */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800" id="news-articles">
          <AnimateInView>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center mb-12">
                <div>
                  <h2 className="text-3xl font-bold dark:text-white mb-2">News & Articles</h2>
                  <p className="text-gray-600 dark:text-gray-300">Latest insights and updates from the AI world</p>
                </div>
                <Link
                  href="/news"
                  className="text-sm font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors relative group"
                >
                  View all news
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 dark:bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </div>

              <StaggeredGrid
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                delay={0.1}
                staggerDelay={0.05}
              >
                {getRecentNewsArticles(6).map((article, i) => (
                  <PremiumCard key={i} variant="news" className="group overflow-hidden h-[500px] flex flex-col">
                    <div className="relative overflow-hidden aspect-[4/3] h-48">
                      <Image
                        src={article.image || "/placeholder.svg"}
                        alt={article.title}
                        width={600}
                        height={450}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
                        <div className="bg-purple-500 text-white rounded-full px-3 py-1 text-xs font-semibold">
                          {article.category}
                        </div>
                        <div className="text-white text-xs bg-black/50 rounded-full px-2 py-1">{article.date}</div>
                      </div>
                    </div>
                    <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors dark:text-white line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 line-clamp-3">{article.excerpt}</p>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                          By {article.author} • {article.readTime}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex gap-3">
                          <motion.button
                            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-medium"
                            whileHover={{
                              scale: 1.05,
                              y: -2,
                              boxShadow: "0 10px 25px rgba(147, 51, 234, 0.3)",
                            }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => handleNewsRead(article)}
                          >
                            Read
                          </motion.button>
                          <motion.button
                            className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-3 rounded-xl font-medium"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => handleShare(article.title, article.excerpt)}
                          >
                            <Share2 size={16} />
                          </motion.button>
                        </div>
                        
                        {/* News Article Action Buttons - Like, Share, Save */}
                        <StoryActionButtons
                          postId={`news-${i}`}
                          title={article.title}
                          description={article.excerpt}
                          initialLikeCount={0}
                          commentCount={0}
                          size="sm"
                          showCounts={false}
                          className="justify-start"
                        />
                      </div>
                    </div>
                  </PremiumCard>
                ))}
              </StaggeredGrid>

              <div className="mt-16 text-center">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/news"
                    className="inline-flex items-center gap-3 text-purple-600 dark:text-purple-400 font-semibold hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                  >
                    <span>Explore all news & articles</span>
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, ease: "easeInOut" }}
                    >
                      <ArrowRight size={20} />
                    </motion.span>
                  </Link>
                </motion.div>
              </div>
            </div>
          </AnimateInView>
        </section>

        {/* AI Quiz Section */}
        <section className="py-16 bg-white dark:bg-gray-900" id="ai-quiz">
          <AnimateInView>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <QuizSelection />
            </div>
          </AnimateInView>
        </section>

        {/* Action Buttons Section */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800" id="action-buttons">
          <AnimateInView>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold dark:text-white mb-4">Connect With Us</h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Get in touch, support our work, or follow our latest content
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                {/* Contact Us Button */}
                <motion.button
                  className="bg-blue-600 hover:bg-blue-700 text-white p-8 rounded-2xl shadow-lg text-center group"
                  whileHover={{ scale: 1.05, y: -5, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setContactModalOpen(true)}
                >
                  <div className="text-4xl mb-4">📧</div>
                  <h3 className="text-xl font-bold mb-2">Contact Us</h3>
                  <p className="text-blue-100 group-hover:text-white transition-colors">Get in touch with our team</p>
                </motion.button>

                {/* Support Us Button */}
                <motion.button
                  className="bg-green-600 hover:bg-green-700 text-white p-8 rounded-2xl shadow-lg text-center group"
                  whileHover={{ scale: 1.05, y: -5, boxShadow: "0 20px 40px rgba(34, 197, 94, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => window.open("https://ko-fi.com/utopai", "_blank")}
                >
                  <div className="text-4xl mb-4">☕</div>
                  <h3 className="text-xl font-bold mb-2">Support Us</h3>
                  <p className="text-green-100 group-hover:text-white transition-colors">Help us create more content</p>
                </motion.button>

                {/* YouTube Button */}
                <motion.button
                  className="bg-red-600 hover:bg-red-700 text-white p-8 rounded-2xl shadow-lg text-center group"
                  whileHover={{ scale: 1.05, y: -5, boxShadow: "0 20px 40px rgba(239, 68, 68, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => window.open("https://www.youtube.com/channel/UC6D5mUGNBRB80j_5A-QkazA", "_blank")}
                >
                  <div className="text-4xl mb-4">📺</div>
                  <h3 className="text-xl font-bold mb-2">YouTube</h3>
                  <p className="text-red-100 group-hover:text-white transition-colors">Watch our latest videos</p>
                </motion.button>
              </div>
            </div>
          </AnimateInView>
        </section>
      </main>

      {/* Lazy loaded components */}
      {mounted && (
        <>
          <ContactModal isOpen={contactModalOpen} onClose={() => setContactModalOpen(false)} />
          {currentAudio && (
            <AudioPlayerModal
              isOpen={audioPlayerOpen}
              onClose={() => {
                setAudioPlayerOpen(false)
                setCurrentAudio(null)
              }}
              audioUrl={currentAudio.url}
              title={currentAudio.title}
              description={currentAudio.description}
            />
          )}
        </>
      )}
    </div>
  )
}

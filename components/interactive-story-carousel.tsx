"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Heart, MessageCircle, Volume2, BookOpen } from "lucide-react"
import { LikeButton } from "./like-button"
import { useFirebaseAuth } from "./firebase-auth-provider"

interface StoryImage {
  src: string
  alt: string
  title: string
  excerpt: string
  content: string
  id: string
  likeCount: number
  commentCount: number
  category: string
  readTime: string
  audioUrl?: string
}

interface InteractiveStoryCarouselProps {
  stories: StoryImage[]
  speed?: number
  className?: string
  onStoryRead?: (content: string) => void
  onAudioPlay?: (audioUrl: string, title: string, description?: string) => void
}

export default function InteractiveStoryCarousel({ 
  stories, 
  speed = 20, 
  className = "",
  onStoryRead,
  onAudioPlay
}: InteractiveStoryCarouselProps) {
  const { user } = useFirebaseAuth()
  const [duplicatedStories, setDuplicatedStories] = useState<StoryImage[]>([])
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set())
  const containerRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    // Duplicate the stories to create a seamless loop
    setDuplicatedStories([...stories, ...stories, ...stories])
  }, [stories])

  useEffect(() => {
    if (containerRef.current) {
      setWidth(containerRef.current.scrollWidth - containerRef.current.offsetWidth)
    }
  }, [duplicatedStories])

  const handleCardClick = (index: number) => {
    setFlippedCards(prev => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }

  const handleRead = (story: StoryImage, e: React.MouseEvent) => {
    e.stopPropagation()
    // Open story in new tab or modal
    window.open(`/stories/${story.title.toLowerCase().replace(/\s+/g, '-')}`, '_blank')
  }

  const handleListen = (story: StoryImage, e: React.MouseEvent) => {
    e.stopPropagation()
    
    // Check if story has an audio file
    if (story.audioUrl && onAudioPlay) {
      // Use the audio player modal
      onAudioPlay(story.audioUrl, story.title, story.excerpt)
    } else {
      // Use text-to-speech as fallback
      if (onStoryRead) {
        onStoryRead(story.content)
      }
    }
  }

  return (
    <div 
      className={`overflow-hidden ${className}`} 
      ref={containerRef}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <motion.div
        className="flex gap-6"
        animate={{
          x: isPaused ? undefined : [-width / 3, (-width * 2) / 3],
        }}
        transition={{
          x: {
            duration: speed,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
            ease: "linear",
          },
        }}
      >
        {duplicatedStories.map((story, index) => {
          const isFlipped = flippedCards.has(index)
          
          return (
            <motion.div
              key={index}
              className="min-w-[560px] h-[400px] relative perspective-1000 flex-shrink-0"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div 
                className="relative w-full h-full cursor-pointer transform-style-preserve-3d transition-transform duration-700"
                style={{
                  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
                onClick={() => handleCardClick(index)}
              >
                {/* Front Side - Clean Image with ONLY Read/Listen buttons */}
                <div className="absolute inset-0 backface-hidden rounded-lg overflow-hidden bg-gradient-to-r from-blue-600 to-red-600 p-[2px]">
                  <div className="absolute inset-0 bg-black rounded-lg overflow-hidden m-[1px]">
                    <Image
                      src={story.src || "/placeholder.svg"}
                      alt={story.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 560px"
                    />
                    
                    {/* ONLY buttons overlay - nothing else */}
                    <div className="absolute inset-0">
                      {/* Action buttons - center bottom - ONLY these buttons, nothing else */}
                      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                        <div className="flex gap-3">
                          <motion.button
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg"
                            whileHover={{ scale: 1.05, y: -2, boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)" }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleCardClick(index) // Show story content on flip
                            }}
                          >
                            Read
                          </motion.button>
                          
                          <motion.button
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-xl font-medium shadow-lg"
                            whileHover={{ scale: 1.05, y: -2, boxShadow: "0 10px 25px rgba(239, 68, 68, 0.3)" }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleListen(story, e)
                            }}
                          >
                            Listen
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Back Side - Story Content */}
                <div 
                  className="absolute inset-0 backface-hidden rounded-lg bg-gradient-to-br from-gray-900 to-gray-800 p-6 flex flex-col"
                  style={{ transform: 'rotateY(180deg)' }}
                >
                  <div className="flex-1 overflow-y-auto">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        {story.category}
                      </span>
                      <span className="text-gray-300 text-xs">
                        {story.readTime}
                      </span>
                    </div>
                    
                    <h3 className="text-white text-xl font-bold mb-4">
                      {story.title}
                    </h3>
                    
                    <div className="text-gray-300 text-sm leading-relaxed">
                      {story.content.split('\n').map((paragraph, i) => (
                        <p key={i} className="mb-3">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 space-y-3">
                    <div className="flex gap-3">
                      <motion.button
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-medium flex items-center justify-center gap-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => handleRead(story, e)}
                      >
                        <BookOpen className="h-4 w-4" />
                        Read Full Story
                      </motion.button>
                      
                      <motion.button
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-xl font-medium flex items-center justify-center gap-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => handleListen(story, e)}
                      >
                        <Volume2 className="h-4 w-4" />
                        Listen
                      </motion.button>
                    </div>

                    {/* Like and Comment Buttons */}
                    <div className="flex gap-2">
                      <div onClick={(e) => e.stopPropagation()}>
                        <LikeButton 
                          postId={story.id}
                          initialLikeCount={story.likeCount}
                          size="sm"
                        />
                      </div>
                      
                      <motion.button
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium bg-gray-700 border border-gray-600 text-gray-300 hover:bg-gray-600"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation()
                          window.open(`/stories/${story.title.toLowerCase().replace(/\s+/g, '-')}#comments`, '_blank')
                        }}
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span>{story.commentCount}</span>
                      </motion.button>
                      
                      <div className="text-xs text-gray-400 px-3 py-2 flex items-center">
                        {user ? 'Interact with story' : 'Sign in to like & comment'}
                      </div>
                    </div>

                    <div className="text-center">
                      <button className="text-gray-400 text-xs hover:text-white transition-colors">
                        Click to flip back ↻
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
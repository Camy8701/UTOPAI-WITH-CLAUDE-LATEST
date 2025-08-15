"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Volume2 } from "lucide-react"

interface StoryContent {
  title: string
  content: string
  audioUrl?: string
}

type StoryModalProps = {
  isOpen: boolean
  onClose: () => void
  title?: string
  content?: string
  story?: StoryContent | null
  audioUrl?: string
  onListen?: (content: string) => void
}

export default function StoryModal({ isOpen, onClose, title, content, story, audioUrl, onListen }: StoryModalProps) {
  const [mounted, setMounted] = useState(false)
  const [showListenConfirm, setShowListenConfirm] = useState(false)

  // Use story prop if available, otherwise fall back to individual props
  const displayTitle = story?.title || title || "Story"
  const displayContent = story?.content || content || ""
  const displayAudioUrl = story?.audioUrl || audioUrl

  useEffect(() => {
    setMounted(true)
    if (isOpen) {
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  const handleListen = () => {
    // If we have an audio file, play it directly
    if (displayAudioUrl) {
      const audio = new Audio(displayAudioUrl)
      audio.play().catch(error => {
        console.error('Error playing audio:', error)
        // Fallback to TTS if audio file fails
        setShowListenConfirm(true)
      })
    } else {
      // No audio file available, show TTS confirmation
      setShowListenConfirm(true)
    }
  }

  const confirmListen = () => {
    setShowListenConfirm(false)
    if (onListen && displayContent) {
      onListen(displayContent)
    }
    // Don't close the modal immediately, let user see the chatbot response
    setTimeout(() => {
      onClose()
    }, 1000)
  }

  if (!mounted) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white dark:bg-gray-900 rounded-lg w-full max-w-4xl max-h-[85vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white dark:bg-gray-900 p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center z-10">
              <h2 className="text-xl font-bold dark:text-white pr-4">{displayTitle}</h2>
              <div className="flex items-center gap-2 flex-shrink-0">
                {displayContent && (
                  <button
                    onClick={handleListen}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-2 text-blue-500"
                  >
                    <Volume2 className="h-5 w-5" />
                    <span className="text-sm font-medium">Listen</span>
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <X className="h-6 w-6 dark:text-white" />
                </button>
              </div>
            </div>
            <div className="p-6">
              {displayContent ? (
                <div className="prose dark:prose-invert max-w-none">
                  {displayContent.split("\n\n").map((paragraph, i) => (
                    <p key={i} className="mb-4 text-gray-800 dark:text-gray-200 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400 text-lg">Story content is loading...</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Listen Confirmation Modal */}
          <AnimatePresence>
            {showListenConfirm && (
              <motion.div
                className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowListenConfirm(false)}
              >
                <motion.div
                  className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-md mx-4"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className="text-lg font-bold mb-4 dark:text-white">Listen to Story</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {displayAudioUrl 
                      ? "Audio file failed to load. Would you like our AI assistant to read this story aloud using text-to-speech instead?"
                      : "No audio file available. Would you like our AI assistant to read this story aloud using text-to-speech technology?"
                    }
                  </p>
                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => setShowListenConfirm(false)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmListen}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                      Start Reading
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

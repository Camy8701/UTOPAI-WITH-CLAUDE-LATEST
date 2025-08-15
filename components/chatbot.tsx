"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, VolumeX, Pause, Play, Volume2, Minus, SkipForward, SkipBack, MessageSquare } from "lucide-react"
import Image from "next/image"

type Message = {
  id: string
  text: string
  isBot: boolean
  timestamp: Date
  isError?: boolean
  isClaudeMessage?: boolean
}

type ChatbotProps = {
  onReadStory?: (storyContent: string) => void
  storyToRead?: string
}

type TTSSettings = {
  language: string
  voiceType: "male" | "female"
  speed: number
  pitch: number
}

// ElevenLabs Voice IDs
const ELEVENLABS_VOICE_IDS = {
  female: {
    "en-US": "XhNlP8uwiH6XZSFnH1yL", // Elizabeth (female English)
    "fr-FR": "jBpfuIE2acCO8z3wKNLl", // French female
  },
  male: {
    "en-US": "pNInz6obpgDQGcFmaJgB", // Eric (male English)
    "fr-FR": "t0jbNlBVZ17f02VDIeMI", // French male
  },
}

// Claude API Configuration
const CLAUDE_BACKEND_URL = "/claude-chat-proxy.php" // Update path if needed

export default function Chatbot({ onReadStory, storyToRead }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0)
  const [storyChunks, setStoryChunks] = useState<string[]>([])
  const [isReadingStory, setIsReadingStory] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false)
  const [audioQueue, setAudioQueue] = useState<string[]>([])
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0)
  const [audioPlaybackErrors, setAudioPlaybackErrors] = useState(0)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Claude chat state
  const [claudeMessages, setClaudeMessages] = useState<Message[]>([
    {
      id: "claude-welcome",
      text: "Hi! I'm Claude. Ask me anything or let me help you with the article!",
      isBot: true,
      timestamp: new Date(),
      isClaudeMessage: true,
    },
  ])
  const [claudeInputValue, setClaudeInputValue] = useState("")
  const [isClaudeTyping, setIsClaudeTyping] = useState(false)
  const [isChatting, setIsChatting] = useState(false)
  const [activeTab, setActiveTab] = useState<"voice" | "claude">("voice")
  const claudeMessagesEndRef = useRef<HTMLDivElement>(null)

  // TTS Settings
  const [ttsSettings, setTTSSettings] = useState<TTSSettings>({
    language: "en-US",
    voiceType: "female",
    speed: 1.0,
    pitch: 1.1,
  })

  // Timer state
  const [elapsedTime, setElapsedTime] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const scrollClaudeToBottom = () => {
    claudeMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    scrollClaudeToBottom()
  }, [claudeMessages])

  // Timer effect
  useEffect(() => {
    if (isSpeaking && !isPaused) {
      timerRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1)
      }, 1000)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }

    if (!isSpeaking && !isPaused) {
      setElapsedTime(0)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isSpeaking, isPaused])

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        addBotMessage(
          "Hello! I'm your AI assistant for Utop-AI with premium natural voices powered by ElevenLabs! I can help you navigate the website, answer questions about our content, and read stories aloud with human-like voices. How can I assist you today?",
        )
      }, 500)
    }
  }, [isOpen, messages.length])

  useEffect(() => {
    if (storyToRead) {
      if (!isOpen) {
        setIsOpen(true)
      }
      setTimeout(() => {
        readStoryAloud(storyToRead)
      }, 500)
    }
  }, [storyToRead, isOpen])

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      stopProgressTracking()
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  const addBotMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isBot: true,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, newMessage])
  }

  const addUserMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isBot: false,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, newMessage])
  }

  const addClaudeMessage = (text: string, isBot: boolean, isError = false) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isBot,
      timestamp: new Date(),
      isError,
      isClaudeMessage: true,
    }
    setClaudeMessages((prev) => [...prev, newMessage])
  }

  const getBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()

    if (input.includes("what is") && (input.includes("utop-ai") || input.includes("utopai"))) {
      return "Utop-AI is a platform that recognizes the talent and effort of the best AI designers, developers, and agencies in the world. We showcase award-winning AI projects and provide inspiration for the AI design community."
    }

    if (input.includes("voice") || input.includes("settings") || input.includes("language")) {
      return "I now use premium ElevenLabs voices that sound completely natural! You can choose between Elizabeth (female) and Eric (male) voices, adjust speaking speed, and switch between English and French. The voices are so realistic you'll forget you're talking to an AI!"
    }

    if (input.includes("read") && (input.includes("story") || input.includes("aloud") || input.includes("listen"))) {
      return "I'd be happy to read a story aloud for you! I now use ElevenLabs' premium natural voices that sound incredibly human-like. You can click the 'Listen' button on any story, or ask me to read a specific story. Would you like me to read 'She used AI to steal my husband' for you?"
    }

    if (input.includes("hello") || input.includes("hi") || input.includes("hey")) {
      return "Hello! Welcome to Utop-AI! I'm here to help you explore our platform with premium natural voices that sound completely human. I can read stories in incredibly realistic voices. What would you like to know?"
    }

    if (input.includes("claude")) {
      setActiveTab("claude")
      return "I've switched to Claude mode! Claude is a powerful AI assistant that can help with more complex questions. You can chat with Claude directly in the Claude tab."
    }

    return "I'm here to help you with information about Utop-AI! I now have premium ElevenLabs voices that sound amazingly natural and human-like. I can read stories aloud in multiple languages with realistic voices. You can ask me about our awards, how to submit projects, or I can read stories for you. What would you like to know?"
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    addUserMessage(inputValue)
    setIsTyping(true)

    setTimeout(() => {
      const response = getBotResponse(inputValue)
      addBotMessage(response)
      setIsTyping(false)
    }, 1000)

    setInputValue("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleClaudeKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendClaudeMessage()
    }
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const [isGeneratingAllAudio, setIsGeneratingAllAudio] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)

  // Generate audio using ElevenLabs API
  const generateAudio = async (text: string): Promise<Blob> => {
    setIsGeneratingAudio(true)

    try {
      // Get the appropriate voice ID based on settings
      const voiceId =
        ELEVENLABS_VOICE_IDS[ttsSettings.voiceType][ttsSettings.language] || ELEVENLABS_VOICE_IDS.female["en-US"] // Default to female English

      const response = await fetch("/api/text-to-speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          voiceId,
          voiceType: ttsSettings.voiceType,
          language: ttsSettings.language,
          speed: ttsSettings.speed,
          stability: 0.75,
          similarityBoost: 0.75,
        }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const audioBlob = await response.blob()
      return audioBlob
    } catch (error) {
      console.error("Error generating audio:", error)
      throw error
    } finally {
      setIsGeneratingAudio(false)
    }
  }

  // Generate all audio chunks with improved error handling
  const generateAllAudioChunks = async (chunks: string[]): Promise<string[]> => {
    setIsGeneratingAllAudio(true)
    setGenerationProgress(0)

    const audioUrls: string[] = []
    const maxRetries = 2

    try {
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i]
        let success = false
        let attempts = 0

        // Retry logic for each chunk
        while (!success && attempts <= maxRetries) {
          try {
            attempts++

            // Generate audio using ElevenLabs
            const audioBlob = await generateAudio(chunk)
            const audioUrl = URL.createObjectURL(audioBlob)
            audioUrls.push(audioUrl)
            success = true
          } catch (error) {
            console.error(`Attempt ${attempts}: Error generating audio for chunk ${i + 1}:`, error)

            if (attempts > maxRetries) {
              // If all API attempts fail, use browser's built-in TTS as fallback
              try {
                const utterance = new SpeechSynthesisUtterance(chunk)
                utterance.lang = ttsSettings.language
                utterance.rate = ttsSettings.speed
                window.speechSynthesis.speak(utterance)

                // Create a placeholder audio URL
                const silentAudio = new Audio(
                  "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAA=",
                )
                const audioUrl = URL.createObjectURL(new Blob([await fetch(silentAudio.src).then((r) => r.blob())]))
                audioUrls.push(audioUrl)
                success = true
              } catch (fallbackError) {
                console.error("Fallback TTS also failed:", fallbackError)
                // Add a silent audio as last resort
                const silentAudioUrl =
                  "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAA="
                audioUrls.push(silentAudioUrl)
                success = true
              }
            } else {
              // Wait before retrying
              await new Promise((resolve) => setTimeout(resolve, 1000 * attempts))
            }
          }
        }

        // Update progress
        setGenerationProgress(((i + 1) / chunks.length) * 100)
      }

      setIsGeneratingAllAudio(false)
      return audioUrls
    } catch (error) {
      console.error("Error generating audio chunks:", error)
      setIsGeneratingAllAudio(false)
      setGenerationProgress(0)

      // Return whatever audio URLs we managed to generate
      if (audioUrls.length > 0) {
        addBotMessage("I encountered some issues generating audio, but I'll play what I can with my voice.")
        return audioUrls
      }

      // If no audio was generated, throw the error to be handled by the caller
      throw error
    }
  }

  // Start tracking progress of audio playback
  const startProgressTracking = () => {
    stopProgressTracking() // Clear any existing interval

    progressIntervalRef.current = setInterval(() => {
      if (audioRef.current && audioRef.current.duration) {
        const currentProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100
        setProgress(currentProgress)
      }
    }, 100)
  }

  // Stop tracking progress
  const stopProgressTracking = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
      progressIntervalRef.current = null
    }
  }

  // Fallback to browser's built-in TTS when audio playback fails
  const handleBrowserTTS = (audioUrls: string[], startIndex: number) => {
    // Clean up any existing audio
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }

    // Get the remaining text chunks
    const remainingChunks = storyChunks.slice(startIndex)

    // Use browser's speech synthesis
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel() // Cancel any ongoing speech

      setIsSpeaking(true)
      setIsPaused(false)

      remainingChunks.forEach((chunk, index) => {
        const utterance = new SpeechSynthesisUtterance(chunk)
        utterance.lang = ttsSettings.language
        utterance.rate = ttsSettings.speed

        // Update progress as each chunk completes
        utterance.onend = () => {
          const currentProgress = ((startIndex + index + 1) / storyChunks.length) * 100
          setProgress(currentProgress)
          setCurrentSentenceIndex(startIndex + index)

          // Check if this was the last chunk
          if (startIndex + index >= storyChunks.length - 1) {
            setIsSpeaking(false)
            setIsReadingStory(false)
            setCurrentSentenceIndex(0)
            setElapsedTime(0)
            setProgress(100)

            addBotMessage(
              "I've finished reading the story using my basic voice. Would you like me to try again with premium voices or help you with something else?",
            )
          }
        }

        window.speechSynthesis.speak(utterance)
      })
    } else {
      // If speech synthesis is not available
      setIsSpeaking(false)
      setIsReadingStory(false)
      addBotMessage(
        "I'm sorry, but I can't read the story aloud right now. Text-to-speech is not available on your device.",
      )
    }
  }

  // Improved play audio chunks continuously with better error handling
  const playContinuousAudio = async (audioUrls: string[], startIndex = 0) => {
    if (startIndex >= audioUrls.length) {
      // Finished all chunks
      setIsSpeaking(false)
      setIsPaused(false)
      setIsReadingStory(false)
      setCurrentSentenceIndex(0)
      setElapsedTime(0)
      setProgress(100)
      setAudioPlaybackErrors(0) // Reset error counter on successful completion
      stopProgressTracking()

      // Clean up all audio URLs
      audioUrls.forEach((url) => URL.revokeObjectURL(url))
      setAudioQueue([])

      addBotMessage(
        "I've finished reading the complete story with natural ElevenLabs voices! The continuous playback sounded incredibly smooth and human-like, didn't it? Would you like me to read it again or help you with anything else?",
      )
      return
    }

    return new Promise<void>((resolve, reject) => {
      try {
        if (audioRef.current) {
          audioRef.current.pause()
          audioRef.current = null
        }

        // Create a new audio element with error handling
        const audio = new Audio()

        // Set crossOrigin to anonymous to avoid CORS issues
        audio.crossOrigin = "anonymous"

        // Add error handling before setting the source
        audio.onerror = (error) => {
          console.error("Audio playback error:", error)
          setAudioPlaybackErrors((prev) => prev + 1)

          // If we've had too many errors, stop playback
          if (audioPlaybackErrors > 3) {
            addBotMessage("I'm having trouble with audio playback. Let me try a different approach.")
            resolve() // Resolve the promise to continue execution
            return
          }

          // Skip to next chunk on error
          setTimeout(() => {
            playContinuousAudio(audioUrls, startIndex + 1)
            resolve()
          }, 500)
        }

        // Now set the source after error handler is established
        audio.src = audioUrls[startIndex]
        audioRef.current = audio

        audio.onloadstart = () => {
          setIsSpeaking(true)
          setIsPaused(false)
          setCurrentSentenceIndex(startIndex)
          setProgress((startIndex / audioUrls.length) * 100)
        }

        audio.onplay = () => {
          setIsSpeaking(true)
          setIsPaused(false)
          startProgressTracking()
        }

        audio.onpause = () => {
          setIsPaused(true)
          stopProgressTracking()
        }

        audio.onended = () => {
          // Automatically play next chunk
          playContinuousAudio(audioUrls, startIndex + 1)
          resolve()
        }

        // Set playback rate based on current speed setting
        audio.playbackRate = ttsSettings.speed

        // Use a timeout to handle cases where the audio might not load
        const loadTimeout = setTimeout(() => {
          if (audio.readyState < 2) {
            // HAVE_CURRENT_DATA
            console.warn("Audio loading timeout, skipping to next chunk")
            clearTimeout(loadTimeout)
            playContinuousAudio(audioUrls, startIndex + 1)
            resolve()
          }
        }, 5000)

        // Start playback with catch for any immediate errors
        audio.play().catch(() => {
          // Browsers throw if play() is interrupted (e.g. paused immediately).
          // We already handle flow control; ignore this specific error silently.
        })
      } catch (error) {
        console.error("Critical error in audio playback:", error)
        reject(error)

        // Fallback to browser TTS as last resort
        if (audioPlaybackErrors > 3) {
          handleBrowserTTS(audioUrls, startIndex)
        }
      }
    })
  }

  // Updated skip functions for continuous playback
  const skipForward = () => {
    if (isReadingStory && audioQueue.length > 0 && currentSentenceIndex < audioQueue.length - 1) {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }

      const nextIndex = currentSentenceIndex + 1
      playContinuousAudio(audioQueue, nextIndex)
    }
  }

  const skipBackward = () => {
    if (isReadingStory && audioQueue.length > 0 && currentSentenceIndex > 0) {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }

      const prevIndex = currentSentenceIndex - 1
      playContinuousAudio(audioQueue, prevIndex)
    }
  }

  // Update the readStoryAloud function to handle errors better
  const readStoryAloud = async (storyContent: string) => {
    setElapsedTime(0)
    setProgress(0)
    setAudioPlaybackErrors(0) // Reset error counter

    try {
      const cleanContent = storyContent
        .replace(/# /g, "")
        .replace(/\n\n/g, ". ")
        .replace(/\n/g, " ")
        .replace(/THE END/g, "The End.")
        .replace(/[""]/g, '"')
        .replace(/['']/g, "'")
        .replace(/[—–]/g, "-")
        .replace(/[^\w\s.,?!'"()-]/g, " ")
        .replace(/\s+/g, " ")
        .trim()

      if (!cleanContent) {
        addBotMessage("Sorry, I couldn't process the story content. Please try again.")
        return
      }

      // Create smaller, more manageable chunks for better audio generation
      const contentChunks = []
      let currentChunk = ""
      const sentences = cleanContent.split(/[.!?]+/).filter((s) => s.trim().length > 0)

      for (const sentence of sentences) {
        const trimmedSentence = sentence.trim()
        if (!trimmedSentence) continue

        // Keep chunks smaller for better audio quality and faster generation
        if (currentChunk.length + trimmedSentence.length < 200) {
          // Reduced from 300 to 200 for better reliability
          currentChunk += trimmedSentence + ". "
        } else {
          if (currentChunk.trim()) {
            contentChunks.push(currentChunk.trim())
          }
          currentChunk = trimmedSentence + ". "
        }
      }

      if (currentChunk.trim()) {
        contentChunks.push(currentChunk.trim())
      }

      if (contentChunks.length === 0) {
        addBotMessage("Sorry, I couldn't break down the story into readable parts. Please try again.")
        return
      }

      setStoryChunks(contentChunks)
      setCurrentSentenceIndex(0)
      setIsReadingStory(true)

      const voiceName = ttsSettings.voiceType === "female" ? "Elizabeth" : "Eric"
      addBotMessage(
        `I'll read the story aloud for you now using ${voiceName}'s voice in ${ttsSettings.language.includes("fr") ? "French" : "English"}. I'm preparing all ${contentChunks.length} parts for continuous playback.`,
      )

      try {
        // Generate all audio chunks first
        const audioUrls = await generateAllAudioChunks(contentChunks)
        setAudioQueue(audioUrls)

        if (audioUrls.length > 0) {
          addBotMessage(
            `Audio generation ${audioUrls.length === contentChunks.length ? "complete" : "partially complete"}! Starting playback now. You can pause, resume, skip, or stop me anytime using the controls.`,
          )

          // Start continuous playback
          setTimeout(() => {
            playContinuousAudio(audioUrls, 0).catch((error) => {
              console.error("Playback failed:", error)
              handleBrowserTTS(audioUrls, 0)
            })
          }, 1000)
        } else {
          throw new Error("No audio was generated")
        }
      } catch (error) {
        console.error("Error generating audio:", error)
        addBotMessage("I'm having trouble with my voice right now. I'll try to read with a basic voice instead.")
        setIsReadingStory(false)

        // Try to use browser's built-in TTS as a last resort
        handleBrowserTTS([], 0)
      }
    } catch (error) {
      console.error("Story processing error:", error)
      addBotMessage("Sorry, I encountered an error processing the story. Please try again.")
      setIsReadingStory(false)
    }
  }

  // Updated play button handler
  const handlePlayResume = () => {
    if (audioQueue.length > 0) {
      playContinuousAudio(audioQueue, currentSentenceIndex).catch((error) => {
        console.error("Resume playback failed:", error)
        handleBrowserTTS(audioQueue, currentSentenceIndex)
      })
    } else if (storyChunks.length > 0) {
      readStoryAloud(storyChunks.join(" "))
    }
  }

  const updateTTSSettings = (newSettings: Partial<TTSSettings>) => {
    setTTSSettings((prev) => ({ ...prev, ...newSettings }))
  }

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPaused(true)
      setIsSpeaking(false)
      stopProgressTracking()
    }
  }

  const resumeAudio = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(() => {
        /* ignore play → pause race */
      })
      setIsPaused(false)
      setIsSpeaking(true)
      startProgressTracking()
    }
  }

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setIsSpeaking(false)
      setIsPaused(false)
      setIsReadingStory(false)
      setCurrentSentenceIndex(0)
      setProgress(0)
      setElapsedTime(0)
      stopProgressTracking()
    }

    // Also stop any browser TTS that might be playing
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
  }

  // Claude chat functions
  const handleSendClaudeMessage = async () => {
    if (!claudeInputValue.trim() || isChatting) return

    const userMessage = claudeInputValue
    setClaudeInputValue("")

    // Add user message to chat
    addClaudeMessage(userMessage, false)

    // Show typing indicator
    setIsClaudeTyping(true)
    setIsChatting(true)

    try {
      // Call Claude API
      const response = await fetch(CLAUDE_BACKEND_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
        }),
      })

      const data = await response.json()

      // Hide typing indicator
      setIsClaudeTyping(false)
      setIsChatting(false)

      if (data.success) {
        // Add Claude's response to chat
        addClaudeMessage(data.message, true)

        // Ask if user wants to hear Claude's response
        const wantsToHear = window.confirm("Would you like to hear Claude's response?")
        if (wantsToHear) {
          await speakClaudeResponse(data.message)
        }
      } else {
        addClaudeMessage("Sorry, I encountered an error: " + data.error, true, true)
      }
    } catch (error) {
      setIsClaudeTyping(false)
      setIsChatting(false)
      addClaudeMessage(
        "Error connecting to Claude: " + (error instanceof Error ? error.message : String(error)),
        true,
        true,
      )
    }
  }

  const speakClaudeResponse = async (text: string) => {
    try {
      setIsGeneratingAudio(true)

      // Generate audio using ElevenLabs
      const audioBlob = await generateAudio(text)
      const audioUrl = URL.createObjectURL(audioBlob)

      if (audioUrl) {
        const audio = new Audio(audioUrl)
        setIsSpeaking(true)

        audio.addEventListener("ended", () => {
          setIsSpeaking(false)
          URL.revokeObjectURL(audioUrl)
        })

        audio.play().catch((error) => {
          console.error("Error playing Claude's response:", error)
          setIsSpeaking(false)
        })
      }
    } catch (error) {
      console.error("Error converting Claude's response to speech:", error)
      setIsGeneratingAudio(false)
    } finally {
      setIsGeneratingAudio(false)
    }
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="mb-4 w-80 bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 flex flex-col overflow-hidden"
            >
              {/* Header with Article Reader Style */}
              <div className="bg-gray-800 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {activeTab === "voice" ? (
                    <Volume2 className="h-6 w-6 text-white" />
                  ) : (
                    <MessageSquare className="h-6 w-6 text-white" />
                  )}
                  <h3 className="text-white font-semibold text-lg">
                    {activeTab === "voice" ? "🎧 Premium Voice Reader" : "💬 Claude AI Chat"}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
                  >
                    <Minus className="h-4 w-4 text-white" />
                  </button>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="bg-gray-800 px-4 border-b border-gray-700">
                <div className="flex">
                  <button
                    onClick={() => setActiveTab("voice")}
                    className={`px-4 py-2 font-medium text-sm ${
                      activeTab === "voice"
                        ? "text-blue-400 border-b-2 border-blue-400"
                        : "text-gray-400 hover:text-gray-300"
                    }`}
                  >
                    Voice Reader
                  </button>
                  <button
                    onClick={() => setActiveTab("claude")}
                    className={`px-4 py-2 font-medium text-sm ${
                      activeTab === "claude"
                        ? "text-blue-400 border-b-2 border-blue-400"
                        : "text-gray-400 hover:text-gray-300"
                    }`}
                  >
                    Claude Chat
                  </button>
                </div>
              </div>

              {/* Voice Reader Tab Content */}
              {activeTab === "voice" && (
                <div className="bg-gray-800 px-4 pb-4">
                  <div className="mb-4">
                    <label className="text-white text-sm font-medium mb-2 block">Language / Langue:</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateTTSSettings({ language: "en-US" })}
                        className={`flex-1 px-4 py-2 rounded-lg border-2 transition-colors ${
                          ttsSettings.language === "en-US"
                            ? "border-blue-500 bg-blue-500/20 text-white"
                            : "border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                      >
                        🇺🇸 EN
                      </button>
                      <button
                        onClick={() => updateTTSSettings({ language: "fr-FR" })}
                        className={`flex-1 px-4 py-2 rounded-lg border-2 transition-colors ${
                          ttsSettings.language === "fr-FR"
                            ? "border-blue-500 bg-blue-500/20 text-white"
                            : "border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                      >
                        🇫🇷 FR
                      </button>
                    </div>
                  </div>

                  {/* Voice Selection */}
                  <div className="mb-4">
                    <label className="text-white text-sm font-medium mb-2 block">Premium Voice:</label>
                    <div className="relative">
                      <select
                        value={ttsSettings.voiceType}
                        onChange={(e) => updateTTSSettings({ voiceType: e.target.value as "male" | "female" })}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white appearance-none cursor-pointer hover:bg-gray-600 transition-colors"
                      >
                        <option value="female">👩 Elizabeth (Natural Female)</option>
                        <option value="male">👨 Eric (Natural Male)</option>
                      </select>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Speed Control */}
                  <div className="mb-6">
                    <label className="text-white text-sm font-medium mb-2 block">
                      Speed / Vitesse: {ttsSettings.speed}x
                    </label>
                    <div className="relative">
                      <input
                        type="range"
                        min="0.5"
                        max="2.0"
                        step="0.1"
                        value={ttsSettings.speed}
                        onChange={(e) => updateTTSSettings({ speed: Number.parseFloat(e.target.value) })}
                        className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                        style={{
                          background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((ttsSettings.speed - 0.5) / 1.5) * 100}%, #4b5563 ${((ttsSettings.speed - 0.5) / 1.5) * 100}%, #4b5563 100%)`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Control Buttons */}
                  <div className="flex gap-2 mb-4">
                    {!isSpeaking && !isPaused && !isGeneratingAllAudio && (
                      <button
                        onClick={handlePlayResume}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <Play className="h-4 w-4" />
                        Play
                      </button>
                    )}

                    {isSpeaking && !isPaused && (
                      <button
                        onClick={pauseAudio}
                        className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <Pause className="h-4 w-4" />
                        Pause
                      </button>
                    )}

                    {isPaused && (
                      <button
                        onClick={resumeAudio}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <Play className="h-4 w-4" />
                        Resume
                      </button>
                    )}

                    {(isSpeaking || isPaused) && (
                      <button
                        onClick={stopAudio}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <VolumeX className="h-4 w-4" />
                        Stop
                      </button>
                    )}
                  </div>

                  {/* Skip Controls */}
                  {isReadingStory && (
                    <div className="flex gap-2 mb-4">
                      <button
                        onClick={skipBackward}
                        disabled={currentSentenceIndex === 0}
                        className="flex-1 bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 disabled:opacity-50 text-white py-2 px-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <SkipBack className="h-4 w-4" />
                        Previous
                      </button>
                      <button
                        onClick={skipForward}
                        disabled={currentSentenceIndex >= audioQueue.length - 1}
                        className="flex-1 bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 disabled:opacity-50 text-white py-2 px-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <SkipForward className="h-4 w-4" />
                        Next
                      </button>
                    </div>
                  )}

                  {/* Progress Indicator */}
                  {isReadingStory && (
                    <div className="text-center">
                      <p className="text-gray-300 text-sm">
                        Reading part {currentSentenceIndex + 1} of {audioQueue.length || storyChunks.length}
                      </p>
                      <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Generation Progress */}
                  {isGeneratingAllAudio && (
                    <div className="mb-4">
                      <div className="text-center mb-2">
                        <p className="text-blue-400 text-sm animate-pulse">
                          🎤 Generating all audio for continuous playback...
                        </p>
                        <p className="text-gray-300 text-xs">{Math.round(generationProgress)}% complete</p>
                      </div>
                      <div className="w-full bg-gray-600 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${generationProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Generation Status */}
                  {isGeneratingAudio && (
                    <div className="text-center mt-2">
                      <p className="text-blue-400 text-sm animate-pulse">🎤 Generating natural voice audio...</p>
                    </div>
                  )}

                  {/* Error Status */}
                  {audioPlaybackErrors > 0 && (
                    <div className="text-center mt-2">
                      <p className="text-amber-400 text-xs">
                        {audioPlaybackErrors === 1
                          ? "Minor audio issue detected. Trying to fix..."
                          : `${audioPlaybackErrors} audio issues detected. Using alternative playback method...`}
                      </p>
                    </div>
                  )}

                  {/* Chat Messages (when not reading) */}
                  {!isReadingStory && (
                    <>
                      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-800 max-h-64">
                        {messages.map((message) => (
                          <div key={message.id} className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}>
                            <div
                              className={`max-w-[80%] p-3 rounded-lg ${
                                message.isBot ? "bg-gray-700 text-white" : "bg-blue-500 text-white"
                              }`}
                            >
                              <p className="text-sm">{message.text}</p>
                              <p className="text-xs opacity-70 mt-1">
                                {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              </p>
                            </div>
                          </div>
                        ))}

                        {isTyping && (
                          <div className="flex justify-start">
                            <div className="bg-gray-700 p-3 rounded-lg">
                              <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div
                                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                  style={{ animationDelay: "0.1s" }}
                                ></div>
                                <div
                                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                  style={{ animationDelay: "0.2s" }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        )}

                        <div ref={messagesEndRef} />
                      </div>

                      {/* Input */}
                      <div className="p-4 bg-gray-800 border-t border-gray-700">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ask me anything..."
                            className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white text-sm placeholder-gray-400"
                            disabled={isSpeaking && !isPaused}
                          />
                          <button
                            onClick={handleSendMessage}
                            disabled={!inputValue.trim() || (isSpeaking && !isPaused)}
                            className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <Send className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Claude Chat Tab Content */}
              {activeTab === "claude" && (
                <div className="bg-gray-800 px-4 pb-4">
                  {/* Claude Chat Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-800 max-h-64 mb-4">
                    {claudeMessages.map((message) => (
                      <div key={message.id} className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}>
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            message.isBot
                              ? message.isError
                                ? "bg-red-900/50 text-white border border-red-700"
                                : "bg-gray-700 text-white"
                              : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                    ))}

                    {isClaudeTyping && (
                      <div className="flex justify-start">
                        <div className="bg-gray-700 p-3 rounded-lg">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-300">Claude is thinking</span>
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div
                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: "0.1s" }}
                              ></div>
                              <div
                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: "0.2s" }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div ref={claudeMessagesEndRef} />
                  </div>

                  {/* Claude Chat Input */}
                  <div className="p-4 bg-gray-800 border-t border-gray-700">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={claudeInputValue}
                        onChange={(e) => setClaudeInputValue(e.target.value)}
                        onKeyPress={handleClaudeKeyPress}
                        placeholder="Chat with Claude..."
                        className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white text-sm placeholder-gray-400"
                        disabled={isChatting || (isSpeaking && !isPaused)}
                      />
                      <button
                        onClick={handleSendClaudeMessage}
                        disabled={!claudeInputValue.trim() || isChatting || (isSpeaking && !isPaused)}
                        className="p-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-md hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </div>
                    {isGeneratingAudio && (
                      <div className="text-center mt-2">
                        <p className="text-blue-400 text-xs animate-pulse">Converting Claude's response to speech...</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chatbot Button */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-16 h-16 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 overflow-hidden"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Image
            src="/images/chatbot-avatar.png"
            alt="AI Assistant Robot"
            width={64}
            height={64}
            className="w-full h-full object-cover rounded-full"
          />

          <div className="absolute inset-0 rounded-full border-2 border-blue-500 animate-pulse"></div>

          {isSpeaking && !isPaused && (
            <div className="absolute inset-0 rounded-full border-4 border-red-500 animate-ping"></div>
          )}

          {isPaused && <div className="absolute inset-0 rounded-full border-4 border-yellow-500"></div>}

          {isGeneratingAudio && (
            <div className="absolute inset-0 rounded-full border-4 border-green-500 animate-pulse"></div>
          )}

          {!isOpen && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          )}

          <div
            className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
              isPaused
                ? "bg-yellow-500"
                : isSpeaking
                  ? "bg-red-500 animate-pulse"
                  : isGeneratingAudio
                    ? "bg-green-500 animate-pulse"
                    : "bg-green-500"
            }`}
          ></div>

          {!isOpen && (isSpeaking || isPaused) && (
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full">
              {formatTime(elapsedTime)}
            </div>
          )}
        </motion.button>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </>
  )
}

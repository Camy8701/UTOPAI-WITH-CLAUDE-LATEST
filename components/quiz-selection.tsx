"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Brain, Trophy, Users, Globe, Star, ArrowRight, Zap, Target } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

type LeaderboardEntry = {
  name: string
  score: number
  percentage: number
  quizType: string
  timestamp: number
}

// Function to get real-time quiz statistics from database
const getQuizStatistics = async () => {
  try {
    const response = await fetch('/api/quiz/leaderboard', {
      credentials: 'include'
    })
    
    if (response.ok) {
      const data = await response.json()
      const stats = data.globalStats
      
      return {
        totalCompletions: stats?.total_completions || 0,
        uniqueUsers: stats?.unique_users || 0,
        averageScore: stats?.average_score ? (stats.average_score / 20) : 4.8, // Convert to 5-star scale
        topicCount: stats?.topic_count || 3,
      }
    }
  } catch (error) {
    console.error('Failed to fetch quiz statistics:', error)
  }
  
  // Fallback to default values
  return {
    totalCompletions: 0,
    uniqueUsers: 0,
    averageScore: 4.8,
    topicCount: 3,
  }
}

// Format numbers for display
const formatNumber = (num: number): string => {
  if (num === 0) return "0"
  if (num < 1000) return num.toString()
  if (num < 10000) return `${(num / 1000).toFixed(1)}K`
  return `${Math.floor(num / 1000)}K+`
}

export default function QuizSelection() {
  const [mounted, setMounted] = useState(false)
  const [stats, setStats] = useState({
    totalCompletions: 0,
    uniqueUsers: 0,
    averageScore: 4.8,
    topicCount: 3,
  })

  useEffect(() => {
    setMounted(true)
    const updateStats = async () => {
      const newStats = await getQuizStatistics()
      setStats(newStats)
    }

    // Update stats immediately
    updateStats()

    // Update stats every 30 seconds to catch changes
    const interval = setInterval(updateStats, 30000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  if (!mounted) {
    return (
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold dark:text-white mb-4">AI Knowledge Quiz</h2>
        <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-32 rounded-lg"></div>
      </div>
    )
  }

  const quizzes = [
    {
      id: "ai-fundamentals",
      title: "AI Fundamentals",
      description: "Test your basic knowledge of artificial intelligence concepts and history",
      difficulty: "Beginner",
      questions: 40,
      timePerQuestion: "10s",
      image: "/images/quiz/ai-knowledge-test.png",
      color: "from-blue-500 to-purple-600",
      icon: Brain,
    },
    {
      id: "ai-intermediate",
      title: "AI Intermediate",
      description: "Dive deeper into machine learning, neural networks, and AI applications",
      difficulty: "Intermediate",
      questions: 40,
      timePerQuestion: "10s",
      image: "/images/quiz/machine-learning-quiz.png",
      color: "from-green-500 to-blue-600",
      icon: Zap,
    },
    {
      id: "ai-ethics",
      title: "AI Advanced",
      description: "Advanced concepts, technical details, and cutting-edge AI research",
      difficulty: "Advanced",
      questions: 40,
      timePerQuestion: "10s",
      image: "/images/quiz/ai-brain-quiz.png",
      color: "from-purple-500 to-pink-600",
      icon: Target,
    },
  ]

  return (
    <div className="text-center mb-16">
      <div className="flex items-center justify-center gap-3 mb-4">
        <Brain className="h-8 w-8 text-blue-500" />
        <h2 className="text-3xl font-bold dark:text-white">AI Knowledge Quiz</h2>
        <Zap className="h-8 w-8 text-yellow-500" />
      </div>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
        Challenge yourself with our comprehensive AI quizzes. Test your knowledge across different difficulty levels and
        compete with other learners!
      </p>

      {/* Real-time Statistics */}
      <div className="bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 rounded-2xl p-8 mb-12 text-white">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <Trophy className="h-8 w-8 mx-auto mb-2 opacity-90" />
            <div className="text-2xl md:text-3xl font-bold mb-1">
              {stats.totalCompletions === 0 ? "0" : formatNumber(stats.totalCompletions)}
            </div>
            <div className="text-sm md:text-base opacity-90">Quiz Completions</div>
          </div>
          <div className="text-center">
            <Users className="h-8 w-8 mx-auto mb-2 opacity-90" />
            <div className="text-2xl md:text-3xl font-bold mb-1">
              {stats.uniqueUsers === 0 ? "0" : formatNumber(stats.uniqueUsers)}
            </div>
            <div className="text-sm md:text-base opacity-90">Active Learners</div>
          </div>
          <div className="text-center">
            <Globe className="h-8 w-8 mx-auto mb-2 opacity-90" />
            <div className="text-2xl md:text-3xl font-bold mb-1">{stats.topicCount}</div>
            <div className="text-sm md:text-base opacity-90">Quiz Topics</div>
          </div>
          <div className="text-center">
            <Star className="h-8 w-8 mx-auto mb-2 opacity-90" />
            <div className="text-2xl md:text-3xl font-bold mb-1">{stats.averageScore.toFixed(1)}</div>
            <div className="text-sm md:text-base opacity-90">Average Rating</div>
          </div>
        </div>
      </div>

      {/* Quiz Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {quizzes.map((quiz, index) => {
          const IconComponent = quiz.icon
          return (
            <motion.div
              key={quiz.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                {/* Quiz Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={quiz.image || "/placeholder.svg"}
                    alt={quiz.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${quiz.color} opacity-80`}></div>
                  <div className="absolute top-4 left-4">
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                      {quiz.difficulty}
                    </span>
                  </div>
                </div>

                {/* Quiz Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold dark:text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-600 transition-all duration-300">
                    {quiz.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{quiz.description}</p>

                  {/* Quiz Stats */}
                  <div className="flex justify-between items-center mb-6 text-sm text-gray-500 dark:text-gray-400">
                    <span>{quiz.questions} Questions</span>
                    <span>{quiz.timePerQuestion} per question</span>
                  </div>

                  {/* Start Quiz Button */}
                  <Link href={`/quiz/${quiz.id}`}>
                    <motion.button
                      className={`w-full bg-gradient-to-r ${quiz.color} text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Start Quiz
                      <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </motion.button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Call to Action */}
      <div className="mt-12 text-center">
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Ready to challenge yourself? Pick a difficulty level and start learning!
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-full">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-blue-700 dark:text-blue-300">10 random questions per quiz</span>
          </div>
          <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-full">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-green-700 dark:text-green-300">Instant feedback & explanations</span>
          </div>
          <div className="flex items-center gap-2 bg-purple-50 dark:bg-purple-900/20 px-4 py-2 rounded-full">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className="text-purple-700 dark:text-purple-300">Global leaderboard ranking</span>
          </div>
        </div>
      </div>
    </div>
  )
}

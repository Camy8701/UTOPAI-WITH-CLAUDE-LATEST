"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth-provider'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Trophy, 
  Calendar,
  Target,
  TrendingUp,
  Medal,
  Clock,
  ChevronLeft,
  ChevronRight,
  Star,
  Award
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface QuizScore {
  id: string
  quiz_title: string
  score: number
  total_questions: number
  percentage: number
  completed_at: string
  time_taken: number // in seconds
  difficulty: 'easy' | 'medium' | 'hard'
  topic: string
  rank?: number
}

interface QuizStats {
  totalQuizzes: number
  averageScore: number
  bestScore: number
  totalPoints: number
  currentRank: number
  totalUsers: number
}

export default function QuizScoresPage() {
  const { user, loading } = useAuth()
  const [quizScores, setQuizScores] = useState<QuizScore[]>([])
  const [stats, setStats] = useState<QuizStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const scoresPerPage = 10

  useEffect(() => {
    if (user) {
      loadQuizScores()
    } else if (!loading) {
      setIsLoading(false)
    }
  }, [user, loading, currentPage])

  const loadQuizScores = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // For now, return empty data since quiz system is not implemented yet
      // This will be replaced with actual API call when quiz system is built
      setQuizScores([])
      setStats({
        totalQuizzes: 0,
        averageScore: 0,
        bestScore: 0,
        totalPoints: 0,
        currentRank: 0,
        totalUsers: 0
      })
      setTotalPages(0)
    } catch (error) {
      console.error('Error loading quiz scores:', error)
      setError('Failed to load quiz scores')
    } finally {
      setIsLoading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getScoreColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600'
    if (percentage >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBackground = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-100 dark:bg-green-900/20'
    if (percentage >= 70) return 'bg-yellow-100 dark:bg-yellow-900/20'
    return 'bg-red-100 dark:bg-red-900/20'
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Trophy className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Sign In Required
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please sign in to view your quiz scores
          </p>
          <Link 
            href="/"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Go to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/dashboard"
            className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors group mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>

          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-full">
              <Trophy className="h-8 w-8 text-yellow-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Quiz Scores</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Track your AI knowledge progress and rankings
              </p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/20">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Quizzes Taken
                  </p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {stats.totalQuizzes}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/20">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Average Score
                  </p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {Math.round(stats.averageScore)}%
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900/20">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Best Score
                  </p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {stats.bestScore}%
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/20">
                  <Award className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Current Rank
                  </p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    #{stats.currentRank}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    of {stats.totalUsers} users
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 dark:text-red-400 text-lg mb-4">{error}</p>
            <Button onClick={loadQuizScores} variant="outline">
              Try Again
            </Button>
          </div>
        ) : quizScores.length === 0 ? (
          <div className="text-center py-12">
            <Trophy className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Quiz Scores Yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Take your first AI knowledge quiz to start tracking your progress
            </p>
            <Link 
              href="/"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
            >
              Take a Quiz
            </Link>
          </div>
        ) : (
          <>
            {/* Quiz Scores List */}
            <div className="space-y-4 mb-8">
              {quizScores.map((quiz, index) => (
                <div key={quiz.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-full ${getScoreBackground(quiz.percentage)}`}>
                        {quiz.percentage >= 90 ? (
                          <Medal className={`h-6 w-6 ${getScoreColor(quiz.percentage)}`} />
                        ) : (
                          <Trophy className={`h-6 w-6 ${getScoreColor(quiz.percentage)}`} />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {quiz.quiz_title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {quiz.topic} • {quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getScoreColor(quiz.percentage)}`}>
                        {quiz.percentage}%
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {quiz.score}/{quiz.total_questions}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(quiz.completed_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{formatTime(quiz.time_taken)}</span>
                      </div>
                      {quiz.rank && (
                        <div className="flex items-center gap-1">
                          <Award className="h-4 w-4" />
                          <span>Rank #{quiz.rank}</span>
                        </div>
                      )}
                    </div>
                    
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(quiz.difficulty)}`}>
                      {quiz.difficulty.toUpperCase()}
                    </span>
                  </div>

                  {/* Score Progress Bar */}
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          quiz.percentage >= 90 ? 'bg-green-500' :
                          quiz.percentage >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${quiz.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      onClick={() => setCurrentPage(page)}
                      className="w-10 h-10"
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Call to Action */}
            <div className="mt-12 text-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-8">
              <Trophy className="h-12 w-12 mx-auto text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Keep Learning!
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Challenge yourself with more AI quizzes to improve your ranking and knowledge.
              </p>
              <Link 
                href="/"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg inline-flex items-center gap-2"
              >
                <Target className="h-4 w-4" />
                Take Another Quiz
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
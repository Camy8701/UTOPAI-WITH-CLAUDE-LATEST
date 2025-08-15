interface QuizSubmission {
  quizType: string
  score: number
  percentage: number
  timeTaken: number
  questionsAsked: number
  correctAnswers: number
  answersData?: Record<string, any>
}

interface QuizResult {
  success: boolean
  attempt: {
    id: string
    quiz_type: string
    score: number
    percentage: number
    time_taken: number
    created_at: string
  }
  rank?: {
    rank_in_type: number
    overall_rank: number
  }
  globalStats?: {
    total_completions: number
    unique_users: number
    average_score: number
    topic_count: number
  }
  message: string
}

interface LeaderboardEntry {
  id: string
  player_name: string
  avatar_url?: string
  quiz_type: string
  score: number
  percentage: number
  time_taken: number
  correct_answers: number
  questions_asked: number
  created_at: string
  rank_in_type: number
  overall_rank: number
}

interface LeaderboardResponse {
  success: boolean
  leaderboard: LeaderboardEntry[]
  globalStats: {
    total_completions: number
    unique_users: number
    average_score: number
    topic_count: number
  }
  quizTypeStats?: {
    quiz_type: string
    total_attempts: number
    unique_players: number
    avg_percentage: number
    best_percentage: number
    avg_time_taken: number
    fastest_time: number
    avg_accuracy: number
  }
  filter: {
    quiz_type?: string
    limit: number
  }
}

class QuizAPIClient {
  private baseUrl = '/api/quiz'

  async submitQuiz(submission: QuizSubmission): Promise<QuizResult> {
    const response = await fetch(`${this.baseUrl}/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(submission),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }))
      throw new Error(error.error || `HTTP ${response.status}`)
    }

    return response.json()
  }

  async getLeaderboard(quizType?: string, limit = 50): Promise<LeaderboardResponse> {
    const params = new URLSearchParams()
    if (quizType) params.append('quiz_type', quizType)
    params.append('limit', limit.toString())

    const response = await fetch(`${this.baseUrl}/leaderboard?${params}`, {
      credentials: 'include',
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }))
      throw new Error(error.error || `HTTP ${response.status}`)
    }

    return response.json()
  }

  async getGlobalStats() {
    const response = await this.getLeaderboard()
    return response.globalStats
  }

  // Helper method to format time taken
  formatTimeTaken(seconds: number): string {
    if (seconds < 60) {
      return `${seconds}s`
    }
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  // Helper method to get quiz type display name
  getQuizTypeDisplayName(quizType: string): string {
    const names: Record<string, string> = {
      'ai-fundamentals': 'AI Fundamentals',
      'ai-intermediate': 'AI Intermediate', 
      'ai-ethics': 'AI Advanced'
    }
    return names[quizType] || quizType
  }

  // Helper method to calculate percentile rank
  calculatePercentile(rank: number, totalEntries: number): number {
    if (totalEntries <= 1) return 100
    return Math.round(((totalEntries - rank) / (totalEntries - 1)) * 100)
  }
}

export const quizAPI = new QuizAPIClient()
export type { QuizSubmission, QuizResult, LeaderboardEntry, LeaderboardResponse }
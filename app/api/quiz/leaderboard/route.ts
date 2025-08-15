import { NextRequest, NextResponse } from 'next/server'
import { createAPIClient } from '@/lib/supabase-client-server'

export async function GET(request: NextRequest) {
  try {
    // Return mock data temporarily to prevent database errors
    return NextResponse.json({
      success: true,
      leaderboard: [],
      globalStats: {
        total_completions: 0,
        unique_users: 0,
        average_score: 0,
        topic_count: 3
      },
      quizTypeStats: null,
      filter: {
        quiz_type: null,
        limit: 50
      }
    })

  } catch (error) {
    console.error('Leaderboard API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
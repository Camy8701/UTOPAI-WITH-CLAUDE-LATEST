import { NextRequest, NextResponse } from 'next/server'
import { createAPIClient } from '@/lib/supabase-client-server'

interface QuizSubmission {
  quizType: string
  score: number
  percentage: number
  timeTaken: number
  questionsAsked: number
  correctAnswers: number
  answersData?: Record<string, any>
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createAPIClient(request)
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body: QuizSubmission = await request.json()
    const { 
      quizType, 
      score, 
      percentage, 
      timeTaken, 
      questionsAsked, 
      correctAnswers, 
      answersData 
    } = body

    // Validate input data
    if (!quizType || typeof score !== 'number' || typeof percentage !== 'number') {
      return NextResponse.json(
        { error: 'Invalid quiz submission data' },
        { status: 400 }
      )
    }

    // Validate quiz type
    const validQuizTypes = ['ai-fundamentals', 'ai-intermediate', 'ai-ethics']
    if (!validQuizTypes.includes(quizType)) {
      return NextResponse.json(
        { error: 'Invalid quiz type' },
        { status: 400 }
      )
    }

    // Validate score ranges
    if (score < 0 || score > 40 || percentage < 0 || percentage > 100) {
      return NextResponse.json(
        { error: 'Invalid score or percentage values' },
        { status: 400 }
      )
    }

    // Insert quiz attempt into database
    const { data: quizAttempt, error: insertError } = await supabase
      .from('quiz_attempts')
      .insert({
        user_id: user.id,
        quiz_type: quizType,
        score,
        percentage,
        time_taken: timeTaken,
        questions_asked: questionsAsked,
        correct_answers: correctAnswers,
        answers_data: answersData || {}
      })
      .select(`
        id,
        quiz_type,
        score,
        percentage,
        time_taken,
        created_at
      `)
      .single()

    if (insertError) {
      console.error('Error inserting quiz attempt:', insertError)
      return NextResponse.json(
        { error: 'Failed to save quiz results' },
        { status: 500 }
      )
    }

    // Get user's rank for this quiz type
    const { data: rankData } = await supabase
      .from('quiz_leaderboards')
      .select('rank_in_type, overall_rank')
      .eq('id', quizAttempt.id)
      .single()

    // Get updated statistics
    const { data: stats } = await supabase
      .from('global_quiz_statistics')
      .select('*')
      .single()

    return NextResponse.json({
      success: true,
      attempt: quizAttempt,
      rank: rankData,
      globalStats: stats,
      message: 'Quiz results saved successfully!'
    })

  } catch (error) {
    console.error('Quiz submission error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
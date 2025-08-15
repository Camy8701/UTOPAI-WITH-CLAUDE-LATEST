import { NextRequest, NextResponse } from 'next/server'
import { createAPIClient } from '@/lib/supabase-client-server'

export async function GET(request: NextRequest) {
  try {
    console.log('=== TEST AUTH ENDPOINT ===')
    
    const supabase = createAPIClient(request)
    
    // Try to get the user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    console.log('Auth result:', {
      hasUser: !!user,
      userId: user?.id,
      email: user?.email,
      authError: authError?.message,
      errorCode: authError?.status
    })
    
    return NextResponse.json({
      success: true,
      authenticated: !!user,
      user: user ? {
        id: user.id,
        email: user.email,
        created_at: user.created_at
      } : null,
      error: authError?.message || null,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Test auth error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
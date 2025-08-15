import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    console.log('=== SIMPLE AUTH TEST ===')
    
    const cookieStore = await cookies()
    const allCookies = cookieStore.getAll()
    
    console.log('Available cookies:', {
      count: allCookies.length,
      names: allCookies.map(c => c.name),
      supabaseCookies: allCookies.filter(c => c.name.includes('supabase') || c.name.includes('sb-'))
    })
    
    return NextResponse.json({
      success: true,
      cookieCount: allCookies.length,
      cookieNames: allCookies.map(c => c.name),
      supabaseCookies: allCookies.filter(c => c.name.includes('supabase') || c.name.includes('sb-')).map(c => ({
        name: c.name,
        hasValue: !!c.value
      })),
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Simple auth test error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  return GET(request) // Same logic for POST
}
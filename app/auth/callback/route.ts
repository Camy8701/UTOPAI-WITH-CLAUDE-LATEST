import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')
  const next = searchParams.get('next') ?? '/'

  console.log('Auth callback received:', { 
    hasCode: !!code, 
    error, 
    errorDescription
  })

  if (error) {
    console.error('OAuth error from Google:', { error, errorDescription })
    return NextResponse.redirect(`${origin}/auth/auth-code-error?error=${encodeURIComponent(error)}&description=${encodeURIComponent(errorDescription || '')}`)
  }

  if (code) {
    // FIX: Await the cookies() call for Next.js 15 compatibility
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: any) {
            cookieStore.delete({ name, ...options })
          },
        },
      }
    )

    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Auth callback error:', error)
        return NextResponse.redirect(`${origin}/auth/auth-code-error?error=${encodeURIComponent(error.message || 'Unknown error')}&description=${encodeURIComponent('Failed to exchange authorization code for session')}`)
      }

      // Success - redirect to the next page
      return NextResponse.redirect(`${origin}${next}`)
    } catch (error) {
      console.error('Auth callback exception:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown exception occurred'
      return NextResponse.redirect(`${origin}/auth/auth-code-error?error=${encodeURIComponent(errorMessage)}&description=${encodeURIComponent('Exception during authentication process')}`)
    }
  }

  // No code present, redirect to home
  return NextResponse.redirect(`${origin}/`)
}
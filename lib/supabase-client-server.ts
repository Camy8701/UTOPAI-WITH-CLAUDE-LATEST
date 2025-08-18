import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

// For API routes that handle both client and server requests
export function createAPIClient(request: NextRequest) {
  // Try to get auth header first (for client-side requests)
  const authHeader = request.headers.get('authorization')
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl) {
    throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
  }
  if (!supabaseAnonKey) {
    throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY')
  }
  
  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      global: {
        headers: authHeader ? {
          authorization: authHeader
        } : {}
      },
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set() {
          // API routes can't set cookies during response
        },
        remove() {
          // API routes can't remove cookies during response
        },
      },
    }
  )
}
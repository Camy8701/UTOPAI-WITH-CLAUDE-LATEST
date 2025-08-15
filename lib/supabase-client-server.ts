import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

// For API routes that handle both client and server requests
export function createAPIClient(request: NextRequest) {

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          // API routes can't set cookies - this is a no-op
        },
        remove(name: string, options: any) {
          // API routes can't remove cookies - this is a no-op
        },
      },
    }
  )
}
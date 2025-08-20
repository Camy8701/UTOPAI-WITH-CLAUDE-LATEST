import { NextResponse } from 'next/server'

export async function GET() {
  // Server-side environment variables are available here
  const config = {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  }

  // Return config for client-side consumption
  return NextResponse.json(config)
}
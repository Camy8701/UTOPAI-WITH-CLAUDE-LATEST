import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

// Validate environment variables with detailed logging
function validateEnvironmentVariables() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  console.log('Environment validation:', {
    hasUrl: !!supabaseUrl,
    urlLength: supabaseUrl?.length || 0,
    hasKey: !!supabaseAnonKey,
    keyLength: supabaseAnonKey?.length || 0,
    urlValue: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : 'undefined',
    nodeEnv: process.env.NODE_ENV,
    isClient: typeof window !== 'undefined'
  })

  if (!supabaseUrl || supabaseUrl.trim() === '') {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is missing or empty')
  }

  if (!supabaseAnonKey || supabaseAnonKey.trim() === '') {
    throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is missing or empty')
  }

  // Validate URL format
  try {
    new URL(supabaseUrl)
  } catch {
    throw new Error(`Invalid NEXT_PUBLIC_SUPABASE_URL format: ${supabaseUrl}`)
  }

  return { supabaseUrl: supabaseUrl.trim(), supabaseAnonKey: supabaseAnonKey.trim() }
}

// Initialize client with proper error handling
let supabaseClient: ReturnType<typeof createClient<Database>> | null = null

function getSupabaseClient() {
  if (supabaseClient) {
    return supabaseClient
  }

  try {
    const { supabaseUrl, supabaseAnonKey } = validateEnvironmentVariables()
    
    supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        debug: process.env.NODE_ENV === 'development',
      },
      global: {
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`
        }
      }
    })

    console.log('✅ Supabase client initialized successfully')
    return supabaseClient
  } catch (error) {
    console.error('❌ Failed to initialize Supabase client:', error)
    throw error
  }
}

// Export the client getter
export const supabase = getSupabaseClient()

// For consistency with auth provider
export const createClientComponentClient = () => supabase

// Test connection
export async function testConnection() {
  try {
    const { data, error } = await supabase.from("profiles").select("*").limit(1)
    if (error && error.code !== "PGRST116") {
      // PGRST116 = table doesn't exist, which is fine for now
      console.error("Supabase connection error:", error)
      return false
    }
    console.log("✅ Supabase connected successfully")
    return true
  } catch (err) {
    console.error("❌ Supabase connection failed:", err)
    return false
  }
}
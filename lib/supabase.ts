import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

// Validate environment variables
function validateEnvironmentVariables() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
  }

  if (!supabaseAnonKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
  }

  return { supabaseUrl, supabaseAnonKey }
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
      },
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
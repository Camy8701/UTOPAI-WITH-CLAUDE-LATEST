import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

// Get environment variables with fallback to hardcoded values for Next.js 15.x bug
function getEnvironmentVariables() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ovizewmqyclbebotemwl.supabase.co'
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92aXpld21xeWNsYmVib3RlbXdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwMjY0OTgsImV4cCI6MjA3MDYwMjQ5OH0.Dxp52bNqqFthuVgJ3xZ_gwCsECzwknN3DEctGn5oC_8'
  
  console.log('Environment check:', {
    hasEnvUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasEnvKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    usingFallback: !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  })
  
  return { supabaseUrl, supabaseAnonKey }
}

// Initialize client with proper error handling
let supabaseClient: ReturnType<typeof createClient<Database>> | null = null

function getSupabaseClient() {
  if (supabaseClient) {
    return supabaseClient
  }

  try {
    const { supabaseUrl, supabaseAnonKey } = getEnvironmentVariables()
    
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
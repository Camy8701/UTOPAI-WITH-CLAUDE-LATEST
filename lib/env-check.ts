// Environment validation utility
export function validateEnvironment() {
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ]

  const missing = required.filter(key => !process.env[key])
  
  if (missing.length > 0) {
    const envInfo = {
      NODE_ENV: process.env.NODE_ENV,
      isClient: typeof window !== 'undefined',
      missingVars: missing,
      availableSupabaseKeys: Object.keys(process.env).filter(key => key.includes('SUPABASE')),
      timestamp: new Date().toISOString()
    }
    
    console.error('Environment validation failed:', envInfo)
    
    // In production, try to provide helpful error message
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`Missing required environment variables in production: ${missing.join(', ')}. Please check your deployment environment configuration.`)
    } else {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}. Please check your .env.local file.`)
    }
  }

  // Validate URL format
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  try {
    new URL(supabaseUrl)
  } catch (error) {
    throw new Error(`Invalid NEXT_PUBLIC_SUPABASE_URL format: ${supabaseUrl}`)
  }

  // Validate key format (basic check for JWT structure)
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  if (!supabaseKey.startsWith('eyJ') || supabaseKey.split('.').length !== 3) {
    throw new Error('Invalid NEXT_PUBLIC_SUPABASE_ANON_KEY format - should be a valid JWT token')
  }

  return {
    supabaseUrl,
    supabaseAnonKey: supabaseKey
  }
}
"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { createClientComponentClient } from '@/lib/supabase'
import type { Database } from '@/types/database'

type Profile = Database['public']['Tables']['profiles']['Row']

interface AuthContextType {
  user: User | null
  profile: Profile | null
  session: Session | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<void>
  signUpWithEmail: (email: string, password: string, fullName?: string) => Promise<void>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Initialize Supabase client with error handling
  const [supabase, setSupabase] = useState<ReturnType<typeof createClientComponentClient> | null>(null)
  
  useEffect(() => {
    try {
      const client = createClientComponentClient()
      setSupabase(client)
    } catch (error) {
      console.error('Failed to initialize Supabase client:', error)
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!supabase) return

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error getting session:', error)
          setLoading(false)
          return
        }
        
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await loadUserProfile(session.user.id)
          
          // Check if user is admin and set admin session
          checkAndSetAdminAccess(session.user)
        } else {
          setLoading(false)
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error)
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        await loadUserProfile(session.user.id)
        
        // Check if user is admin and set admin session
        checkAndSetAdminAccess(session.user)
      } else {
        setProfile(null)
        setLoading(false)
        
        // Clear admin session if user logs out
        if (typeof window !== 'undefined') {
          localStorage.removeItem('isAdminLoggedIn')
          localStorage.removeItem('adminEmail')
          localStorage.removeItem('adminLoginTime')
        }
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  // Check if user is admin and set admin access
  const checkAndSetAdminAccess = (user: any) => {
    if (user?.email === 'utopaiblog@gmail.com') {
      if (typeof window !== 'undefined') {
        localStorage.setItem('isAdminLoggedIn', 'true')
        localStorage.setItem('adminEmail', user.email)
        localStorage.setItem('adminLoginTime', new Date().toISOString())
      }
    }
  }

  const loadUserProfile = async (userId: string) => {
    if (!supabase) {
      console.error('Supabase client not initialized')
      setLoading(false)
      return
    }

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error && error.code === 'PGRST116') {
        // Profile doesn't exist, create one
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError) {
          console.error('Error getting current user:', userError)
          setLoading(false)
        } else if (user) {
          await createUserProfile(user)
        } else {
          setLoading(false)
        }
      } else if (error) {
        console.error('Error loading profile:', error)
        setLoading(false)
      } else if (profile) {
        setProfile(profile)
        setLoading(false)
      } else {
        // No profile and no error - shouldn't happen but handle it
        setLoading(false)
      }
    } catch (error) {
      console.error('Exception in loadUserProfile:', error)
      setLoading(false)
    }
  }

  const createUserProfile = async (user: User) => {
    if (!supabase) {
      console.error('Supabase client not initialized')
      setLoading(false)
      return
    }

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email!,
          full_name: user.user_metadata.full_name || user.user_metadata.name || null,
          avatar_url: user.user_metadata.avatar_url || user.user_metadata.picture || null,
          google_id: user.user_metadata.provider_id || null,
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating profile:', error)
        // Even if profile creation fails, we still have a user - show the button
        setLoading(false)
        return
      }
      
      if (profile) {
        setProfile(profile)
      }
      
      setLoading(false)
    } catch (error) {
      console.error('Exception in createUserProfile:', error)
      // Critical: ALWAYS set loading to false so user button appears
      setLoading(false)
    }
  }

  const refreshProfile = async () => {
    if (user) {
      await loadUserProfile(user.id)
    }
  }

  const signInWithGoogle = async () => {
    if (!supabase) {
      throw new Error('Authentication service is not available. Please refresh the page and try again.')
    }

    try {
      const isProduction = window.location.hostname === 'www.utopai.blog' || 
                          window.location.hostname === 'utopai.blog' ||
                          window.location.hostname.includes('vercel.app')
      const redirectTo = isProduction 
        ? `${window.location.origin}/auth/callback`
        : `${window.location.origin}/auth/callback`

      console.log('Starting Google OAuth with redirect:', redirectTo)
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })
      
      if (error) {
        console.error('Supabase OAuth error:', error)
        throw new Error(`OAuth failed: ${error.message}`)
      }
      
      console.log('OAuth initiated successfully')
    } catch (error) {
      console.error('Error signing in with Google:', error)
      throw error
    }
  }

  const signInWithEmail = async (email: string, password: string) => {
    if (!supabase) {
      throw new Error('Authentication service is not available. Please refresh the page and try again.')
    }

    try {
      console.log('Attempting email sign-in for:', email)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        console.error('Email sign-in error:', error)
        
        // Provide more user-friendly error messages
        if (error.message === 'Invalid login credentials') {
          throw new Error('Invalid email or password. Please check your credentials and try again.')
        } else if (error.message === 'Email not confirmed') {
          throw new Error('Please check your email and confirm your account before signing in.')
        } else {
          throw new Error(error.message)
        }
      }
      
      console.log('Email sign-in successful')
    } catch (error) {
      console.error('Error signing in with email:', error)
      throw error
    }
  }

  const signUpWithEmail = async (email: string, password: string, fullName?: string) => {
    if (!supabase) {
      throw new Error('Authentication service is not available. Please refresh the page and try again.')
    }

    try {
      console.log('Attempting email sign-up for:', email)
      
      // Use the current domain for redirect
      const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://utopai.blog'
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName || '',
          },
          emailRedirectTo: `${currentOrigin}/auth/callback`,
          captchaToken: undefined // Explicitly set to avoid issues
        },
      })
      
      if (error) {
        console.error('Email sign-up error:', error)
        
        // Handle specific fetch errors more gracefully
        if (error.message?.includes('Invalid value') || error.message?.includes('fetch')) {
          throw new Error('Network error during sign-up. Please check your connection and try again.')
        }
        
        throw error
      }
      
      console.log('Email sign-up successful:', data)
    } catch (error: any) {
      console.error('Error signing up with email:', error)
      
      // Provide user-friendly error messages
      if (error.message?.includes('Invalid value') || error.message?.includes('fetch')) {
        throw new Error('Network error during sign-up. Please refresh the page and try again.')
      }
      
      throw error
    }
  }

  const signOut = async () => {
    try {
      // Clear admin session first
      if (typeof window !== 'undefined') {
        localStorage.removeItem('isAdminLoggedIn')
        localStorage.removeItem('adminEmail')
        localStorage.removeItem('adminLoginTime')
      }
      
      // Sign out from Supabase
      if (supabase) {
        const { error } = await supabase.auth.signOut()
        if (error) {
          console.error('Supabase signOut error:', error)
          throw error
        }
      }
    } catch (error) {
      console.error('Error signing out:', error)
      throw error
    }
  }

  const value = {
    user,
    profile,
    session,
    loading,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    refreshProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
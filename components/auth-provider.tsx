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
  const supabase = createClientComponentClient()

  useEffect(() => {
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
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })
      
      if (error) {
        console.error('Supabase OAuth error:', error)
        throw error
      }
    } catch (error) {
      console.error('Error signing in with Google:', error)
      throw error
    }
  }

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        console.error('Email sign-in error:', error)
        throw error
      }
    } catch (error) {
      console.error('Error signing in with email:', error)
      throw error
    }
  }

  const signUpWithEmail = async (email: string, password: string, fullName?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName || '',
          },
        },
      })
      
      if (error) {
        console.error('Email sign-up error:', error)
        throw error
      }
    } catch (error) {
      console.error('Error signing up with email:', error)
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
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Supabase signOut error:', error)
        throw error
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
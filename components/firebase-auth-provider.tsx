"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { 
  User, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'

interface UserProfile {
  uid: string
  email: string
  displayName: string
  photoURL?: string
  createdAt: string
  lastLoginAt: string
}

interface FirebaseAuthContextType {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<void>
  signUpWithEmail: (email: string, password: string, fullName?: string) => Promise<void>
  signOut: () => Promise<void>
}

const FirebaseAuthContext = createContext<FirebaseAuthContextType | undefined>(undefined)

export function FirebaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)
      
      if (user) {
        // Load or create user profile
        await loadUserProfile(user)
      } else {
        setProfile(null)
      }
      
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const loadUserProfile = async (user: User) => {
    try {
      const profileRef = doc(db, 'users', user.uid)
      const profileSnap = await getDoc(profileRef)
      
      if (profileSnap.exists()) {
        // Update last login
        const profileData = profileSnap.data() as UserProfile
        profileData.lastLoginAt = new Date().toISOString()
        await setDoc(profileRef, profileData, { merge: true })
        setProfile(profileData)
      } else {
        // Create new profile
        const newProfile: UserProfile = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || '',
          photoURL: user.photoURL || undefined,
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString()
        }
        await setDoc(profileRef, newProfile)
        setProfile(newProfile)
      }
      
      // Check if user is admin and set admin access
      if (user.email === 'utopaiblog@gmail.com') {
        if (typeof window !== 'undefined') {
          localStorage.setItem('isAdminLoggedIn', 'true')
          localStorage.setItem('adminEmail', user.email)
          localStorage.setItem('adminLoginTime', new Date().toISOString())
        }
      }
    } catch (error) {
      console.error('Error loading user profile:', error)
      setLoading(false)
    }
  }

  const signInWithGoogle = async () => {
    try {
      setLoading(true)
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
      console.log('✅ Google sign-in successful')
    } catch (error: any) {
      console.error('Google sign-in error:', error)
      setLoading(false)
      throw new Error(error.message || 'Failed to sign in with Google')
    }
  }

  const signInWithEmail = async (email: string, password: string) => {
    try {
      setLoading(true)
      await signInWithEmailAndPassword(auth, email, password)
      console.log('✅ Email sign-in successful')
    } catch (error: any) {
      console.error('Email sign-in error:', error)
      setLoading(false)
      
      // Provide user-friendly error messages
      if (error.code === 'auth/user-not-found') {
        throw new Error('No account found with this email address.')
      } else if (error.code === 'auth/wrong-password') {
        throw new Error('Incorrect password. Please try again.')
      } else if (error.code === 'auth/too-many-requests') {
        throw new Error('Too many failed login attempts. Please try again later.')
      } else {
        throw new Error(error.message || 'Failed to sign in')
      }
    }
  }

  const signUpWithEmail = async (email: string, password: string, fullName?: string) => {
    try {
      setLoading(true)
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      
      // Update display name if provided
      if (fullName) {
        await updateProfile(userCredential.user, {
          displayName: fullName
        })
      }
      
      console.log('✅ Email sign-up successful')
    } catch (error: any) {
      console.error('Email sign-up error:', error)
      setLoading(false)
      
      // Provide user-friendly error messages
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('An account with this email already exists.')
      } else if (error.code === 'auth/weak-password') {
        throw new Error('Password should be at least 6 characters.')
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Please enter a valid email address.')
      } else {
        throw new Error(error.message || 'Failed to create account')
      }
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
      
      await firebaseSignOut(auth)
      setProfile(null)
      console.log('✅ Sign out successful')
    } catch (error: any) {
      console.error('Sign out error:', error)
      throw new Error(error.message || 'Failed to sign out')
    }
  }

  const value = {
    user,
    profile,
    loading,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut
  }

  return (
    <FirebaseAuthContext.Provider value={value}>
      {children}
    </FirebaseAuthContext.Provider>
  )
}

export function useFirebaseAuth() {
  const context = useContext(FirebaseAuthContext)
  if (context === undefined) {
    throw new Error('useFirebaseAuth must be used within a FirebaseAuthProvider')
  }
  return context
}
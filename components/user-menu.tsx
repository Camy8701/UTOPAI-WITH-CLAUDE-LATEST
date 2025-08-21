"use client"

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useFirebaseAuth } from './firebase-auth-provider'
import { FirebaseAuthModal } from './firebase-auth-modal'
import { Button } from './ui/button'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { LogIn, User, Settings, LogOut, Shield } from 'lucide-react'

export function UserMenu() {
  const { user, profile, signOut, loading } = useFirebaseAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')
  const [forceRender, setForceRender] = useState(0)
  const router = useRouter()
  
  // Admin check
  const isAdmin = user?.email === 'utopaiblog@gmail.com'
  
  // Force re-render every 30 seconds to prevent frozen state
  useEffect(() => {
    const interval = setInterval(() => {
      setForceRender(prev => prev + 1)
    }, 30000)
    
    return () => clearInterval(interval)
  }, [])


  // Navigation handler
  const handleNavigation = useCallback((path: string) => {
    router.push(path)
  }, [router])

  // Logout handler
  const handleSignOut = useCallback(async () => {
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }, [signOut, router])

  // Auth modal handlers
  const openSignIn = useCallback(() => {
    setAuthMode('signin')
    setShowAuthModal(true)
  }, [])

  const openSignUp = useCallback(() => {
    setAuthMode('signup')
    setShowAuthModal(true)
  }, [])

  const closeModal = useCallback(() => {
    setShowAuthModal(false)
  }, [])

  // Get user display data with fallbacks
  const getUserDisplayData = () => {
    if (!user) return null
    
    // Try to get name from profile first, then Firebase user displayName, then email
    let displayName = 'User' // Default fallback
    
    if (profile?.displayName) {
      displayName = profile.displayName
    } else if (user.displayName) {
      displayName = user.displayName
    } else if (user.email) {
      displayName = user.email.split('@')[0]
    }

    // Generate initials - ALWAYS works
    const initials = displayName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U' // Fallback to 'U' if somehow empty

    return { displayName, initials }
  }

  const userDisplayData = getUserDisplayData()

  // Loading state
  if (loading) {
    return (
      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
    )
  }

  // Not authenticated - show sign in/up buttons
  if (!user) {
    return (
      <>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={openSignIn}
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <LogIn className="h-4 w-4 mr-2" />
            Sign In
          </Button>
          <Button
            size="sm"
            onClick={openSignUp}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Sign Up
          </Button>
        </div>
        
        <FirebaseAuthModal 
          isOpen={showAuthModal}
          onClose={closeModal}
          mode={authMode}
        />
      </>
    )
  }

  // Authenticated user - show dropdown
  return (
    <>
      <DropdownMenu key={user.id}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className={`relative h-8 w-8 rounded-full p-0 hover:ring-2 hover:ring-offset-2 transition-all ${
              isAdmin 
                ? 'hover:ring-orange-500' 
                : 'hover:ring-red-500'
            }`}
          >
            <Avatar className="h-8 w-8">
              <AvatarImage 
                src={profile?.photoURL || user.photoURL || undefined} 
                alt={userDisplayData?.displayName || 'User'}
              />
              <AvatarFallback className={`text-white text-xs font-semibold ${
                isAdmin ? 'bg-orange-600' : 'bg-red-600'
              }`}>
                {userDisplayData?.initials || 'U'}
              </AvatarFallback>
            </Avatar>
            
            {/* Admin badge */}
            {isAdmin && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full border-2 border-white flex items-center justify-center">
                <span className="text-[8px] text-white font-bold">A</span>
              </div>
            )}
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="end" className="w-56">
          {/* User info header */}
          <div className="flex items-center gap-2 p-2">
            <Avatar className="h-8 w-8">
              <AvatarImage 
                src={profile?.photoURL || user.photoURL || undefined} 
                alt={userDisplayData?.displayName || 'User'}
              />
              <AvatarFallback className={`text-white text-xs font-semibold ${
                isAdmin ? 'bg-orange-600' : 'bg-red-600'
              }`}>
                {userDisplayData?.initials || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-1 flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{userDisplayData?.displayName || 'User'}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
              {isAdmin && (
                <p className="text-xs text-orange-600 font-medium">Admin</p>
              )}
            </div>
          </div>
          
          <DropdownMenuSeparator />
          
          {/* Dashboard link */}
          <DropdownMenuItem 
            onClick={() => handleNavigation(isAdmin ? '/admin' : '/dashboard')}
            className="cursor-pointer"
          >
            {isAdmin ? (
              <>
                <Shield className="mr-2 h-4 w-4" />
                Admin Dashboard
              </>
            ) : (
              <>
                <User className="mr-2 h-4 w-4" />
                Dashboard
              </>
            )}
          </DropdownMenuItem>
          
          {/* Settings link */}
          <DropdownMenuItem 
            onClick={() => handleNavigation('/settings')}
            className="cursor-pointer"
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          {/* Sign out */}
          <DropdownMenuItem 
            onClick={handleSignOut}
            className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

    </>
  )
}
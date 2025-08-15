"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { RotateCcw, CheckCircle, Home } from 'lucide-react'
import { createClientComponentClient } from '@/lib/supabase'

export function ClearAuthButton() {
  const [isClearing, setIsClearing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const supabase = createClientComponentClient()

  const clearAuth = async () => {
    setIsClearing(true)
    
    try {
      console.log('🔄 Starting auth clear...')
      
      // 1. Sign out from Supabase (this should clear server-side session)
      await supabase.auth.signOut()
      console.log('✅ Supabase sign out')
      
      // 2. Clear browser storage
      localStorage.clear()
      sessionStorage.clear()
      console.log('✅ Storage cleared')
      
      // 3. Clear auth cookies by setting them to expire
      const cookiesToClear = [
        'sb-ovizewmqyclbebotemwl-auth-token',
        'sb-ovizewmqyclbebotemwl-auth-token-code-verifier',
        'supabase-auth-token',
        'supabase.auth.token'
      ]
      
      cookiesToClear.forEach(cookieName => {
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=localhost`
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`
        console.log(`✅ Cleared cookie: ${cookieName}`)
      })
      
      // 4. Wait for cleanup
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setIsComplete(true)
      console.log('✅ Auth clear complete!')
      
    } catch (error) {
      console.error('❌ Clear error:', error)
    } finally {
      setIsClearing(false)
    }
  }

  const goHome = () => {
    // Force complete reload to ensure clean state
    window.location.href = '/'
  }

  if (isComplete) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center text-green-600 mb-4">
          <CheckCircle className="h-6 w-6 mr-2" />
          <span className="font-semibold">Authentication Cleared!</span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          All auth data has been cleared. You can now try signing in again.
        </p>
        <Button onClick={goHome} className="w-full flex items-center justify-center gap-2">
          <Home className="h-4 w-4" />
          Go to Home & Try Again
        </Button>
      </div>
    )
  }

  return (
    <Button 
      onClick={clearAuth}
      disabled={isClearing}
      variant="destructive"
      className="w-full flex items-center justify-center gap-2"
    >
      <RotateCcw className={`h-4 w-4 ${isClearing ? 'animate-spin' : ''}`} />
      {isClearing ? 'Clearing...' : 'Clear Auth Data'}
    </Button>
  )
}
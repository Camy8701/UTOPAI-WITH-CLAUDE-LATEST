"use client"

import { useState } from 'react'
import { useAuth } from './auth-provider'
import { createClientComponentClient } from '@/lib/supabase'
import { Button } from './ui/button'

export function AuthTestButton() {
  const { user } = useAuth()
  const [testResult, setTestResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  
  const fixSession = async () => {
    setIsLoading(true)
    try {
      console.log('Attempting to fix session...')
      const supabase = createClientComponentClient()
      
      // Get the current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      console.log('Client session check:', {
        hasSession: !!session,
        sessionError: sessionError?.message,
        accessToken: session?.access_token ? 'present' : 'missing'
      })
      
      if (!session) {
        // Try to refresh the session
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession()
        console.log('Client refresh attempt:', {
          success: !!refreshData.session,
          error: refreshError?.message
        })
        
        if (refreshData.session) {
          setTestResult({
            success: true,
            message: 'Session fixed successfully!',
            action: 'refreshed'
          })
          // Trigger a page reload to update the auth state
          window.location.reload()
          return
        }
      }
      
      setTestResult({
        success: session ? true : false,
        message: session ? 'Session is already valid' : 'Could not fix session - please sign in again',
        hasSession: !!session
      })
      
    } catch (error) {
      console.error('Fix session error:', error)
      setTestResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const testAuth = async () => {
    setIsLoading(true)
    try {
      // First, try to refresh the session
      console.log('Attempting session refresh...')
      const refreshResponse = await fetch('/api/auth/refresh-session', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      const refreshData = await refreshResponse.json()
      console.log('Session refresh result:', refreshData)
      
      // Then test the original auth endpoint
      const authResponse = await fetch('/api/test-auth', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      const authData = await authResponse.json()
      
      setTestResult({ 
        refresh: refreshData,
        auth: authData,
        authWorking: authData.authenticated
      })
      console.log('Combined auth test results:', { refreshData, authData })
    } catch (error) {
      console.error('Auth test failed:', error)
      setTestResult({ error: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="p-4 bg-yellow-100 rounded-lg">
        <p className="text-sm text-yellow-800">Please sign in to test authentication</p>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      <div className="bg-blue-100 rounded-lg p-3">
        <h4 className="font-semibold text-blue-800 mb-2">Client Auth Status:</h4>
        <p className="text-sm text-blue-700">
          User ID: {user.id}<br/>
          Email: {user.email}
        </p>
      </div>
      
      <div className="flex gap-2">
        <Button
          onClick={testAuth}
          disabled={isLoading}
          className="flex-1"
        >
          {isLoading ? 'Testing...' : 'Test Server Auth'}
        </Button>
        
        <Button
          onClick={fixSession}
          disabled={isLoading}
          variant="outline"
          className="flex-1"
        >
          {isLoading ? 'Fixing...' : 'Fix Session'}
        </Button>
      </div>
      
      {testResult && (
        <div className={`rounded-lg p-3 ${testResult.authenticated ? 'bg-green-100' : 'bg-red-100'}`}>
          <h4 className={`font-semibold mb-2 ${testResult.authenticated ? 'text-green-800' : 'text-red-800'}`}>
            Server Auth Result:
          </h4>
          <pre className={`text-xs ${testResult.authenticated ? 'text-green-700' : 'text-red-700'}`}>
            {JSON.stringify(testResult, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}
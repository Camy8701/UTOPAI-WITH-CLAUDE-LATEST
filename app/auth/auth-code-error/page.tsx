"use client"

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { AlertCircle, Home, RefreshCw } from 'lucide-react'

export default function AuthCodeErrorPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [description, setDescription] = useState<string | null>(null)

  useEffect(() => {
    setError(searchParams.get('error'))
    setDescription(searchParams.get('description'))
  }, [searchParams])

  const handleRetry = () => {
    // Clear any existing auth state and try again
    if (typeof window !== 'undefined') {
      window.localStorage.clear()
      window.sessionStorage.clear()
    }
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Authentication Error
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            We encountered an issue while signing you in.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">
              Error Details:
            </h3>
            <p className="text-sm text-red-700 dark:text-red-300">
              {error}
            </p>
            {description && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                {description}
              </p>
            )}
          </div>
        )}

        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            This usually happens when:
          </p>
          <ul className="text-sm text-gray-600 dark:text-gray-400 text-left list-disc list-inside space-y-1">
            <li>The authentication process was interrupted</li>
            <li>You denied permission to the application</li>
            <li>There was a network connectivity issue</li>
          </ul>
        </div>

        <div className="mt-8 space-y-3">
          <Button 
            onClick={handleRetry}
            className="w-full flex items-center justify-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => router.push('/')}
            className="w-full flex items-center justify-center gap-2"
          >
            <Home className="h-4 w-4" />
            Go Home
          </Button>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            If this problem persists, please try clearing your browser cache or contact support.
          </p>
        </div>
      </div>
    </div>
  )
}
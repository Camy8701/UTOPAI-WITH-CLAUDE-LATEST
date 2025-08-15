"use client"

import { useAuth } from '@/components/auth-provider'
import { Button } from '@/components/ui/button'

export default function AuthTestPage() {
  const { user, profile, session, loading, signInWithGoogle, signOut } = useAuth()

  const handleSignIn = async () => {
    try {
      console.log('🔄 Attempting sign in...')
      await signInWithGoogle()
      console.log('✅ Sign in completed')
    } catch (error) {
      console.error('❌ Sign in failed:', error)
    }
  }

  const handleSignOut = async () => {
    try {
      console.log('🔄 Attempting sign out...')
      await signOut()
      console.log('✅ Sign out completed')
    } catch (error) {
      console.error('❌ Sign out failed:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading authentication...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          🔧 Authentication Debug Page
        </h1>

        {/* Auth Status */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Current Auth State
          </h2>
          
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <span className="font-medium">Loading:</span>
              <span className={`px-2 py-1 rounded ${loading ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                {loading ? 'Yes' : 'No'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-medium">User:</span>
              <span className={`px-2 py-1 rounded ${user ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {user ? 'Logged In' : 'Not Logged In'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-medium">Session:</span>
              <span className={`px-2 py-1 rounded ${session ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {session ? 'Active' : 'None'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-medium">Profile:</span>
              <span className={`px-2 py-1 rounded ${profile ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {profile ? 'Loaded' : 'Not Loaded'}
              </span>
            </div>
          </div>
        </div>

        {/* User Details */}
        {user && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              User Information
            </h2>
            <div className="space-y-2 text-sm">
              <p><strong>ID:</strong> {user.id}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Created:</strong> {new Date(user.created_at).toLocaleString()}</p>
              <p><strong>Last Sign In:</strong> {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'Never'}</p>
              <p><strong>Provider:</strong> {user.app_metadata?.provider || 'Unknown'}</p>
              <p><strong>Email Confirmed:</strong> {user.email_confirmed_at ? 'Yes' : 'No'}</p>
            </div>

            {user.user_metadata && Object.keys(user.user_metadata).length > 0 && (
              <div className="mt-4">
                <strong>User Metadata:</strong>
                <pre className="mt-2 p-3 bg-gray-100 dark:bg-gray-700 rounded text-xs overflow-auto">
                  {JSON.stringify(user.user_metadata, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Profile Details */}
        {profile && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Profile Information
            </h2>
            <div className="space-y-2 text-sm">
              <p><strong>Full Name:</strong> {profile.full_name || 'Not set'}</p>
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>Avatar URL:</strong> {profile.avatar_url || 'Not set'}</p>
              <p><strong>Google ID:</strong> {profile.google_id || 'Not set'}</p>
              <p><strong>Quiz Points:</strong> {profile.quiz_points}</p>
              <p><strong>Quiz Attempts:</strong> {profile.total_quiz_attempts}</p>
              <p><strong>Created:</strong> {new Date(profile.created_at).toLocaleString()}</p>
              <p><strong>Updated:</strong> {new Date(profile.updated_at).toLocaleString()}</p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Actions
          </h2>
          <div className="flex gap-4">
            {user ? (
              <>
                <Button 
                  onClick={handleSignOut}
                  variant="destructive"
                >
                  Sign Out
                </Button>
                <Button asChild>
                  <a href="/dashboard">Go to Dashboard</a>
                </Button>
              </>
            ) : (
              <Button onClick={handleSignIn}>
                Sign In with Google
              </Button>
            )}
          </div>
        </div>

        {/* Console Logs Helper */}
        <div className="mt-6 bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            💡 Check your browser's developer console (F12) for detailed authentication logs.
          </p>
        </div>
      </div>
    </div>
  )
}
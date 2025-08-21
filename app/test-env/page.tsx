"use client"

export default function TestEnvPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Environment Variables Test</h1>
      
      <div className="space-y-4">
        <div className="p-4 border rounded">
          <h2 className="font-semibold">NEXT_PUBLIC_SUPABASE_URL:</h2>
          <p className="text-sm font-mono bg-gray-100 p-2 rounded mt-2">
            {supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : '❌ NOT FOUND'}
          </p>
          <p className="text-xs text-gray-600 mt-1">
            Status: {supabaseUrl ? '✅ Available' : '❌ Missing'}
          </p>
        </div>

        <div className="p-4 border rounded">
          <h2 className="font-semibold">NEXT_PUBLIC_SUPABASE_ANON_KEY:</h2>
          <p className="text-sm font-mono bg-gray-100 p-2 rounded mt-2">
            {supabaseKey ? `${supabaseKey.substring(0, 30)}...` : '❌ NOT FOUND'}
          </p>
          <p className="text-xs text-gray-600 mt-1">
            Status: {supabaseKey ? '✅ Available' : '❌ Missing'}
          </p>
        </div>

        <div className="p-4 border rounded bg-blue-50">
          <h2 className="font-semibold">Overall Status:</h2>
          <p className="mt-2">
            {supabaseUrl && supabaseKey ? 
              '✅ Environment variables are properly loaded!' : 
              '❌ Environment variables are missing. Check Vercel settings.'
            }
          </p>
        </div>

        <div className="p-4 border rounded bg-gray-50">
          <h2 className="font-semibold">Debug Info:</h2>
          <ul className="text-sm mt-2 space-y-1">
            <li>• Build time: {new Date().toISOString()}</li>
            <li>• Client side: {typeof window !== 'undefined' ? 'Yes' : 'No'}</li>
            <li>• Node env: {process.env.NODE_ENV}</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
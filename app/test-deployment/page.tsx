"use client"

import { useEffect, useState } from 'react'

export default function TestDeployment() {
  const [info, setInfo] = useState<any>({})
  const [timestamp] = useState(() => new Date().toISOString())

  useEffect(() => {
    setInfo({
      timestamp,
      url: window.location.href,
      hostname: window.location.hostname,
      userAgent: navigator.userAgent.substring(0, 100),
      deploymentId: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || 'local',
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      supabaseUrlPrefix: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) || 'missing'
    })
  }, [timestamp])

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Deployment Test Page
        </h1>
        
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Deployment Information
          </h2>
          
          <div className="space-y-2 font-mono text-sm">
            <div><span className="font-bold">Page Generated:</span> {info.timestamp}</div>
            <div><span className="font-bold">URL:</span> {info.url}</div>
            <div><span className="font-bold">Hostname:</span> {info.hostname}</div>
            <div><span className="font-bold">Deployment ID:</span> {info.deploymentId}</div>
            <div><span className="font-bold">Has Supabase URL:</span> {info.hasSupabaseUrl ? '✅ Yes' : '❌ No'}</div>
            <div><span className="font-bold">Has Supabase Key:</span> {info.hasSupabaseKey ? '✅ Yes' : '❌ No'}</div>
            <div><span className="font-bold">Supabase URL Preview:</span> {info.supabaseUrlPrefix}...</div>
          </div>
        </div>

        <div className="mt-6 bg-blue-100 dark:bg-blue-900/20 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-blue-900 dark:text-blue-100">
            Latest Commit Should Be: 9eab802
          </h2>
          <p className="text-blue-800 dark:text-blue-200">
            If the deployment ID above doesn't start with "9eab802", then Vercel is not deploying 
            the latest code. Check your Vercel dashboard and make sure:
          </p>
          <ul className="list-disc list-inside mt-2 text-blue-800 dark:text-blue-200">
            <li>Connected to the correct GitHub repository</li>
            <li>Using the "main" branch</li>
            <li>Environment variables are properly set</li>
            <li>Force a new deployment without using build cache</li>
          </ul>
        </div>

        <div className="mt-6">
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Back to Homepage
          </button>
        </div>
      </div>
    </div>
  )
}
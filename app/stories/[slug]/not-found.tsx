import Link from "next/link"
import { ArrowLeft, BookOpen } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex flex-col items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <BookOpen className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-600" />
        </div>
        
        <h1 className="text-2xl font-bold mb-4 dark:text-white">Story Not Found</h1>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The story you're looking for doesn't exist or may have been moved. 
          Check out our other amazing AI stories instead!
        </p>
        
        <div className="space-y-3">
          <Link 
            href="/" 
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md inline-flex items-center justify-center w-full transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          
          <Link 
            href="/collections" 
            className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-6 py-2 rounded-md inline-flex items-center justify-center w-full transition-colors"
          >
            Browse All Stories
          </Link>
        </div>
      </div>
    </div>
  )
}
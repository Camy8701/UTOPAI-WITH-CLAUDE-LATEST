"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Heart, Bookmark, Share2, Eye, User, Calendar, Clock } from "lucide-react"
import { useActivity, type Activity } from "@/components/activity-context"
import { formatDistanceToNow } from "date-fns"

const getActivityIcon = (type: Activity["type"]) => {
  switch (type) {
    case "story_liked":
      return <Heart className="h-5 w-5 text-red-500" />
    case "story_unliked":
      return <Heart className="h-5 w-5 text-gray-400" />
    case "story_saved":
      return <Bookmark className="h-5 w-5 text-blue-500" />
    case "story_unsaved":
      return <Bookmark className="h-5 w-5 text-gray-400" />
    case "story_shared":
      return <Share2 className="h-5 w-5 text-green-500" />
    case "story_read":
      return <Eye className="h-5 w-5 text-purple-500" />
    case "profile_updated":
      return <User className="h-5 w-5 text-orange-500" />
    case "login":
      return <Calendar className="h-5 w-5 text-blue-600" />
    case "signup":
      return <User className="h-5 w-5 text-green-600" />
    default:
      return <Clock className="h-5 w-5 text-gray-400" />
  }
}


export default function ActivitiesPage() {
  const [mounted, setMounted] = useState(false)
  const { getRecentActivities } = useActivity()
  const [activities, setActivities] = useState<Activity[]>([])

  useEffect(() => {
    setMounted(true)
    // Get recent activities (up to 50)
    const recentActivities = getRecentActivities(50)
    setActivities(recentActivities)
  }, [getRecentActivities])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Your Activities</h1>
          <p className="text-gray-600 dark:text-gray-400">Track your interactions and engagement across the platform</p>
        </div>

        {activities.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-12 text-center">
            <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Activities Yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start exploring stories, taking quizzes, and engaging with content to see your activities here.
            </p>
            <motion.button
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => (window.location.href = "/")}
            >
              Explore Content
            </motion.button>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">{getActivityIcon(activity.type)}</div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-gray-900 dark:text-white font-medium">{activity.title}</p>
                        <p className="text-gray-700 dark:text-gray-300 mt-1">{activity.description}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                          {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                        </p>
                      </div>

                      {activity.metadata?.storyImage && (
                        <div className="flex-shrink-0 ml-4">
                          <img
                            src={activity.metadata.storyImage || "/placeholder.svg"}
                            alt={activity.metadata.storyTitle || "Activity item"}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        </div>
                      )}
                    </div>

                    {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                      <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-xs text-gray-600 dark:text-gray-400">Additional details:</p>
                        <pre className="text-xs text-gray-700 dark:text-gray-300 mt-1 whitespace-pre-wrap">
                          {JSON.stringify(activity.metadata, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {activities.length >= 50 && (
              <div className="text-center py-6">
                <p className="text-gray-500 dark:text-gray-400 text-sm">Showing your 50 most recent activities</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

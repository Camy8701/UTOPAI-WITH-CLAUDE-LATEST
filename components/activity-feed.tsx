"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, Bookmark, Share2, BookOpen, User, LogIn, UserPlus, Clock, Filter, ChevronDown } from "lucide-react"
import Image from "next/image"
import { useActivity, type Activity } from "./activity-context"

type ActivityType = Activity['type']

const activityIcons: Record<ActivityType, React.ComponentType<any>> = {
  story_liked: Heart,
  story_unliked: Heart,
  story_saved: Bookmark,
  story_unsaved: Bookmark,
  story_shared: Share2,
  story_read: BookOpen,
  profile_updated: User,
  login: LogIn,
  signup: UserPlus,
}

const activityColors: Record<ActivityType, string> = {
  story_liked: "text-red-500 bg-red-50 dark:bg-red-900/20",
  story_unliked: "text-gray-500 bg-gray-50 dark:bg-gray-800",
  story_saved: "text-blue-500 bg-blue-50 dark:bg-blue-900/20",
  story_unsaved: "text-gray-500 bg-gray-50 dark:bg-gray-800",
  story_shared: "text-green-500 bg-green-50 dark:bg-green-900/20",
  story_read: "text-purple-500 bg-purple-50 dark:bg-purple-900/20",
  profile_updated: "text-orange-500 bg-orange-50 dark:bg-orange-900/20",
  login: "text-blue-600 bg-blue-50 dark:bg-blue-900/20",
  signup: "text-green-600 bg-green-50 dark:bg-green-900/20",
}

function ActivityItem({ activity }: { activity: Activity }) {
  const Icon = activityIcons[activity.type]
  const colorClass = activityColors[activity.type]

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const activityTime = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - activityTime.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`

    return activityTime.toLocaleDateString()
  }

  return (
    <motion.div
      className="flex items-start gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className={`p-2 rounded-full ${colorClass}`}>
        <Icon className="h-4 w-4" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">{activity.title}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{activity.description}</p>

            {activity.metadata?.storyImage && (
              <div className="mt-3 flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                  <Image
                    src={activity.metadata.storyImage || "/placeholder.svg"}
                    alt={activity.metadata.storyTitle || "Story"}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {activity.metadata.storyTitle}
                  </p>
                  {activity.metadata.platform && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">Shared on {activity.metadata.platform}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 ml-3">
            <Clock className="h-3 w-3" />
            <span>{formatTimeAgo(activity.timestamp)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

interface ActivityFeedProps {
  limit?: number
  showFilter?: boolean
  className?: string
}

export default function ActivityFeed({ limit = 10, showFilter = true, className = "" }: ActivityFeedProps) {
  const { activities, getRecentActivities, getActivitiesByType } = useActivity()
  const [selectedFilter, setSelectedFilter] = useState<ActivityType | "all">("all")
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)

  const filterOptions: { value: ActivityType | "all"; label: string }[] = [
    { value: "all", label: "All Activities" },
    { value: "story_liked", label: "Liked Stories" },
    { value: "story_saved", label: "Saved Stories" },
    { value: "story_shared", label: "Shared Stories" },
    { value: "story_read", label: "Read Stories" },
    { value: "profile_updated", label: "Profile Updates" },
    { value: "login", label: "Login Activities" },
  ]

  const getFilteredActivities = () => {
    if (selectedFilter === "all") {
      return getRecentActivities(limit)
    }
    return getActivitiesByType(selectedFilter).slice(0, limit)
  }

  const filteredActivities = getFilteredActivities()

  if (activities.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No activities yet</h3>
        <p className="text-gray-500 dark:text-gray-400">
          Start exploring and interacting with stories to see your activity here.
        </p>
      </div>
    )
  }

  return (
    <div className={className}>
      {showFilter && (
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>

          <div className="relative">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-white"
            >
              <Filter className="h-4 w-4" />
              <span>{filterOptions.find((opt) => opt.value === selectedFilter)?.label}</span>
              <ChevronDown className="h-4 w-4" />
            </button>

            <AnimatePresence>
              {showFilterDropdown && (
                <motion.div
                  className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {filterOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSelectedFilter(option.value)
                        setShowFilterDropdown(false)
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 ${
                        selectedFilter === option.value
                          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredActivities.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </AnimatePresence>
      </div>

      {filteredActivities.length === 0 && selectedFilter !== "all" && (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            No {filterOptions.find((opt) => opt.value === selectedFilter)?.label.toLowerCase()} found.
          </p>
        </div>
      )}
    </div>
  )
}

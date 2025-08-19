"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export interface Activity {
  id: string
  type: "story_liked" | "story_unliked" | "story_saved" | "story_unsaved" | "story_shared" | "story_read" | "profile_updated" | "login" | "signup"
  title: string
  description: string
  timestamp: string
  metadata?: {
    storyImage?: string
    storyTitle?: string
    platform?: string
  }
}

interface ActivityContextType {
  activities: Activity[]
  addActivity: (activity: Omit<Activity, "id" | "timestamp">) => void
  getRecentActivities: (limit?: number) => Activity[]
  getActivitiesByType: (type: Activity['type']) => Activity[]
  clearActivities: () => void
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined)

export function useActivity() {
  const context = useContext(ActivityContext)
  if (context === undefined) {
    throw new Error("useActivity must be used within an ActivityProvider")
  }
  return context
}

export function ActivityProvider({ children }: { children: ReactNode }) {
  const [activities, setActivities] = useState<Activity[]>([])

  const addActivity = (activity: Omit<Activity, "id" | "timestamp">) => {
    const newActivity: Activity = {
      ...activity,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
    }

    setActivities((prev) => [newActivity, ...prev].slice(0, 100)) // Keep only last 100 activities
  }

  const getRecentActivities = (limit = 10) => {
    return activities.slice(0, limit)
  }

  const getActivitiesByType = (type: Activity['type']) => {
    return activities.filter(activity => activity.type === type)
  }

  const clearActivities = () => {
    setActivities([])
  }

  const value: ActivityContextType = {
    activities,
    addActivity,
    getRecentActivities,
    getActivitiesByType,
    clearActivities,
  }

  return <ActivityContext.Provider value={value}>{children}</ActivityContext.Provider>
}

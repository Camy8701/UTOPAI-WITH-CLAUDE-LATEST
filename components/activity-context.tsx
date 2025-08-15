"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export interface Activity {
  id: string
  type: "liked" | "saved" | "shared" | "read" | "profile_updated" | "login"
  itemId?: string
  itemTitle?: string
  itemImage?: string
  timestamp: Date
  metadata?: Record<string, any>
}

interface ActivityContextType {
  activities: Activity[]
  addActivity: (activity: Omit<Activity, "id" | "timestamp">) => void
  getRecentActivities: (limit?: number) => Activity[]
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
      timestamp: new Date(),
    }

    setActivities((prev) => [newActivity, ...prev].slice(0, 100)) // Keep only last 100 activities
  }

  const getRecentActivities = (limit = 10) => {
    return activities.slice(0, limit)
  }

  const clearActivities = () => {
    setActivities([])
  }

  const value: ActivityContextType = {
    activities,
    addActivity,
    getRecentActivities,
    clearActivities,
  }

  return <ActivityContext.Provider value={value}>{children}</ActivityContext.Provider>
}

"use client"

import type React from "react"

import { Clock, User, FileText, MessageSquare, BookOpen, Shield } from "lucide-react"

interface Activity {
  id: string
  action: string
  user: string
  time: string
  icon: React.ElementType
  iconColor: string
}

export function RecentActivities() {
  const activities: Activity[] = [
    {
      id: "1",
      action: "New user registered",
      user: "john@example.com",
      time: "2 minutes ago",
      icon: User,
      iconColor: "text-blue-600",
    },
    {
      id: "2",
      action: "Story submitted for review",
      user: "writer@utopai.com",
      time: "15 minutes ago",
      icon: BookOpen,
      iconColor: "text-purple-600",
    },
    {
      id: "3",
      action: "Comment moderated",
      user: "moderator@utopai.com",
      time: "1 hour ago",
      icon: MessageSquare,
      iconColor: "text-orange-600",
    },
    {
      id: "4",
      action: "New post published",
      user: "editor@utopai.com",
      time: "2 hours ago",
      icon: FileText,
      iconColor: "text-green-600",
    },
    {
      id: "5",
      action: "Security settings updated",
      user: "admin@utopai.com",
      time: "3 hours ago",
      icon: Shield,
      iconColor: "text-red-600",
    },
  ]

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <div className={`p-2 rounded-full bg-gray-100 dark:bg-gray-800 ${activity.iconColor}`}>
            <activity.icon className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm">{activity.action}</p>
            <p className="text-xs text-muted-foreground">{activity.user}</p>
          </div>
          <div className="flex items-center text-xs text-muted-foreground whitespace-nowrap">
            <Clock className="w-3 h-3 mr-1" />
            {activity.time}
          </div>
        </div>
      ))}
    </div>
  )
}

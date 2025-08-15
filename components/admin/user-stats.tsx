"use client"

import { Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAdminDashboardData } from "@/hooks/use-admin-dashboard-data"

/**
 * Simple card that displays basic user metrics.
 * Consumed inside /app/admin/page.tsx.
 */
export function UserStats() {
  const { userStats } = useAdminDashboardData()

  if (!userStats) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-muted-foreground">Loading user stats…</CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">User Stats</CardTitle>
        <div className="rounded-full bg-green-100 p-2 text-green-600 dark:bg-green-900/30 dark:text-green-400">
          <Users className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-xl font-bold">{userStats.totalUsers.toLocaleString()}</p>
        <CardDescription>Total registered users</CardDescription>

        <div className="grid grid-cols-2 gap-4 pt-2 text-sm">
          <div>
            <p className="font-medium">{userStats.activeUsers.toLocaleString()}</p>
            <p className="text-muted-foreground">Active users</p>
          </div>
          <div>
            <p className="font-medium">{userStats.newUsersThisMonth.toLocaleString()}</p>
            <p className="text-muted-foreground">New this month</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { useEffect, useState } from "react"
import { adminDataService, type UserStatsResponse, type ContentStatsResponse } from "@/lib/admin-data-service"

/**
 * Small client-side hook that loads admin-dashboard metrics.
 * Currently fetches mock data from lib/admin-data-service.
 */
export function useAdminDashboardData() {
  const [userStats, setUserStats] = useState<UserStatsResponse | null>(null)
  const [contentStats, setContentStats] = useState<ContentStatsResponse | null>(null)

  useEffect(() => {
    let isMounted = true
    ;(async () => {
      const [u, c] = await Promise.all([adminDataService.fetchUserStats(), adminDataService.fetchContentStats()])
      if (isMounted) {
        setUserStats(u)
        setContentStats(c)
      }
    })()
    return () => {
      isMounted = false
    }
  }, [])

  return { userStats, contentStats }
}

export function useUserStats() {
  const { userStats } = useAdminDashboardData()
  return userStats
}

export function useContentStats() {
  const { contentStats } = useAdminDashboardData()
  return contentStats
}

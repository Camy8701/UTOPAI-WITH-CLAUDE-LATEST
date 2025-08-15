/**
 * A minimal data-service layer for the admin dashboard.
 * Swap the mocked data for real fetch/DB queries when needed.
 */

export interface UserStatsResponse {
  totalUsers: number
  activeUsers: number
  newUsersThisMonth: number
}

export interface ContentStatsResponse {
  totalPosts: number
  publishedPosts: number
  drafts: number
}

export async function fetchUserStats(): Promise<UserStatsResponse> {
  // TODO: replace with real API/database call
  return {
    totalUsers: 2847,
    activeUsers: 1994,
    newUsersThisMonth: 312,
  }
}

export async function fetchContentStats(): Promise<ContentStatsResponse> {
  // TODO: replace with real API/database call
  return {
    totalPosts: 642,
    publishedPosts: 587,
    drafts: 55,
  }
}

export const adminDataService = {
  fetchUserStats,
  fetchContentStats,
}

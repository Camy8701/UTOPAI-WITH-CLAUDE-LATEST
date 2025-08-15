"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type UserProfile = {
  id: string
  name: string
  email: string
  avatar?: string
  joinDate: string
  quizPoints: number
  weeklyQuizPoints: number
  totalQuizzesCompleted: number
  bestWeeklyScore: number
}

type FavoriteItem = {
  id: string
  title: string
  image: string
  type: "story" | "article" | "collection"
  dateAdded: string
}

type LikedItem = {
  id: string
  count: number
  userLiked: boolean
}

type QuizResult = {
  id: string
  score: number
  totalQuestions: number
  pointsEarned: number
  completedAt: string
  weekNumber: number
  year: number
}

type LeaderboardEntry = {
  userId: string
  name: string
  avatar?: string
  weeklyPoints: number
  totalPoints: number
  rank: number
}

type UserContextType = {
  profile: UserProfile | null
  favorites: FavoriteItem[]
  likes: { [key: string]: LikedItem }
  quizHistory: QuizResult[]
  weeklyLeaderboard: LeaderboardEntry[]
  addToFavorites: (item: Omit<FavoriteItem, "dateAdded">) => void
  removeFromFavorites: (id: string) => void
  isFavorite: (id: string) => boolean
  toggleLike: (id: string) => void
  getLikeCount: (id: string) => number
  isLiked: (id: string) => boolean
  updateProfile: (profile: UserProfile) => void
  addQuizResult: (score: number, totalQuestions: number) => void
  getWeeklyRank: () => number
  clearUserData: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

// Helper function to get current week number
function getWeekNumber(date: Date): { week: number; year: number } {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000
  const week = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
  return { week, year: date.getFullYear() }
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])
  const [likes, setLikes] = useState<{ [key: string]: LikedItem }>({})
  const [quizHistory, setQuizHistory] = useState<QuizResult[]>([])
  const [weeklyLeaderboard, setWeeklyLeaderboard] = useState<LeaderboardEntry[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Load user data from localStorage
    const savedProfile = localStorage.getItem("userProfile")
    const savedFavorites = localStorage.getItem("userFavorites")
    const savedLikes = localStorage.getItem("userLikes")
    const savedQuizHistory = localStorage.getItem("quizHistory")
    const savedLeaderboard = localStorage.getItem("weeklyLeaderboard")
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
    const profileCompleted = localStorage.getItem("profileCompleted") === "true"

    if (isLoggedIn && savedProfile && profileCompleted) {
      const profileData = JSON.parse(savedProfile)
      // Ensure quiz-related fields exist
      if (!profileData.quizPoints) profileData.quizPoints = 0
      if (!profileData.weeklyQuizPoints) profileData.weeklyQuizPoints = 0
      if (!profileData.totalQuizzesCompleted) profileData.totalQuizzesCompleted = 0
      if (!profileData.bestWeeklyScore) profileData.bestWeeklyScore = 0
      setProfile(profileData)
    }
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
    if (savedLikes) {
      setLikes(JSON.parse(savedLikes))
    } else {
      // Initialize with empty like counts (no dummy data)
      const defaultLikes = {}
      setLikes(defaultLikes)
      localStorage.setItem("userLikes", JSON.stringify(defaultLikes))
    }
    if (savedQuizHistory) {
      setQuizHistory(JSON.parse(savedQuizHistory))
    }
    if (savedLeaderboard) {
      setWeeklyLeaderboard(JSON.parse(savedLeaderboard))
    } else {
      // Initialize with empty leaderboard (no dummy data)
      const emptyLeaderboard: LeaderboardEntry[] = []
      setWeeklyLeaderboard(emptyLeaderboard)
      localStorage.setItem("weeklyLeaderboard", JSON.stringify(emptyLeaderboard))
    }
  }, [])

  useEffect(() => {
    if (mounted && profile) {
      localStorage.setItem("userProfile", JSON.stringify(profile))
    }
  }, [profile, mounted])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("userFavorites", JSON.stringify(favorites))
    }
  }, [favorites, mounted])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("userLikes", JSON.stringify(likes))
    }
  }, [likes, mounted])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("quizHistory", JSON.stringify(quizHistory))
    }
  }, [quizHistory, mounted])

  const addToFavorites = (item: Omit<FavoriteItem, "dateAdded">) => {
    const newFavorite: FavoriteItem = {
      ...item,
      dateAdded: new Date().toISOString(),
    }
    setFavorites((prev) => [...prev.filter((fav) => fav.id !== item.id), newFavorite])
  }

  const removeFromFavorites = (id: string) => {
    setFavorites((prev) => prev.filter((fav) => fav.id !== id))
  }

  const isFavorite = (id: string) => {
    return favorites.some((fav) => fav.id === id)
  }

  const toggleLike = (id: string) => {
    setLikes((prev) => {
      const current = prev[id] || { id, count: 0, userLiked: false }
      const newCount = current.userLiked ? current.count - 1 : current.count + 1
      return {
        ...prev,
        [id]: {
          ...current,
          count: Math.max(0, newCount),
          userLiked: !current.userLiked,
        },
      }
    })
  }

  const getLikeCount = (id: string) => {
    return likes[id]?.count || 0
  }

  const isLiked = (id: string) => {
    return likes[id]?.userLiked || false
  }

  const addQuizResult = (score: number, totalQuestions: number) => {
    if (!profile) return

    const now = new Date()
    const { week, year } = getWeekNumber(now)
    const pointsEarned = score * 10 // 10 points per correct answer

    const newQuizResult: QuizResult = {
      id: `quiz-${Date.now()}`,
      score,
      totalQuestions,
      pointsEarned,
      completedAt: now.toISOString(),
      weekNumber: week,
      year,
    }

    setQuizHistory((prev) => [...prev, newQuizResult])

    // Update user profile with new points
    setProfile((prev) => {
      if (!prev) return null

      const newWeeklyPoints = prev.weeklyQuizPoints + pointsEarned
      return {
        ...prev,
        quizPoints: prev.quizPoints + pointsEarned,
        weeklyQuizPoints: newWeeklyPoints,
        totalQuizzesCompleted: prev.totalQuizzesCompleted + 1,
        bestWeeklyScore: Math.max(prev.bestWeeklyScore, newWeeklyPoints),
      }
    })

    // Update leaderboard - use current profile state
    const currentProfile = profile
    setWeeklyLeaderboard((prev) => {
      const userIndex = prev.findIndex((entry) => entry.userId === currentProfile.id)
      let newLeaderboard = [...prev]

      if (userIndex >= 0) {
        // Update existing user
        newLeaderboard[userIndex] = {
          ...newLeaderboard[userIndex],
          weeklyPoints: newLeaderboard[userIndex].weeklyPoints + pointsEarned,
          totalPoints: newLeaderboard[userIndex].totalPoints + pointsEarned,
        }
      } else {
        // Add new user to leaderboard
        newLeaderboard.push({
          userId: currentProfile.id,
          name: currentProfile.name,
          avatar: currentProfile.avatar,
          weeklyPoints: pointsEarned,
          totalPoints: pointsEarned,
          rank: 0, // Will be calculated below
        })
      }

      // Sort by weekly points and update ranks
      newLeaderboard.sort((a, b) => b.weeklyPoints - a.weeklyPoints)
      newLeaderboard = newLeaderboard.map((entry, index) => ({
        ...entry,
        rank: index + 1,
      }))

      localStorage.setItem("weeklyLeaderboard", JSON.stringify(newLeaderboard))
      return newLeaderboard
    })
  }

  const getWeeklyRank = () => {
    if (!profile) return 0
    const userEntry = weeklyLeaderboard.find((entry) => entry.userId === profile.id)
    return userEntry?.rank || 0
  }

  const updateProfile = (newProfile: UserProfile) => {
    setProfile(newProfile)
    localStorage.setItem("userProfile", JSON.stringify(newProfile))
    localStorage.setItem("profileCompleted", "true")
    localStorage.setItem("isLoggedIn", "true") // Ensure login status is maintained
  }

  const clearUserData = () => {
    setProfile(null)
    setFavorites([])
    setQuizHistory([])
    localStorage.removeItem("userProfile")
    localStorage.removeItem("userFavorites")
    localStorage.removeItem("quizHistory")
    localStorage.removeItem("profileCompleted") // Clear the completion flag
    localStorage.removeItem("isLoggedIn") // Clear login status
    // Keep likes but reset user's liked status
    const resetLikes = Object.fromEntries(
      Object.entries(likes).map(([key, value]) => [key, { ...value, userLiked: false }]),
    )
    setLikes(resetLikes)
    localStorage.setItem("userLikes", JSON.stringify(resetLikes))
  }

  return (
    <UserContext.Provider
      value={{
        profile,
        favorites,
        likes,
        quizHistory,
        weeklyLeaderboard,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        toggleLike,
        getLikeCount,
        isLiked,
        updateProfile,
        addQuizResult,
        getWeeklyRank,
        clearUserData,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}

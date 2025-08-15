"use client"

import { useEffect, useState } from 'react'
import { useAuth } from './auth-provider'

interface ProfileButtonMonitorProps {
  onFailureDetected: () => void
}

export function ProfileButtonMonitor({ onFailureDetected }: ProfileButtonMonitorProps) {
  const { user } = useAuth()
  const [clickAttempts, setClickAttempts] = useState(0)
  const [lastClickTime, setLastClickTime] = useState<number>(0)

  useEffect(() => {
    if (!user) return

    // Monitor for failed navigation attempts
    const handleProfileButtonClick = () => {
      const now = Date.now()
      setLastClickTime(now)
      setClickAttempts(prev => prev + 1)

      // If user clicks multiple times in short succession, might indicate a problem
      if (clickAttempts >= 2 && now - lastClickTime < 3000) {
        console.warn('🚨 Profile button seems unresponsive, triggering backup')
        onFailureDetected()
      }
    }

    // Listen for clicks on profile button
    const profileButton = document.querySelector('[data-testid="profile-button"]')
    if (profileButton) {
      profileButton.addEventListener('click', handleProfileButtonClick)
      
      return () => {
        profileButton.removeEventListener('click', handleProfileButtonClick)
      }
    }

    // Reset click attempts after 5 seconds
    const resetTimer = setTimeout(() => {
      setClickAttempts(0)
    }, 5000)

    return () => clearTimeout(resetTimer)
  }, [user, clickAttempts, lastClickTime, onFailureDetected])

  // Monitor for navigation failures
  useEffect(() => {
    const checkForNavigationFailure = () => {
      // If we're still on the same page after a click attempt, something went wrong
      if (clickAttempts > 0 && window.location.pathname !== '/dashboard') {
        const timeSinceClick = Date.now() - lastClickTime
        if (timeSinceClick > 2000) { // 2 seconds should be enough for navigation
          console.warn('🚨 Navigation to dashboard failed, triggering backup')
          onFailureDetected()
        }
      }
    }

    const interval = setInterval(checkForNavigationFailure, 1000)
    return () => clearInterval(interval)
  }, [clickAttempts, lastClickTime, onFailureDetected])

  return null // This is a monitoring component, no UI
}
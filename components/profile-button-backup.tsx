"use client"

import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useFirebaseAuth } from './firebase-auth-provider'

export function ProfileButtonBackup() {
  const { user, profile } = useFirebaseAuth()
  
  if (!user) return null
  
  const displayName = profile?.full_name || user.email?.split('@')[0] || 'User'
  const initials = displayName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <Link
      href="/dashboard"
      className="relative h-8 w-8 rounded-full cursor-pointer hover:ring-2 hover:ring-red-500 hover:ring-offset-2 transition-all block"
      title={`Go to Dashboard - ${displayName} (Backup)`}
    >
      <Avatar className="h-8 w-8">
        <AvatarImage 
          src={profile?.avatar_url || undefined} 
          alt={displayName}
        />
        <AvatarFallback className="bg-red-600 text-white text-xs font-semibold">
          {initials}
        </AvatarFallback>
      </Avatar>
    </Link>
  )
}
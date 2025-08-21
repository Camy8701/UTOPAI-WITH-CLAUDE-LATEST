"use client"

import type { ReactNode } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { UserProvider } from "@/components/user-context"
import { FirebaseAuthProvider } from "@/components/firebase-auth-provider"
import { ActivityProvider } from "@/components/activity-context"
import { Toaster } from "@/components/ui/toaster"

/**
 * Global providers for Theme, User context, Auth, Toasts, etc.
 * Add any other top-level providers here as your project grows.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <FirebaseAuthProvider>
        <UserProvider>
          <ActivityProvider>
            {children}
            {/* Global toast portal */}
            <Toaster />
          </ActivityProvider>
        </UserProvider>
      </FirebaseAuthProvider>
    </ThemeProvider>
  )
}

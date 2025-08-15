"use client"

/**
 * Minimal ‟no-auth” replacement.
 * Provides a stubbed `useAuth` hook and an optional `<AuthProvider/>`
 * so that any legacy imports continue to work even though
 * log-in / sign-up has been removed.
 */

import type React from "react"
import { createContext, useContext } from "react"

type User = {
  id?: string
  name?: string
  provider?: string
}

interface AuthContextValue {
  isLoggedIn: boolean
  user: User | null
}

const AuthContext = createContext<AuthContextValue>({
  isLoggedIn: false,
  user: null,
})

/**
 * Dummy provider – just returns a fixed, logged-out state.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <AuthContext.Provider value={{ isLoggedIn: false, user: null }}>{children}</AuthContext.Provider>
}

/**
 * Stub hook used throughout the code-base.
 * Always reports “logged out”.
 */
export function useAuth() {
  return useContext(AuthContext)
}

"use client"

import { AdminAuthProvider as AdminAuthContextProvider } from "@/components/admin-auth-context"
import type { ReactNode } from "react"

interface AdminAuthProviderProps {
  children: ReactNode
}

export function AdminAuthProvider({ children }: AdminAuthProviderProps) {
  return <AdminAuthContextProvider>{children}</AdminAuthContextProvider>
}

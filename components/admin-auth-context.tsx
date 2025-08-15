"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { Lock } from "lucide-react"

export type AdminRole = "super_admin" | "admin" | "editor" | "moderator"

export interface AdminUser {
  id: string
  email: string
  name: string
  role: AdminRole
  avatar?: string
  permissions: string[]
  lastLogin?: string
  isActive: boolean
  createdAt: string
}

export interface AdminPermissions {
  // Content Management
  "content.create": boolean
  "content.edit": boolean
  "content.delete": boolean
  "content.publish": boolean
  "content.moderate": boolean
  "content.schedule": boolean

  // User Management
  "users.view": boolean
  "users.edit": boolean
  "users.delete": boolean
  "users.ban": boolean

  // Admin Management
  "admin.view": boolean
  "admin.create": boolean
  "admin.edit": boolean
  "admin.delete": boolean

  // System Settings
  "settings.view": boolean
  "settings.edit": boolean
  "settings.backup": boolean

  // Analytics
  "analytics.view": boolean
  "analytics.export": boolean

  // Media
  "media.upload": boolean
  "media.delete": boolean
  "media.manage": boolean

  // Stories
  "stories.view": boolean
  "stories.approve": boolean
  "stories.reject": boolean
  "stories.edit": boolean
}

interface AdminAuthContextType {
  adminUser: AdminUser | null
  isAdminLoggedIn: boolean
  isAuthenticated: boolean
  adminLogin: (
    email: string,
    password: string,
    twoFactorCode?: string,
  ) => Promise<{ success: boolean; requiresTwoFactor?: boolean; error?: string }>
  adminLogout: () => void
  hasPermission: (permission: keyof AdminPermissions) => boolean
  hasRole: (role: AdminRole | AdminRole[]) => boolean
  isLoading: boolean
  refreshAdminUser: () => Promise<void>
  updateAdminProfile: (updates: Partial<AdminUser>) => Promise<boolean>
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

// Role-based permissions mapping
const ROLE_PERMISSIONS: Record<AdminRole, (keyof AdminPermissions)[]> = {
  super_admin: [
    "content.create",
    "content.edit",
    "content.delete",
    "content.publish",
    "content.moderate",
    "content.schedule",
    "users.view",
    "users.edit",
    "users.delete",
    "users.ban",
    "admin.view",
    "admin.create",
    "admin.edit",
    "admin.delete",
    "settings.view",
    "settings.edit",
    "settings.backup",
    "analytics.view",
    "analytics.export",
    "media.upload",
    "media.delete",
    "media.manage",
    "stories.view",
    "stories.approve",
    "stories.reject",
    "stories.edit",
  ],
  admin: [
    "content.create",
    "content.edit",
    "content.delete",
    "content.publish",
    "content.moderate",
    "content.schedule",
    "users.view",
    "users.edit",
    "users.ban",
    "admin.view",
    "admin.create",
    "admin.edit",
    "settings.view",
    "settings.edit",
    "analytics.view",
    "analytics.export",
    "media.upload",
    "media.delete",
    "media.manage",
    "stories.view",
    "stories.approve",
    "stories.reject",
    "stories.edit",
  ],
  editor: [
    "content.create",
    "content.edit",
    "content.publish",
    "content.moderate",
    "content.schedule",
    "users.view",
    "admin.view",
    "settings.view",
    "analytics.view",
    "media.upload",
    "media.manage",
    "stories.view",
    "stories.approve",
    "stories.reject",
    "stories.edit",
  ],
  moderator: [
    "content.moderate",
    "users.view",
    "users.ban",
    "admin.view",
    "settings.view",
    "analytics.view",
    "media.upload",
    "stories.view",
    "stories.approve",
    "stories.reject",
  ],
}

// Admin credentials with the specified email
const ADMIN_CREDENTIALS = {
  "panappworld@gmail.com": {
    password: "Admin123!",
    role: "super_admin" as AdminRole,
    name: "Super Admin",
    twoFactor: null,
    description: "Full system access with all permissions",
  },
  "editor@utopai.com": {
    password: "editor123",
    role: "editor" as AdminRole,
    name: "Content Editor",
    twoFactor: null,
    description: "Content management and basic analytics",
  },
  "moderator@utopai.com": {
    password: "moderator123",
    role: "moderator" as AdminRole,
    name: "Content Moderator",
    twoFactor: null,
    description: "Content moderation and basic analytics",
  },
}

// Mock admin users for demonstration
const MOCK_ADMIN_USERS: AdminUser[] = Object.entries(ADMIN_CREDENTIALS).map(([email, cred], index) => ({
  id: `admin-${index + 1}`,
  email,
  name: cred.name,
  role: cred.role,
  permissions: ROLE_PERMISSIONS[cred.role],
  isActive: true,
  createdAt: "2024-01-01T00:00:00Z",
  lastLogin: new Date().toISOString(),
}))

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider")
  }
  return context
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null)
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Load admin user from localStorage on mount
  useEffect(() => {
    const loadAdminUser = () => {
      try {
        const savedAdminUser = localStorage.getItem("adminUser")
        const savedAdminLoginStatus = localStorage.getItem("isAdminLoggedIn") === "true"
        const adminSessionExpiry = localStorage.getItem("adminSessionExpiry")

        if (savedAdminUser && savedAdminLoginStatus && adminSessionExpiry) {
          const expiryTime = new Date(adminSessionExpiry)
          const now = new Date()

          if (now < expiryTime) {
            const userData = JSON.parse(savedAdminUser)
            setAdminUser(userData)
            setIsAdminLoggedIn(true)
          } else {
            // Session expired
            adminLogout()
          }
        }
      } catch (error) {
        console.error("Error loading admin user:", error)
        adminLogout()
      } finally {
        setIsLoading(false)
      }
    }

    loadAdminUser()
  }, [])

  const adminLogin = async (
    email: string,
    password: string,
    twoFactorCode?: string,
  ): Promise<{ success: boolean; requiresTwoFactor?: boolean; error?: string }> => {
    try {
      setIsLoading(true)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Find admin user
      const foundAdmin = MOCK_ADMIN_USERS.find(
        (admin) => admin.email.toLowerCase() === email.toLowerCase() && admin.isActive,
      )

      if (!foundAdmin) {
        return { success: false, error: "Invalid credentials or account not found" }
      }

      // Validate credentials
      const credentials = ADMIN_CREDENTIALS[email as keyof typeof ADMIN_CREDENTIALS]
      if (!credentials || password !== credentials.password) {
        return { success: false, error: "Invalid credentials" }
      }

      // Check 2FA requirement
      if (credentials.twoFactor && !twoFactorCode) {
        return { success: false, requiresTwoFactor: true }
      }

      if (credentials.twoFactor && twoFactorCode !== credentials.twoFactor) {
        return { success: false, error: "Invalid 2FA code" }
      }

      // Update last login
      const updatedAdmin = {
        ...foundAdmin,
        lastLogin: new Date().toISOString(),
      }

      // Set session expiry (24 hours)
      const sessionExpiry = new Date()
      sessionExpiry.setHours(sessionExpiry.getHours() + 24)

      setAdminUser(updatedAdmin)
      setIsAdminLoggedIn(true)
      localStorage.setItem("adminUser", JSON.stringify(updatedAdmin))
      localStorage.setItem("isAdminLoggedIn", "true")
      localStorage.setItem("adminSessionExpiry", sessionExpiry.toISOString())

      return { success: true }
    } catch (error) {
      console.error("Admin login error:", error)
      return { success: false, error: "Login failed. Please try again." }
    } finally {
      setIsLoading(false)
    }
  }

  const adminLogout = () => {
    setAdminUser(null)
    setIsAdminLoggedIn(false)
    localStorage.removeItem("adminUser")
    localStorage.removeItem("isAdminLoggedIn")
    localStorage.removeItem("adminSessionExpiry")
    router.push("/admin/login")
  }

  const hasPermission = (permission: keyof AdminPermissions): boolean => {
    if (!adminUser || !isAdminLoggedIn) return false
    return adminUser.permissions.includes(permission)
  }

  const hasRole = (role: AdminRole | AdminRole[]): boolean => {
    if (!adminUser || !isAdminLoggedIn) return false

    if (Array.isArray(role)) {
      return role.includes(adminUser.role)
    }

    return adminUser.role === role
  }

  const refreshAdminUser = async (): Promise<void> => {
    if (!adminUser) return

    try {
      // In a real app, this would fetch fresh user data from the API
      const updatedAdmin = MOCK_ADMIN_USERS.find((admin) => admin.id === adminUser.id)
      if (updatedAdmin) {
        setAdminUser(updatedAdmin)
        localStorage.setItem("adminUser", JSON.stringify(updatedAdmin))
      }
    } catch (error) {
      console.error("Error refreshing admin user:", error)
    }
  }

  const updateAdminProfile = async (updates: Partial<AdminUser>): Promise<boolean> => {
    if (!adminUser) return false

    try {
      const updatedAdmin = { ...adminUser, ...updates }
      setAdminUser(updatedAdmin)
      localStorage.setItem("adminUser", JSON.stringify(updatedAdmin))
      return true
    } catch (error) {
      console.error("Error updating admin profile:", error)
      return false
    }
  }

  const changePassword = async (
    currentPassword: string,
    newPassword: string,
  ): Promise<{ success: boolean; error?: string }> => {
    if (!adminUser) return { success: false, error: "Not authenticated" }

    try {
      // Validate current password
      const credentials = ADMIN_CREDENTIALS[adminUser.email as keyof typeof ADMIN_CREDENTIALS]
      if (!credentials || currentPassword !== credentials.password) {
        return { success: false, error: "Current password is incorrect" }
      }

      // In a real app, this would update the password in the database
      // For this demo, we'll just simulate success
      return { success: true }
    } catch (error) {
      console.error("Error changing password:", error)
      return { success: false, error: "Failed to change password" }
    }
  }

  const value: AdminAuthContextType = {
    adminUser,
    isAdminLoggedIn,
    isAuthenticated: isAdminLoggedIn,
    adminLogin,
    adminLogout,
    hasPermission,
    hasRole,
    isLoading,
    refreshAdminUser,
    updateAdminProfile,
    changePassword,
  }

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}

// Permission Guard Components
interface PermissionGuardProps {
  children: ReactNode
  permission?: keyof AdminPermissions
  role?: AdminRole | AdminRole[]
  fallback?: ReactNode
  showError?: boolean
}

export function AdminPermissionGuard({ children, permission, role, fallback, showError = true }: PermissionGuardProps) {
  const { hasPermission, hasRole, isAdminLoggedIn, adminUser } = useAdminAuth()

  // Check if user is logged in
  if (!isAdminLoggedIn || !adminUser) {
    return fallback || (showError ? <AccessDeniedMessage type="login" /> : null)
  }

  // Check permission if specified
  if (permission && !hasPermission(permission)) {
    return fallback || (showError ? <AccessDeniedMessage type="permission" permission={permission} /> : null)
  }

  // Check role if specified
  if (role && !hasRole(role)) {
    const roleText = Array.isArray(role) ? role.join(", ") : role
    return fallback || (showError ? <AccessDeniedMessage type="role" role={roleText} /> : null)
  }

  return <>{children}</>
}

interface AccessDeniedMessageProps {
  type: "login" | "permission" | "role"
  permission?: string
  role?: string
}

function AccessDeniedMessage({ type, permission, role }: AccessDeniedMessageProps) {
  const getMessage = () => {
    switch (type) {
      case "login":
        return "You must be logged in as an admin to access this content."
      case "permission":
        return `You don't have the required permission: ${permission}`
      case "role":
        return `This content requires one of the following roles: ${role}`
      default:
        return "Access denied."
    }
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
        <Lock className="w-8 h-8 text-red-600 dark:text-red-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Access Denied</h3>
      <p className="text-gray-600 dark:text-gray-400 max-w-md">{getMessage()}</p>
    </div>
  )
}

// Convenience components for common permission checks
export function RequirePermission({
  permission,
  children,
  fallback,
}: {
  permission: keyof AdminPermissions
  children: ReactNode
  fallback?: ReactNode
}) {
  return (
    <AdminPermissionGuard permission={permission} fallback={fallback}>
      {children}
    </AdminPermissionGuard>
  )
}

export function RequireRole({
  role,
  children,
  fallback,
}: {
  role: AdminRole | AdminRole[]
  children: ReactNode
  fallback?: ReactNode
}) {
  return (
    <AdminPermissionGuard role={role} fallback={fallback}>
      {children}
    </AdminPermissionGuard>
  )
}

export function RequireSuperAdmin({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <AdminPermissionGuard role="super_admin" fallback={fallback}>
      {children}
    </AdminPermissionGuard>
  )
}

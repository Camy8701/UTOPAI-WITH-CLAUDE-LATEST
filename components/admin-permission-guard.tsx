"use client"

import { useAdminAuth } from "@/components/admin-auth-context"
import type { ReactNode } from "react"

type Permission =
  | "content.view"
  | "content.create"
  | "content.edit"
  | "content.delete"
  | "content.moderate"
  | "users.view"
  | "users.edit"
  | "users.delete"
  | "analytics.view"
  | "media.manage"
  | "settings.view"
  | "settings.edit"

interface AdminPermissionGuardProps {
  children: ReactNode
  permission: Permission
  showError?: boolean
  fallback?: ReactNode
}

export function AdminPermissionGuard({
  children,
  permission,
  showError = true,
  fallback = null,
}: AdminPermissionGuardProps) {
  const { adminUser, isAdminLoggedIn } = useAdminAuth()

  // If not logged in, don't show anything
  if (!isAdminLoggedIn || !adminUser) {
    return showError ? <div className="text-red-500 text-sm">Access denied: Not authenticated</div> : fallback
  }

  // Check if user has the required permission
  const hasPermission = checkPermission(adminUser.role, permission)

  if (!hasPermission) {
    return showError ? (
      <div className="text-red-500 text-sm">Access denied: Insufficient permissions for {permission}</div>
    ) : (
      fallback
    )
  }

  return <>{children}</>
}

// Permission checking logic based on user role
function checkPermission(role: string, permission: Permission): boolean {
  const rolePermissions: Record<string, Permission[]> = {
    super_admin: [
      "content.view",
      "content.create",
      "content.edit",
      "content.delete",
      "content.moderate",
      "users.view",
      "users.edit",
      "users.delete",
      "analytics.view",
      "media.manage",
      "settings.view",
      "settings.edit",
    ],
    admin: [
      "content.view",
      "content.create",
      "content.edit",
      "content.delete",
      "content.moderate",
      "users.view",
      "users.edit",
      "analytics.view",
      "media.manage",
      "settings.view",
    ],
    moderator: ["content.view", "content.moderate", "users.view", "media.manage"],
    editor: ["content.view", "content.create", "content.edit", "media.manage"],
    viewer: ["content.view"],
  }

  const userPermissions = rolePermissions[role] || []
  return userPermissions.includes(permission)
}

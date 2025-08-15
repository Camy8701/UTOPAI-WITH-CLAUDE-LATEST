"use client"

import { useAudit } from "@/components/audit-context"
import { useAdminAuth } from "@/components/admin-auth-context"

export function useAuditActions() {
  const { logAction } = useAudit()
  const { adminUser } = useAdminAuth()

  const logContentAction = (
    action: "create" | "update" | "delete" | "publish" | "unpublish",
    contentType: string,
    contentId: string,
    details: Record<string, any> = {},
  ) => {
    logAction(
      `content.${action}` as any,
      {
        contentType,
        contentId,
        ...details,
      },
      {
        resource: contentType,
        resourceId: contentId,
      },
    )
  }

  const logUserAction = (
    action: "create" | "update" | "delete" | "ban" | "unban" | "role_change",
    userId: string,
    details: Record<string, any> = {},
  ) => {
    logAction(
      `user.${action}` as any,
      {
        userId,
        ...details,
      },
      {
        resource: "user",
        resourceId: userId,
      },
    )
  }

  const logAdminAction = (
    action: "create" | "update" | "delete" | "role_change" | "permission_change",
    targetAdminId: string,
    details: Record<string, any> = {},
  ) => {
    logAction(
      `admin.${action}` as any,
      {
        targetAdminId,
        ...details,
      },
      {
        resource: "admin",
        resourceId: targetAdminId,
      },
    )
  }

  const logSettingsAction = (
    action: "update" | "backup" | "restore" | "export",
    settingType: string,
    details: Record<string, any> = {},
  ) => {
    logAction(
      `settings.${action}` as any,
      {
        settingType,
        ...details,
      },
      {
        resource: "settings",
        resourceId: settingType,
      },
    )
  }

  const logMediaAction = (
    action: "upload" | "delete" | "update",
    mediaId: string,
    details: Record<string, any> = {},
  ) => {
    logAction(
      `media.${action}` as any,
      {
        mediaId,
        ...details,
      },
      {
        resource: "media",
        resourceId: mediaId,
      },
    )
  }

  const logSecurityAction = (
    action: "permission_denied" | "suspicious_activity" | "password_change",
    details: Record<string, any> = {},
    options: { severity?: "low" | "medium" | "high" | "critical" } = {},
  ) => {
    logAction(`security.${action}` as any, details, {
      resource: "security",
      severity: options.severity || "medium",
    })
  }

  const logAuthAction = (
    action: "login" | "logout" | "login_failed" | "session_expired",
    details: Record<string, any> = {},
    options: { success?: boolean; errorMessage?: string } = {},
  ) => {
    logAction(`admin.${action}` as any, details, {
      resource: "authentication",
      success: options.success,
      errorMessage: options.errorMessage,
    })
  }

  return {
    logContentAction,
    logUserAction,
    logAdminAction,
    logSettingsAction,
    logMediaAction,
    logSecurityAction,
    logAuthAction,
  }
}

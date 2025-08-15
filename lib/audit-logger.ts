"use client"

import { useCallback } from "react"

export interface AuditUser {
  id: string
  email: string
  name: string
  role: string
}

export interface AuditLogEntry {
  id: string
  userId: string
  userEmail: string
  userName: string
  userRole: string
  action: string
  resource?: string
  resourceId?: string
  metadata: Record<string, any>
  timestamp: string
  ipAddress?: string
  userAgent?: string
  sessionId?: string
  success: boolean
  errorMessage?: string
  severity: "low" | "medium" | "high" | "critical"
}

class AuditLogger {
  private logs: AuditLogEntry[] = []

  log(
    user: AuditUser,
    action: string,
    metadata: Record<string, any> = {},
    options: {
      resource?: string
      resourceId?: string
      success?: boolean
      errorMessage?: string
      severity?: "low" | "medium" | "high" | "critical"
    } = {},
  ) {
    const logEntry: AuditLogEntry = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      userEmail: user.email,
      userName: user.name,
      userRole: user.role,
      action,
      resource: options.resource,
      resourceId: options.resourceId,
      metadata,
      timestamp: new Date().toISOString(),
      ipAddress: "127.0.0.1", // In real app, get from request
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "Unknown",
      sessionId: `session_${Date.now()}`,
      success: options.success ?? true,
      errorMessage: options.errorMessage,
      severity: options.severity ?? "low",
    }

    this.logs.push(logEntry)

    // Keep only last 1000 logs in memory
    if (this.logs.length > 1000) {
      this.logs = this.logs.slice(-1000)
    }

    // In a real app, you would send this to your backend
    console.log("Audit Log:", logEntry)
  }

  getLogs(filters?: {
    userId?: string
    action?: string
    severity?: string
    startDate?: string
    endDate?: string
    limit?: number
  }): AuditLogEntry[] {
    let filteredLogs = [...this.logs]

    if (filters?.userId) {
      filteredLogs = filteredLogs.filter((log) => log.userId === filters.userId)
    }

    if (filters?.action) {
      filteredLogs = filteredLogs.filter((log) => log.action.includes(filters.action!))
    }

    if (filters?.severity) {
      filteredLogs = filteredLogs.filter((log) => log.severity === filters.severity)
    }

    if (filters?.startDate) {
      filteredLogs = filteredLogs.filter((log) => log.timestamp >= filters.startDate!)
    }

    if (filters?.endDate) {
      filteredLogs = filteredLogs.filter((log) => log.timestamp <= filters.endDate!)
    }

    // Sort by timestamp (newest first)
    filteredLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    if (filters?.limit) {
      filteredLogs = filteredLogs.slice(0, filters.limit)
    }

    return filteredLogs
  }

  getStats() {
    const total = this.logs.length
    const today = new Date().toISOString().split("T")[0]
    const todayLogs = this.logs.filter((log) => log.timestamp.startsWith(today))

    const severityCounts = this.logs.reduce(
      (acc, log) => {
        acc[log.severity] = (acc[log.severity] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const actionCounts = this.logs.reduce(
      (acc, log) => {
        acc[log.action] = (acc[log.action] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return {
      total,
      today: todayLogs.length,
      severityCounts,
      actionCounts,
      recentLogs: this.logs.slice(-10),
    }
  }

  clearOldLogs(daysToKeep = 30) {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep)
    const cutoffTimestamp = cutoffDate.toISOString()

    this.logs = this.logs.filter((log) => log.timestamp >= cutoffTimestamp)
  }
}

export const auditLogger = new AuditLogger()

export const useAuditLogger = () => {
  const logAction = useCallback(
    (
      user: AuditUser,
      action: string,
      metadata: Record<string, any> = {},
      options: {
        resource?: string
        resourceId?: string
        success?: boolean
        errorMessage?: string
        severity?: "low" | "medium" | "high" | "critical"
      } = {},
    ) => {
      return auditLogger.log(user, action, metadata, options)
    },
    [],
  )

  const getLogs = useCallback(
    (filters?: {
      userId?: string
      action?: string
      severity?: string
      startDate?: string
      endDate?: string
      limit?: number
    }) => {
      return auditLogger.getLogs(filters)
    },
    [],
  )

  const getStats = useCallback(() => {
    return auditLogger.getStats()
  }, [])

  return {
    logAction,
    getLogs,
    getStats,
    auditLogger,
  }
}

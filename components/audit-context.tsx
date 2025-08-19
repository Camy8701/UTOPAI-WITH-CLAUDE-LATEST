"use client"

import { createContext, useContext, type ReactNode } from "react"
import { auditLogger } from "@/lib/audit-logger"
import type { AuditLog } from "@/types"

interface AuditContextType {
  logs: AuditLog[]
  addLog: (log: Omit<AuditLog, "id" | "timestamp">) => void
  clearLogs: () => void
  exportLogs: (format: "json" | "csv") => void
}

const AuditContext = createContext<AuditContextType | undefined>(undefined)

export function useAudit() {
  const context = useContext(AuditContext)
  if (context === undefined) {
    throw new Error("useAudit must be used within an AuditProvider")
  }
  return context
}

export function AuditProvider({ children }: { children: ReactNode }) {
  // Temporarily disabled - audit logger API mismatch
  const logs: AuditLog[] = []

  const addLog = (log: Omit<AuditLog, "id" | "timestamp">) => {
    // TODO: Fix audit logger API alignment
    console.log("Audit log:", log)
  }

  const clearLogs = () => {
    // TODO: Implement clear logs
  }

  const exportLogs = (format: "json" | "csv") => {
    // TODO: Implement export logs
    console.log("Export format:", format)
  }

  const value: AuditContextType = {
    logs,
    addLog,
    clearLogs,
    exportLogs,
  }

  return <AuditContext.Provider value={value}>{children}</AuditContext.Provider>
}

// Export as default as well
export default AuditProvider

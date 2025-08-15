"use client"

import { createContext, useContext, type ReactNode } from "react"
import { auditLogger, type AuditLog } from "@/lib/audit-logger"

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
  const logs = auditLogger.getLogs()

  const addLog = (log: Omit<AuditLog, "id" | "timestamp">) => {
    auditLogger.log(log.admin, log.action, log.details, log.metadata)
  }

  const clearLogs = () => {
    auditLogger.clearLogs()
  }

  const exportLogs = (format: "json" | "csv") => {
    auditLogger.exportLogs(format)
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

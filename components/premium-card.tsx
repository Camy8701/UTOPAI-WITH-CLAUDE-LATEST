"use client"

import type { HTMLAttributes, ReactNode } from "react"
import { cn } from "@/lib/utils"

/**
 * Minimal replacement for the old PremiumCard.
 * It simply renders a rounded container while forwarding
 * `className` and `children` so existing pages continue to work.
 *
 * Props used in the codebase:
 *  - `variant`: "story" | "product" | "news" | etc. (optional)
 *  - `className`: additional styling
 *  - `children`: card content
 */
interface PremiumCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: string
  children: ReactNode
}

export default function PremiumCard({
  variant, // currently unused but kept for API compatibility
  className,
  children,
  ...rest
}: PremiumCardProps) {
  return (
    <div
      {...rest}
      className={cn(
        "rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-900",
        className,
      )}
    >
      {children}
    </div>
  )
}

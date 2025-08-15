"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface PremiumHeroTitleProps {
  title: string
  subtitle?: string
  description?: string
  delay?: number
  className?: string
}

export default function PremiumHeroTitle({
  title,
  subtitle,
  description,
  delay = 0,
  className = "",
}: PremiumHeroTitleProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <section
      className={`section-padding bg-gradient-to-br from-background via-background-secondary to-background-tertiary ${className}`}
    >
      <div className="max-w-7xl mx-auto container-padding text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] }}
          className="space-y-6"
        >
          {subtitle && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: delay + 0.2 }}
              className="text-caption text-story tracking-wider"
            >
              {subtitle}
            </motion.div>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: delay + 0.3 }}
            className="font-display font-bold text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-tight tracking-tighter"
          >
            <span className="bg-gradient-to-r from-foreground via-story to-product bg-clip-text text-transparent">
              {title}
            </span>
          </motion.h1>

          {description && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: delay + 0.5 }}
              className="text-body-lg text-foreground-secondary max-w-3xl mx-auto text-balance"
            >
              {description}
            </motion.p>
          )}

          {/* Decorative Elements */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: delay + 0.7 }}
            className="flex justify-center items-center space-x-4 pt-8"
          >
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-story to-transparent"></div>
            <div className="w-2 h-2 rounded-full bg-story animate-pulse"></div>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-product to-transparent"></div>
          </motion.div>
        </motion.div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-story/10 to-product/10 rounded-full blur-xl"
          />
          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 2 }}
            className="absolute top-1/3 right-1/4 w-24 h-24 bg-gradient-to-br from-news/10 to-quiz/10 rounded-full blur-xl"
          />
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 7, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 4 }}
            className="absolute bottom-1/4 left-1/3 w-20 h-20 bg-gradient-to-br from-accent-coral/10 to-accent-teal/10 rounded-full blur-xl"
          />
        </div>
      </div>
    </section>
  )
}

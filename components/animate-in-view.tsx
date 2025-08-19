"use client"

import { useRef, useEffect, useState, type ReactNode } from "react"
import { motion, useAnimation, type Variant } from "framer-motion"

type AnimateInViewProps = {
  children: ReactNode
  variants?: {
    hidden: Variant
    visible: Variant
  }
  className?: string
  delay?: number
  duration?: number
  once?: boolean
  threshold?: number
}

export default function AnimateInView({
  children,
  variants,
  className = "",
  delay = 0,
  duration = 0.5,
  once = true,
  threshold = 0.1,
}: AnimateInViewProps) {
  const controls = useAnimation()
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  const defaultVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  }

  const currentVariants = variants || defaultVariants

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isInView) {
          controls.start("visible")
          setIsInView(true)
          if (once) {
            observer.unobserve(entry.target)
          }
        }
        if (!entry.isIntersecting && !once && isInView) {
          controls.start("hidden")
          setIsInView(false)
        }
      },
      {
        threshold,
        rootMargin: "0px 0px -100px 0px",
      },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [controls, isInView, once, threshold])

  return (
    <motion.div 
      ref={ref} 
      initial="hidden" 
      animate={controls} 
      variants={currentVariants} 
      className={className}
      transition={{ duration, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  )
}

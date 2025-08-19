"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"

type StaggeredGridProps = {
  children: ReactNode[]
  className?: string
  itemClassName?: string
  delay?: number
  staggerDelay?: number
}

export default function StaggeredGrid({
  children,
  className = "",
  itemClassName = "",
  delay = 0.1,
  staggerDelay = 0.1,
}: StaggeredGridProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      {children.map((child, index) => (
        <motion.div 
          key={index} 
          className={itemClassName} 
          variants={itemVariants}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}

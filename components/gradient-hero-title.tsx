"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface GradientHeroTitleProps {
  text: string
  delay?: number
}

export default function GradientHeroTitle({ text, delay = 0 }: GradientHeroTitleProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const words = text.split(" ")

  return (
    <section className="bg-gray-100 dark:bg-gray-950 py-16 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay, ease: "easeOut" }}
        >
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tight text-black dark:text-white uppercase">
            {words.map((word, index) => (
              <span key={index} className="inline-block mr-4">
                {word === "AI" ? (
                  <>
                    <span className="text-blue-500">A</span>
                    <span className="text-red-500">I</span>
                  </>
                ) : (
                  word
                )}
              </span>
            ))}
          </h1>
        </motion.div>
      </div>
    </section>
  )
}

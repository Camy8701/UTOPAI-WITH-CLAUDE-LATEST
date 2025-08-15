"use client"

import { motion } from "framer-motion"

type AdBannerProps = {
  className?: string
  position?: "horizontal" | "vertical" | "square"
  direction?: "left-to-right" | "right-to-left"
}

export default function AdBanner({
  className = "",
  position = "horizontal",
  direction = "right-to-left",
}: AdBannerProps) {
  let dimensions = "h-24 w-full" // Default horizontal banner

  if (position === "vertical") {
    dimensions = "h-96 w-64"
  } else if (position === "square") {
    dimensions = "h-64 w-64"
  }

  // Create an array of 2 ad sections
  const adSections = [
    { id: 1, text: "ADS" },
    { id: 2, text: "ADS" },
  ]

  // Set animation direction based on prop
  const animationX = direction === "left-to-right" ? [-1000, 0] : [0, -1000]

  return (
    <motion.div
      className={`${dimensions} rounded-lg overflow-hidden ${className}`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      {/* Split into 2 distinct parts */}
      <div className="w-full h-full flex gap-2">
        {/* First Part */}
        <div className="flex-1 bg-gray-200 dark:bg-gray-800 border-2 border-dashed border-gray-400 dark:border-gray-600 rounded-lg overflow-hidden relative">
          <motion.div
            className="flex absolute w-full h-full"
            animate={{
              x: animationX,
            }}
            transition={{
              x: {
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
                duration: 15,
                ease: "linear",
              },
            }}
          >
            {/* Duplicate the first section to create a seamless loop */}
            {[adSections[0], adSections[0]].map((section, index) => (
              <div
                key={`part1-${section.id}-${index}`}
                className="flex-shrink-0 w-full h-full flex items-center justify-center"
              >
                <span className="text-gray-500 dark:text-gray-400 font-bold text-2xl">{section.text}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Second Part */}
        <div className="flex-1 bg-gray-200 dark:bg-gray-800 border-2 border-dashed border-gray-400 dark:border-gray-600 rounded-lg overflow-hidden relative">
          <motion.div
            className="flex absolute w-full h-full"
            animate={{
              x: animationX,
            }}
            transition={{
              x: {
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
                duration: 15,
                ease: "linear",
              },
            }}
          >
            {/* Duplicate the second section to create a seamless loop */}
            {[adSections[1], adSections[1]].map((section, index) => (
              <div
                key={`part2-${section.id}-${index}`}
                className="flex-shrink-0 w-full h-full flex items-center justify-center"
              >
                <span className="text-gray-500 dark:text-gray-400 font-bold text-2xl">{section.text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

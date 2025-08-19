"use client"

// Using a bold sans-serif font similar to the PRIMEASIA LEATHER example

import { motion } from "framer-motion"

type ColoredTextProps = {
  text: string
  specialChars?: { [key: number]: string }
  className?: string
  delay?: number
}

export default function ColoredText({ text, specialChars = {}, className = "", delay = 0 }: ColoredTextProps) {
  const words = text.split(" ")

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: delay * i },
    }),
  }

  const child = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
    },
  }

  return (
    <motion.div
      className={`overflow-hidden text-[540%] font-semibold uppercase tracking-tight font-['Lota_Grotesque_Alt_3',_'Helvetica',_'Arial',_sans-serif] ${className}`}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {words.map((word, wordIndex) => {
        // Apply specific colors based on the word
        let wordColor = ""
        if (word.toLowerCase() === "latest") {
          wordColor = "text-black dark:text-white"
        } else if (word.toLowerCase() === "ai") {
          // For "AI", we'll handle individual characters differently
          return (
            <motion.span key={wordIndex} className="inline-block mr-1" variants={child}>
              <span className="text-blue-500">{word.charAt(0)}</span>
              <span className="text-red-500">{word.charAt(1)}</span>
            </motion.span>
          )
        } else if (word.toLowerCase() === "story") {
          wordColor = "text-black dark:text-white"
        }

        return (
          <motion.span key={wordIndex} className={`inline-block mr-1 ${wordColor}`} variants={child}>
            {Array.from(word).map((char, charIndex) => {
              // Calculate the global index by counting characters up to this point
              const globalIndex =
                words.slice(0, wordIndex).join(" ").length + (wordIndex > 0 ? wordIndex : 0) + charIndex

              if (specialChars[globalIndex] && !wordColor) {
                return (
                  <span key={charIndex} className={`text-blue-500 ${specialChars[globalIndex]}`}>
                    {char}
                  </span>
                )
              }
              return <span key={charIndex}>{char}</span>
            })}
          </motion.span>
        )
      })}
    </motion.div>
  )
}

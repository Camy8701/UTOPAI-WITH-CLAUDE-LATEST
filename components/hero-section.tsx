"use client"

import { useEffect, useRef, useState } from "react"
import AnimateInView from "./animate-in-view"
import "../app/fonts.css" // Make sure this file exists with the Geliat font import

export default function HeroSection() {
  const textRef = useRef<HTMLHeadingElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [fontSize, setFontSize] = useState(80)

  useEffect(() => {
    const resizeText = () => {
      if (!textRef.current || !containerRef.current) return

      const container = containerRef.current
      const text = textRef.current

      // Get container width with padding
      const containerWidth = container.offsetWidth - 32 // Account for px-4 (16px each side)

      // Start with a large font size and scale down
      let currentFontSize = Math.min(containerWidth * 0.12, 200) // Base calculation
      text.style.fontSize = `${currentFontSize}px`

      // Reduce font size until text fits in one line
      while (text.scrollWidth > containerWidth && currentFontSize > 16) {
        currentFontSize -= 1
        text.style.fontSize = `${currentFontSize}px`
      }

      setFontSize(currentFontSize)
    }

    // Initial resize
    resizeText()

    // Resize on window resize
    window.addEventListener("resize", resizeText)

    // Cleanup
    return () => window.removeEventListener("resize", resizeText)
  }, [])

  return (
    <section className="relative py-16 lg:py-24 flex items-center justify-center bg-white dark:bg-gray-900">
      <div ref={containerRef} className="container mx-auto px-4 text-center">
        <AnimateInView>
          <h1
            ref={textRef}
            className="font-semibold text-black dark:text-white tracking-tighter leading-none uppercase font-geliat whitespace-nowrap"
            style={{
              fontSize: `${fontSize}px`,
              minHeight: "1em", // Prevent layout shift
            }}
          >
            LATEST AI CHRONICLES
          </h1>
        </AnimateInView>
      </div>
    </section>
  )
}

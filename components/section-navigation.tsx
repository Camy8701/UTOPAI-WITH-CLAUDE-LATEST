"use client"

import Link from "next/link"
import { Book, Grid, Package, FileText, Brain, Newspaper, Crown } from "lucide-react"
import { motion } from "framer-motion"

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: "smooth" })
  }
}

const sections = [
  {
    name: "Featured AI Stories",
    icon: Book,
    href: "#featured-stories",
    color: "bg-blue-500",
    onClick: () => scrollToSection("featured-stories"),
  },
  {
    name: "Featured Collections",
    icon: Grid,
    href: "#featured-collections",
    color: "bg-purple-500",
    onClick: () => scrollToSection("featured-collections"),
  },
  {
    name: "Digital Products",
    icon: Package,
    href: "#digital-products",
    color: "bg-amber-500",
    onClick: () => scrollToSection("digital-products"),
  },
  {
    name: "Best AI Tools",
    icon: FileText,
    href: "#best-ai-tools",
    color: "bg-green-500",
    onClick: () => scrollToSection("best-ai-tools"),
  },
  {
    name: "AI Knowledge Quiz",
    icon: Brain,
    href: "#ai-quiz",
    color: "bg-pink-500",
    onClick: () => scrollToSection("ai-quiz"),
  },
  {
    name: "News & Articles",
    icon: Newspaper,
    href: "#news-articles",
    color: "bg-orange-500",
    onClick: () => scrollToSection("news-articles"),
  },
  {
    name: "Become a Member",
    icon: Crown,
    href: "#action-buttons",
    color: "bg-yellow-500",
    onClick: () => scrollToSection("action-buttons"),
  },
]

export default function SectionNavigation() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 py-6 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between overflow-x-auto pb-2 -mx-4 px-4 space-x-8">
          {sections.map((section) => (
            <button
              key={section.name}
              onClick={section.onClick}
              className="flex flex-col items-center space-y-2 flex-shrink-0"
            >
              <motion.div
                className={`${section.color} w-14 h-14 rounded-full flex items-center justify-center text-white`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <section.icon size={24} />
              </motion.div>
              <span className="text-xs text-center font-medium text-gray-900 dark:text-gray-100">{section.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

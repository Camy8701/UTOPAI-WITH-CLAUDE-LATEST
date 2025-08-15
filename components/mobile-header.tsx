"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Menu, X, Calculator, ArrowUpDown, Settings } from "lucide-react"
import Link from "next/link"
import ThemeToggle from "./theme-toggle"

export default function MobileHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest(".mobile-menu") && !target.closest(".menu-button")) {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener("click", handleClickOutside)
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.removeEventListener("click", handleClickOutside)
      document.body.style.overflow = "unset"
    }
  }, [isMenuOpen])

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className="text-xl font-black">
              <span className="text-blue-600">utopai</span>
              <span className="text-gray-900 dark:text-white">.blog</span>
            </div>
          </Link>

          {/* Right side buttons */}
          <div className="flex items-center gap-2">
            {/* Utility Tools */}
            <Link href="/tip-calculator">
              <motion.div
                className="bg-gradient-to-r from-cyan-500 to-cyan-600 w-8 h-8 rounded-full flex items-center justify-center text-white shadow-md"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Calculator size={14} />
              </motion.div>
            </Link>
            <Link href="/currency-converter">
              <motion.div
                className="bg-gradient-to-r from-violet-500 to-violet-600 w-8 h-8 rounded-full flex items-center justify-center text-white shadow-md"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowUpDown size={14} />
              </motion.div>
            </Link>

            {/* Search Toggle */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle search"
            >
              <Search size={20} className="text-gray-600 dark:text-gray-300" />
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="menu-button p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X size={20} className="text-gray-600 dark:text-gray-300" />
              ) : (
                <Menu size={20} className="text-gray-600 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-gray-200 dark:border-gray-800 overflow-hidden"
            >
              <div className="p-4">
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search stories, topics..."
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    autoFocus
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="mobile-menu lg:hidden fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white dark:bg-gray-900 z-50 shadow-2xl"
            >
              <div className="flex flex-col h-full">
                {/* Menu Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Menu</h2>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <X size={20} className="text-gray-600 dark:text-gray-300" />
                  </button>
                </div>

                {/* Utility Tools Section */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                    Utility Tools
                  </h3>
                  <div className="flex space-x-4">
                    <Link
                      href="/tip-calculator"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex flex-col items-center"
                    >
                      <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 w-12 h-12 rounded-full flex items-center justify-center text-white mb-2 shadow-lg">
                        <Calculator size={20} />
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-300 text-center">Tip Calculator</span>
                    </Link>
                    <Link
                      href="/currency-converter"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex flex-col items-center"
                    >
                      <div className="bg-gradient-to-r from-violet-500 to-violet-600 w-12 h-12 rounded-full flex items-center justify-center text-white mb-2 shadow-lg">
                        <ArrowUpDown size={20} />
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-300 text-center">Currency Converter</span>
                    </Link>
                  </div>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 p-6">
                  <div className="space-y-2">
                    <Link
                      href="/"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                        <span className="text-blue-600 dark:text-blue-400 text-sm font-semibold">H</span>
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">Home</span>
                    </Link>

                    <div className="border-t border-gray-200 dark:border-gray-800 my-4"></div>

                    <Link
                      href="/admin/social-media"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                        <Settings size={16} className="text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">Social Media Tools</span>
                    </Link>
                  </div>
                </nav>

                <Link
                  href="https://ko-fi.com/utopai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-black dark:bg-white text-white dark:text-black py-3 rounded-lg font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Support Us
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer for fixed header */}
      <div className="lg:hidden h-16"></div>
    </>
  )
}

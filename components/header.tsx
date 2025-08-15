"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { Search, Calculator, Type, Upload, X } from "lucide-react"
import { motion } from "framer-motion"
import { memo, useState, useRef, useEffect } from "react"
import ThemeToggle from "@/components/theme-toggle"
import { useSearch } from "@/components/search-context"
import SearchResults from "@/components/search-results"
import { UserMenu } from "@/components/user-menu"

const Header = memo(() => {
  const { searchQuery, setSearchQuery, clearSearch } = useSearch()
  const [isSearchResultsOpen, setIsSearchResultsOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    setIsSearchResultsOpen(value.trim().length > 0)
  }

  const handleSearchClear = () => {
    clearSearch()
    setIsSearchResultsOpen(false)
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }

  const handleSearchFocus = () => {
    if (searchQuery.trim().length > 0) {
      setIsSearchResultsOpen(true)
    }
  }

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
        setIsSearchResultsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault()
        if (searchInputRef.current) {
          searchInputRef.current.focus()
        }
      }
      if (event.key === "Escape") {
        setIsSearchResultsOpen(false)
        if (searchInputRef.current) {
          searchInputRef.current.blur()
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
      <div className="max-w-full mx-auto px-6 lg:px-12 flex items-center h-16">
        {/* Left Section - Logo and Navigation */}
        <div className="flex items-center flex-shrink-0">
          <Link href="/" className="flex-shrink-0 mr-8">
            <Image
              src="/images/utopai-logo.png"
              alt="Utopai Logo"
              width={120}
              height={40}
              style={{ height: '40px', width: 'auto' }}
              priority
              loading="eager"
            />
          </Link>

          {/* Desktop Navigation - Social Media Links */}
          <nav className="hidden md:flex md:items-center md:space-x-6">
            <Link
              href="https://www.youtube.com/channel/UC6D5mUGNBRB80j_5A-QkazA"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-gray-900 dark:text-gray-100 font-medium whitespace-nowrap hover:text-red-600 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
              YouTube
            </Link>
            <Link
              href="https://ko-fi.com/utopai"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-gray-900 dark:text-gray-100 font-medium whitespace-nowrap hover:text-green-600 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.881 8.948c-.773-4.085-4.859-4.593-4.859-4.593H.723c-.604 0-.679.798-.679.798s-.082 7.324-.022 11.822c.164 2.424 2.586 2.672 2.586 2.672s8.267-.023 11.966-.049c2.438-.426 2.683-2.566 2.658-3.734 4.352.24 7.422-2.831 6.649-6.916zm-11.062 3.511c-1.246 1.453-4.011 3.976-4.011 3.976s-.121.119-.31.023c-.076-.057-.108-.09-.108-.09-.443-.441-3.368-3.049-4.034-3.954-.709-.965-1.041-2.7-.091-3.71.951-1.01 3.005-1.086 4.363.407 0 0 1.565-1.782 3.468-.963 1.904.82 1.832 3.011.723 4.311zm6.173.478c-.928.116-1.682.028-1.682.028V7.284h1.77s1.971.551 1.971 2.638c0 1.913-.985 2.667-2.059 3.015z"/>
              </svg>
              Support Us
            </Link>
          </nav>
        </div>

        {/* Center Section - Search Bar aligned with buttons */}
        <div className="hidden md:block flex-1 mx-8">
          <div className="relative w-full max-w-7xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search AI tools, stories, news... (⌘K)"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={handleSearchFocus}
              className="block w-full pl-10 pr-12 py-2 border border-gray-300 dark:border-gray-700 rounded-md leading-5 bg-gray-100 dark:bg-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm h-10 transition-all duration-200"
            />
            {searchQuery && (
              <button
                onClick={handleSearchClear}
                className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-200 dark:hover:bg-gray-700 rounded-r-md transition-colors"
              >
                <X className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
              </button>
            )}
          </div>
        </div>

        {/* Right Section - User Actions and Utility Tools */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User Menu */}
          <UserMenu />

          {/* Utility Tools */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Tip Calculator */}
            <motion.div
              whileHover={{ scale: 1.05, y: -1, boxShadow: "0 8px 20px rgba(6, 182, 212, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                href="/tip-calculator"
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 shadow-md transition-all duration-200 whitespace-nowrap h-10"
              >
                <Calculator size={16} />
                <span>Tip Calculator</span>
              </Link>
            </motion.div>

            {/* Character Counter */}
            <motion.div
              whileHover={{ scale: 1.05, y: -1, boxShadow: "0 8px 20px rgba(139, 92, 246, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                href="/character-counter"
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 shadow-md transition-all duration-200 whitespace-nowrap h-10"
              >
                <Type size={16} />
                <span>Character Counter</span>
              </Link>
            </motion.div>

            {/* File Converter */}
            <motion.div
              whileHover={{ scale: 1.05, y: -1, boxShadow: "0 8px 20px rgba(249, 115, 22, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                href="/file-converter"
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 shadow-md transition-all duration-200 whitespace-nowrap h-10"
              >
                <Upload size={16} />
                <span>File Converter</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mobile Utility Tools Bar */}
      <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search AI tools, stories, news..."
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={handleSearchFocus}
              className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchQuery && (
              <button onClick={handleSearchClear} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <X className="h-4 w-4 text-gray-400" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Utility Tools Bar */}
      <div className="lg:hidden border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-center space-x-4">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Utility Tools
            </span>

            {/* Mobile Tip Calculator */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.2 }}>
              <Link
                href="/tip-calculator"
                className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-3 py-2 rounded-md text-xs font-medium flex items-center gap-2 shadow-md whitespace-nowrap"
              >
                <Calculator size={14} />
                <span>Tip Calculator</span>
              </Link>
            </motion.div>

            {/* Mobile Character Counter */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.2 }}>
              <Link
                href="/character-counter"
                className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-2 rounded-md text-xs font-medium flex items-center gap-2 shadow-md whitespace-nowrap"
              >
                <Type size={14} />
                <span>Character Counter</span>
              </Link>
            </motion.div>

            {/* Mobile File Converter */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.2 }}>
              <Link
                href="/file-converter"
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-3 py-2 rounded-md text-xs font-medium flex items-center gap-2 shadow-md whitespace-nowrap"
              >
                <Upload size={14} />
                <span>File Converter</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Search Results */}
      <SearchResults isOpen={isSearchResultsOpen} onClose={() => setIsSearchResultsOpen(false)} />
    </header>
  )
})

Header.displayName = "Header"

export default Header

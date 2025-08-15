"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback, useEffect } from "react"
import { searchContent, getSearchSuggestions, type SearchableItem } from "@/lib/search-data"

interface SearchContextType {
  searchQuery: string
  setSearchQuery: (query: string) => void
  searchResults: SearchableItem[]
  suggestions: string[]
  isSearching: boolean
  clearSearch: () => void
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchableItem[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      setSuggestions([])
      setIsSearching(false)
      return
    }

    setIsSearching(true)

    try {
      // Call the database search API
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=10`, {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        
        // Transform API results to match the expected format
        const transformedResults: SearchableItem[] = data.results.map((result: any) => ({
          id: result.id,
          title: result.title,
          description: result.description || result.excerpt || '',
          category: result.category,
          url: result.url,
          image: result.image,
          tags: [], // API doesn't return tags yet
          content: result.description || result.excerpt || ''
        }))

        setSearchResults(transformedResults)
        setSuggestions(data.suggestions || [])
      } else {
        // Fallback to static search if API fails
        const results = searchContent(query)
        const searchSuggestions = getSearchSuggestions(query)
        setSearchResults(results)
        setSuggestions(searchSuggestions)
      }
    } catch (error) {
      console.error('Search API failed, using fallback:', error)
      // Fallback to static search
      const results = searchContent(query)
      const searchSuggestions = getSearchSuggestions(query)
      setSearchResults(results)
      setSuggestions(searchSuggestions)
    }

    setIsSearching(false)
  }, [])

  useEffect(() => {
    performSearch(searchQuery)
  }, [searchQuery, performSearch])

  const clearSearch = useCallback(() => {
    setSearchQuery("")
    setSearchResults([])
    setSuggestions([])
    setIsSearching(false)
  }, [])

  const value = {
    searchQuery,
    setSearchQuery,
    searchResults,
    suggestions,
    isSearching,
    clearSearch,
  }

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
}

export function useSearch() {
  const context = useContext(SearchContext)
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider")
  }
  return context
}

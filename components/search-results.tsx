"use client"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { X, Search, ExternalLink, ArrowRight } from "lucide-react"
import { useSearch } from "@/components/search-context"
import type { SearchableItem } from "@/lib/search-data"

interface SearchResultsProps {
  isOpen: boolean
  onClose: () => void
}

export default function SearchResults({ isOpen, onClose }: SearchResultsProps) {
  const { searchQuery, searchResults, suggestions, isSearching, clearSearch } = useSearch()

  const getCategoryIcon = (category: SearchableItem["category"]) => {
    switch (category) {
      case "story":
        return "📖"
      case "news":
        return "📰"
      case "tool":
        return "🛠️"
      case "quiz":
        return "🧠"
      case "section":
        return "🏠"
      default:
        return "📄"
    }
  }

  const getCategoryColor = (category: SearchableItem["category"]) => {
    switch (category) {
      case "story":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      case "news":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
      case "tool":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "quiz":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400"
      case "section":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  const handleResultClick = (item: SearchableItem) => {
    onClose()
    clearSearch()

    if (item.url.startsWith("http")) {
      window.open(item.url, "_blank")
    } else {
      window.location.href = item.url
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-20 left-1/2 transform -translate-x-1/2 w-full max-w-2xl mx-auto px-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <Search className="h-5 w-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {searchQuery ? `Search results for "${searchQuery}"` : "Search everything"}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="max-h-96 overflow-y-auto">
              {isSearching ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span>Searching...</span>
                  </div>
                </div>
              ) : searchQuery && searchResults.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="text-4xl mb-4">🔍</div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No results found</h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                    Try searching for stories, tools, news, quizzes, or sections using different keywords.
                  </p>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="p-2">
                  {searchResults.map((item, index) => (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleResultClick(item)}
                      className="w-full p-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors text-left group"
                    >
                      <div className="flex items-start gap-4">
                        {item.image ? (
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xl flex-shrink-0">
                            {getCategoryIcon(item.category)}
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}
                            >
                              {item.category}
                            </span>
                            {item.url.startsWith("http") && <ExternalLink className="h-3 w-3 text-gray-400" />}
                          </div>

                          <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                            {item.title}
                          </h3>

                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
                            {item.description}
                          </p>

                          {item.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {item.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-400 rounded"
                                >
                                  {tag}
                                </span>
                              ))}
                              {item.tags.length > 3 && (
                                <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-400 rounded">
                                  +{item.tags.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex-shrink-0" />
                      </div>
                    </motion.button>
                  ))}
                </div>
              ) : (
                <div className="p-6">
                  <div className="text-center mb-6">
                    <div className="text-4xl mb-4">🔍</div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Search everything</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Find stories, tools, news, quizzes, and more across the entire website.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-lg mb-1">📖</div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">Stories</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">AI fiction & narratives</div>
                    </div>

                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-lg mb-1">🛠️</div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">Tools</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">AI tools & utilities</div>
                    </div>

                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-lg mb-1">📰</div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">News</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Latest AI updates</div>
                    </div>

                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-lg mb-1">🧠</div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">Quizzes</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Test your knowledge</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            {searchQuery && (
              <div className="border-t border-gray-200 dark:border-gray-700 p-3">
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>
                    {searchResults.length} result{searchResults.length !== 1 ? "s" : ""} found
                  </span>
                  <span>Press ESC to close</span>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

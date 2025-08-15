"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, Star, Eye, Heart, Search, Grid, List } from "lucide-react"
import AnimateInView from "@/components/animate-in-view"
import StaggeredGrid from "@/components/staggered-grid"
import { ErrorBoundary } from "@/components/error-boundary"

// Product interface
interface Product {
  id: string
  title: string
  description: string
  price: number | string
  originalPrice?: string
  category: string
  rating: number
  reviews: number
  image: string
  imageAlt: string
  type: string
  bestseller?: boolean
  featured?: boolean
}

// All products data
const allProducts: Product[] = [
  {
    id: "passive-income-vending",
    title: "Make Passive Income with Vending Machines - Ebook",
    description:
      "Discover how to generate steady, hands-off income with vending machines—one of the simplest and most reliable passive business models.",
    price: 29.99,
    originalPrice: "$49.99",
    category: "Business & Finance",
    rating: 4.8,
    reviews: 156,
    image: "/images/products/vending-machines-ebook.png",
    imageAlt: "Vending machine ebook cover",
    type: "ebook",
    bestseller: true,
    featured: true,
  },
  {
    id: "ai-content-course",
    title: "AI Content Creation Masterclass",
    description:
      "Learn how to create engaging content using AI tools and techniques. Master the art of AI-assisted writing, video creation, and social media content.",
    price: 39.99,
    originalPrice: "$79.99",
    category: "Education",
    rating: 4.9,
    reviews: 203,
    image: "/images/products/ai-content-course.png",
    imageAlt: "AI content course cover",
    type: "course",
    bestseller: false,
    featured: true,
  },
  {
    id: "productivity-templates",
    title: "Ultimate Productivity Templates Pack",
    description:
      "Boost your productivity with our comprehensive template collection. Includes Notion templates, spreadsheets, and planning tools.",
    price: 19.99,
    originalPrice: "$39.99",
    category: "Productivity",
    rating: 4.7,
    reviews: 89,
    image: "/images/products/productivity-templates.png",
    imageAlt: "Productivity templates pack",
    type: "templates",
    bestseller: false,
    featured: true,
  },
  {
    id: "social-media-toolkit",
    title: "Social Media Marketing Toolkit",
    description:
      "Complete toolkit for social media success. Includes content calendars, hashtag research tools, and engagement strategies.",
    price: 24.99,
    originalPrice: "$49.99",
    category: "Marketing",
    rating: 4.6,
    reviews: 142,
    image: "/images/products/social-media-toolkit.png",
    imageAlt: "Social media toolkit",
    type: "toolkit",
    bestseller: false,
    featured: false,
  },
  {
    id: "crypto-trading-guide",
    title: "Cryptocurrency Trading Guide",
    description:
      "Master cryptocurrency trading with this comprehensive guide. Learn technical analysis, risk management, and trading strategies.",
    price: 34.99,
    originalPrice: "$69.99",
    category: "Finance",
    rating: 4.5,
    reviews: 98,
    image: "/images/products/crypto-trading-guide.png",
    imageAlt: "Crypto trading guide",
    type: "guide",
    bestseller: false,
    featured: false,
  },
  {
    id: "freelancer-kit",
    title: "Complete Freelancer Starter Kit",
    description:
      "Everything you need to start your freelancing career. Includes contracts, pricing guides, and client management tools.",
    price: 27.99,
    originalPrice: "$55.99",
    category: "Business",
    rating: 4.8,
    reviews: 167,
    image: "/images/products/freelancer-kit.png",
    imageAlt: "Freelancer starter kit",
    type: "kit",
    bestseller: true,
    featured: false,
  },
]

const categories = ["All", "Business & Finance", "Education", "Productivity", "Marketing", "Finance", "Business"]

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("featured")

  // Filter and sort products
  const filteredProducts = allProducts
    .filter((product) => {
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory
      const matchesSearch =
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return Number(a.price) - Number(b.price)
        case "price-high":
          return Number(b.price) - Number(a.price)
        case "rating":
          return b.rating - a.rating
        case "reviews":
          return b.reviews - a.reviews
        default: // featured
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
      }
    })

  const calculateDiscount = (original: string, current: number | string): number => {
    try {
      const originalPrice = typeof original === "string" ? Number.parseFloat(original.replace(/[^0-9.]/g, "")) : 0
      const currentPrice = typeof current === "string" ? Number.parseFloat(current.replace(/[^0-9.]/g, "")) : current
      if (isNaN(originalPrice) || isNaN(currentPrice) || originalPrice <= 0) return 0
      return Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    } catch (error) {
      return 0
    }
  }

  const formatPrice = (price: number | string): string => {
    if (typeof price === "string") {
      if (price.includes("$")) return price
      const numPrice = Number.parseFloat(price)
      if (isNaN(numPrice)) return "$0.00"
      price = numPrice
    }
    return `$${price.toFixed(2)}`
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4 mb-6">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/"
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft size={20} />
                <span>Back to Home</span>
              </Link>
            </motion.div>
          </div>

          <AnimateInView>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Digital Products Collection
</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
              Discover our complete collection of premium digital resources designed to boost your success and
              productivity.
            </p>
          </AnimateInView>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Sort and View Options */}
          <div className="flex items-center gap-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="reviews">Most Reviews</option>
            </select>

            <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${viewMode === "grid" ? "bg-blue-600 text-white" : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400"}`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${viewMode === "list" ? "bg-blue-600 text-white" : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400"}`}
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            Showing {filteredProducts.length} of {allProducts.length} products
          </p>
        </div>

        {/* Products Grid/List */}
        <ErrorBoundary fallback={<div className="text-center py-10">Failed to load products</div>}>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 dark:text-gray-400 text-lg">No products found matching your criteria</p>
            </div>
          ) : (
            <StaggeredGrid
              className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-6"}
              delay={0.1}
              staggerDelay={0.05}
            >
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  className={`group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 ${
                    viewMode === "list" ? "flex" : ""
                  }`}
                  whileHover={{ y: -5 }}
                >
                  {/* Product Image */}
                  <div
                    className={`relative overflow-hidden ${viewMode === "list" ? "w-64 flex-shrink-0" : "aspect-[4/3]"}`}
                  >
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.imageAlt}
                      width={600}
                      height={450}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        ;(e.target as HTMLImageElement).src = "/diverse-products-still-life.png"
                      }}
                    />

                    {/* Badges */}
                    <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                      <div className="flex flex-col gap-2">
                        {product.bestseller && (
                          <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            BESTSELLER
                          </span>
                        )}
                        {product.featured && (
                          <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            FEATURED
                          </span>
                        )}
                        <span className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white text-xs font-medium px-2 py-1 rounded-full">
                          {product.category}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-2">
                        <motion.button
                          className="bg-white dark:bg-gray-900 rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          aria-label="Add to favorites"
                        >
                          <Heart size={16} className="text-gray-600 dark:text-gray-400" />
                        </motion.button>
                        <motion.button
                          className="bg-white dark:bg-gray-900 rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          aria-label="Quick view"
                        >
                          <Eye size={16} className="text-gray-600 dark:text-gray-400" />
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-6 flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium dark:text-white">{product.rating}</span>
                      </div>
                      <span className="text-gray-400">•</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{product.reviews} reviews</span>
                    </div>

                    <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors dark:text-white line-clamp-2">
                      {product.title}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">{product.description}</p>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <motion.button
                        onClick={() => window.open("https://gumroad.com/products", "_blank")}
                        className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors flex-1"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Preview
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </StaggeredGrid>
          )}
        </ErrorBoundary>
      </div>
    </div>
  )
}

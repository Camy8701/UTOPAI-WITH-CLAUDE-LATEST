"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { ChevronLeft, ChevronRight, ShoppingCart, Eye } from "lucide-react"

interface DigitalProduct {
  id: string
  title: string
  description: string
  price: string
  image: string
  category: string
  tags: string[]
}

const digitalProducts: DigitalProduct[] = [
  {
    id: "1",
    title: "AI Content Creation Suite",
    description: "Complete toolkit for creating engaging content with AI assistance. Includes templates, prompts, and automation tools.",
    price: "$29.99",
    image: "/1.webp",
    category: "Content Tools",
    tags: ["AI Writing", "Templates", "Automation"]
  },
  {
    id: "2", 
    title: "Smart Productivity Dashboard",
    description: "Advanced productivity system with AI-powered task management, time tracking, and goal setting features.",
    price: "$49.99",
    image: "/2.webp",
    category: "Productivity",
    tags: ["Task Management", "Analytics", "Goal Tracking"]
  },
  {
    id: "3",
    title: "Digital Marketing Mastery",
    description: "Comprehensive course and tools for mastering digital marketing in the AI era. Includes advanced strategies and automation.",
    price: "$99.99",
    image: "/3.webp", 
    category: "Education",
    tags: ["Marketing", "Strategy", "Course"]
  },
  {
    id: "4",
    title: "AI Business Analytics Pro",
    description: "Professional analytics suite with AI insights, predictive modeling, and automated reporting for businesses.",
    price: "$199.99",
    image: "/4.webp",
    category: "Business Tools",
    tags: ["Analytics", "AI Insights", "Reports"]
  }
]

export default function DigitalProductsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % digitalProducts.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + digitalProducts.length) % digitalProducts.length)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <div className="relative w-full max-w-6xl mx-auto">
      {/* Main Carousel */}
      <div className="relative h-[500px] overflow-hidden rounded-2xl bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
              {/* Product Image */}
              <div className="relative h-full">
                <Image
                  src={digitalProducts[currentIndex].image}
                  alt={digitalProducts[currentIndex].title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {digitalProducts[currentIndex].category}
                  </span>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-8 lg:p-12 flex flex-col justify-center text-white">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-3xl lg:text-4xl font-bold mb-4">
                      {digitalProducts[currentIndex].title}
                    </h3>
                    <p className="text-lg text-gray-200 leading-relaxed">
                      {digitalProducts[currentIndex].description}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {digitalProducts[currentIndex].tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-white/20 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Price and Actions */}
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold text-yellow-400">
                      {digitalProducts[currentIndex].price}
                    </div>
                    <div className="flex gap-3">
                      <motion.button
                        className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl backdrop-blur-sm border border-white/20 flex items-center gap-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Eye size={16} />
                        Preview
                      </motion.button>
                      <motion.button
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-2 rounded-xl font-semibold flex items-center gap-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ShoppingCart size={16} />
                        Buy Now
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-200"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-200"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Dots Navigation */}
      <div className="flex justify-center mt-6 space-x-2">
        {digitalProducts.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === currentIndex
                ? "bg-purple-600 scale-125"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>

      {/* Product Grid Preview */}
      <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {digitalProducts.map((product, index) => (
          <motion.div
            key={product.id}
            className={`relative cursor-pointer rounded-lg overflow-hidden aspect-square ${
              index === currentIndex ? "ring-2 ring-purple-600" : ""
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => goToSlide(index)}
          >
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
              <div className="absolute bottom-2 left-2 right-2">
                <h4 className="text-white text-sm font-semibold line-clamp-2">
                  {product.title}
                </h4>
                <p className="text-yellow-400 text-sm font-bold">
                  {product.price}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
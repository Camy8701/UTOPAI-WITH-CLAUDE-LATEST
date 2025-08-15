"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, Star, Heart, Share2, CheckCircle, Mail } from "lucide-react"
import { useState } from "react"
import { useParams } from "next/navigation"

// Sample product data (in a real app, this would come from an API)
const productData = {
  "passive-income-vending": {
    id: "passive-income-vending",
    title: "Make Passive Income with Vending Machines - Ebook",
    description:
      "Discover how to generate steady, hands-off income with vending machines—one of the simplest and most reliable passive business models. This ebook walks you through everything from choosing the right machines and ideal locations to stocking products that sell and maintaining your routes efficiently. Whether you're new to entrepreneurship or looking to diversify your income streams, you'll gain practical insights and proven strategies to turn vending machines into a profitable, low-maintenance business.",
    price: "$29.99",
    originalPrice: "$49.99",
    category: "ebooks",
    rating: 4.8,
    reviews: 156,
    mainImage: "/images/products/vending-machines-ebook.png",
    thumbnails: [
      "/images/products/vending-machines-ebook.png",
      "/images/products/vending-preview-1.png",
      "/images/products/vending-preview-2.png",
    ],
    type: "ebook",
    features: [
      "Complete step-by-step guide to vending machine business",
      "Location scouting strategies and negotiation tips",
      "Product selection and inventory management",
      "Financial planning and ROI calculations",
      "Maintenance schedules and troubleshooting",
      "Legal considerations and permits required",
      "Scaling strategies for multiple machines",
      "Real-world case studies and success stories",
    ],
    contactEmail: "info@utopai.com",
    bestseller: true,
  },
}

export default function ProductDetailPage() {
  const params = useParams()
  const productId = params.id as string
  const product = productData[productId as keyof typeof productData]

  const [selectedImage, setSelectedImage] = useState(0)
  const [isLiked, setIsLiked] = useState(false)

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold dark:text-white mb-4">Product Not Found</h1>
          <Link href="/products" className="text-blue-500 hover:underline">
            Back to Products
          </Link>
        </div>
      </div>
    )
  }

  const handleContactClick = () => {
    window.location.href = `mailto:${product.contactEmail}?subject=Inquiry about ${product.title}`
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-4">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </Link>
        </div>
      </div>

      {/* Product Detail */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <motion.div
              className="relative aspect-square bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <Image
                  src={product.thumbnails[selectedImage] || "/placeholder.svg"}
                  alt={product.title}
                  width={400}
                  height={600}
                  className="max-w-full max-h-full object-contain drop-shadow-2xl"
                />
              </div>
            </motion.div>

            {/* Thumbnail Images */}
            <div className="flex gap-4">
              {product.thumbnails.map((thumb, index) => (
                <motion.button
                  key={index}
                  className={`relative aspect-square w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index
                      ? "border-blue-500 ring-2 ring-blue-200"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedImage(index)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center p-2">
                    <Image
                      src={thumb || "/placeholder.svg"}
                      alt={`Preview ${index + 1}`}
                      width={80}
                      height={80}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Right Column - Product Info */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h1 className="text-3xl lg:text-4xl font-bold dark:text-white mb-4">{product.title}</h1>

              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-6">{product.description}</p>

              {/* Rating and Reviews */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <span className="font-medium dark:text-white">{product.rating}</span>
                  <span className="text-gray-500 dark:text-gray-400">({product.reviews} reviews)</span>
                </div>
                {product.bestseller && (
                  <span className="bg-orange-500 text-white text-sm font-bold px-3 py-1 rounded-full">BESTSELLER</span>
                )}
              </div>

              {/* Price Display */}
              <div className="mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">{product.price}</span>
                  <span className="text-xl text-gray-500 line-through">{product.originalPrice}</span>
                </div>
              </div>

              {/* Category */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Category</span>
                  <p className="font-medium dark:text-white capitalize">{product.category}</p>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    className={`p-2 rounded-full border transition-colors ${
                      isLiked
                        ? "bg-red-50 border-red-200 text-red-500"
                        : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400"
                    }`}
                    onClick={() => setIsLiked(!isLiked)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
                  </motion.button>
                  <motion.button
                    className="p-2 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Share2 className="h-5 w-5" />
                  </motion.button>
                </div>
              </div>

              {/* Contact Button */}
              <motion.button
                onClick={handleContactClick}
                className="w-full py-4 px-8 rounded-xl text-lg mb-4 bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Mail className="h-5 w-5" />
                Contact Us for More Info
              </motion.button>

              {/* Contact Info */}
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 text-center">
                Email us at{" "}
                <a href={`mailto:${product.contactEmail}`} className="text-blue-500 hover:underline">
                  {product.contactEmail}
                </a>{" "}
                for pricing and availability
              </p>

              {/* Features */}
              <div>
                <h3 className="text-xl font-bold dark:text-white mb-4">What's Included:</h3>
                <div className="space-y-3">
                  {product.features.map((feature, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                    >
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

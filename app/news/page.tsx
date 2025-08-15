"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, X } from "lucide-react"
import Image from "next/image"
import { getAllNewsArticles, type NewsArticle } from "@/lib/news-data"

const categories = ["All", "Industry News", "Research", "Policy", "Hardware", "Healthcare", "Ethics", "Business"]

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null)

  const allArticles = getAllNewsArticles()

  const filteredArticles = allArticles.filter((article) => {
    const matchesCategory = selectedCategory === "All" || article.category === selectedCategory
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleArticleClick = (article: NewsArticle) => {
    setSelectedArticle(article)
  }

  const closeModal = () => {
    setSelectedArticle(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4"> News &amp; Articles Collection</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Stay updated with the latest developments, breakthroughs, and trends in artificial intelligence.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search AI news by title, category, or keyword"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className={`${
                selectedCategory === category
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-white/10 hover:bg-white/20 text-white border-white/20"
              }`}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article) => (
            <Card
              key={article.id}
              className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer group"
              onClick={() => handleArticleClick(article)}
            >
              <div className="relative overflow-hidden rounded-t-lg">
                <Image
                  src={article.image || "/placeholder.svg"}
                  alt={article.title}
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge className="absolute top-3 left-3 bg-blue-600 hover:bg-blue-700">{article.category}</Badge>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-white mb-3 line-clamp-2 group-hover:text-blue-300 transition-colors">
                  {article.title}
                </h3>
                <p className="text-gray-300 mb-4 line-clamp-3">{article.excerpt}</p>
                <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                  <span>{article.date}</span>
                  <span>by {article.author}</span>
                </div>
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleArticleClick(article)
                  }}
                >
                  Read
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No articles found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Article Modal */}
      <Dialog open={!!selectedArticle} onOpenChange={closeModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-slate-900 border-slate-700">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1 pr-4">
                <Badge className="mb-3 bg-blue-600 hover:bg-blue-700">{selectedArticle?.category}</Badge>
                <DialogTitle className="text-2xl font-bold text-white mb-4 leading-tight">
                  {selectedArticle?.title}
                </DialogTitle>
                <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
                  <span>{selectedArticle?.date}</span>
                  <span>by {selectedArticle?.author}</span>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={closeModal} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </Button>
            </div>
          </DialogHeader>

          {selectedArticle && (
            <div className="space-y-6">
              <div className="relative overflow-hidden rounded-lg">
                <Image
                  src={selectedArticle.image || "/placeholder.svg"}
                  alt={selectedArticle.title}
                  width={800}
                  height={400}
                  className="w-full h-64 object-cover"
                />
              </div>

              <div
                className="prose prose-invert max-w-none text-gray-300"
                dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

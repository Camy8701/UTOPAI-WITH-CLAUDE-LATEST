"use client"

import { useState } from "react"
import { ArrowLeft, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"

interface Article {
  id: string
  title: string
  excerpt: string
  status: "published" | "draft"
  publishedAt: string
  views: number
  comments: number
  author: string
  category: string
}

interface ArticleEditorProps {
  article?: Article | null
  onSave: (articleData: any) => void
  onCancel: () => void
}

export function ArticleEditor({ article, onSave, onCancel }: ArticleEditorProps) {
  const [title, setTitle] = useState(article?.title || "")
  const [content, setContent] = useState("")
  const [excerpt, setExcerpt] = useState(article?.excerpt || "")
  const [category, setCategory] = useState(article?.category || "")
  const [status, setStatus] = useState<"published" | "draft">(article?.status || "draft")
  const [metaTitle, setMetaTitle] = useState("")
  const [metaDescription, setMetaDescription] = useState("")
  const [tags, setTags] = useState("")
  const [activeTab, setActiveTab] = useState("content")

  const handleSave = () => {
    const articleData = {
      title,
      content,
      excerpt,
      category,
      status,
      metaTitle,
      metaDescription,
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    }
    onSave(articleData)
  }

  const categories = [
    "AI Technology",
    "Web Development",
    "AI Ethics",
    "Machine Learning",
    "Data Science",
    "Programming",
    "Design",
    "Business",
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onCancel} className="flex items-center gap-2">
                <ArrowLeft size={16} />
                Back
              </Button>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                {article ? "Edit Article" : "New Article"}
              </h1>
              {status && <Badge variant={status === "published" ? "default" : "secondary"}>{status}</Badge>}
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={() => setStatus(status === "draft" ? "published" : "draft")}>
                {status === "draft" ? "Publish" : "Unpublish"}
              </Button>
              <Button onClick={handleSave} className="flex items-center gap-2">
                <Save size={16} />
                Save
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Editor */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="seo">SEO</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>

              {/* Content Tab */}
              <TabsContent value="content" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Article Content</CardTitle>
                    <CardDescription>Write your article content here</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter article title..."
                        className="text-lg font-medium"
                      />
                    </div>
                    <div>
                      <Label htmlFor="excerpt">Excerpt</Label>
                      <Textarea
                        id="excerpt"
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                        placeholder="Brief description of your article..."
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="content">Content</Label>
                      <Textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Write your article content here..."
                        rows={20}
                        className="font-mono"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Article Settings</CardTitle>
                    <CardDescription>Configure your article settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="tags">Tags</Label>
                      <Input
                        id="tags"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="Enter tags separated by commas..."
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="published"
                        checked={status === "published"}
                        onCheckedChange={(checked) => setStatus(checked ? "published" : "draft")}
                      />
                      <Label htmlFor="published">Published</Label>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* SEO Tab */}
              <TabsContent value="seo" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>SEO Settings</CardTitle>
                    <CardDescription>Optimize your article for search engines</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="meta-title">Meta Title</Label>
                      <Input
                        id="meta-title"
                        value={metaTitle}
                        onChange={(e) => setMetaTitle(e.target.value)}
                        placeholder="SEO title for search engines..."
                      />
                      <p className="text-xs text-gray-500 mt-1">{metaTitle.length}/60 characters</p>
                    </div>
                    <div>
                      <Label htmlFor="meta-description">Meta Description</Label>
                      <Textarea
                        id="meta-description"
                        value={metaDescription}
                        onChange={(e) => setMetaDescription(e.target.value)}
                        placeholder="SEO description for search engines..."
                        rows={3}
                      />
                      <p className="text-xs text-gray-500 mt-1">{metaDescription.length}/160 characters</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Preview Tab */}
              <TabsContent value="preview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Article Preview</CardTitle>
                    <CardDescription>Preview how your article will look</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <article className="prose dark:prose-invert max-w-none">
                      <h1>{title || "Untitled Article"}</h1>
                      <p className="text-gray-600 dark:text-gray-400 italic">{excerpt}</p>
                      <div className="whitespace-pre-wrap">{content || "No content yet..."}</div>
                    </article>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={handleSave} className="w-full flex items-center gap-2">
                  <Save size={16} />
                  Save Article
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setStatus(status === "draft" ? "published" : "draft")}
                  className="w-full"
                >
                  {status === "draft" ? "Publish" : "Unpublish"}
                </Button>
                <Button variant="ghost" onClick={onCancel} className="w-full">
                  Cancel
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Article Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Word Count:</span>
                  <span>{content.split(/\s+/).filter(Boolean).length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Character Count:</span>
                  <span>{content.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Reading Time:</span>
                  <span>{Math.ceil(content.split(/\s+/).filter(Boolean).length / 200)} min</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

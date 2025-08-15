"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Code,
  Link,
  ImageIcon,
  Save,
  Eye,
  Upload,
  X,
  Plus,
  Heading1,
  Heading2,
  Heading3,
  Undo,
  Redo,
  FileText,
  Tag,
  Globe,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface BlogPost {
  id?: string
  title: string
  content: string
  excerpt: string
  tags: string[]
  category: string
  status: "draft" | "published" | "scheduled"
  publishDate?: string
  featuredImage?: string
  seoTitle?: string
  seoDescription?: string
  slug?: string
}

interface RichTextEditorProps {
  initialPost?: BlogPost
  onSave?: (post: BlogPost) => void
  onPublish?: (post: BlogPost) => void
  onPreview?: (post: BlogPost) => void
}

export function RichTextEditor({ initialPost, onSave, onPublish, onPreview }: RichTextEditorProps) {
  const { toast } = useToast()
  const editorRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [post, setPost] = useState<BlogPost>({
    title: "",
    content: "",
    excerpt: "",
    tags: [],
    category: "",
    status: "draft",
    featuredImage: "",
    seoTitle: "",
    seoDescription: "",
    slug: "",
    ...initialPost,
  })

  const [currentTag, setCurrentTag] = useState("")
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [autoSaveStatus, setAutoSaveStatus] = useState<"saved" | "saving" | "unsaved">("saved")

  // Auto-save functionality
  useEffect(() => {
    const timer = setTimeout(() => {
      if (autoSaveStatus === "unsaved") {
        handleAutoSave()
      }
    }, 3000)

    return () => clearTimeout(timer)
  }, [post, autoSaveStatus])

  // Update word count
  useEffect(() => {
    const text = editorRef.current?.textContent || ""
    setWordCount(text.split(/\s+/).filter((word) => word.length > 0).length)
  }, [post.content])

  // Generate slug from title
  useEffect(() => {
    if (post.title && !post.slug) {
      const slug = post.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
      setPost((prev) => ({ ...prev, slug }))
    }
  }, [post.title])

  const handleAutoSave = useCallback(async () => {
    setAutoSaveStatus("saving")
    try {
      // Simulate auto-save API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setAutoSaveStatus("saved")
      toast({
        title: "Auto-saved",
        description: "Your changes have been automatically saved.",
      })
    } catch (error) {
      setAutoSaveStatus("unsaved")
      toast({
        title: "Auto-save failed",
        description: "Failed to auto-save changes. Please save manually.",
        variant: "destructive",
      })
    }
  }, [post, toast])

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    handleContentChange()
  }

  const handleContentChange = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML
      setPost((prev) => ({ ...prev, content }))
      setAutoSaveStatus("unsaved")
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string
        execCommand("insertImage", imageUrl)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleLinkInsert = () => {
    const url = prompt("Enter URL:")
    if (url) {
      execCommand("createLink", url)
    }
  }

  const addTag = () => {
    if (currentTag.trim() && !post.tags.includes(currentTag.trim())) {
      setPost((prev) => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()],
      }))
      setCurrentTag("")
      setAutoSaveStatus("unsaved")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setPost((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
    setAutoSaveStatus("unsaved")
  }

  const handleSave = () => {
    onSave?.(post)
    setAutoSaveStatus("saved")
    toast({
      title: "Post saved",
      description: "Your blog post has been saved successfully.",
    })
  }

  const handlePublish = () => {
    const publishedPost = { ...post, status: "published" as const }
    onPublish?.(publishedPost)
    setPost(publishedPost)
    toast({
      title: "Post published",
      description: "Your blog post is now live!",
    })
  }

  const handlePreview = () => {
    setIsPreviewMode(!isPreviewMode)
    onPreview?.(post)
  }

  const toolbarButtons = [
    { icon: Bold, command: "bold", title: "Bold" },
    { icon: Italic, command: "italic", title: "Italic" },
    { icon: Underline, command: "underline", title: "Underline" },
    { icon: Strikethrough, command: "strikeThrough", title: "Strikethrough" },
  ]

  const alignmentButtons = [
    { icon: AlignLeft, command: "justifyLeft", title: "Align Left" },
    { icon: AlignCenter, command: "justifyCenter", title: "Align Center" },
    { icon: AlignRight, command: "justifyRight", title: "Align Right" },
    { icon: AlignJustify, command: "justifyFull", title: "Justify" },
  ]

  const headingButtons = [
    { icon: Heading1, command: "formatBlock", value: "h1", title: "Heading 1" },
    { icon: Heading2, command: "formatBlock", value: "h2", title: "Heading 2" },
    { icon: Heading3, command: "formatBlock", value: "h3", title: "Heading 3" },
  ]

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <FileText className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold">Blog Post Editor</h1>
            <p className="text-sm text-muted-foreground">
              {autoSaveStatus === "saved" && "All changes saved"}
              {autoSaveStatus === "saving" && "Saving..."}
              {autoSaveStatus === "unsaved" && "Unsaved changes"}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Badge variant={post.status === "published" ? "default" : "secondary"}>{post.status}</Badge>
          <span className="text-sm text-muted-foreground">{wordCount} words</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Editor */}
        <div className="lg:col-span-3 space-y-4">
          {/* Post Title */}
          <Card>
            <CardContent className="p-4">
              <Input
                placeholder="Enter post title..."
                value={post.title}
                onChange={(e) => {
                  setPost((prev) => ({ ...prev, title: e.target.value }))
                  setAutoSaveStatus("unsaved")
                }}
                className="text-2xl font-bold border-none p-0 focus-visible:ring-0"
              />
            </CardContent>
          </Card>

          {/* Toolbar */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center gap-2">
                {/* Formatting */}
                <div className="flex items-center space-x-1">
                  {toolbarButtons.map(({ icon: Icon, command, title }) => (
                    <Button key={command} variant="ghost" size="sm" onClick={() => execCommand(command)} title={title}>
                      <Icon className="h-4 w-4" />
                    </Button>
                  ))}
                </div>

                <Separator orientation="vertical" className="h-6" />

                {/* Headings */}
                <div className="flex items-center space-x-1">
                  {headingButtons.map(({ icon: Icon, command, value, title }) => (
                    <Button
                      key={value}
                      variant="ghost"
                      size="sm"
                      onClick={() => execCommand(command, value)}
                      title={title}
                    >
                      <Icon className="h-4 w-4" />
                    </Button>
                  ))}
                </div>

                <Separator orientation="vertical" className="h-6" />

                {/* Alignment */}
                <div className="flex items-center space-x-1">
                  {alignmentButtons.map(({ icon: Icon, command, title }) => (
                    <Button key={command} variant="ghost" size="sm" onClick={() => execCommand(command)} title={title}>
                      <Icon className="h-4 w-4" />
                    </Button>
                  ))}
                </div>

                <Separator orientation="vertical" className="h-6" />

                {/* Lists */}
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => execCommand("insertUnorderedList")}
                    title="Bullet List"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => execCommand("insertOrderedList")}
                    title="Numbered List"
                  >
                    <ListOrdered className="h-4 w-4" />
                  </Button>
                </div>

                <Separator orientation="vertical" className="h-6" />

                {/* Media & Links */}
                <div className="flex items-center space-x-1">
                  <Button variant="ghost" size="sm" onClick={handleLinkInsert} title="Insert Link">
                    <Link className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()} title="Insert Image">
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => execCommand("formatBlock", "blockquote")}
                    title="Quote"
                  >
                    <Quote className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => execCommand("formatBlock", "pre")}
                    title="Code Block"
                  >
                    <Code className="h-4 w-4" />
                  </Button>
                </div>

                <Separator orientation="vertical" className="h-6" />

                {/* Undo/Redo */}
                <div className="flex items-center space-x-1">
                  <Button variant="ghost" size="sm" onClick={() => execCommand("undo")} title="Undo">
                    <Undo className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => execCommand("redo")} title="Redo">
                    <Redo className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content Editor */}
          <Card>
            <CardContent className="p-0">
              {isPreviewMode ? (
                <div className="p-6 prose prose-lg max-w-none">
                  <h1>{post.title}</h1>
                  <div dangerouslySetInnerHTML={{ __html: post.content }} />
                </div>
              ) : (
                <div
                  ref={editorRef}
                  contentEditable
                  className="min-h-[500px] p-6 prose prose-lg max-w-none focus:outline-none"
                  onInput={handleContentChange}
                  dangerouslySetInnerHTML={{ __html: post.content }}
                  style={{ whiteSpace: "pre-wrap" }}
                />
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button onClick={handleSave} variant="outline">
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              <Button onClick={handlePreview} variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                {isPreviewMode ? "Edit" : "Preview"}
              </Button>
            </div>

            <Button onClick={handlePublish} className="bg-green-600 hover:bg-green-700">
              <Globe className="h-4 w-4 mr-2" />
              Publish
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Post Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Post Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={post.category}
                  onChange={(e) => {
                    setPost((prev) => ({ ...prev, category: e.target.value }))
                    setAutoSaveStatus("unsaved")
                  }}
                  placeholder="Enter category"
                />
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={post.status}
                  onChange={(e) => {
                    setPost((prev) => ({ ...prev, status: e.target.value as any }))
                    setAutoSaveStatus("unsaved")
                  }}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>

              {post.status === "scheduled" && (
                <div>
                  <Label htmlFor="publishDate">Publish Date</Label>
                  <Input
                    id="publishDate"
                    type="datetime-local"
                    value={post.publishDate}
                    onChange={(e) => {
                      setPost((prev) => ({ ...prev, publishDate: e.target.value }))
                      setAutoSaveStatus("unsaved")
                    }}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Tag className="h-4 w-4 mr-2" />
                Tags
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  placeholder="Add tag"
                  onKeyPress={(e) => e.key === "Enter" && addTag()}
                />
                <Button onClick={addTag} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Featured Image */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Featured Image</CardTitle>
            </CardHeader>
            <CardContent>
              {post.featuredImage ? (
                <div className="space-y-2">
                  <img
                    src={post.featuredImage || "/placeholder.svg"}
                    alt="Featured"
                    className="w-full h-32 object-cover rounded-md"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setPost((prev) => ({ ...prev, featuredImage: "" }))
                      setAutoSaveStatus("unsaved")
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <Button variant="outline" className="w-full" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Image
                </Button>
              )}
            </CardContent>
          </Card>

          {/* SEO Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">SEO Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  value={post.slug}
                  onChange={(e) => {
                    setPost((prev) => ({ ...prev, slug: e.target.value }))
                    setAutoSaveStatus("unsaved")
                  }}
                  placeholder="url-slug"
                />
              </div>

              <div>
                <Label htmlFor="seoTitle">SEO Title</Label>
                <Input
                  id="seoTitle"
                  value={post.seoTitle}
                  onChange={(e) => {
                    setPost((prev) => ({ ...prev, seoTitle: e.target.value }))
                    setAutoSaveStatus("unsaved")
                  }}
                  placeholder="SEO optimized title"
                />
              </div>

              <div>
                <Label htmlFor="seoDescription">Meta Description</Label>
                <Textarea
                  id="seoDescription"
                  value={post.seoDescription}
                  onChange={(e) => {
                    setPost((prev) => ({ ...prev, seoDescription: e.target.value }))
                    setAutoSaveStatus("unsaved")
                  }}
                  placeholder="Brief description for search engines"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={post.excerpt}
                  onChange={(e) => {
                    setPost((prev) => ({ ...prev, excerpt: e.target.value }))
                    setAutoSaveStatus("unsaved")
                  }}
                  placeholder="Brief excerpt of the post"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { FileText, Plus, Search, Filter, Edit, Trash2, Eye, Calendar, User, Tag, Save, X, Globe } from "lucide-react"

interface BlogPost {
  id: string
  title: string
  excerpt: string | null
  content: string
  content_type: "story" | "news" | "tool" | "article"
  published: boolean
  slug: string
  author_id: string
  thumbnail_url?: string | null
  audio_url?: string | null
  view_count?: number
  like_count?: number
  comment_count?: number
  created_at: string
  updated_at: string
  profiles?: {
    full_name: string | null
  }
}

// Real database integration will replace mock data

export default function PostsPage() {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [contentTypeFilter, setContentTypeFilter] = useState("all")
  const [showEditor, setShowEditor] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [postToDelete, setPostToDelete] = useState<string | null>(null)

  // Editor state
  const [editorData, setEditorData] = useState({
    title: "",
    excerpt: "",
    content: "",
    content_type: "story" as "story" | "news" | "tool" | "article",
    published: false,
    slug: "",
    thumbnail_url: "",
    audio_url: "",
    audioFile: null as File | null,
  })

  const contentTypes = [
    { value: "story", label: "AI Story", icon: "📖" },
    { value: "news", label: "News Article", icon: "📢" },
    { value: "tool", label: "AI Tool Review", icon: "⚡" },
    { value: "article", label: "Article", icon: "📝" },
  ]

  // Load posts from static data (Firebase migration in progress)
  const loadPosts = async () => {
    try {
      setIsLoading(true)
      // TODO: Replace with Firebase-based posts when ready
      const staticPosts: BlogPost[] = []
      setPosts(staticPosts)
    } catch (error) {
      console.error('Error loading posts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Check if user is admin
    if (typeof window !== "undefined") {
      const isAdmin = localStorage.getItem("isAdminLoggedIn") === "true"
      const adminEmail = localStorage.getItem("adminEmail")

      if (!isAdmin || adminEmail !== "utopaiblog@gmail.com") {
        router.push("/admin/login")
        return
      }

      setIsAuthorized(true)
      loadPosts()
    }
  }, [router])

  useEffect(() => {
    let filtered = posts

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (post.excerpt && post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())) ||
          post.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by status
    if (statusFilter !== "all") {
      const isPublished = statusFilter === "published"
      filtered = filtered.filter((post) => post.published === isPublished)
    }

    // Filter by content type
    if (contentTypeFilter !== "all") {
      filtered = filtered.filter((post) => post.content_type === contentTypeFilter)
    }

    setFilteredPosts(filtered)
  }, [posts, searchTerm, statusFilter, contentTypeFilter])

  const handleCreatePost = () => {
    setEditingPost(null)
    setEditorData({
      title: "",
      excerpt: "",
      content: "",
      content_type: "story",
      published: false,
      slug: "",
      thumbnail_url: "",
      audio_url: "",
      audioFile: null,
    })
    setShowEditor(true)
  }

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post)
    setEditorData({
      title: post.title,
      excerpt: post.excerpt || "",
      content: post.content,
      content_type: post.content_type,
      published: post.published,
      slug: post.slug,
      thumbnail_url: post.thumbnail_url || "",
      audio_url: post.audio_url || "",
      audioFile: null,
    })
    setShowEditor(true)
  }

  const handleFileUpload = async (file: File, type: 'audio' | 'video'): Promise<string> => {
    // In production, you would upload to a file storage service like:
    // - AWS S3
    // - Cloudinary
    // - Your server's upload endpoint
    
    // For now, we'll simulate file upload and return a mock URL
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUrl = `https://utopai.blog/uploads/${type}/${Date.now()}-${file.name}`
        resolve(mockUrl)
      }, 1000)
    })
  }

  const handleSavePost = async () => {
    if (!editorData.title.trim()) {
      alert("Please enter a title for the post")
      return
    }

    try {
      setIsLoading(true)
      
      // Generate slug from title if not provided
      const slug = editorData.slug.trim() || editorData.title.trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

      // Handle file upload if needed
      let audioUrl = editorData.audio_url
      if (editorData.audioFile) {
        audioUrl = await handleFileUpload(editorData.audioFile, 'audio')
      }

      // Get current user - for now we'll use a default admin user ID
      // In production, you'd get this from the actual authenticated user
      const adminUserId = 'eed7219e-4647-4218-9df4-b8b1afeba7ea' // Default admin user

      const postData = {
        title: editorData.title.trim(),
        excerpt: editorData.excerpt.trim() || null,
        content: editorData.content.trim(),
        content_type: editorData.content_type,
        published: editorData.published,
        slug: slug,
        author_id: adminUserId,
        thumbnail_url: editorData.thumbnail_url.trim() || null,
        audio_url: audioUrl || null,
      }

      // TODO: Implement Firebase post creation/updating
      console.log('Firebase post operations not implemented yet:', postData)
      alert('Post operations moved to Firebase - coming soon!')
      return

      // Reload posts
      await loadPosts()
      
      setShowEditor(false)
      setEditingPost(null)
    } catch (error) {
      console.error('Error saving post:', error)
      alert('Failed to save post. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeletePost = async (id: string) => {
    try {
      // TODO: Implement Firebase post deletion
      console.log('Firebase post deletion not implemented yet:', id)
      alert('Post deletion moved to Firebase - coming soon!')
      
      setDeleteDialogOpen(false)
      setPostToDelete(null)
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('Failed to delete post. Please try again.')
    }
  }

  const handleToggleStatus = async (id: string) => {
    try {
      // TODO: Implement Firebase post status toggling
      console.log('Firebase post status toggle not implemented yet:', id)
      alert('Post status changes moved to Firebase - coming soon!')
    } catch (error) {
      console.error('Error updating post status:', error)
      alert('Failed to update post status. Please try again.')
    }
  }

  const getStatusColor = (published: boolean) => {
    return published 
      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading posts...</p>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Access Denied</h1>
          <p className="text-gray-600 dark:text-gray-400">Redirecting to admin login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <FileText className="h-6 w-6 text-red-600" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Posts Management</h1>
              <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                {filteredPosts.length} posts
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={handleCreatePost} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Post
              </Button>
              <Button onClick={() => router.push("/admin")} variant="outline">
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Search
            </CardTitle>
            <CardDescription>Filter and search through your blog posts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={contentTypeFilter} onValueChange={setContentTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Content type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {contentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={() => {
                  setSearchTerm("")
                  setStatusFilter("all")
                  setContentTypeFilter("all")
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Posts</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{posts.length}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Published</p>
                  <p className="text-2xl font-bold text-green-600">
                    {posts.filter((post) => post.published === true).length}
                  </p>
                </div>
                <Globe className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Drafts</p>
                  <p className="text-2xl font-bold text-gray-600">
                    {posts.filter((post) => post.published === false).length}
                  </p>
                </div>
                <Edit className="h-8 w-8 text-gray-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Views</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {posts.reduce((total, post) => total + (post.view_count || 0), 0).toLocaleString()}
                  </p>
                </div>
                <Eye className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Posts List */}
        <Card>
          <CardHeader>
            <CardTitle>All Posts ({filteredPosts.length})</CardTitle>
            <CardDescription>Manage your blog posts and articles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="font-medium text-gray-900 dark:text-white">{post.title}</h3>
                      <Badge className={getStatusColor(post.published)}>{post.published ? 'published' : 'draft'}</Badge>
                      <Badge variant="outline" className="text-xs">
                        {contentTypes.find(ct => ct.value === post.content_type)?.icon} {post.content_type}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-2">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {post.profiles?.full_name || 'Admin'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(post.created_at).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {post.view_count || 0}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {post.audio_url && (
                        <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                          🎵 Audio Available
                        </Badge>
                      )}
                      {post.thumbnail_url && (
                        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                          🖼️ Thumbnail
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleStatus(post.id)}
                      className={`flex items-center gap-1 ${
                        post.published
                          ? "text-orange-600 hover:text-orange-700"
                          : "text-green-600 hover:text-green-700"
                      }`}
                    >
                      {post.published ? "Unpublish" : "Publish"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditPost(post)}
                      className="flex items-center gap-1"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setPostToDelete(post.id)
                        setDeleteDialogOpen(true)
                      }}
                      className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}

              {filteredPosts.length === 0 && (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 mb-2">
                    {searchTerm || statusFilter !== "all" || contentTypeFilter !== "all"
                      ? "No posts found matching your criteria."
                      : "No posts yet. Create your first post!"}
                  </p>
                  {!searchTerm && statusFilter === "all" && contentTypeFilter === "all" && (
                    <Button onClick={handleCreatePost} className="mt-4">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Post
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Post Editor Dialog */}
      <Dialog open={showEditor} onOpenChange={setShowEditor}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPost ? "Edit Post" : "Create New Post"}</DialogTitle>
            <DialogDescription>
              {editingPost ? "Make changes to your post" : "Create a new blog post"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={editorData.title}
                  onChange={(e) => setEditorData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter post title..."
                  className="text-lg font-medium"
                />
              </div>

              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={editorData.excerpt}
                  onChange={(e) => setEditorData((prev) => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Brief description of your post..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={editorData.content}
                  onChange={(e) => setEditorData((prev) => ({ ...prev, content: e.target.value }))}
                  placeholder="Write your post content here..."
                  rows={8}
                  className="font-mono text-sm"
                />
              </div>

              {/* Media URLs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="thumbnailUrl">Thumbnail Image URL</Label>
                  <Input
                    id="thumbnailUrl"
                    value={editorData.thumbnail_url}
                    onChange={(e) => setEditorData((prev) => ({ ...prev, thumbnail_url: e.target.value }))}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div>
                  <Label htmlFor="audioUrl">Audio URL (for Listen feature)</Label>
                  <Input
                    id="audioUrl"
                    value={editorData.audio_url}
                    onChange={(e) => setEditorData((prev) => ({ ...prev, audio_url: e.target.value }))}
                    placeholder="https://example.com/audio.mp3"
                  />
                </div>
              </div>

              {/* Audio Upload Section */}
              {(editorData.content_type === "story") && (
                <div className="space-y-4 p-4 border rounded-lg bg-green-50 dark:bg-green-900/20">
                  <h4 className="font-medium text-green-800 dark:text-green-200 flex items-center gap-2">
                    🎵 Audio Content (for "Listen" button)
                  </h4>
                  
                  <div>
                    <Label htmlFor="audioFile">Upload Audio File</Label>
                    <Input
                      id="audioFile"
                      type="file"
                      accept="audio/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null
                        setEditorData((prev) => ({ ...prev, audioFile: file }))
                      }}
                      className="mb-2"
                    />
                    {editorData.audioFile && (
                      <p className="text-sm text-green-600 dark:text-green-400">
                        Selected: {editorData.audioFile.name}
                      </p>
                    )}
                  </div>

                  <div className="text-sm text-gray-600 dark:text-gray-400">OR</div>

                  <div>
                    <Label htmlFor="audioUrlAlt">Audio URL (if hosted elsewhere)</Label>
                    <Input
                      id="audioUrlAlt"
                      value={editorData.audio_url}
                      onChange={(e) => setEditorData((prev) => ({ ...prev, audio_url: e.target.value }))}
                      placeholder="https://example.com/audio.mp3"
                    />
                  </div>
                </div>
              )}

              {/* Video Upload Section */}
              {editorData.content_type === "tool" && (
                <div className="space-y-4 p-4 border rounded-lg bg-blue-50 dark:bg-blue-900/20">
                  <h4 className="font-medium text-blue-800 dark:text-blue-200 flex items-center gap-2">
                    ⚡ AI Tool Content
                  </h4>
                  
                  <div>
                    <Label htmlFor="toolUrl">Tool Demo/Website URL</Label>
                    <Input
                      id="toolUrl"
                      value={editorData.thumbnail_url || ''}
                      onChange={(e) => setEditorData((prev) => ({ ...prev, thumbnail_url: e.target.value }))}
                      placeholder="https://tool-website.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="toolDescription">Additional Tool Info</Label>
                    <Input
                      id="toolDescription"
                      value={editorData.excerpt}
                      onChange={(e) => setEditorData((prev) => ({ ...prev, excerpt: e.target.value }))}
                      placeholder="Brief description of the AI tool features"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="publishedSwitch"
                  checked={editorData.published}
                  onCheckedChange={(checked) =>
                    setEditorData((prev) => ({ ...prev, published: checked }))
                  }
                />
                <Label htmlFor="publishedSwitch">Published</Label>
              </div>

              <div>
                <Label>Content Type</Label>
                <Select
                  value={editorData.content_type}
                  onValueChange={(value: "story" | "news" | "tool" | "article") =>
                    setEditorData((prev) => ({ ...prev, content_type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {contentTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.icon} {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="slug">URL Slug (optional)</Label>
                <Input
                  id="slug"
                  value={editorData.slug}
                  onChange={(e) => setEditorData((prev) => ({ ...prev, slug: e.target.value }))}
                  placeholder="url-friendly-slug"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditor(false)}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSavePost}>
              <Save className="h-4 w-4 mr-2" />
              {editingPost ? "Update Post" : "Create Post"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Post</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this post? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => postToDelete && handleDeletePost(postToDelete)}>
              Delete Post
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

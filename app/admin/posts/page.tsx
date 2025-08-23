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
import { FileText, Plus, Search, Filter, Edit, Trash2, Eye, Calendar, User, Tag, Save, X, Globe, Upload, Image as ImageIcon, Music } from "lucide-react"
import { useFirebaseAuth } from "@/components/firebase-auth-provider"
import { BlogPostsAdmin, BlogPost, POST_CATEGORIES, uploadFile, generateSlug } from "@/lib/firebase-admin"
import { toast } from "sonner"

export default function PostsPage() {
  const router = useRouter()
  const { user } = useFirebaseAuth()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [contentTypeFilter, setContentTypeFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [showEditor, setShowEditor] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [postToDelete, setPostToDelete] = useState<string | null>(null)

  // Editor state
  const [editorData, setEditorData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "AI Stories",
    content_type: "story" as "story" | "news" | "tool" | "article",
    published: false,
    featured: false,
    slug: "",
    tags: [] as string[],
    tagInput: "",
    thumbnailFile: null as File | null,
    audioFile: null as File | null,
  })

  const contentTypes = [
    { value: "story", label: "AI Story", icon: "📖" },
    { value: "news", label: "News Article", icon: "📢" },
    { value: "tool", label: "AI Tool Review", icon: "⚡" },
    { value: "article", label: "Article", icon: "📝" },
  ]

  // Load posts from Firebase
  const loadPosts = async () => {
    try {
      setIsLoading(true)
      const firebasePosts = await BlogPostsAdmin.getAllPosts()
      setPosts(firebasePosts)
    } catch (error) {
      console.error('Error loading posts:', error)
      toast.error('Failed to load posts')
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

    // Filter by category
    if (categoryFilter !== "all") {
      filtered = filtered.filter((post) => post.category === categoryFilter)
    }

    setFilteredPosts(filtered)
  }, [posts, searchTerm, statusFilter, contentTypeFilter, categoryFilter])

  const handleCreatePost = () => {
    setEditingPost(null)
    setEditorData({
      title: "",
      excerpt: "",
      content: "",
      category: "AI Stories",
      content_type: "story",
      published: false,
      featured: false,
      slug: "",
      tags: [],
      tagInput: "",
      thumbnailFile: null,
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
      category: post.category,
      content_type: post.content_type,
      published: post.published,
      featured: post.featured || false,
      slug: post.slug,
      tags: post.tags || [],
      tagInput: "",
      thumbnailFile: null,
      audioFile: null,
    })
    setShowEditor(true)
  }

  const handleSavePost = async () => {
    if (!editorData.title.trim()) {
      toast.error("Please enter a title for the post")
      return
    }

    if (!user) {
      toast.error("You must be logged in to create posts")
      return
    }

    try {
      setIsSaving(true)
      
      // Generate slug from title if not provided
      const slug = editorData.slug.trim() || generateSlug(editorData.title)

      let thumbnailUrl = ""
      let audioUrl = ""

      // Upload thumbnail if provided
      if (editorData.thumbnailFile) {
        try {
          console.log('Uploading thumbnail...', editorData.thumbnailFile.name)
          thumbnailUrl = await uploadFile(editorData.thumbnailFile, 'thumbnails')
          console.log('Thumbnail uploaded successfully:', thumbnailUrl)
        } catch (error) {
          console.error('Thumbnail upload failed:', error)
          // Continue with post creation even if thumbnail upload fails
          toast.error('Thumbnail upload failed, but post will be created without it')
        }
      }

      // Upload audio if provided  
      if (editorData.audioFile) {
        try {
          console.log('Uploading audio...', editorData.audioFile.name)
          audioUrl = await uploadFile(editorData.audioFile, 'audio')
          console.log('Audio uploaded successfully:', audioUrl)
        } catch (error) {
          console.error('Audio upload failed:', error)
          // Continue with post creation even if audio upload fails
          toast.error('Audio upload failed, but post will be created without it')
        }
      }

      const postData: Omit<BlogPost, 'id'> = {
        title: editorData.title.trim(),
        excerpt: editorData.excerpt.trim() || undefined,
        content: editorData.content.trim(),
        category: editorData.category,
        content_type: editorData.content_type,
        published: editorData.published,
        featured: editorData.featured,
        slug: slug,
        author_id: user.uid,
        author_name: user.displayName || user.email || 'Admin',
        tags: editorData.tags,
        thumbnail_url: thumbnailUrl || editingPost?.thumbnail_url,
        audio_url: audioUrl || editingPost?.audio_url,
      }

      if (editingPost) {
        // Update existing post
        await BlogPostsAdmin.updatePost(editingPost.id!, postData)
        toast.success("Post updated successfully!")
      } else {
        // Create new post
        await BlogPostsAdmin.createPost(postData)
        toast.success("Post created successfully!")
      }

      // Reload posts
      await loadPosts()
      
      setShowEditor(false)
      setEditingPost(null)
    } catch (error) {
      console.error('Error saving post:', error)
      toast.error('Failed to save post. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeletePost = async (id: string) => {
    try {
      await BlogPostsAdmin.deletePost(id)
      toast.success("Post deleted successfully!")
      
      // Reload posts
      await loadPosts()
      
      setDeleteDialogOpen(false)
      setPostToDelete(null)
    } catch (error) {
      console.error('Error deleting post:', error)
      toast.error('Failed to delete post. Please try again.')
    }
  }

  const handleToggleStatus = async (id: string) => {
    try {
      const post = posts.find(p => p.id === id)
      if (!post) return

      await BlogPostsAdmin.updatePost(id, { published: !post.published })
      toast.success(`Post ${post.published ? 'unpublished' : 'published'} successfully!`)
      
      // Reload posts
      await loadPosts()
    } catch (error) {
      console.error('Error updating post status:', error)
      toast.error('Failed to update post status. Please try again.')
    }
  }

  const addTag = () => {
    if (editorData.tagInput.trim() && !editorData.tags.includes(editorData.tagInput.trim())) {
      setEditorData(prev => ({
        ...prev,
        tags: [...prev.tags, prev.tagInput.trim()],
        tagInput: ""
      }))
    }
  }

  const removeTag = (tagToRemove: string) => {
    setEditorData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
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
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {POST_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={() => {
                  setSearchTerm("")
                  setStatusFilter("all")
                  setContentTypeFilter("all")
                  setCategoryFilter("all")
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
                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                        {post.category}
                      </Badge>
                      {post.featured && (
                        <Badge className="bg-yellow-100 text-yellow-800 text-xs">Featured</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-2">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {post.author_name || 'Admin'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {post.created_at ? new Date(post.created_at.seconds * 1000).toLocaleDateString() : 'N/A'}
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
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex gap-1">
                          {post.tags.slice(0, 3).map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                          {post.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{post.tags.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleStatus(post.id!)}
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
                        setPostToDelete(post.id!)
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
                    {searchTerm || statusFilter !== "all" || contentTypeFilter !== "all" || categoryFilter !== "all"
                      ? "No posts found matching your criteria."
                      : "No posts yet. Create your first post!"}
                  </p>
                  {!searchTerm && statusFilter === "all" && contentTypeFilter === "all" && categoryFilter === "all" && (
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
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  value={editorData.content}
                  onChange={(e) => setEditorData((prev) => ({ ...prev, content: e.target.value }))}
                  placeholder="Write your post content here..."
                  rows={12}
                  className="font-mono text-sm"
                />
              </div>

              {/* Media Upload */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="thumbnailFile">Thumbnail Image</Label>
                  <Input
                    id="thumbnailFile"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null
                      setEditorData((prev) => ({ ...prev, thumbnailFile: file }))
                    }}
                  />
                  {editorData.thumbnailFile && (
                    <p className="text-sm text-green-600 mt-1">
                      <ImageIcon className="inline h-3 w-3 mr-1" />
                      {editorData.thumbnailFile.name}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="audioFile">Audio File</Label>
                  <Input
                    id="audioFile"
                    type="file"
                    accept="audio/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null
                      setEditorData((prev) => ({ ...prev, audioFile: file }))
                    }}
                  />
                  {editorData.audioFile && (
                    <p className="text-sm text-green-600 mt-1">
                      <Music className="inline h-3 w-3 mr-1" />
                      {editorData.audioFile.name}
                    </p>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div>
                <Label>Tags</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={editorData.tagInput}
                    onChange={(e) => setEditorData(prev => ({ ...prev, tagInput: e.target.value }))}
                    placeholder="Add a tag..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag} size="sm">Add</Button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {editorData.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                      #{tag} <X className="h-3 w-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              </div>
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

              <div className="flex items-center space-x-2">
                <Switch
                  id="featuredSwitch"
                  checked={editorData.featured}
                  onCheckedChange={(checked) =>
                    setEditorData((prev) => ({ ...prev, featured: checked }))
                  }
                />
                <Label htmlFor="featuredSwitch">Featured</Label>
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
                <Label>Category</Label>
                <Select
                  value={editorData.category}
                  onValueChange={(value) =>
                    setEditorData((prev) => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {POST_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
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
            <Button onClick={handleSavePost} disabled={isSaving}>
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {editingPost ? "Update Post" : "Create Post"}
                </>
              )}
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
              Are you sure you want to delete this post? This will also delete all associated comments and likes. This action cannot be undone.
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
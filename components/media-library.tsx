"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Upload,
  Search,
  Grid,
  List,
  Trash2,
  Download,
  Copy,
  ImageIcon,
  File,
  Video,
  Music,
  FileText,
  MoreHorizontal,
  Calendar,
  Eye,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"

interface MediaFile {
  id: string
  name: string
  url: string
  type: "image" | "video" | "audio" | "document"
  size: number
  uploadedAt: string
  dimensions?: { width: number; height: number }
  alt?: string
}

interface MediaLibraryProps {
  onSelect?: (file: MediaFile) => void
  allowMultiple?: boolean
  fileTypes?: string[]
}

export function MediaLibrary({
  onSelect,
  allowMultiple = false,
  fileTypes = ["image", "video", "audio", "document"],
}: MediaLibraryProps) {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [files, setFiles] = useState<MediaFile[]>([
    {
      id: "1",
      name: "hero-image.jpg",
      url: "/images/hero-image.webp",
      type: "image",
      size: 245760,
      uploadedAt: "2024-01-15T10:00:00Z",
      dimensions: { width: 1920, height: 1080 },
      alt: "Hero image for blog",
    },
    {
      id: "2",
      name: "ai-brain-quiz.png",
      url: "/images/quiz/ai-brain-quiz.png",
      type: "image",
      size: 156432,
      uploadedAt: "2024-01-14T15:30:00Z",
      dimensions: { width: 800, height: 600 },
    },
  ])
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [typeFilter, setTypeFilter] = useState<string>("all")

  const filteredFiles = files.filter((file) => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || file.type === typeFilter
    const matchesAllowedTypes = fileTypes.includes(file.type)
    return matchesSearch && matchesType && matchesAllowedTypes
  })

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(event.target.files || [])

    uploadedFiles.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const newFile: MediaFile = {
          id: Date.now().toString() + Math.random(),
          name: file.name,
          url: e.target?.result as string,
          type: getFileType(file.type),
          size: file.size,
          uploadedAt: new Date().toISOString(),
        }

        if (file.type.startsWith("image/")) {
          const img = new Image()
          img.onload = () => {
            newFile.dimensions = { width: img.width, height: img.height }
            setFiles((prev) => [newFile, ...prev])
          }
          img.src = newFile.url
        } else {
          setFiles((prev) => [newFile, ...prev])
        }
      }
      reader.readAsDataURL(file)
    })

    toast({
      title: "Files uploaded",
      description: `${uploadedFiles.length} file(s) uploaded successfully.`,
    })
  }

  const getFileType = (mimeType: string): MediaFile["type"] => {
    if (mimeType.startsWith("image/")) return "image"
    if (mimeType.startsWith("video/")) return "video"
    if (mimeType.startsWith("audio/")) return "audio"
    return "document"
  }

  const getFileIcon = (type: MediaFile["type"]) => {
    switch (type) {
      case "image":
        return ImageIcon
      case "video":
        return Video
      case "audio":
        return Music
      case "document":
        return FileText
      default:
        return File
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handleFileSelect = (file: MediaFile) => {
    if (allowMultiple) {
      setSelectedFiles((prev) => (prev.includes(file.id) ? prev.filter((id) => id !== file.id) : [...prev, file.id]))
    } else {
      onSelect?.(file)
    }
  }

  const handleDeleteFile = (fileId: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== fileId))
    setSelectedFiles((prev) => prev.filter((id) => id !== fileId))
    toast({
      title: "File deleted",
      description: "The file has been deleted successfully.",
    })
  }

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url)
    toast({
      title: "URL copied",
      description: "File URL copied to clipboard.",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Media Library</h2>
          <p className="text-muted-foreground">Manage your images, videos, and documents</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}>
            {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
          </Button>

          <Button onClick={() => fileInputRef.current?.click()}>
            <Upload className="h-4 w-4 mr-2" />
            Upload Files
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 border rounded-md"
        >
          <option value="all">All Types</option>
          <option value="image">Images</option>
          <option value="video">Videos</option>
          <option value="audio">Audio</option>
          <option value="document">Documents</option>
        </select>
      </div>

      {/* Selected Files Info */}
      {allowMultiple && selectedFiles.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
          <span className="text-sm font-medium">{selectedFiles.length} file(s) selected</span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setSelectedFiles([])}>
              Clear Selection
            </Button>
            <Button size="sm">Use Selected</Button>
          </div>
        </div>
      )}

      {/* Files Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredFiles.map((file) => {
            const FileIcon = getFileIcon(file.type)
            const isSelected = selectedFiles.includes(file.id)

            return (
              <Card
                key={file.id}
                className={`cursor-pointer transition-all hover:shadow-md ${isSelected ? "ring-2 ring-blue-500" : ""}`}
                onClick={() => handleFileSelect(file)}
              >
                <CardContent className="p-3">
                  <div className="aspect-square mb-2 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                    {file.type === "image" ? (
                      <img
                        src={file.url || "/placeholder.svg"}
                        alt={file.alt || file.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FileIcon className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-medium truncate" title={file.name}>
                      {file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                    {file.dimensions && (
                      <p className="text-xs text-muted-foreground">
                        {file.dimensions.width} × {file.dimensions.height}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-end mt-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => copyToClipboard(file.url)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy URL
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteFile(file.id)} className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredFiles.map((file) => {
            const FileIcon = getFileIcon(file.type)
            const isSelected = selectedFiles.includes(file.id)

            return (
              <Card
                key={file.id}
                className={`cursor-pointer transition-all hover:shadow-sm ${isSelected ? "ring-2 ring-blue-500" : ""}`}
                onClick={() => handleFileSelect(file)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                        {file.type === "image" ? (
                          <img
                            src={file.url || "/placeholder.svg"}
                            alt={file.alt || file.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FileIcon className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>

                      <div>
                        <p className="font-medium">{file.name}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{formatFileSize(file.size)}</span>
                          {file.dimensions && (
                            <span>
                              {file.dimensions.width} × {file.dimensions.height}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(file.uploadedAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="capitalize">
                        {file.type}
                      </Badge>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => copyToClipboard(file.url)}>
                            <Copy className="h-4 w-4 mr-2" />
                            Copy URL
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteFile(file.id)} className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {filteredFiles.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No files found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || typeFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Upload your first file to get started"}
            </p>
            <Button onClick={() => fileInputRef.current?.click()}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Files
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  )
}

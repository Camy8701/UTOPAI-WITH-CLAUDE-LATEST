"use client"

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { 
  ImageIcon,
  Upload,
  Search,
  Trash2,
  Copy,
  Grid,
  List,
  ArrowLeft,
  FileText,
  Video,
  File,
  Eye
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface MediaFile {
  id: string
  name: string
  url: string
  type: string
  size: number
  uploaded_at: string
  uploaded_by: string
  alt_text?: string
  caption?: string
}

export default function AdminMediaPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [files, setFiles] = useState<MediaFile[]>([])
  const [filteredFiles, setFilteredFiles] = useState<MediaFile[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'images' | 'videos' | 'documents'>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null)
  const [showFileDialog, setShowFileDialog] = useState(false)

  useEffect(() => {
    // Check if user is admin
    if (typeof window !== 'undefined') {
      const isAdmin = localStorage.getItem('isAdminLoggedIn') === 'true'
      const adminEmail = localStorage.getItem('adminEmail')

      if (!isAdmin || adminEmail !== 'utopaiblog@gmail.com') {
        router.push('/admin/login')
        return
      }

      setIsAuthorized(true)
    }
    setIsLoading(false)
  }, [router])

  useEffect(() => {
    if (isAuthorized) {
      loadFiles()
    }
  }, [isAuthorized])

  useEffect(() => {
    // Filter files based on search term and type filter
    let filtered = files

    if (searchTerm) {
      filtered = filtered.filter(file => 
        file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.alt_text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.caption?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(file => {
        switch (typeFilter) {
          case 'images':
            return file.type.startsWith('image/')
          case 'videos':
            return file.type.startsWith('video/')
          case 'documents':
            return !file.type.startsWith('image/') && !file.type.startsWith('video/')
          default:
            return true
        }
      })
    }

    setFilteredFiles(filtered)
  }, [files, searchTerm, typeFilter])

  const loadFiles = async () => {
    // For demo purposes, we'll create some sample files
    const sampleFiles: MediaFile[] = [
      {
        id: '1',
        name: 'utopai-logo.png',
        url: '/images/utopai-logo.png',
        type: 'image/png',
        size: 51200, // 50KB
        uploaded_at: new Date().toISOString(),
        uploaded_by: 'utopaiblog@gmail.com',
        alt_text: 'Utopai Logo',
        caption: 'Main site logo'
      }
    ]

    setFiles(sampleFiles)
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files
    if (!selectedFiles || selectedFiles.length === 0) return

    setUploading(true)

    try {
      for (const file of Array.from(selectedFiles)) {
        const newFile: MediaFile = {
          id: Date.now().toString(),
          name: file.name,
          url: URL.createObjectURL(file), // Temporary URL for demo
          type: file.type,
          size: file.size,
          uploaded_at: new Date().toISOString(),
          uploaded_by: 'utopaiblog@gmail.com'
        }

        setFiles(prev => [newFile, ...prev])
      }
    } catch (error) {
      console.error('Error uploading files:', error)
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const deleteFile = async (fileId: string) => {
    if (!confirm('Are you sure you want to delete this file? This action cannot be undone.')) {
      return
    }

    setFiles(files.filter(file => file.id !== fileId))
  }

  const copyFileUrl = (url: string) => {
    navigator.clipboard.writeText(url)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <ImageIcon className="h-5 w-5" />
    if (type.startsWith('video/')) return <Video className="h-5 w-5" />
    return <File className="h-5 w-5" />
  }

  const stats = {
    total: files.length,
    images: files.filter(f => f.type.startsWith('image/')).length,
    videos: files.filter(f => f.type.startsWith('video/')).length,
    documents: files.filter(f => !f.type.startsWith('image/') && !f.type.startsWith('video/')).length,
    totalSize: files.reduce((acc, file) => acc + file.size, 0)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading media library...</p>
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
              <Link href="/admin">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Media Library</h1>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {stats.total} Files
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*,.pdf,.doc,.docx,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Upload className="h-4 w-4 mr-2" />
                {uploading ? 'Uploading...' : 'Upload Files'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Files</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                </div>
                <File className="h-8 w-8 text-blue-500" />
              </div>
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {formatFileSize(stats.totalSize)} total
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Images</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.images}</p>
                </div>
                <ImageIcon className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Videos</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.videos}</p>
                </div>
                <Video className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Documents</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.documents}</p>
                </div>
                <FileText className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search files by name, alt text, or caption..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex space-x-2">
            <Button
              variant={typeFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setTypeFilter('all')}
            >
              All Files
            </Button>
            <Button
              variant={typeFilter === 'images' ? 'default' : 'outline'}
              onClick={() => setTypeFilter('images')}
            >
              Images
            </Button>
            <Button
              variant={typeFilter === 'videos' ? 'default' : 'outline'}
              onClick={() => setTypeFilter('videos')}
            >
              Videos
            </Button>
            <Button
              variant={typeFilter === 'documents' ? 'default' : 'outline'}
              onClick={() => setTypeFilter('documents')}
            >
              Documents
            </Button>
            <div className="border-l border-gray-300 dark:border-gray-600 pl-2 ml-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="ml-1"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Files Display */}
        <Card>
          <CardHeader>
            <CardTitle>Files ({filteredFiles.length})</CardTitle>
            <CardDescription>Manage your uploaded media files and assets</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredFiles.length === 0 ? (
              <div className="text-center py-12">
                <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No files found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {searchTerm || typeFilter !== 'all' 
                    ? 'Try adjusting your search or filter criteria'
                    : 'Upload some files to get started'}
                </p>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Your First File
                </Button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {filteredFiles.map((file) => (
                  <div
                    key={file.id}
                    className="group relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => {
                      setSelectedFile(file)
                      setShowFileDialog(true)
                    }}
                  >
                    {file.type.startsWith('image/') ? (
                      <div className="aspect-square relative">
                        <Image
                          src={file.url}
                          alt={file.alt_text || file.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="aspect-square flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                        {getFileIcon(file.type)}
                      </div>
                    )}
                    <div className="p-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                      <Button size="sm" variant="secondary" onClick={(e) => {
                        e.stopPropagation()
                        copyFileUrl(file.url)
                      }}>
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="secondary" onClick={(e) => {
                        e.stopPropagation()
                        deleteFile(file.id)
                      }}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        {getFileIcon(file.type)}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{file.name}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                          <span>{formatFileSize(file.size)}</span>
                          <span>{new Date(file.uploaded_at).toLocaleDateString()}</span>
                          <span>{file.type}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedFile(file)
                          setShowFileDialog(true)
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyFileUrl(file.url)}
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Copy URL
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => deleteFile(file.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* File Details Dialog */}
        <Dialog open={showFileDialog} onOpenChange={setShowFileDialog}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                File Details
              </DialogTitle>
              <DialogDescription>
                View and manage file information
              </DialogDescription>
            </DialogHeader>
            
            {selectedFile && (
              <div className="space-y-6">
                {/* File Preview */}
                <div className="flex justify-center">
                  {selectedFile.type.startsWith('image/') ? (
                    <div className="relative max-w-md max-h-64">
                      <Image
                        src={selectedFile.url}
                        alt={selectedFile.alt_text || selectedFile.name}
                        width={400}
                        height={300}
                        className="object-contain rounded-lg"
                      />
                    </div>
                  ) : (
                    <div className="w-48 h-48 bg-gray-100 dark:bg-gray-700 rounded-lg flex flex-col items-center justify-center">
                      {getFileIcon(selectedFile.type)}
                      <span className="mt-2 text-sm text-center px-4">{selectedFile.name}</span>
                    </div>
                  )}
                </div>

                {/* File Information */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">File Information</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Name:</span> {selectedFile.name}</p>
                      <p><span className="font-medium">Type:</span> {selectedFile.type}</p>
                      <p><span className="font-medium">Size:</span> {formatFileSize(selectedFile.size)}</p>
                      <p><span className="font-medium">Uploaded:</span> {new Date(selectedFile.uploaded_at).toLocaleDateString()}</p>
                      <p><span className="font-medium">Uploaded by:</span> {selectedFile.uploaded_by}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Metadata</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Alt Text:</span> {selectedFile.alt_text || 'Not provided'}</p>
                      <p><span className="font-medium">Caption:</span> {selectedFile.caption || 'Not provided'}</p>
                      <div className="mt-4">
                        <p className="font-medium mb-2">File URL:</p>
                        <div className="flex items-center space-x-2">
                          <Input
                            value={selectedFile.url}
                            readOnly
                            className="text-xs"
                          />
                          <Button
                            size="sm"
                            onClick={() => copyFileUrl(selectedFile.url)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowFileDialog(false)}>
                Close
              </Button>
              {selectedFile && (
                <Button
                  variant="destructive"
                  onClick={() => {
                    deleteFile(selectedFile.id)
                    setShowFileDialog(false)
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete File
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
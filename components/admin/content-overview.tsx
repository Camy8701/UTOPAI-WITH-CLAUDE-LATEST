"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, BookOpen, Newspaper, Video, MessageSquare, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"

interface ContentItem {
  id: string
  title: string
  type: "post" | "story" | "news" | "video"
  status: "published" | "draft" | "scheduled" | "pending"
  author: string
  date: string
  views?: number
  comments?: number
}

export function ContentOverview() {
  const [activeTab, setActiveTab] = useState("all")

  const contentItems: ContentItem[] = [
    {
      id: "1",
      title: "Getting Started with AI in 2024",
      type: "post",
      status: "published",
      author: "John Doe",
      date: "2024-06-10",
      views: 1250,
      comments: 23,
    },
    {
      id: "2",
      title: "The Future of Machine Learning",
      type: "post",
      status: "draft",
      author: "Jane Smith",
      date: "2024-06-08",
    },
    {
      id: "3",
      title: "AI Consciousness: A New Frontier",
      type: "story",
      status: "pending",
      author: "Alex Johnson",
      date: "2024-06-07",
    },
    {
      id: "4",
      title: "Google Announces New AI Model",
      type: "news",
      status: "published",
      author: "Sarah Williams",
      date: "2024-06-05",
      views: 3420,
      comments: 56,
    },
    {
      id: "5",
      title: "How to Build Your First Neural Network",
      type: "video",
      status: "scheduled",
      author: "Michael Brown",
      date: "2024-06-12",
    },
    {
      id: "6",
      title: "The Last Programmer: An AI Story",
      type: "story",
      status: "pending",
      author: "Emily Chen",
      date: "2024-06-06",
    },
  ]

  const filteredContent =
    activeTab === "all"
      ? contentItems
      : contentItems.filter((item) => item.type === activeTab || item.status === activeTab)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "draft":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      case "scheduled":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
      case "pending":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "post":
        return <FileText className="h-4 w-4" />
      case "story":
        return <BookOpen className="h-4 w-4" />
      case "news":
        return <Newspaper className="h-4 w-4" />
      case "video":
        return <Video className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-2xl font-bold">Content Management</h2>
          <p className="text-muted-foreground">Manage all your content in one place</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/posts/new">
            <Button>
              <FileText className="h-4 w-4 mr-2" />
              New Post
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 md:grid-cols-6 lg:w-[600px]">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="post">Posts</TabsTrigger>
          <TabsTrigger value="story">Stories</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <Card>
            <CardHeader>
              <CardTitle>Content Items</CardTitle>
              <CardDescription>
                {activeTab === "all" ? "All content items" : `Filtered by ${activeTab}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredContent.length > 0 ? (
                  filteredContent.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">{getTypeIcon(item.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium truncate">{item.title}</h3>
                            <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                          </div>
                          <div className="flex items-center gap-4">
                            <span>{item.author}</span>
                            <span>{item.date}</span>
                            {item.views !== undefined && <span>Views: {item.views}</span>}
                            {item.comments !== undefined && <span>Comments: {item.comments}</span>}
                          </div>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Comments
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))
                ) : (
                  <p>No content found.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  )
}

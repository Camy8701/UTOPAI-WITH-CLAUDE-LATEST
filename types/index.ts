/**
 * Type definitions for the application
 */

export interface Product {
  id: string
  title: string
  description: string
  price: number | string
  originalPrice?: string
  category?: string
  rating?: number
  reviews?: number
  image?: string
  imageSrc?: string
  imageAlt?: string
  href?: string
  type?: string
  bestseller?: boolean
  color?: string
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role?: "user" | "admin" | "moderator"
  createdAt: Date
  updatedAt: Date
}

export interface Article {
  id: string
  title: string
  content: string
  excerpt: string
  author: string
  publishedAt: Date
  updatedAt: Date
  tags: string[]
  image?: string
  slug: string
  status: "draft" | "published" | "archived"
}

export interface Quiz {
  id: string
  title: string
  description: string
  questions: QuizQuestion[]
  category: string
  difficulty: "easy" | "medium" | "hard"
  timeLimit?: number
  image?: string
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
}

export interface PaymentAnalytics {
  id: string
  productId: string
  productName: string
  amount: number
  currency: string
  status: "initiated" | "processing" | "succeeded" | "failed" | "cancelled"
  errorType?: string
  errorMessage?: string
  sessionId?: string
  timestamp: Date
  processingTime?: number
}

export interface AdminUser {
  id: string
  email: string
  role: "super_admin" | "admin" | "editor" | "moderator"
  permissions: string[]
  lastLogin?: Date
  isActive: boolean
}

export interface AuditLog {
  id: string
  userId: string
  action: string
  resource: string
  details: Record<string, any>
  timestamp: Date
  ipAddress?: string
  userAgent?: string
}

export interface Activity {
  id: string
  userId: string
  type: "like" | "share" | "comment" | "view" | "purchase"
  resourceId: string
  resourceType: "article" | "product" | "quiz"
  timestamp: Date
  metadata?: Record<string, any>
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface ErrorInfo {
  message: string
  stack?: string
  componentStack?: string
  errorBoundary?: string
}

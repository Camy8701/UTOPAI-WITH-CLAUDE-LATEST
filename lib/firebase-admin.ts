import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  orderBy, 
  where,
  getDoc,
  writeBatch,
  serverTimestamp
} from 'firebase/firestore'
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage'
import { db, storage } from './firebase'

export interface BlogPost {
  id?: string
  title: string
  content: string
  excerpt?: string
  slug: string
  category: string
  content_type: 'story' | 'news' | 'tool' | 'article'
  published: boolean
  featured: boolean
  thumbnail_url?: string
  audio_url?: string
  author_id: string
  author_name?: string
  tags?: string[]
  read_time?: number
  view_count?: number
  like_count?: number
  comment_count?: number
  created_at?: any
  updated_at?: any
}

export interface Comment {
  id?: string
  content: string
  post_id: string
  user_id: string
  user_name?: string
  user_avatar?: string
  parent_id?: string
  status: 'approved' | 'pending' | 'rejected'
  created_at?: any
  updated_at?: any
}

// Generate URL-friendly slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Remove multiple hyphens
    .trim()
    .slice(0, 60) // Limit length
}

// Calculate estimated read time
export function calculateReadTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

// Upload file to Firebase Storage
export async function uploadFile(
  file: File, 
  path: string, 
  postId?: string
): Promise<string> {
  try {
    const timestamp = Date.now()
    const filename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`
    const fullPath = postId ? `${path}/${postId}/${filename}` : `${path}/${filename}`
    
    console.log('Uploading to path:', fullPath)
    const storageRef = ref(storage, fullPath)
    const snapshot = await uploadBytes(storageRef, file)
    console.log('Upload completed, getting download URL...')
    const downloadURL = await getDownloadURL(snapshot.ref)
    console.log('Download URL obtained:', downloadURL)
    
    return downloadURL
  } catch (error) {
    console.error('Error uploading file:', error)
    console.error('Error details:', error.message)
    throw new Error(`Failed to upload file: ${error.message}`)
  }
}

// Delete file from Firebase Storage
export async function deleteFile(url: string): Promise<void> {
  try {
    const fileRef = ref(storage, url)
    await deleteObject(fileRef)
  } catch (error) {
    console.error('Error deleting file:', error)
    // Don't throw error - file might not exist
  }
}

// Blog Posts Management
export class BlogPostsAdmin {
  static async createPost(postData: Omit<BlogPost, 'id'>): Promise<string> {
    try {
      const postsRef = collection(db, 'blog_posts')
      
      // Generate slug if not provided
      if (!postData.slug) {
        postData.slug = generateSlug(postData.title)
      }
      
      // Calculate read time
      postData.read_time = calculateReadTime(postData.content)
      
      // Add timestamps
      const postWithTimestamps = {
        ...postData,
        view_count: 0,
        like_count: 0,
        comment_count: 0,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      }
      
      const docRef = await addDoc(postsRef, postWithTimestamps)
      console.log('Post created with ID:', docRef.id)
      return docRef.id
    } catch (error) {
      console.error('Error creating post:', error)
      throw new Error('Failed to create post')
    }
  }

  static async updatePost(postId: string, updates: Partial<BlogPost>): Promise<void> {
    try {
      const postRef = doc(db, 'blog_posts', postId)
      
      // Regenerate slug if title changed
      if (updates.title && !updates.slug) {
        updates.slug = generateSlug(updates.title)
      }
      
      // Recalculate read time if content changed
      if (updates.content) {
        updates.read_time = calculateReadTime(updates.content)
      }
      
      // Update timestamp
      updates.updated_at = serverTimestamp()
      
      await updateDoc(postRef, updates)
      console.log('Post updated:', postId)
    } catch (error) {
      console.error('Error updating post:', error)
      throw new Error('Failed to update post')
    }
  }

  static async deletePost(postId: string): Promise<void> {
    try {
      const batch = writeBatch(db)
      
      // Delete the post
      const postRef = doc(db, 'blog_posts', postId)
      batch.delete(postRef)
      
      // Delete associated comments
      const commentsQuery = query(
        collection(db, 'comments'), 
        where('post_id', '==', postId)
      )
      const commentsSnapshot = await getDocs(commentsQuery)
      commentsSnapshot.docs.forEach(commentDoc => {
        batch.delete(commentDoc.ref)
      })
      
      // Delete associated likes
      const likesQuery = query(
        collection(db, 'likes'), 
        where('post_id', '==', postId)
      )
      const likesSnapshot = await getDocs(likesQuery)
      likesSnapshot.docs.forEach(likeDoc => {
        batch.delete(likeDoc.ref)
      })
      
      await batch.commit()
      console.log('Post and associated data deleted:', postId)
    } catch (error) {
      console.error('Error deleting post:', error)
      throw new Error('Failed to delete post')
    }
  }

  static async getAllPosts(): Promise<BlogPost[]> {
    try {
      const postsRef = collection(db, 'blog_posts')
      const q = query(postsRef, orderBy('created_at', 'desc'))
      const querySnapshot = await getDocs(q)
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as BlogPost[]
    } catch (error) {
      console.error('Error getting posts:', error)
      return []
    }
  }

  static async getPostsByCategory(category: string): Promise<BlogPost[]> {
    try {
      const postsRef = collection(db, 'blog_posts')
      const q = query(
        postsRef, 
        where('category', '==', category),
        orderBy('created_at', 'desc')
      )
      const querySnapshot = await getDocs(q)
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as BlogPost[]
    } catch (error) {
      console.error('Error getting posts by category:', error)
      return []
    }
  }
}

// Comments Management
export class CommentsAdmin {
  static async getAllComments(): Promise<Comment[]> {
    try {
      const commentsRef = collection(db, 'comments')
      const q = query(commentsRef, orderBy('created_at', 'desc'))
      const querySnapshot = await getDocs(q)
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Comment[]
    } catch (error) {
      console.error('Error getting comments:', error)
      return []
    }
  }

  static async updateCommentStatus(
    commentId: string, 
    status: 'approved' | 'pending' | 'rejected'
  ): Promise<void> {
    try {
      const commentRef = doc(db, 'comments', commentId)
      await updateDoc(commentRef, {
        status,
        updated_at: serverTimestamp()
      })
      console.log('Comment status updated:', commentId, status)
    } catch (error) {
      console.error('Error updating comment status:', error)
      throw new Error('Failed to update comment status')
    }
  }

  static async deleteComment(commentId: string): Promise<void> {
    try {
      const commentRef = doc(db, 'comments', commentId)
      await deleteDoc(commentRef)
      console.log('Comment deleted:', commentId)
    } catch (error) {
      console.error('Error deleting comment:', error)
      throw new Error('Failed to delete comment')
    }
  }

  static async updateComment(commentId: string, content: string): Promise<void> {
    try {
      const commentRef = doc(db, 'comments', commentId)
      await updateDoc(commentRef, {
        content,
        updated_at: serverTimestamp()
      })
      console.log('Comment updated:', commentId)
    } catch (error) {
      console.error('Error updating comment:', error)
      throw new Error('Failed to update comment')
    }
  }
}

// Categories for posts
export const POST_CATEGORIES = [
  'AI Stories',
  'AI News', 
  'AI Tools',
  'Technology',
  'Future Fiction',
  'Machine Learning',
  'Deep Learning',
  'Robotics',
  'Innovation',
  'Science',
  'Business',
  'Education',
  'Entertainment'
] as const

export type PostCategory = typeof POST_CATEGORIES[number]
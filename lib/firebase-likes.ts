import { 
  collection, 
  doc, 
  addDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where, 
  getDoc,
  serverTimestamp 
} from 'firebase/firestore'
import { db } from './firebase'

export interface Like {
  id?: string
  userId: string
  postId?: string
  commentId?: string
  createdAt: any
}

export interface Comment {
  id?: string
  postId: string
  userId: string
  userEmail: string
  userName: string
  content: string
  createdAt: any
  parentId?: string // for replies
}

// Likes functionality
export async function toggleLike(userId: string, postId?: string, commentId?: string) {
  try {
    if (!postId && !commentId) {
      throw new Error('Either postId or commentId is required')
    }

    const likesRef = collection(db, 'likes')
    const q = query(
      likesRef,
      where('userId', '==', userId),
      ...(postId ? [where('postId', '==', postId)] : []),
      ...(commentId ? [where('commentId', '==', commentId)] : [])
    )

    const existingLikes = await getDocs(q)
    
    if (!existingLikes.empty) {
      // Unlike - remove the like
      const likeDoc = existingLikes.docs[0]
      await deleteDoc(likeDoc.ref)
      return { liked: false, action: 'unliked' }
    } else {
      // Like - add the like
      const likeData: Like = {
        userId,
        createdAt: serverTimestamp()
      }
      
      if (postId) likeData.postId = postId
      if (commentId) likeData.commentId = commentId
      
      await addDoc(likesRef, likeData)
      return { liked: true, action: 'liked' }
    }
  } catch (error) {
    console.error('Error toggling like:', error)
    throw error
  }
}

export async function getLikeCount(postId?: string, commentId?: string) {
  try {
    const likesRef = collection(db, 'likes')
    const q = query(
      likesRef,
      ...(postId ? [where('postId', '==', postId)] : []),
      ...(commentId ? [where('commentId', '==', commentId)] : [])
    )

    const snapshot = await getDocs(q)
    return snapshot.size
  } catch (error) {
    console.error('Error getting like count:', error)
    return 0
  }
}

export async function checkUserLike(userId: string, postId?: string, commentId?: string) {
  try {
    const likesRef = collection(db, 'likes')
    const q = query(
      likesRef,
      where('userId', '==', userId),
      ...(postId ? [where('postId', '==', postId)] : []),
      ...(commentId ? [where('commentId', '==', commentId)] : [])
    )

    const snapshot = await getDocs(q)
    return !snapshot.empty
  } catch (error) {
    console.error('Error checking user like:', error)
    return false
  }
}

// Comments functionality
export async function addComment(
  postId: string, 
  userId: string, 
  userEmail: string,
  userName: string,
  content: string,
  parentId?: string
) {
  try {
    const commentsRef = collection(db, 'comments')
    const commentData: Comment = {
      postId,
      userId,
      userEmail,
      userName,
      content,
      createdAt: serverTimestamp(),
      ...(parentId && { parentId })
    }

    const docRef = await addDoc(commentsRef, commentData)
    return docRef.id
  } catch (error) {
    console.error('Error adding comment:', error)
    throw error
  }
}

export async function getComments(postId: string) {
  try {
    const commentsRef = collection(db, 'comments')
    const q = query(commentsRef, where('postId', '==', postId))
    
    const snapshot = await getDocs(q)
    const comments = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Comment[]

    return comments.sort((a, b) => {
      const aTime = a.createdAt?.toDate?.() || new Date(0)
      const bTime = b.createdAt?.toDate?.() || new Date(0)
      return aTime.getTime() - bTime.getTime()
    })
  } catch (error) {
    console.error('Error getting comments:', error)
    return []
  }
}
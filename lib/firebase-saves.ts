import { 
  collection, 
  doc, 
  addDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where,
  serverTimestamp 
} from 'firebase/firestore'
import { db } from './firebase'

export interface SavedPost {
  id?: string
  userId: string
  postId: string
  postTitle: string
  postSlug?: string
  createdAt: any
}

export async function toggleSavePost(
  userId: string, 
  postId: string, 
  postTitle: string, 
  postSlug?: string
) {
  try {
    const savesRef = collection(db, 'savedPosts')
    const q = query(
      savesRef,
      where('userId', '==', userId),
      where('postId', '==', postId)
    )

    const existingSaves = await getDocs(q)
    
    if (!existingSaves.empty) {
      // Unsave - remove the save
      const saveDoc = existingSaves.docs[0]
      await deleteDoc(saveDoc.ref)
      return { saved: false, action: 'unsaved' }
    } else {
      // Save - add the save
      const saveData: SavedPost = {
        userId,
        postId,
        postTitle,
        postSlug,
        createdAt: serverTimestamp()
      }
      
      await addDoc(savesRef, saveData)
      return { saved: true, action: 'saved' }
    }
  } catch (error) {
    console.error('Error toggling save post:', error)
    throw error
  }
}

export async function checkPostSaved(userId: string, postId: string) {
  try {
    const savesRef = collection(db, 'savedPosts')
    const q = query(
      savesRef,
      where('userId', '==', userId),
      where('postId', '==', postId)
    )

    const snapshot = await getDocs(q)
    return !snapshot.empty
  } catch (error) {
    console.error('Error checking saved post:', error)
    return false
  }
}

export async function getUserSavedPosts(userId: string) {
  try {
    const savesRef = collection(db, 'savedPosts')
    const q = query(
      savesRef,
      where('userId', '==', userId)
    )

    const snapshot = await getDocs(q)
    const savedPosts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as SavedPost[]

    return savedPosts.sort((a, b) => {
      const aTime = a.createdAt?.toDate?.() || new Date(0)
      const bTime = b.createdAt?.toDate?.() || new Date(0)
      return bTime.getTime() - aTime.getTime()
    })
  } catch (error) {
    console.error('Error getting saved posts:', error)
    return []
  }
}
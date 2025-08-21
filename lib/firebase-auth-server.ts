import { NextRequest } from 'next/server'
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

// Initialize Firebase Admin SDK for server-side auth verification
function getFirebaseAdmin() {
  if (getApps().length === 0) {
    // For development, we'll skip admin SDK initialization
    // In production, you would need to set up Firebase Admin credentials
    return null
  }
  return getAuth(getApps()[0])
}

export async function verifyFirebaseToken(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }

    const token = authHeader.substring(7)
    const admin = getFirebaseAdmin()
    
    if (!admin) {
      // For now, return null to indicate no authentication
      // In production, you would verify the token with Firebase Admin
      return null
    }

    const decodedToken = await admin.verifyIdToken(token)
    return {
      uid: decodedToken.uid,
      email: decodedToken.email,
      id: decodedToken.uid
    }
  } catch (error) {
    console.error('Firebase token verification error:', error)
    return null
  }
}

// Helper to get user from client-side Firebase token
export async function getCurrentUser(request: NextRequest) {
  // For now, we'll extract user info from the request headers
  // This is a simplified approach for the migration
  const userHeader = request.headers.get('x-user-id')
  const emailHeader = request.headers.get('x-user-email')
  
  if (userHeader && emailHeader) {
    return {
      id: userHeader,
      uid: userHeader,
      email: emailHeader
    }
  }
  
  return null
}
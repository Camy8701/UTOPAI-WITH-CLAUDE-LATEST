import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyB2r69XiI8JecES517ZxkZqtEhsRXfoT94",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "utopaiblog-1af85.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "utopaiblog-1af85",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "utopaiblog-1af85.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "900616509848",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:900616509848:web:2870931b7e768ef33df3ed",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-TXY2ES4T4B"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app)

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app)

// Development mode emulators (optional)
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  // Uncomment these lines if you want to use Firebase emulators in development
  // try {
  //   connectAuthEmulator(auth, 'http://localhost:9099')
  //   connectFirestoreEmulator(db, 'localhost', 8080)
  // } catch (error) {
  //   console.log('Emulators already connected')
  // }
}

export default app
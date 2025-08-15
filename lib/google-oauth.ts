// Google OAuth configuration
export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""

export interface GoogleUser {
  id: string
  email: string
  name: string
  picture: string
  given_name: string
  family_name: string
}

export class GoogleOAuth {
  private static instance: GoogleOAuth
  private gapi: any = null
  private auth2: any = null
  private isInitialized = false

  private constructor() {}

  static getInstance(): GoogleOAuth {
    if (!GoogleOAuth.instance) {
      GoogleOAuth.instance = new GoogleOAuth()
    }
    return GoogleOAuth.instance
  }

  private isValidEnvironment(): boolean {
    if (typeof window === "undefined") return false

    const hostname = window.location.hostname
    const isLocalhost = hostname === "localhost" || hostname === "127.0.0.1"
    const isVercelProduction = hostname.endsWith(".vercel.app")
    const isCustomDomain = !hostname.includes("vusercontent.net") && !hostname.includes("lite.vusercontent")

    return isLocalhost || isVercelProduction || isCustomDomain
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return

    // Check if we're in a valid environment for Google OAuth
    if (!this.isValidEnvironment()) {
      console.warn("Google OAuth not available in this environment (preview/sandbox)")
      throw new Error("Google OAuth not available in preview environment")
    }

    const clientId = GOOGLE_CLIENT_ID

    if (!clientId || clientId === "your_client_id") {
      console.warn("Google Client ID not properly configured")
      throw new Error("Google Client ID not configured")
    }

    return new Promise((resolve, reject) => {
      if (typeof window === "undefined") {
        reject(new Error("Google OAuth can only be initialized in the browser"))
        return
      }

      // Load Google API script
      if (!window.gapi) {
        const script = document.createElement("script")
        script.src = "https://apis.google.com/js/api.js"
        script.onload = () => {
          window.gapi.load("auth2", () => {
            this.initAuth2().then(resolve).catch(reject)
          })
        }
        script.onerror = () => reject(new Error("Failed to load Google API"))
        document.head.appendChild(script)
      } else {
        this.initAuth2().then(resolve).catch(reject)
      }
    })
  }

  private async initAuth2(): Promise<void> {
    try {
      this.gapi = window.gapi
      this.auth2 = await this.gapi.auth2.init({
        client_id: GOOGLE_CLIENT_ID,
        scope: "profile email",
      })
      this.isInitialized = true
      console.log("Google OAuth initialized successfully")
    } catch (error) {
      console.error("Failed to initialize Google Auth2:", error)
      throw error
    }
  }

  async signIn(): Promise<GoogleUser> {
    if (!this.auth2) {
      throw new Error("Google OAuth not initialized")
    }

    try {
      const googleUser = await this.auth2.signIn({
        prompt: "select_account", // This forces account selection
      })

      const profile = googleUser.getBasicProfile()

      return {
        id: profile.getId(),
        email: profile.getEmail(),
        name: profile.getName(),
        picture: profile.getImageUrl(),
        given_name: profile.getGivenName(),
        family_name: profile.getFamilyName(),
      }
    } catch (error) {
      console.error("Google sign-in failed:", error)
      throw error
    }
  }

  async signOut(): Promise<void> {
    if (this.auth2) {
      try {
        const authInstance = this.auth2.getAuthInstance()
        await authInstance.signOut()
        console.log("Successfully signed out from Google")
      } catch (error) {
        console.error("Error signing out from Google:", error)
      }
    }
  }

  isSignedIn(): boolean {
    if (!this.auth2) return false
    try {
      const authInstance = this.auth2.getAuthInstance()
      return authInstance.isSignedIn.get()
    } catch (error) {
      console.error("Error checking sign-in status:", error)
      return false
    }
  }

  getCurrentUser(): GoogleUser | null {
    if (!this.auth2) return null

    try {
      const authInstance = this.auth2.getAuthInstance()
      if (!authInstance.isSignedIn.get()) return null

      const googleUser = authInstance.currentUser.get()
      const profile = googleUser.getBasicProfile()

      return {
        id: profile.getId(),
        email: profile.getEmail(),
        name: profile.getName(),
        picture: profile.getImageUrl(),
        given_name: profile.getGivenName(),
        family_name: profile.getFamilyName(),
      }
    } catch (error) {
      console.error("Error getting current user:", error)
      return null
    }
  }
}

// Global type declaration
declare global {
  interface Window {
    gapi: any
  }
}

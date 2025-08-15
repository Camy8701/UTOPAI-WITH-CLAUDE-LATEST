"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Settings, Mail, Lock, Shield, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react"

export default function AdminSettingsPage() {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  // Settings state
  const [currentEmail, setCurrentEmail] = useState("")
  const [newEmail, setNewEmail] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  
  // Verification state
  const [showEmailVerification, setShowEmailVerification] = useState(false)
  const [showPasswordVerification, setShowPasswordVerification] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")
  const [generatedCode, setGeneratedCode] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    // Check if user is admin
    if (typeof window !== "undefined") {
      const isAdmin = localStorage.getItem("isAdminLoggedIn") === "true"
      const adminEmail = localStorage.getItem("adminEmail")

      if (!isAdmin || adminEmail !== "utopaiblog@gmail.com") {
        router.push("/admin/login")
        return
      }

      setCurrentEmail(adminEmail || "")
      setIsAuthorized(true)
    }
    setIsLoading(false)
  }, [router])

  const generateVerificationCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase()
  }

  const sendVerificationEmail = async (email: string, code: string, type: 'email' | 'password') => {
    try {
      const response = await fetch('/api/send-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          code,
          type
        }),
      })

      const data = await response.json()
      
      if (response.ok && data.success) {
        return { success: true }
      } else {
        throw new Error(data.error || 'Failed to send email')
      }
    } catch (error) {
      console.error('Email sending error:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  const handleEmailUpdate = async () => {
    if (!newEmail.trim()) {
      setError("Please enter a new email address")
      return
    }

    if (newEmail === currentEmail) {
      setError("New email must be different from current email")
      return
    }

    const code = generateVerificationCode()
    setGeneratedCode(code)
    
    const emailResult = await sendVerificationEmail("utopaiblog@gmail.com", code, 'email')
    
    if (emailResult.success) {
      setShowEmailVerification(true)
      setSuccess(`Verification code sent to utopaiblog@gmail.com`)
      setError("")
    } else {
      setError(`Failed to send verification email: ${emailResult.error}`)
    }
  }

  const handlePasswordUpdate = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please fill in all password fields")
      return
    }

    if (currentPassword !== "Admin123!") {
      setError("Current password is incorrect")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords don't match")
      return
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters")
      return
    }

    const code = generateVerificationCode()
    setGeneratedCode(code)
    
    const emailResult = await sendVerificationEmail("utopaiblog@gmail.com", code, 'password')
    
    if (emailResult.success) {
      setShowPasswordVerification(true)
      setSuccess(`Verification code sent to utopaiblog@gmail.com`)
      setError("")
    } else {
      setError(`Failed to send verification email: ${emailResult.error}`)
    }
  }

  const verifyAndUpdateEmail = () => {
    if (verificationCode !== generatedCode) {
      setError("Invalid verification code")
      return
    }

    // Update email in localStorage
    localStorage.setItem("adminEmail", newEmail)
    setCurrentEmail(newEmail)
    setNewEmail("")
    setShowEmailVerification(false)
    setVerificationCode("")
    setSuccess("Email updated successfully!")
    setError("")
  }

  const verifyAndUpdatePassword = () => {
    if (verificationCode !== generatedCode) {
      setError("Invalid verification code")
      return
    }

    // In production, you would update this in your database
    // For now, we'll update the hardcoded value by showing instructions
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
    setShowPasswordVerification(false)
    setVerificationCode("")
    setSuccess(`Password updated successfully! New password: ${newPassword}. Please update your login page with this new password.`)
    setError("")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading settings...</p>
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
              <Settings className="h-6 w-6 text-red-600" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Settings</h1>
              <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                Super Admin
              </Badge>
            </div>
            <Button onClick={() => router.push("/admin")} variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alerts */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 dark:text-red-200">{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 dark:text-green-200">{success}</AlertDescription>
          </Alert>
        )}

        {/* Current Admin Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Current Admin Account
            </CardTitle>
            <CardDescription>Your current admin account information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</p>
                  <p className="text-gray-900 dark:text-white">{currentEmail}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Lock className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</p>
                  <p className="text-gray-900 dark:text-white">••••••••</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Email Update Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Update Email Address
            </CardTitle>
            <CardDescription>Change your admin email address (requires verification)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="newEmail">New Email Address</Label>
              <Input
                id="newEmail"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Enter new email address"
              />
            </div>
            <Button onClick={handleEmailUpdate} className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Update Email
            </Button>
          </CardContent>
        </Card>

        {/* Password Update Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Update Password
            </CardTitle>
            <CardDescription>Change your admin password (requires verification)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
              />
            </div>
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (min 8 characters)"
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />
            </div>
            <Button onClick={handlePasswordUpdate} className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Update Password
            </Button>
          </CardContent>
        </Card>
      </main>

      {/* Email Verification Dialog */}
      <Dialog open={showEmailVerification} onOpenChange={setShowEmailVerification}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify Email Change</DialogTitle>
            <DialogDescription>
              A verification code has been sent to utopaiblog@gmail.com. Please enter the code to confirm the email change.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="emailVerificationCode">Verification Code</Label>
              <Input
                id="emailVerificationCode"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter 6-digit code"
                maxLength={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEmailVerification(false)}>
              Cancel
            </Button>
            <Button onClick={verifyAndUpdateEmail}>
              Verify & Update Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Password Verification Dialog */}
      <Dialog open={showPasswordVerification} onOpenChange={setShowPasswordVerification}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify Password Change</DialogTitle>
            <DialogDescription>
              A verification code has been sent to utopaiblog@gmail.com. Please enter the code to confirm the password change.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="passwordVerificationCode">Verification Code</Label>
              <Input
                id="passwordVerificationCode"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter 6-digit code"
                maxLength={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPasswordVerification(false)}>
              Cancel
            </Button>
            <Button onClick={verifyAndUpdatePassword}>
              Verify & Update Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
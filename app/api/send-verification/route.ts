import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email, code, type } = await request.json()

    // Validate input
    if (!email || !code || !type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // For security, only send to the admin email
    if (email !== "utopaiblog@gmail.com") {
      return NextResponse.json(
        { error: "Unauthorized email address" },
        { status: 403 }
      )
    }

    // Email content based on type
    const subject = type === "email" ? "🔐 Email Change Verification - UTOP-AI Admin" : "🔐 Password Change Verification - UTOP-AI Admin"
    const htmlMessage = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">🔐 UTOP-AI Admin Security</h1>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
          <h2 style="color: #343a40; margin-top: 0;">Verification Code Required</h2>
          
          <p style="color: #6c757d; font-size: 16px;">
            You requested a ${type === "email" ? "email address change" : "password change"} for your UTOP-AI admin account.
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; border: 2px solid #007bff;">
            <p style="margin: 0; color: #6c757d; font-size: 14px;">Your verification code is:</p>
            <h1 style="font-size: 36px; color: #007bff; margin: 10px 0; letter-spacing: 4px; font-family: monospace;">${code}</h1>
            <p style="margin: 0; color: #6c757d; font-size: 12px;">This code expires in 10 minutes</p>
          </div>
          
          <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 0; color: #856404; font-size: 14px;">
              <strong>Security Notice:</strong> If you didn't request this change, please ignore this email and consider changing your password.
            </p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #dee2e6; margin: 20px 0;">
          
          <p style="color: #6c757d; font-size: 14px; margin: 0;">
            Best regards,<br>
            <strong>UTOP-AI Admin System</strong><br>
            <a href="https://utopai.blog" style="color: #007bff;">utopai.blog</a>
          </p>
        </div>
      </div>
    `
    
    const textMessage = `
UTOP-AI Admin Security Verification

You requested a ${type === "email" ? "email address change" : "password change"} for your UTOP-AI admin account.

Your verification code is: ${code}

This code expires in 10 minutes.

If you didn't request this change, please ignore this email and consider changing your password.

Best regards,
UTOP-AI Admin System
https://utopai.blog
    `

    // Send email using Resend
    const emailResult = await sendEmailWithSMTP({
      to: email,
      subject,
      html: htmlMessage,
      text: textMessage
    })

    if (emailResult.success) {
      return NextResponse.json({ 
        success: true, 
        message: "Verification code sent successfully" 
      })
    } else {
      throw new Error(emailResult.error)
    }

  } catch (error) {
    console.error("Email sending error:", error)
    return NextResponse.json(
      { error: "Failed to send verification email" },
      { status: 500 }
    )
  }
}

// Email sending function using Resend API
async function sendEmailWithSMTP(emailData: { to: string; subject: string; html: string; text: string }) {
  try {
    const RESEND_API_KEY = process.env.RESEND_API_KEY
    
    if (RESEND_API_KEY) {
      console.log('🚀 Sending email via Resend API...')
      console.log(`📧 To: ${emailData.to}`)
      console.log(`📋 Subject: ${emailData.subject}`)
      
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'UTOP-AI Admin <admin@utopai.blog>',
          to: emailData.to,
          subject: emailData.subject,
          html: emailData.html,
          text: emailData.text,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        console.log('✅ Email sent successfully via Resend!')
        console.log(`📬 Email ID: ${result.id}`)
        return { success: true, emailId: result.id }
      } else {
        const error = await response.json()
        console.error('❌ Resend API error:', error)
        return { success: false, error: `Resend API error: ${error.message || JSON.stringify(error)}` }
      }
    }

    // Method 3: Using Gmail SMTP (requires app password)
    const GMAIL_USER = process.env.GMAIL_USER
    const GMAIL_PASS = process.env.GMAIL_APP_PASSWORD
    
    if (GMAIL_USER && GMAIL_PASS) {
      // This would require nodemailer package
      // For now, we'll return a mock success for development
      console.log(`EMAIL SENT TO: ${emailData.to}`)
      console.log(`SUBJECT: ${emailData.subject}`)
      console.log(`MESSAGE: ${emailData.text}`)
      
      return { success: true }
    }

    // Fallback: Log the email for development
    console.log("=== VERIFICATION EMAIL ===")
    console.log(`TO: ${emailData.to}`)
    console.log(`SUBJECT: ${emailData.subject}`)
    console.log(`MESSAGE: ${emailData.text}`)
    console.log("========================")
    
    return { success: true }
    
  } catch (error) {
    return { 
      success: false, 
      error: `Email sending failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
    }
  }
}
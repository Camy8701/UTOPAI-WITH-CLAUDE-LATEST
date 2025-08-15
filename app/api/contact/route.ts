import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface ContactFormData {
  name: string
  email: string
  reason: string
  message: string
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json()
    const { name, email, reason, message } = body

    // Validate required fields
    if (!name || !email || !reason || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Validate message length
    if (message.length < 10) {
      return NextResponse.json(
        { error: 'Message must be at least 10 characters long' },
        { status: 400 }
      )
    }

    if (message.length > 5000) {
      return NextResponse.json(
        { error: 'Message must be less than 5000 characters' },
        { status: 400 }
      )
    }

    // Create email content
    const emailSubject = `Contact Form: ${reason} - ${name}`
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #0066cc; padding-bottom: 10px;">
          New Contact Form Submission
        </h2>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #0066cc;">Contact Details</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Reason:</strong> ${reason}</p>
          <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
        </div>

        <div style="background-color: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h3 style="margin-top: 0; color: #333;">Message</h3>
          <div style="white-space: pre-wrap; line-height: 1.6;">${message}</div>
        </div>

        <div style="margin-top: 20px; padding: 15px; background-color: #e8f4fd; border-radius: 8px;">
          <p style="margin: 0; font-size: 14px; color: #666;">
            This email was sent from the utopai.blog contact form. 
            Reply directly to this email to respond to ${name}.
          </p>
        </div>
      </div>
    `

    const emailText = `
      New Contact Form Submission
      
      Name: ${name}
      Email: ${email}
      Reason: ${reason}
      Submitted: ${new Date().toLocaleString()}
      
      Message:
      ${message}
      
      ---
      This email was sent from the utopai.blog contact form.
      Reply directly to this email to respond to ${name}.
    `

    // Send email to admin
    const { data: emailResult, error: emailError } = await resend.emails.send({
      from: 'utopai.blog Contact Form <noreply@utopai.blog>',
      to: [process.env.ADMIN_EMAIL || 'utopaiblog@gmail.com'],
      replyTo: email, // Allow direct reply to user
      subject: emailSubject,
      html: emailHtml,
      text: emailText,
    })

    if (emailError) {
      console.error('Resend email error:', emailError)
      return NextResponse.json(
        { error: 'Failed to send email. Please try again later.' },
        { status: 500 }
      )
    }

    // Send confirmation email to user
    const confirmationHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0066cc;">Thank you for contacting utopai.blog!</h2>
        
        <p>Hi ${name},</p>
        
        <p>We've received your message and will get back to you as soon as possible. Here's a copy of what you sent:</p>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Reason:</strong> ${reason}</p>
          <p><strong>Message:</strong></p>
          <div style="white-space: pre-wrap; line-height: 1.6; margin-top: 10px;">${message}</div>
        </div>
        
        <p>Best regards,<br>The utopai.blog Team</p>
        
        <div style="margin-top: 30px; padding: 15px; background-color: #e8f4fd; border-radius: 8px; font-size: 14px; color: #666;">
          <p style="margin: 0;">
            This is an automated confirmation email. If you didn't submit this form, please ignore this message.
          </p>
        </div>
      </div>
    `

    // Send confirmation (don't fail the request if this fails)
    try {
      await resend.emails.send({
        from: 'utopai.blog <noreply@utopai.blog>',
        to: [email],
        subject: 'Thank you for contacting utopai.blog',
        html: confirmationHtml,
        text: `Hi ${name},\n\nWe've received your message about "${reason}" and will get back to you as soon as possible.\n\nBest regards,\nThe utopai.blog Team`
      })
    } catch (confirmationError) {
      console.error('Failed to send confirmation email:', confirmationError)
      // Don't fail the request if confirmation email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Your message has been sent successfully! We\'ll get back to you soon.',
      emailId: emailResult?.id
    })

  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
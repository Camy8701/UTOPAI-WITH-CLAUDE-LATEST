# Email Setup for UTOP-AI Admin

## Current Status
The verification system is now implemented and will LOG the verification codes to the console for immediate testing.

## How to Test Right Now

1. **Go to**: `http://localhost:3001/admin/settings`
2. **Try to change password or email**
3. **Check the terminal/console** where your Next.js server is running
4. **Look for**: `=== VERIFICATION EMAIL ===` section
5. **Find your 6-digit code** in the logged message
6. **Enter the code** in the verification dialog

## For Production Email Sending

### Option 1: Resend (Recommended - Easy & Free)
1. Sign up at https://resend.com (free tier: 3000 emails/month)
2. Get your API key
3. Add to your environment variables:
```bash
RESEND_API_KEY=your_resend_api_key_here
```

### Option 2: Gmail SMTP (Free)
1. Enable 2-factor authentication on your Gmail
2. Generate an "App Password" for your account
3. Add to your environment variables:
```bash
GMAIL_USER=utopaiblog@gmail.com
GMAIL_APP_PASSWORD=your_app_password_here
```

### Option 3: SendGrid (Popular choice)
1. Sign up at https://sendgrid.com
2. Get your API key
3. Modify the API route to use SendGrid

## Environment Variables Setup

Create a `.env.local` file in your project root:
```env
# Email Service (choose one)
RESEND_API_KEY=your_resend_api_key
# OR
GMAIL_USER=utopaiblog@gmail.com
GMAIL_APP_PASSWORD=your_gmail_app_password
```

## Testing the Email System

1. **Development**: Codes are logged to console
2. **Production**: Real emails sent to utopaiblog@gmail.com

The system automatically falls back to console logging if no email service is configured, so you can test it immediately!
# UTOP-AI Deployment Checklist

## ✅ Environment Variables in Vercel
Make sure all 5 environment variables are set:
- `NEXT_PUBLIC_SUPABASE_URL` = https://ovizewmqyclbebotemwl.supabase.co
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
- `SUPABASE_SERVICE_ROLE_KEY` = sb_secret_t9123ITQ4ythtICSR6gyAA_TZr8JWQ3
- `RESEND_API_KEY` = re_ch7dCzmD_9cLPf1qF5rSvTPeQyJFtW3GN
- `ADMIN_EMAIL` = utopaiblog@gmail.com

All should be checked for Production, Preview, and Development environments.

## 🔧 Supabase Configuration Required

### 1. Google OAuth Setup
In Supabase Dashboard → Authentication → Providers → Google:
- Enable Google provider
- Add your Vercel deployment URL to redirect URLs:
  - `https://your-deployment.vercel.app/auth/callback`
  - `https://your-custom-domain.com/auth/callback` (if using custom domain)

### 2. Site URL Configuration
In Supabase Dashboard → Authentication → URL Configuration:
- Site URL: `https://your-deployment.vercel.app` (or your custom domain)
- Redirect URLs: 
  - `https://your-deployment.vercel.app/auth/callback`
  - `https://your-custom-domain.com/auth/callback`

### 3. Email Templates (if using email auth)
In Supabase Dashboard → Authentication → Email Templates:
- Confirm signup: Update redirect URL to your domain
- Reset password: Update redirect URL to your domain

## 🚨 Common Issues & Fixes

### Auth Not Working
1. **Check Supabase redirect URLs** - Must match your deployment URL exactly
2. **Verify Google OAuth credentials** - Must be configured in Supabase
3. **Check console errors** - Look for specific error messages
4. **Test environment variables** - Visit `/test-deployment` page on your site

### Environment Variables Not Loading
1. **Redeploy after adding env vars** - Vercel requires redeploy
2. **Check all environments checked** - Production, Preview, Development
3. **Verify variable names** - Must match exactly (case-sensitive)

### Database Errors
1. **Check Supabase connection** - Test in dashboard
2. **Verify table permissions** - RLS policies must allow access
3. **Check user profiles table** - Must exist for user creation

## 📝 Testing Steps

1. Visit your deployment URL
2. Open browser dev tools (F12) → Console tab
3. Try signing up with Google
4. Check for any error messages
5. Try email signup/signin
6. Verify user profile creation works

## 🔍 Debug URLs

- Test deployment status: `https://your-site.vercel.app/test-deployment`
- Auth error page: `https://your-site.vercel.app/auth/auth-code-error`
- Supabase logs: Check your Supabase dashboard → Logs

## 📧 Next Steps

Please provide:
1. Your Vercel deployment URL
2. Screenshot of any error messages
3. Console errors from browser dev tools
4. Confirmation that Supabase OAuth redirect URLs are updated
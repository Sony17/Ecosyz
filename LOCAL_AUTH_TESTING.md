# 🧪 Local Authentication Testing Guide

## Overview
This guide helps you test OAuth authentication locally with GitHub and Google providers.

## 🔧 Setup for Local Testing

### 1. GitHub OAuth Configuration

#### Step 1: Create/Update GitHub OAuth App
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App" or edit existing app
3. Configure the following:
   ```
   Application name: Ecosyz Local Dev
   Homepage URL: http://localhost:3000
   Authorization callback URL: https://ltenyoiaydemsnrvdbpc.supabase.co/auth/v1/callback
   ```

#### Step 2: Update Environment Variables
Your `.env` already has GitHub credentials:
```bash
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

### 2. Google OAuth Configuration

#### Step 1: Configure Google OAuth Consent Screen
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to "APIs & Services" > "OAuth consent screen"
3. Add `localhost:3000` to authorized domains (for testing)

#### Step 2: Configure OAuth 2.0 Client
1. Go to "APIs & Services" > "Credentials"
2. Edit your OAuth 2.0 Client ID
3. Add authorized origins:
   ```
   http://localhost:3000
   https://localhost:3000
   ```
4. Add authorized redirect URIs:
   ```
   https://ltenyoiaydemsnrvdbpc.supabase.co/auth/v1/callback
   ```

Your `.env` already has Google credentials:
```bash
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 3. Supabase Configuration

#### Step 1: Configure OAuth Providers in Supabase
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to "Authentication" > "Providers"
3. Enable and configure:

**GitHub:**
```bash
Client ID: your_github_client_id
Client Secret: your_github_client_secret
Redirect URL: https://ltenyoiaydemsnrvdbpc.supabase.co/auth/v1/callback
```

**Google:**
```bash
Client ID: your_google_client_id
Client Secret: your_google_client_secret
Redirect URL: https://ltenyoiaydemsnrvdbpc.supabase.co/auth/v1/callback
```

#### Step 2: Configure Site URL
In Supabase Dashboard → Authentication → URL Configuration:
```bash
Site URL: http://localhost:3000
Additional Redirect URLs: 
- http://localhost:3000/auth/callback
- http://localhost:3000/workspaces
```

## 🚀 Testing Locally

### Start Development Server
```bash
cd /home/user/webapp
npm run dev
```

### Test Authentication Flow
1. Open http://localhost:3000
2. Click "Sign In" in header
3. Try each provider:
   - ✅ GitHub OAuth
   - ✅ Google OAuth  
   - ✅ Email/Password signup
   - ✅ Email/Password signin

### Test Authentication State
1. Sign in with any provider
2. Verify user appears in header dropdown
3. Navigate to different pages - auth state should persist
4. Try generating an app - should work without asking to login again
5. Sign out and verify state clears

## 🔧 Alternative Testing Methods

### Option A: Use Ngrok for Public URL
If you need a public URL for testing:
```bash
# Install ngrok
npm install -g ngrok

# Start your dev server
npm run dev

# In another terminal, expose localhost:3000
ngrok http 3000
```
Then update OAuth redirect URLs to use the ngrok URL.

### Option B: Test Email/Password Only
For quick testing without OAuth setup:
1. Focus on email/password authentication
2. Create test accounts in Supabase dashboard
3. Test the unified auth system functionality

### Option C: Mock OAuth for Development
Create a development-only mock OAuth system:
```typescript
// In development, bypass OAuth and create mock user
if (process.env.NODE_ENV === 'development') {
  // Mock successful OAuth response
  const mockUser = {
    id: 'dev-user-123',
    email: 'dev@example.com',
    name: 'Dev User'
  };
}
```

## 📋 Testing Checklist

### Authentication Flow:
- [ ] Email/password signup works
- [ ] Email/password signin works
- [ ] GitHub OAuth works (if configured)
- [ ] Google OAuth works (if configured)
- [ ] User state persists across page reloads
- [ ] Sign out clears authentication state

### Application Integration:
- [ ] Header shows user info when authenticated
- [ ] Header shows "Sign In" when not authenticated
- [ ] Generate button works for authenticated users
- [ ] Generate button redirects to auth for unauthenticated users
- [ ] Workspace access works for authenticated users
- [ ] Workspace redirects to auth for unauthenticated users

### Post-Authentication:
- [ ] Successful login redirects to intended page
- [ ] Successful signup redirects to workspace
- [ ] Authentication state is consistent across components
- [ ] No duplicate login prompts

## 🛠️ Troubleshooting

### Common Issues:
1. **"Invalid redirect URI"**: Update OAuth app settings to include localhost URLs
2. **CORS errors**: Check Supabase site URL configuration
3. **Authentication state not persisting**: Check cookie settings and HTTPS requirements
4. **Provider not showing**: Verify provider is enabled in Supabase dashboard

### Debug Authentication:
```bash
# Check auth state
console.log('Auth user:', user);
console.log('Is authenticated:', isAuthenticated);
console.log('Loading:', loading);

# Check API response
curl http://localhost:3000/api/auth/me
```

## 📱 Quick Start for Testing

1. **Start the server**: `npm run dev`
2. **Test email auth first** (no OAuth setup required)
3. **Configure OAuth providers** if needed for full testing
4. **Verify all authentication flows** work correctly
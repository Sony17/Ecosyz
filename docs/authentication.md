# Authentication System

Ecosyz uses a comprehensive authentication system built on Supabase Auth with custom enhancements for user management and session handling.

## 🔐 Authentication Overview

### Supported Methods

- **Email/Password**: Traditional authentication
- **OAuth Providers**: GitHub, Google
- **Password Reset**: Secure password recovery
- **Session Management**: JWT-based sessions

### Security Features

- **Password Hashing**: Bcrypt via Supabase
- **JWT Tokens**: Secure token-based authentication
- **HTTP-Only Cookies**: XSS protection
- **CSRF Protection**: SameSite cookie policy
- **Rate Limiting**: Built-in abuse prevention

## 🚀 Authentication Flow

### User Registration

```
1. User submits registration form
2. Frontend validates input (Zod)
3. POST /api/auth/signup
4. Supabase creates user account
5. Database syncs user profile
6. Email confirmation sent (if enabled)
7. Success response with user data
```

### User Login

```
1. User submits login form
2. Frontend validates credentials
3. POST /api/auth/signin
4. Supabase validates credentials
5. JWT tokens generated
6. HTTP-only cookies set
7. Database user sync
8. Success response
```

### OAuth Flow

```
1. User clicks OAuth provider
2. Redirect to /api/auth/{provider}
3. Supabase OAuth flow
4. Provider authentication
5. Redirect to /auth/callback
6. Tokens exchanged
7. Cookies set
8. User redirected to dashboard
```

## 📊 API Endpoints

### Authentication APIs

#### `POST /api/auth/signup`
Create new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "User Name"
}
```

**Response:**
```json
{
  "message": "Account created successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

#### `POST /api/auth/signin`
Authenticate existing user.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "message": "Signed in successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

#### `POST /api/auth/signout`
End user session.

**Response:**
```json
{
  "message": "Signed out successfully"
}
```

#### `GET /api/auth/session`
Get current session information.

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "User Name",
    "avatarUrl": "https://..."
  }
}
```

### Password Reset APIs

#### `POST /api/auth/reset-password`
Send password reset email.

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "message": "Password reset email sent"
}
```

#### `POST /api/auth/update-password`
Update password with reset tokens.

**Request:**
```json
{
  "password": "newpassword",
  "accessToken": "jwt_token",
  "refreshToken": "refresh_token"
}
```

### OAuth APIs

#### `GET /api/auth/github`
Initiate GitHub OAuth flow.

#### `GET /api/auth/google`
Initiate Google OAuth flow.

#### `GET /auth/callback`
Handle OAuth callback and token exchange.

## 🔧 Configuration

### Supabase Setup

1. **Create Project**: [Supabase Dashboard](https://app.supabase.com)
2. **Authentication Settings**:
   - Enable email confirmations (optional for development)
   - Configure OAuth providers
   - Set up SMTP for emails

3. **Environment Variables**:
```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
```

### OAuth Provider Setup

#### GitHub OAuth
1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create new OAuth App
3. Set Authorization callback URL: `https://your-domain.com/auth/callback`
4. Add Client ID and Secret to Supabase

#### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials
3. Set redirect URI: `https://your-domain.com/auth/callback`
4. Add credentials to Supabase

## 🛡️ Security Best Practices

### Password Requirements
- Minimum 6 characters
- No common passwords
- Regular password rotation encouraged

### Session Security
- HTTP-only cookies prevent XSS
- Secure cookies in production (HTTPS only)
- SameSite=lax prevents CSRF
- Automatic token refresh

### Rate Limiting
- Supabase built-in rate limiting
- Additional API rate limiting
- Progressive delays on failed attempts

## 🔍 Troubleshooting

### Common Issues

**"Invalid login credentials"**
- Check email/password combination
- Ensure account is confirmed (if email confirmation enabled)
- Verify Supabase project settings

**"OAuth provider not configured"**
- Check OAuth app setup in provider dashboard
- Verify callback URLs match
- Ensure Supabase OAuth settings are correct

**"Session expired"**
- Automatic refresh should handle this
- Check cookie settings
- Verify token validity

### Debug Commands

```bash
# Check session
curl http://localhost:3000/api/auth/session

# Test signup
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123","name":"Test"}'

# Test signin
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

## 🔄 User Lifecycle

### Account Creation
1. User registers → Supabase user created
2. Profile record created in database
3. Welcome email sent (if configured)
4. User can immediately sign in

### Account Management
- Profile updates via `/api/profile`
- Password changes via reset flow
- Account deletion (future feature)

### Session Handling
- Automatic login persistence
- Cross-tab session sync
- Secure logout with cleanup

## 🚀 Advanced Features

### Custom Claims
- Role-based access control (future)
- Feature flags per user
- Subscription tiers

### Multi-tenancy
- Organization support (planned)
- Team collaboration features
- Shared workspaces

### Audit Logging
- Authentication events
- Security incidents
- User activity tracking

---

For implementation details, see the [API documentation](api.md) and [architecture overview](architecture.md).
# User Profile System

This document describes the User Profile System implementation for the OpenIdea project.

## Overview

The User Profile System allows authenticated users to manage their profile information, including display name, bio, avatar, and preferences. It integrates with Supabase Auth and uses Prisma for data persistence.

## Features

- **Profile Management**: Display name, bio, and avatar
- **User Preferences**: Theme, language, email notification settings
- **Avatar Upload**: Image upload to Supabase Storage with validation
- **Form Validation**: Client and server-side validation using Zod
- **Responsive UI**: Works on desktop and mobile devices
- **Auth Integration**: Protected routes and session management

## Database Schema

The system uses a `Profile` model with a 1:1 relationship to the `User` model:

```prisma
model Profile {
  id          String   @id @default(cuid())
  userId      String   @unique
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  displayName String?
  bio         String?  @db.Text
  avatarUrl   String?
  preferences Json?    // { theme: "system"|"light"|"dark", language: "en-IN", emailNotifications: boolean, marketingEmails: boolean }
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## Setup Instructions

### 1. Database Migration

Run the profile migration:

```bash
pnpm run db:migrate
```

Or manually:

```bash
npx prisma migrate dev --name profile_init
```

### 2. Supabase Storage Setup

1. Go to your Supabase Dashboard → Storage
2. Create a new bucket named `avatars`
3. Set bucket to public (or configure appropriate RLS policies)
4. Note: The bucket should allow public read access for avatar images

### 3. Environment Variables

Ensure these environment variables are set:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Database
DATABASE_URL=your_database_url
DIRECT_URL=your_direct_database_url
```

## API Endpoints

### GET /api/profile

Returns the current user's profile data. Creates a default profile if none exists.

**Response:**
```json
{
  "profile": {
    "id": "profile_id",
    "displayName": "John Doe",
    "bio": "Software developer...",
    "avatarUrl": "https://...",
    "preferences": {
      "theme": "system",
      "language": "en-IN",
      "emailNotifications": true,
      "marketingEmails": false
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### PUT /api/profile

Updates the user's profile information.

**Request Body:**
```json
{
  "displayName": "John Doe",
  "bio": "Updated bio...",
  "preferences": {
    "theme": "dark",
    "language": "en-US",
    "emailNotifications": true,
    "marketingEmails": false
  }
}
```

### POST /api/profile/avatar

Uploads a new avatar image.

**Request:** `multipart/form-data` with `file` field
**Supported formats:** Images only (JPG, PNG, WebP, etc.)
**Max size:** 2MB

**Response:**
```json
{
  "avatarUrl": "https://supabase-url/storage/v1/object/public/avatars/userId/timestamp.ext",
  "profile": { ... }
}
```

## UI Components

### Profile Page (`/profile`)

- Server component with auth guard
- Redirects to `/auth-test` if not authenticated
- Fetches profile data server-side
- Uses existing layout components (Header, Footer, Container)

### ProfileForm Component

Client component with React Hook Form integration:

- **Display Name**: Required, max 50 characters
- **Bio**: Optional, max 500 characters
- **Theme**: Select (system/light/dark)
- **Language**: Select (currently en-IN default)
- **Email Notifications**: Checkbox
- **Marketing Emails**: Checkbox

### AvatarUploader Component

Handles image upload with preview:

- File validation (images only, 2MB max)
- Immediate upload on selection
- Preview with loading states
- Error handling with toast notifications

## Testing

### Manual Testing Steps

1. **Authentication**: Ensure user is logged in via `/auth-test`

2. **Access Profile Page**:
   - Navigate to `/profile`
   - Verify auth guard redirects if not logged in
   - Check page loads with existing or default profile data

3. **Update Profile**:
   - Modify display name, bio, and preferences
   - Click "Save Changes"
   - Verify success toast and data persistence
   - Check form validation for required fields

4. **Avatar Upload**:
   - Click "Change Avatar"
   - Select an image file (< 2MB)
   - Verify upload progress and success
   - Check avatar preview updates
   - Test error cases (invalid file type, size too large)

5. **Database Verification**:
   - Check Prisma Studio: `pnpm run db:studio`
   - Verify Profile record exists with correct data
   - Confirm avatar URL is stored

### API Testing

```bash
# Get profile
curl -H "Cookie: sb-access-token=..." http://localhost:3001/api/profile

# Update profile
curl -X PUT -H "Content-Type: application/json" -H "Cookie: sb-access-token=..." \
  -d '{"displayName":"Test User","bio":"Test bio","preferences":{"theme":"dark","language":"en-IN","emailNotifications":true,"marketingEmails":false}}' \
  http://localhost:3001/api/profile

# Upload avatar
curl -X POST -H "Cookie: sb-access-token=..." \
  -F "file=@/path/to/image.jpg" \
  http://localhost:3001/api/profile/avatar
```

## Navigation

- Profile link appears in header navigation when authenticated
- Available in both desktop and mobile menus
- Links to `/profile` route

## Error Handling

- Form validation with Zod schemas
- API error responses with descriptive messages
- Toast notifications for user feedback
- File upload validation and error states
- Graceful fallbacks for missing data

## Security Considerations

- All routes require authentication
- File upload validation (type, size)
- Supabase Storage bucket permissions
- Input sanitization via Zod validation
- CSRF protection via Next.js

## Future Enhancements

- Email verification integration
- Profile completion onboarding flow
- Social media profile linking
- Advanced avatar editing (crop, filters)
- Profile analytics and insights
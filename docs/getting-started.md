# Getting Started with Ecosyz

Welcome to Ecosyz! This guide will help you get up and running with the Open Idea platform in minutes.

## 🚀 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **pnpm** package manager ([Install](https://pnpm.io/installation))
- **Git** ([Download](https://git-scm.com/))
- **Supabase Account** ([Sign up](https://supabase.com))

## 📦 Quick Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Sony17/Ecosyz.git
cd Ecosyz
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Setup

```bash
# Copy environment template
cp .env.example .env.local

# Edit with your values
nano .env.local
```

**Required Environment Variables:**
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Database
DATABASE_URL=your_database_url
DIRECT_URL=your_direct_database_url

# Optional: External APIs
OPENAI_API_KEY=your_openai_key
GOOGLE_SEARCH_API_KEY=your_google_api_key
```

### 4. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push

# Optional: Open Prisma Studio
npx prisma studio
```

### 5. Start Development Server

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your app!

## 🔧 Development Workflow

### Code Quality

```bash
# Run linting
pnpm lint

# Run type checking
pnpx tsc --noEmit

# Run tests (when available)
pnpm test
```

### Database Management

```bash
# View database in browser
npx prisma studio

# Reset database (development only)
npx prisma migrate reset

# Create new migration
npx prisma migrate dev --name your_migration_name
```

### API Testing

```bash
# Test authentication
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","name":"Test User"}'

# Test profile API
curl http://localhost:3000/api/profile
```

## 🏗️ Project Structure

```
Ecosyz/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── components/        # React components
│   └── globals.css        # Global styles
├── docs/                  # Documentation
├── prisma/                # Database schema
├── src/                   # Source code
│   ├── lib/              # Utilities and configurations
│   └── types/            # TypeScript types
├── public/                # Static assets
└── tests/                 # Test files
```

## 🔐 Authentication Setup

### Supabase Configuration

1. **Create Project**: Go to [Supabase Dashboard](https://app.supabase.com)
2. **Get Keys**: Copy URL and anon key from project settings
3. **Enable Auth**: Configure authentication providers
4. **Database**: Set up database and run migrations

### OAuth Providers (Optional)

Configure in Supabase Dashboard:
- **GitHub**: Add GitHub OAuth app
- **Google**: Add Google OAuth credentials

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
```

### Manual Deployment

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

## 🐛 Troubleshooting

### Common Issues

**"Invalid login credentials"**
- Check Supabase URL and keys
- Ensure user exists in Supabase Auth
- Verify email confirmation settings

**"Database connection failed"**
- Check DATABASE_URL in .env.local
- Run `npx prisma generate`
- Ensure Supabase database is accessible

**"Build failed"**
- Run `pnpm lint` and fix errors
- Check TypeScript errors with `pnpx tsc --noEmit`
- Clear Next.js cache: `rm -rf .next`

### Getting Help

- 📖 [Full Documentation](../docs/)
- 🐛 [Report Issues](https://github.com/Sony17/Ecosyz/issues)
- 💬 [Discussions](https://github.com/Sony17/Ecosyz/discussions)

## 🎯 Next Steps

1. **Explore the codebase** - Start with `app/page.tsx`
2. **Test authentication** - Try signup/signin flow
3. **Customize UI** - Modify components in `app/components/`
4. **Add features** - Check the [backlog](../docs/backlog.md)

Happy coding! 🚀
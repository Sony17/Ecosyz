# Ecosyz Architecture Overview

This document provides a comprehensive overview of the Ecosyz platform architecture, design decisions, and technical implementation.

## 🏗️ System Architecture

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Next.js)     │◄──►│   (API Routes)  │◄──►│   (PostgreSQL)  │
│                 │    │                 │    │                 │
│ • React/TSX     │    │ • REST APIs     │    │ • Prisma ORM    │
│ • Tailwind CSS  │    │ • Auth Logic    │    │ • User Data     │
│ • Components    │    │ • Business Logic│    │ • Resources     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
       │                       │                       │
       └───────────────────────┼───────────────────────┘
                               │
                    ┌─────────────────┐
                    │   External      │
                    │   Services      │
                    │                 │
                    │ • Supabase Auth │
                    │ • AI Services   │
                    │ • Search APIs   │
                    └─────────────────┘
```

## 🛠️ Technology Stack

### Frontend Layer
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React hooks + server state
- **Forms**: React Hook Form + Zod validation
- **UI Components**: Custom component library

### Backend Layer
- **Runtime**: Node.js (Next.js API Routes)
- **Authentication**: Supabase Auth
- **Database**: PostgreSQL via Supabase
- **ORM**: Prisma
- **API**: RESTful endpoints
- **Validation**: Zod schemas

### External Services
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **File Storage**: Supabase Storage
- **Email**: Resend (via Supabase)
- **AI Services**: OpenAI, custom summarization
- **Search**: Google Custom Search, arXiv, etc.

## 📁 Project Structure

```
Ecosyz/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication pages
│   ├── (dashboard)/              # Protected pages
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── profile/              # Profile management
│   │   ├── search/               # Search functionality
│   │   └── workspaces/           # Workspace management
│   ├── components/               # React components
│   │   ├── ui/                   # Reusable UI components
│   │   ├── auth/                 # Auth-specific components
│   │   └── workspace/            # Workspace components
│   └── globals.css               # Global styles
├── docs/                         # Documentation
├── prisma/                       # Database schema
│   ├── schema.prisma             # Database models
│   └── migrations/               # Database migrations
├── src/                          # Shared utilities
│   ├── lib/                      # Core libraries
│   │   ├── auth.ts               # Authentication helpers
│   │   ├── db.ts                 # Database client
│   │   ├── supabase.ts           # Supabase client
│   │   └── validation.ts         # Zod schemas
│   └── types/                    # TypeScript types
├── public/                       # Static assets
├── tests/                        # Test files
└── types/                        # Global type definitions
```

## 🔐 Authentication Architecture

### Authentication Flow

```
1. User Login Request
        ↓
2. Frontend → /api/auth/signin
        ↓
3. Supabase Auth Validation
        ↓
4. JWT Token Generation
        ↓
5. HTTP-Only Cookies Set
        ↓
6. Database User Sync
        ↓
7. Success Response
```

### Session Management

- **Storage**: HTTP-only cookies (secure, XSS protection)
- **Tokens**: JWT access + refresh tokens
- **Validation**: Server-side on each request
- **Refresh**: Automatic token rotation
- **Logout**: Cookie clearing + Supabase session termination

### Security Features

- **Password Hashing**: Handled by Supabase
- **Token Encryption**: JWT with secure signing
- **CSRF Protection**: SameSite cookie policy
- **Rate Limiting**: Supabase built-in protection
- **Input Validation**: Zod schemas on all inputs

## 🗄️ Database Architecture

### Schema Design

```sql
-- Core Entities
Users (Supabase Auth) ←→ Profiles (App Data)
    ↓
Workspaces (User's Projects)
    ↓
Resources (Papers, Articles, etc.)
    ↓
Annotations (User Notes)
```

### Key Relationships

- **User ↔ Profile**: One-to-one (extended user data)
- **User ↔ Workspaces**: One-to-many (user's projects)
- **Workspace ↔ Resources**: One-to-many (project contents)
- **Resource ↔ Annotations**: One-to-many (user notes)

### Data Flow

```
API Request → Validation → Business Logic → Database → Response
    ↓            ↓            ↓            ↓         ↓
 Zod Schema → Auth Check → Service Layer → Prisma → JSON
```

## 🔍 Search Architecture

### Multi-Source Search

```
User Query → Search Orchestrator → Multiple APIs
    ↓               ↓                  ↓
  Results → Deduplication → Ranking → Display
```

### Supported Sources

- **Academic**: arXiv, Semantic Scholar, OpenAlex
- **Web**: Google Custom Search, Bing
- **Code**: GitHub Search API
- **Media**: YouTube Data API

### Search Pipeline

1. **Query Processing**: Parse and normalize search terms
2. **Parallel Search**: Query multiple APIs simultaneously
3. **Deduplication**: Remove duplicate results
4. **Ranking**: Score and sort results
5. **Caching**: LRU cache for performance

## 🤖 AI Integration

### Summarization Engine

```
Input Text → Preprocessing → AI Model → Postprocessing → Summary
    ↓            ↓             ↓            ↓            ↓
Clean Text → Chunking → OpenAI API → Formatting → Structured Output
```

### Key Features

- **Multi-format Support**: PDF, HTML, plain text
- **Chunking Strategy**: Intelligent text splitting
- **Model Selection**: GPT-4 for complex, GPT-3.5 for simple
- **Caching**: Avoid re-processing same content
- **Error Handling**: Fallback strategies

## 🚀 Deployment Architecture

### Vercel Deployment

```
Git Push → Vercel Build → Environment Setup → Deployment
    ↓           ↓              ↓               ↓
   main     Build Command   Env Variables   Live Site
 branch     (pnpm build)     (.env files)   (CDN)
```

### Environment Strategy

- **Development**: Local `.env.local`
- **Preview**: Auto-created per PR
- **Production**: Separate environment variables

### Scaling Considerations

- **Serverless**: Automatic scaling with Vercel
- **CDN**: Global content delivery
- **Database**: Supabase handles connection pooling
- **Caching**: Next.js ISR + Redis (future)

## 🔧 Development Workflow

### Code Quality

```bash
# Linting
pnpm lint

# Type checking
pnpx tsc --noEmit

# Testing
pnpm test

# Build verification
pnpm build
```

### Git Workflow

```
feature-branch → Pull Request → Code Review → Merge to main → Auto-deploy
```

### CI/CD Pipeline

- **Linting**: ESLint configuration
- **Type Check**: TypeScript compilation
- **Build**: Next.js production build
- **Deploy**: Vercel automatic deployment

## 📊 Performance Optimization

### Frontend Optimizations

- **Code Splitting**: Route-based splitting
- **Image Optimization**: Next.js Image component
- **Caching**: Aggressive caching strategies
- **Bundle Analysis**: Bundle analyzer integration

### Backend Optimizations

- **Database Indexing**: Optimized queries
- **Caching**: Redis for frequent data
- **API Rate Limiting**: Prevent abuse
- **Response Compression**: Gzip compression

## 🔮 Future Architecture

### Planned Improvements

- **Microservices**: Split monolithic API
- **GraphQL**: Replace REST APIs
- **Real-time**: WebSocket integration
- **Advanced AI**: Custom model training
- **Multi-region**: Global deployment

### Scalability Roadmap

- **Database**: Connection pooling, read replicas
- **Caching**: Redis cluster, CDN optimization
- **Monitoring**: Application performance monitoring
- **Load Balancing**: Advanced routing strategies

## 📚 Documentation Structure

- **API Docs**: Comprehensive endpoint documentation
- **Component Library**: Reusable component documentation
- **Architecture Decisions**: ADRs for major decisions
- **Deployment Guide**: Infrastructure as code
- **Troubleshooting**: Common issues and solutions

---

*This architecture document is living and should be updated as the system evolves.*
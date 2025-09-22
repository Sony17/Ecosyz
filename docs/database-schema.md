# Database Schema

This document describes the Ecosyz database schema, relationships, and data models.

## 🗄️ Database Overview

Ecosyz uses PostgreSQL as the primary database, managed through Supabase with Prisma ORM for type-safe database operations.

### Technology Stack

- **Database**: PostgreSQL 15
- **ORM**: Prisma
- **Hosting**: Supabase
- **Migration**: Prisma Migrate
- **Studio**: Prisma Studio for development

## 📊 Schema Models

### User Model

```sql
model User {
  id            String      @id @default(cuid())
  supabaseId    String      @unique
  email         String      @unique
  name          String?
  avatarUrl     String?
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  workspaces    Workspace[]
  profile       Profile?
}
```

**Relationships:**
- One-to-many with `Workspace`
- One-to-one with `Profile`

**Usage:**
- Core user identity from Supabase Auth
- Extended with app-specific data
- Used for authorization and personalization

### Profile Model

```sql
model Profile {
  id          String   @id @default(cuid())
  userId      String   @unique
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  displayName String?
  bio         String?  @db.Text
  avatarUrl   String?
  preferences Json?    // Flexible preferences object
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

**Preferences Structure:**
```json
{
  "theme": "system" | "light" | "dark",
  "language": "en-IN",
  "emailNotifications": true,
  "marketingEmails": false
}
```

**Usage:**
- Extended user profile information
- User preferences and settings
- Display information for UI

### Workspace Model

```sql
model Workspace {
  id        String      @id @default(cuid())
  title     String
  ownerId   String
  owner     User        @relation(fields: [ownerId], references: [id], onDelete: Cascade)
  createdAt DateTime    @default(now())
  resources Resource[]
  shares    ShareLink[]
}
```

**Relationships:**
- Many-to-one with `User` (owner)
- One-to-many with `Resource`
- One-to-many with `ShareLink`

**Usage:**
- User's research projects/organizations
- Container for related resources
- Collaboration spaces

### Resource Model

```sql
model Resource {
  id          String      @id @default(cuid())
  workspace   Workspace   @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  workspaceId String
  title       String
  url         String?
  type        String?     // "paper", "article", "video", etc.
  tags        Json?       // Array of tag strings
  data        Json?       // Flexible metadata storage
  createdAt   DateTime    @default(now())
  annotations Annotation[]
}
```

**Data Structure Examples:**

**Academic Paper:**
```json
{
  "authors": ["Smith, J.", "Doe, A."],
  "year": 2024,
  "journal": "Nature",
  "doi": "10.1038/nature12345",
  "abstract": "...",
  "citations": 150
}
```

**Web Article:**
```json
{
  "source": "TechCrunch",
  "author": "Jane Smith",
  "publishedAt": "2024-01-15T10:30:00Z",
  "readTime": 5,
  "category": "AI"
}
```

**Usage:**
- Research materials and references
- Search results storage
- User-curated content

### Annotation Model

```sql
model Annotation {
  id         String   @id @default(cuid())
  resource   Resource @relation(fields: [resourceId], references: [id], onDelete: Cascade)
  resourceId String
  body       String
  highlights Json?    // Text selection data
  createdAt  DateTime @default(now())
}
```

**Highlights Structure:**
```json
{
  "text": "Selected text content",
  "startOffset": 150,
  "endOffset": 200,
  "color": "#ffeb3b"
}
```

**Usage:**
- User notes and comments
- Text highlights and annotations
- Research insights and observations

### ShareLink Model

```sql
model ShareLink {
  id          String    @id @default(cuid())
  workspace   Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  workspaceId String
  token       String    @unique
  readOnly    Boolean   @default(true)
  expiresAt   DateTime?
  createdAt   DateTime  @default(now())
}
```

**Usage:**
- Public sharing of workspaces
- Temporary access links
- Collaboration features

## 🔗 Database Relationships

### Entity Relationship Diagram

```
User (1) ──── (1) Profile
  │
  └── (∞) Workspace
         │
         ├── (∞) Resource
         │      │
         │      └── (∞) Annotation
         │
         └── (∞) ShareLink
```

### Foreign Key Constraints

- **Cascade Delete**: When user deleted → profile, workspaces, resources, annotations deleted
- **Restrict Delete**: Cannot delete workspace with existing resources
- **Unique Constraints**: Email uniqueness, Supabase ID uniqueness

## 🔍 Indexes and Performance

### Automatic Indexes

Prisma automatically creates indexes for:
- Primary keys (`id`)
- Foreign keys (`userId`, `workspaceId`, `resourceId`)
- Unique constraints (`email`, `supabaseId`)

### Recommended Additional Indexes

```sql
-- For user searches
CREATE INDEX idx_user_email ON "User" (email);
CREATE INDEX idx_user_name ON "User" (name);

-- For workspace queries
CREATE INDEX idx_workspace_owner ON "Workspace" (owner_id);
CREATE INDEX idx_workspace_created ON "Workspace" (created_at DESC);

-- For resource searches
CREATE INDEX idx_resource_workspace ON "Resource" (workspace_id);
CREATE INDEX idx_resource_type ON "Resource" (type);
CREATE INDEX idx_resource_created ON "Resource" (created_at DESC);

-- For full-text search
CREATE INDEX idx_resource_title_fts ON "Resource" USING gin(to_tsvector('english', title));
CREATE INDEX idx_resource_data_fts ON "Resource" USING gin(to_tsvector('english', data::text));
```

## 🔄 Data Migration Strategy

### Migration Commands

```bash
# Create new migration
npx prisma migrate dev --name migration_name

# Apply migrations
npx prisma migrate deploy

# Reset database (development)
npx prisma migrate reset

# Generate client
npx prisma generate
```

### Migration Best Practices

1. **Descriptive Names**: Use clear migration names
2. **Backward Compatible**: Ensure migrations can be rolled back
3. **Data Safety**: Backup before destructive changes
4. **Testing**: Test migrations on staging environment

## 📊 Database Operations

### Common Queries

**Get User with Profile:**
```typescript
const user = await prisma.user.findUnique({
  where: { id: userId },
  include: { profile: true }
});
```

**Get Workspace with Resources:**
```typescript
const workspace = await prisma.workspace.findUnique({
  where: { id: workspaceId },
  include: {
    resources: {
      include: {
        annotations: true
      }
    }
  }
});
```

**Search Resources:**
```typescript
const resources = await prisma.resource.findMany({
  where: {
    workspaceId: workspaceId,
    OR: [
      { title: { contains: query, mode: 'insensitive' } },
      { data: { path: ['abstract'], string_contains: query } }
    ]
  }
});
```

## 🔒 Security Considerations

### Row Level Security (RLS)

Supabase RLS policies ensure users can only access their own data:

```sql
-- Users can only see their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = user_id);

-- Users can only modify their own workspaces
CREATE POLICY "Users can modify own workspaces" ON workspaces
  FOR ALL USING (auth.uid() = owner_id);
```

### Data Validation

- **Application Level**: Zod schemas validate input
- **Database Level**: Constraints and triggers
- **API Level**: Middleware validation

## 📈 Scaling Considerations

### Current Limitations

- **Single Region**: Currently single Supabase region
- **Connection Pooling**: Limited concurrent connections
- **Storage**: File storage in Supabase Storage

### Future Improvements

- **Read Replicas**: For read-heavy operations
- **Sharding**: By user or workspace
- **Caching**: Redis for frequent queries
- **Archiving**: Old data archiving strategy

## 🛠️ Development Tools

### Prisma Studio

```bash
npx prisma studio
```

Opens browser interface for database exploration and editing.

### Database URL Configuration

```env
# Development
DATABASE_URL="postgresql://user:password@localhost:5432/ecosyz_dev"

# Production
DATABASE_URL="postgresql://user:password@db.supabase.co:5432/postgres"
DIRECT_URL="postgresql://user:password@db.supabase.co:5432/postgres"
```

### Seed Data

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create sample data
  const user = await prisma.user.create({
    data: {
      supabaseId: 'sample-uuid',
      email: 'user@example.com',
      name: 'Sample User',
      profile: {
        create: {
          displayName: 'Sample User',
          preferences: {
            theme: 'system',
            language: 'en-IN'
          }
        }
      }
    }
  });
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
```

## 🔧 Maintenance

### Regular Tasks

- **Monitor Performance**: Query execution times
- **Update Indexes**: Based on query patterns
- **Clean Old Data**: Archive unused resources
- **Backup Verification**: Regular backup testing

### Troubleshooting

**Connection Issues:**
```bash
# Test connection
npx prisma db push --preview-feature

# Check migration status
npx prisma migrate status
```

**Performance Issues:**
```bash
# Analyze slow queries
EXPLAIN ANALYZE SELECT * FROM resources WHERE workspace_id = $1;

# Check index usage
SELECT * FROM pg_stat_user_indexes;
```

---

For API usage examples, see the [API documentation](api.md).
# Database Connections and Migrations Guide

## Database URLs in Supabase

We use two different database connection URLs for different purposes:

### 1. Pooled Connection (DATABASE_URL)
```
postgresql://postgres.ltenyoiaydemsnrvdbpc:[PASSWORD]@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

**Used for:**
- Regular application queries
- Normal CRUD operations
- High-concurrency operations
- Production environment

**Why:**
- Manages connection pooling efficiently
- Better handles multiple simultaneous connections
- Prevents database connection exhaustion
- Optimal for serverless environments

### 2. Direct Connection (DIRECT_URL)
```
postgresql://postgres:[PASSWORD]@db.ltenyoiaydemsnrvdbpc.supabase.co:5432/postgres
```

**Used for:**
- Database migrations
- Schema changes
- Prisma Studio
- Development tools

**Why:**
- Bypasses connection pooling
- Required for operations that need direct database access
- Necessary for schema migrations
- Supports long-lived connections

## Database Migration Commands

### 1. Create a New Migration
```bash
npx prisma migrate dev --name your_migration_name
```
- Creates a new migration file
- Applies the migration to your database
- Regenerates Prisma Client

### 2. Reset Database (Development Only)
```bash
npx prisma migrate reset --force
```
- Drops all tables and data
- Reapplies all migrations
- Seeds the database (if configured)

### 3. Apply Migrations (Production)
```bash
npx prisma migrate deploy
```
- Applies pending migrations
- Safe for production use
- Doesn't reset or modify existing data

### 4. View Database in Prisma Studio
```bash
npx prisma studio
```
- Opens web interface at http://localhost:5555
- Uses DIRECT_URL connection
- Great for data visualization and management

## Common Issues and Solutions

1. **Connection Pooling Errors**
   - If you see "Too many connections" error, ensure you're using the pooled URL for app queries

2. **Migration Failures**
   - Always use DIRECT_URL for migrations
   - Reset database if in development
   - Check foreign key constraints

3. **Prisma Studio Connection Issues**
   - Verify DIRECT_URL is correctly configured
   - Check if database is accessible
   - Ensure proper permissions

## Environment Setup

1. Create `.env` file with both URLs:
```env
DATABASE_URL="[pooled-connection-url]"
DIRECT_URL="[direct-connection-url]"
```

2. Update `schema.prisma`:
```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

## Best Practices

1. **Version Control**
   - Commit migration files
   - Don't commit `.env` files
   - Maintain `.env.example`

2. **Development Workflow**
   - Use `migrate dev` during development
   - Test migrations locally first
   - Keep migrations small and focused

3. **Production Deployments**
   - Always backup before migrations
   - Use `migrate deploy` in production
   - Never use `reset` in production

4. **Connection Management**
   - Use pooled connections for regular operations
   - Use direct connections for admin tasks
   - Monitor connection limits

## Troubleshooting

If you encounter issues:

1. Check connection strings
2. Verify database permissions
3. Ensure proper environment variables
4. Review migration history
5. Check Prisma logs

For more detailed information:
- [Prisma Migrations](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [Supabase Connection Pooling](https://supabase.com/docs/guides/database/connecting-to-postgres)
- [Database Connection Issues](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pool)
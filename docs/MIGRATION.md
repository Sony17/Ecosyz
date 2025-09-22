# Database Migration Guide

This guide explains how to migrate from SQLite (dev) to a production database like PostgreSQL.

## Current Setup (SQLite)
- Provider: `sqlite`
- URL: `file:./dev.db`
- Command: `npm run db:push` (direct schema push, no migrations)

## Migrating to Production (e.g., PostgreSQL)

### 1. Choose a Database
- **Options:** Neon, Supabase, PlanetScale, Railway, or self-hosted PostgreSQL/MySQL.
- Get the connection URL (e.g., `postgresql://user:pass@host:port/db`).

### 2. Update Environment
- Edit `.env`:
  ```
  DATABASE_URL="postgresql://user:pass@host:port/db"
  ```

### 3. Update Schema
- Edit `prisma/schema.prisma`:
  ```
  datasource db {
    provider = "postgresql"  // or "mysql"
    url      = env("DATABASE_URL")
  }
  ```

### 4. Generate Migrations
- Run: `npm run db:migrate`
  - This creates migration files in `prisma/migrations/`.
  - Applies them to the database.

### 5. Deploy
- For production: `npx prisma migrate deploy` (applies migrations without generating new ones).
- Update your Vercel env vars with the new `DATABASE_URL`.

### 6. Notes
- Schema remains the same; only provider/URL changes.
- Test locally with a test DB before deploying.
- Use `npm run prisma:studio` to view data in both setups.
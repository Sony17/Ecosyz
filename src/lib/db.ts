import { PrismaClient } from '@prisma/client';

// Prevent multiple instances in dev (hot-reload safe)
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    // Disable prepared statements for Supabase transaction pooler compatibility
    // This prevents "prepared statement already exists" errors with connection pooling
    transactionOptions: {
      maxWait: 20000,
      timeout: 20000,
    },
  });

if (process.env.NODE_ENV === 'development') globalForPrisma.prisma = prisma;

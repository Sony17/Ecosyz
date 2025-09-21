import { PrismaClient, Prisma } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

const logLevels: Prisma.LogLevel[] = process.env.NODE_ENV === 'development' 
  ? ['query', 'error', 'warn'] 
  : ['error'];

export const prisma = global.prisma || new PrismaClient({
  log: logLevels,
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

export const prisma = globalForPrisma.__prisma ?? new PrismaClient({
  log: ['warn', 'error'],
});

globalForPrisma.__prisma = prisma;

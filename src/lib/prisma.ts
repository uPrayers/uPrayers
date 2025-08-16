// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

// Reuse the Prisma client across hot reloads in dev to avoid
// exhausting database connections, and keep a single instance in prod.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "production" ? [] : ["query", "error", "warn"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

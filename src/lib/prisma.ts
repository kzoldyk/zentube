import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export interface Env {
  DB: D1Database;
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Gets or creates a Prisma client instance using the Cloudflare D1 adapter.
 * This function should be called within a server context (Server Action, Server Component, or Route Handler).
 */
export const getPrisma = async () => {
  const { env } = await getCloudflareContext();
  
  if (!env.DB) {
    throw new Error("D1 database binding 'DB' not found in Cloudflare context.");
  }

  // In production, we create a new client for each request to ensure the correct D1 binding is used.
  // In development, we use a global instance to prevent multiple connections during hot reloading.
  if (process.env.NODE_ENV === "development" && globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }

  const adapter = new PrismaD1(env.DB);
  const client = new PrismaClient({ adapter });
  
  if (process.env.NODE_ENV === "development") {
    globalForPrisma.prisma = client;
  }
  
  return client;
};

// Exporting a placeholder for the legacy 'prisma' export to avoid immediate breakages,
// but code should be migrated to use 'await getPrisma()'.
export const prisma = {} as PrismaClient;

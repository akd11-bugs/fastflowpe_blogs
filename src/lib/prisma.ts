import 'server-only'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../generated/prisma/client'

// Server-only singleton — never import this into a client component.
// Prisma manages its own tables (see prisma/schema.prisma) in the same
// Postgres instance Payload CMS uses, but never touches Payload's own tables.

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const adapter = new PrismaPg({ connectionString: process.env.PRISMA_DATABASE_URL })

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client'

const adapter = new PrismaPg({ connectionString: process.env.PRISMA_DATABASE_URL })
const prisma = new PrismaClient({ adapter })

async function main() {
  const noteCount = await prisma.note.count()
  console.log(`✅ Connected — found ${noteCount} Note row(s).`)
}

main()
  .catch((error) => {
    console.error('❌ Connection failed:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

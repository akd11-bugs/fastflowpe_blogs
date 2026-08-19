import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client'

const adapter = new PrismaPg({ connectionString: process.env.PRISMA_DATABASE_URL })
const prisma = new PrismaClient({ adapter })

async function main() {
  const [howTo, launch] = await Promise.all([
    prisma.tag.upsert({ where: { name: 'how-to' }, update: {}, create: { name: 'how-to' } }),
    prisma.tag.upsert({ where: { name: 'launch' }, update: {}, create: { name: 'launch' } }),
  ])

  await prisma.note.createMany({
    data: [
      { title: 'Welcome note', content: 'This is a starter row seeded by prisma/seed.ts.' },
      { title: 'Second note', content: 'Replace these starter models with your own.' },
    ],
    skipDuplicates: true,
  })

  const firstNote = await prisma.note.findFirst({ where: { title: 'Welcome note' } })
  if (firstNote) {
    await prisma.note.update({
      where: { id: firstNote.id },
      data: { tags: { connect: [{ id: howTo.id }, { id: launch.id }] } },
    })
  }

  console.log('Seed complete.')
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

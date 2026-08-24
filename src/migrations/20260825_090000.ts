import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Adds `heading` and `description` — the Juspay-style masthead fields — to
 * the Archive block. Additive only, matching 20260824_090000.ts's pattern:
 * migrate:create is interactive on this database (pre-existing, unrelated
 * footer-enum drift) and would rather ask about that than generate these two
 * columns.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "pages_blocks_archive" ADD COLUMN "heading" varchar;
  ALTER TABLE "pages_blocks_archive" ADD COLUMN "description" varchar;
  ALTER TABLE "_pages_v_blocks_archive" ADD COLUMN "heading" varchar;
  ALTER TABLE "_pages_v_blocks_archive" ADD COLUMN "description" varchar;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "pages_blocks_archive" DROP COLUMN IF EXISTS "heading";
  ALTER TABLE "pages_blocks_archive" DROP COLUMN IF EXISTS "description";
  ALTER TABLE "_pages_v_blocks_archive" DROP COLUMN IF EXISTS "heading";
  ALTER TABLE "_pages_v_blocks_archive" DROP COLUMN IF EXISTS "description";`)
}

import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Adds `subheading` to the `pages_blocks_featured_posts` block (see
 * src/blocks/FeaturedPosts/config.ts) — a one-line H2 shown directly
 * below the H1, before the hero. Same reasoning/pattern as the
 * `heading` column added in 20260827_090000.ts.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "pages_blocks_featured_posts" ADD COLUMN "subheading" varchar;
  ALTER TABLE "_pages_v_blocks_featured_posts" ADD COLUMN "subheading" varchar;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "pages_blocks_featured_posts" DROP COLUMN IF EXISTS "subheading";
  ALTER TABLE "_pages_v_blocks_featured_posts" DROP COLUMN IF EXISTS "subheading";`)
}

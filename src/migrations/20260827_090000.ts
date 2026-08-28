import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Adds `heading` to the `pages_blocks_featured_posts` block (see
 * src/blocks/FeaturedPosts/config.ts) — an admin-editable H1 shown above
 * the featured posts, always rendered so the page has real orientation
 * copy even when no posts are picked yet.
 *
 * Hand-written for the same reason as every other migration in this file:
 * `payload migrate:create` is interactive on this database and asks
 * "new enum or rename?" before it will generate anything. Column type
 * confirmed by introspecting `pages_blocks_archive.heading`, which is a
 * plain `character varying` with no length cap — matched exactly here.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "pages_blocks_featured_posts" ADD COLUMN "heading" varchar;
  ALTER TABLE "_pages_v_blocks_featured_posts" ADD COLUMN "heading" varchar;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "pages_blocks_featured_posts" DROP COLUMN IF EXISTS "heading";
  ALTER TABLE "_pages_v_blocks_featured_posts" DROP COLUMN IF EXISTS "heading";`)
}

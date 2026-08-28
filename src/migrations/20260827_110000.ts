import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Adds `blogs_intro` to `pages_blocks_featured_posts` (see
 * src/blocks/FeaturedPosts/config.ts) — a short blurb shown beside the
 * "Blogs" heading. Same pattern as `heading`/`subheading` in the two
 * prior migrations.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "pages_blocks_featured_posts" ADD COLUMN "blogs_intro" varchar;
  ALTER TABLE "_pages_v_blocks_featured_posts" ADD COLUMN "blogs_intro" varchar;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "pages_blocks_featured_posts" DROP COLUMN IF EXISTS "blogs_intro";
  ALTER TABLE "_pages_v_blocks_featured_posts" DROP COLUMN IF EXISTS "blogs_intro";`)
}

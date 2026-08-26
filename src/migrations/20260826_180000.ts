import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Adds the `pages_blocks_featured_posts` block (see
 * src/blocks/FeaturedPosts/config.ts) — an admin-picked set of up to 3
 * posts, rendered as the homepage's new "hero".
 *
 * Hand-written for the same reason as every other migration in this file:
 * `payload migrate:create` is interactive on this database (pre-existing
 * footer/header link-enum naming drift) and asks "new enum or rename?"
 * before it will generate anything.
 *
 * No new columns needed for the `posts` relationship field itself —
 * `pages_rels`/`_pages_v_rels` already have a `posts_id` column (from the
 * existing Archive block's `selectedDocs`/`categories` fields), so
 * Payload will just write rows there with a new `path` value
 * ("layout.N.posts") once content exists. Only the block's own row table
 * is new, in both the live and versions shape (confirmed by introspecting
 * `pages_blocks_archive` / `_pages_v_blocks_archive` directly — note the
 * live table's `id` is varchar while the versions table's `id` is a plain
 * integer, and only the versions table has `_uuid`; both asymmetries are
 * intentional and copied here).
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE TABLE "pages_blocks_featured_posts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar,
  	"grid_position_col_start" numeric,
  	"grid_position_col_span" numeric,
  	"grid_position_row_start" numeric,
  	"grid_position_row_span" numeric
  );

  CREATE TABLE "_pages_v_blocks_featured_posts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar,
  	"grid_position_col_start" numeric,
  	"grid_position_col_span" numeric,
  	"grid_position_row_start" numeric,
  	"grid_position_row_span" numeric
  );

  ALTER TABLE "pages_blocks_featured_posts" ADD CONSTRAINT "pages_blocks_featured_posts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_featured_posts" ADD CONSTRAINT "_pages_v_blocks_featured_posts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;

  CREATE INDEX "pages_blocks_featured_posts_order_idx" ON "pages_blocks_featured_posts" USING btree ("_order");
  CREATE INDEX "pages_blocks_featured_posts_parent_id_idx" ON "pages_blocks_featured_posts" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_featured_posts_path_idx" ON "pages_blocks_featured_posts" USING btree ("_path");

  CREATE INDEX "_pages_v_blocks_featured_posts_order_idx" ON "_pages_v_blocks_featured_posts" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_featured_posts_parent_id_idx" ON "_pages_v_blocks_featured_posts" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_featured_posts_path_idx" ON "_pages_v_blocks_featured_posts" USING btree ("_path");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DROP TABLE IF EXISTS "pages_blocks_featured_posts" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_featured_posts" CASCADE;`)
}

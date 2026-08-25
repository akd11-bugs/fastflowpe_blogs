import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Creates `search_categories` — the one table actually missing from
 * `@payloadcms/plugin-search`'s schema on this database.
 *
 * `search` and `search_rels` already exist (confirmed by querying
 * information_schema directly, with all their expected columns, FKs, and
 * indexes already in place) — only the `categories` array field's own table
 * was never created. That single gap is what every query against the
 * `search` collection has been failing on since before this session started
 * ("relation search_categories does not exist"), including the public
 * /search page.
 *
 * Column set and FK/index conventions copied from this database's existing
 * `pages_blocks_feature_slides_items` table — the same shape (an array
 * field's rows, `_order` + `_parent_id` + varchar `id`), just parented to
 * `search` instead of a block.
 *
 * Hand-written for the same reason as every other migration in this file:
 * `payload migrate:create` is interactive on this database and immediately
 * asks about unrelated, pre-existing footer-enum drift before it will
 * generate anything.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE TABLE "search_categories" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"relation_to" varchar,
  	"category_i_d" varchar,
  	"title" varchar
  );

  ALTER TABLE "search_categories" ADD CONSTRAINT "search_categories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."search"("id") ON DELETE cascade ON UPDATE no action;

  CREATE INDEX "search_categories_order_idx" ON "search_categories" USING btree ("_order");
  CREATE INDEX "search_categories_parent_id_idx" ON "search_categories" USING btree ("_parent_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DROP TABLE "search_categories" CASCADE;`)
}

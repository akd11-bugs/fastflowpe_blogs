import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Adds the tables for the new Industry Solutions block, mirroring the exact
 * shape of the existing Feature Slides block (20260819_080000.ts) — same
 * table quartet (live items / live block / versioned items / versioned
 * block), same FK and index conventions — with one extra `headline` column
 * on the items table for this block's three-field item shape.
 *
 * Hand-written for the same reason as 20260824_090000.ts: `migrate:create` is
 * interactive on this database and immediately asks about unrelated,
 * pre-existing footer-enum drift before it will generate anything.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE TABLE "pages_blocks_industry_solutions_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"headline" varchar,
  	"description" varchar
  );

  CREATE TABLE "pages_blocks_industry_solutions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar DEFAULT 'Industries',
  	"heading" varchar DEFAULT 'Built for Every Industry',
  	"description" varchar,
  	"grid_position_col_start" numeric DEFAULT 1,
  	"grid_position_col_span" numeric DEFAULT 12,
  	"grid_position_row_start" numeric DEFAULT 1,
  	"grid_position_row_span" numeric DEFAULT 1,
  	"block_name" varchar
  );

  CREATE TABLE "_pages_v_blocks_industry_solutions_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"headline" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );

  CREATE TABLE "_pages_v_blocks_industry_solutions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar DEFAULT 'Industries',
  	"heading" varchar DEFAULT 'Built for Every Industry',
  	"description" varchar,
  	"grid_position_col_start" numeric DEFAULT 1,
  	"grid_position_col_span" numeric DEFAULT 12,
  	"grid_position_row_start" numeric DEFAULT 1,
  	"grid_position_row_span" numeric DEFAULT 1,
  	"_uuid" varchar,
  	"block_name" varchar
  );

  ALTER TABLE "pages_blocks_industry_solutions_items" ADD CONSTRAINT "pages_blocks_industry_solutions_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_industry_solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_industry_solutions" ADD CONSTRAINT "pages_blocks_industry_solutions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_industry_solutions_items" ADD CONSTRAINT "_pages_v_blocks_industry_solutions_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_industry_solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_industry_solutions" ADD CONSTRAINT "_pages_v_blocks_industry_solutions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;

  CREATE INDEX "pages_blocks_industry_solutions_items_order_idx" ON "pages_blocks_industry_solutions_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_industry_solutions_items_parent_id_idx" ON "pages_blocks_industry_solutions_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_industry_solutions_order_idx" ON "pages_blocks_industry_solutions" USING btree ("_order");
  CREATE INDEX "pages_blocks_industry_solutions_parent_id_idx" ON "pages_blocks_industry_solutions" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_industry_solutions_path_idx" ON "pages_blocks_industry_solutions" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_industry_solutions_items_order_idx" ON "_pages_v_blocks_industry_solutions_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_industry_solutions_items_parent_id_idx" ON "_pages_v_blocks_industry_solutions_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_industry_solutions_order_idx" ON "_pages_v_blocks_industry_solutions" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_industry_solutions_parent_id_idx" ON "_pages_v_blocks_industry_solutions" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_industry_solutions_path_idx" ON "_pages_v_blocks_industry_solutions" USING btree ("_path");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DROP TABLE "pages_blocks_industry_solutions_items" CASCADE;
  DROP TABLE "pages_blocks_industry_solutions" CASCADE;
  DROP TABLE "_pages_v_blocks_industry_solutions_items" CASCADE;
  DROP TABLE "_pages_v_blocks_industry_solutions" CASCADE;`)
}

import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Adds the two new nested-array tables for Header navItems' `dropdownGroups`
 * (see Header/config.ts) — each nav item can now optionally carry up to 4
 * groups of links (each group with an optional heading), rendered as a
 * hover/tap dropdown panel matching fastflowpe.com's Products/Industry nav
 * items.
 *
 * Hand-written for the same reason as every other migration in this file:
 * `payload migrate:create` is interactive on this database (pre-existing
 * footer/header link-enum naming drift) and asks "new enum or rename?"
 * before it will generate anything.
 *
 * Shape copied from the existing `header_nav_items` → its own link fields
 * pattern, just one level deeper: `header_nav_items_dropdown_groups` is a
 * child of `header_nav_items` (whose own id is varchar, hence the varchar
 * `_parent_id` here — matches `footer_columns_nav_items` referencing the
 * varchar `footer_columns.id`), and `header_nav_items_dropdown_groups_links`
 * is a child of that.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE TYPE "public"."enum_header_nav_items_dropdown_groups_links_link_type" AS ENUM('reference', 'custom');

  CREATE TABLE "header_nav_items_dropdown_groups" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar
  );

  CREATE TABLE "header_nav_items_dropdown_groups_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_header_nav_items_dropdown_groups_links_link_type",
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar NOT NULL
  );

  ALTER TABLE "header_nav_items_dropdown_groups" ADD CONSTRAINT "header_nav_items_dropdown_groups_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header_nav_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_nav_items_dropdown_groups_links" ADD CONSTRAINT "header_nav_items_dropdown_groups_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header_nav_items_dropdown_groups"("id") ON DELETE cascade ON UPDATE no action;

  CREATE INDEX "header_nav_items_dropdown_groups_order_idx" ON "header_nav_items_dropdown_groups" USING btree ("_order");
  CREATE INDEX "header_nav_items_dropdown_groups_parent_id_idx" ON "header_nav_items_dropdown_groups" USING btree ("_parent_id");
  CREATE INDEX "header_nav_items_dropdown_groups_links_order_idx" ON "header_nav_items_dropdown_groups_links" USING btree ("_order");
  CREATE INDEX "header_nav_items_dropdown_groups_links_parent_id_idx" ON "header_nav_items_dropdown_groups_links" USING btree ("_parent_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DROP TABLE IF EXISTS "header_nav_items_dropdown_groups_links" CASCADE;
  DROP TABLE IF EXISTS "header_nav_items_dropdown_groups" CASCADE;
  DROP TYPE IF EXISTS "public"."enum_header_nav_items_dropdown_groups_links_link_type";`)
}

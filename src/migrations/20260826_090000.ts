import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Adds the DB columns/table for the Header loginLink/signupLink fields and
 * the Footer companyName/companyAddress/cin/socialLinks fields (see
 * Header/config.ts and Footer/config.ts).
 *
 * Hand-written rather than produced by `payload migrate:create`, for the
 * same reason documented in 20260824_090000.ts and 20260819_075000.ts: the
 * generator is interactive on this database (pre-existing footer/header
 * link-enum drift makes it ask "new enum or rename?" before it will
 * generate anything), and there's no safe way to answer that non-interactively
 * without risking a wrong "rename" being applied to live data.
 *
 * All new columns are nullable, including the `_label` ones — `link()`
 * marks its `label` subfield required at the *field validation* layer for
 * when a value is actually saved (enforced by Payload/Admin, independent of
 * this migration), but `header` and `footer` are singleton globals with one
 * existing row each; a NOT NULL column added to a table that already has a
 * row would need a default or immediately violate the constraint. Nullable
 * is also consistent with how this project treats new content as
 * admin-entered later, not backfilled by a migration.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE TYPE "public"."enum_header_login_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_header_login_link_appearance" AS ENUM('outline');
  CREATE TYPE "public"."enum_header_signup_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_header_signup_link_appearance" AS ENUM('default');
  CREATE TYPE "public"."enum_footer_social_links_platform" AS ENUM('linkedin', 'instagram', 'x', 'facebook', 'youtube');

  ALTER TABLE "header" ADD COLUMN "login_link_type" "enum_header_login_link_type";
  ALTER TABLE "header" ADD COLUMN "login_link_new_tab" boolean;
  ALTER TABLE "header" ADD COLUMN "login_link_url" varchar;
  ALTER TABLE "header" ADD COLUMN "login_link_label" varchar;
  ALTER TABLE "header" ADD COLUMN "login_link_appearance" "enum_header_login_link_appearance";
  ALTER TABLE "header" ADD COLUMN "signup_link_type" "enum_header_signup_link_type";
  ALTER TABLE "header" ADD COLUMN "signup_link_new_tab" boolean;
  ALTER TABLE "header" ADD COLUMN "signup_link_url" varchar;
  ALTER TABLE "header" ADD COLUMN "signup_link_label" varchar;
  ALTER TABLE "header" ADD COLUMN "signup_link_appearance" "enum_header_signup_link_appearance";

  ALTER TABLE "footer" ADD COLUMN "company_name" varchar;
  ALTER TABLE "footer" ADD COLUMN "company_address" varchar;
  ALTER TABLE "footer" ADD COLUMN "cin" varchar;

  CREATE TABLE "footer_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_footer_social_links_platform" NOT NULL,
  	"url" varchar NOT NULL
  );

  ALTER TABLE "footer_social_links" ADD CONSTRAINT "footer_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;

  CREATE INDEX "footer_social_links_order_idx" ON "footer_social_links" USING btree ("_order");
  CREATE INDEX "footer_social_links_parent_id_idx" ON "footer_social_links" USING btree ("_parent_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DROP INDEX IF EXISTS "footer_social_links_order_idx";
  DROP INDEX IF EXISTS "footer_social_links_parent_id_idx";
  DROP TABLE IF EXISTS "footer_social_links" CASCADE;

  ALTER TABLE "footer" DROP COLUMN IF EXISTS "company_name";
  ALTER TABLE "footer" DROP COLUMN IF EXISTS "company_address";
  ALTER TABLE "footer" DROP COLUMN IF EXISTS "cin";

  ALTER TABLE "header" DROP COLUMN IF EXISTS "login_link_type";
  ALTER TABLE "header" DROP COLUMN IF EXISTS "login_link_new_tab";
  ALTER TABLE "header" DROP COLUMN IF EXISTS "login_link_url";
  ALTER TABLE "header" DROP COLUMN IF EXISTS "login_link_label";
  ALTER TABLE "header" DROP COLUMN IF EXISTS "login_link_appearance";
  ALTER TABLE "header" DROP COLUMN IF EXISTS "signup_link_type";
  ALTER TABLE "header" DROP COLUMN IF EXISTS "signup_link_new_tab";
  ALTER TABLE "header" DROP COLUMN IF EXISTS "signup_link_url";
  ALTER TABLE "header" DROP COLUMN IF EXISTS "signup_link_label";
  ALTER TABLE "header" DROP COLUMN IF EXISTS "signup_link_appearance";

  DROP TYPE IF EXISTS "public"."enum_header_login_link_type";
  DROP TYPE IF EXISTS "public"."enum_header_login_link_appearance";
  DROP TYPE IF EXISTS "public"."enum_header_signup_link_type";
  DROP TYPE IF EXISTS "public"."enum_header_signup_link_appearance";
  DROP TYPE IF EXISTS "public"."enum_footer_social_links_platform";`)
}

import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Adds the `showChevron` checkbox on each Header navItem (see
 * Header/config.ts) — a visual-only dropdown-chevron indicator, no menu
 * behind it yet.
 *
 * Hand-written for the same reason as 20260826_090000.ts and every other
 * migration in this file: `payload migrate:create` is interactive on this
 * database (pre-existing footer/header link-enum naming drift) and asks
 * "new enum or rename?" before it will generate anything.
 *
 * Nullable boolean, matching the checkbox's own optionality — existing
 * navItems rows simply have no value (falsy) until an admin opts a row in.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "header_nav_items" ADD COLUMN "show_chevron" boolean;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "header_nav_items" DROP COLUMN IF EXISTS "show_chevron";`)
}

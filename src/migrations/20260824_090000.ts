import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Adds the optional `image` upload to each Process Steps step, for the
 * full-bleed stacking panels.
 *
 * Hand-written rather than produced by `payload migrate:create` on purpose.
 * The generator is interactive and, on this database, immediately asks whether
 * `enum_footer_columns_nav_items_link_type` is a new enum or a rename of
 * `enum_footer_nav_items_link_type` — pre-existing drift unrelated to this
 * change. Answering "rename" wrongly rewrites live footer data, so this
 * migration touches nothing but the two columns it needs and leaves that
 * question for a deliberate, separate decision.
 *
 * Strictly additive: two nullable FK columns plus their indexes. `ON DELETE
 * set null` matches every other media reference in this schema (see
 * pages_blocks_media_block_media_id_media_id_fk), so deleting an image leaves
 * the step intact and the panel falls back to its placeholder.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "pages_blocks_process_steps_steps" ADD COLUMN "image_id" integer;
  ALTER TABLE "_pages_v_blocks_process_steps_steps" ADD COLUMN "image_id" integer;

  ALTER TABLE "pages_blocks_process_steps_steps" ADD CONSTRAINT "pages_blocks_process_steps_steps_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_process_steps_steps" ADD CONSTRAINT "_pages_v_blocks_process_steps_steps_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;

  CREATE INDEX "pages_blocks_process_steps_steps_image_idx" ON "pages_blocks_process_steps_steps" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_process_steps_steps_image_idx" ON "_pages_v_blocks_process_steps_steps" USING btree ("image_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DROP INDEX IF EXISTS "pages_blocks_process_steps_steps_image_idx";
  DROP INDEX IF EXISTS "_pages_v_blocks_process_steps_steps_image_idx";

  ALTER TABLE "pages_blocks_process_steps_steps" DROP CONSTRAINT IF EXISTS "pages_blocks_process_steps_steps_image_id_media_id_fk";
  ALTER TABLE "_pages_v_blocks_process_steps_steps" DROP CONSTRAINT IF EXISTS "_pages_v_blocks_process_steps_steps_image_id_media_id_fk";

  ALTER TABLE "pages_blocks_process_steps_steps" DROP COLUMN IF EXISTS "image_id";
  ALTER TABLE "_pages_v_blocks_process_steps_steps" DROP COLUMN IF EXISTS "image_id";`)
}

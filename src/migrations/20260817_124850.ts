import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_cta" ADD COLUMN "grid_position_col_start" numeric DEFAULT 1;
  ALTER TABLE "pages_blocks_cta" ADD COLUMN "grid_position_col_span" numeric DEFAULT 12;
  ALTER TABLE "pages_blocks_cta" ADD COLUMN "grid_position_row_start" numeric DEFAULT 1;
  ALTER TABLE "pages_blocks_cta" ADD COLUMN "grid_position_row_span" numeric DEFAULT 1;
  ALTER TABLE "pages_blocks_content" ADD COLUMN "grid_position_col_start" numeric DEFAULT 1;
  ALTER TABLE "pages_blocks_content" ADD COLUMN "grid_position_col_span" numeric DEFAULT 12;
  ALTER TABLE "pages_blocks_content" ADD COLUMN "grid_position_row_start" numeric DEFAULT 1;
  ALTER TABLE "pages_blocks_content" ADD COLUMN "grid_position_row_span" numeric DEFAULT 1;
  ALTER TABLE "pages_blocks_media_block" ADD COLUMN "grid_position_col_start" numeric DEFAULT 1;
  ALTER TABLE "pages_blocks_media_block" ADD COLUMN "grid_position_col_span" numeric DEFAULT 12;
  ALTER TABLE "pages_blocks_media_block" ADD COLUMN "grid_position_row_start" numeric DEFAULT 1;
  ALTER TABLE "pages_blocks_media_block" ADD COLUMN "grid_position_row_span" numeric DEFAULT 1;
  ALTER TABLE "pages_blocks_archive" ADD COLUMN "grid_position_col_start" numeric DEFAULT 1;
  ALTER TABLE "pages_blocks_archive" ADD COLUMN "grid_position_col_span" numeric DEFAULT 12;
  ALTER TABLE "pages_blocks_archive" ADD COLUMN "grid_position_row_start" numeric DEFAULT 1;
  ALTER TABLE "pages_blocks_archive" ADD COLUMN "grid_position_row_span" numeric DEFAULT 1;
  ALTER TABLE "pages_blocks_form_block" ADD COLUMN "grid_position_col_start" numeric DEFAULT 1;
  ALTER TABLE "pages_blocks_form_block" ADD COLUMN "grid_position_col_span" numeric DEFAULT 12;
  ALTER TABLE "pages_blocks_form_block" ADD COLUMN "grid_position_row_start" numeric DEFAULT 1;
  ALTER TABLE "pages_blocks_form_block" ADD COLUMN "grid_position_row_span" numeric DEFAULT 1;
  ALTER TABLE "_pages_v_blocks_cta" ADD COLUMN "grid_position_col_start" numeric DEFAULT 1;
  ALTER TABLE "_pages_v_blocks_cta" ADD COLUMN "grid_position_col_span" numeric DEFAULT 12;
  ALTER TABLE "_pages_v_blocks_cta" ADD COLUMN "grid_position_row_start" numeric DEFAULT 1;
  ALTER TABLE "_pages_v_blocks_cta" ADD COLUMN "grid_position_row_span" numeric DEFAULT 1;
  ALTER TABLE "_pages_v_blocks_content" ADD COLUMN "grid_position_col_start" numeric DEFAULT 1;
  ALTER TABLE "_pages_v_blocks_content" ADD COLUMN "grid_position_col_span" numeric DEFAULT 12;
  ALTER TABLE "_pages_v_blocks_content" ADD COLUMN "grid_position_row_start" numeric DEFAULT 1;
  ALTER TABLE "_pages_v_blocks_content" ADD COLUMN "grid_position_row_span" numeric DEFAULT 1;
  ALTER TABLE "_pages_v_blocks_media_block" ADD COLUMN "grid_position_col_start" numeric DEFAULT 1;
  ALTER TABLE "_pages_v_blocks_media_block" ADD COLUMN "grid_position_col_span" numeric DEFAULT 12;
  ALTER TABLE "_pages_v_blocks_media_block" ADD COLUMN "grid_position_row_start" numeric DEFAULT 1;
  ALTER TABLE "_pages_v_blocks_media_block" ADD COLUMN "grid_position_row_span" numeric DEFAULT 1;
  ALTER TABLE "_pages_v_blocks_archive" ADD COLUMN "grid_position_col_start" numeric DEFAULT 1;
  ALTER TABLE "_pages_v_blocks_archive" ADD COLUMN "grid_position_col_span" numeric DEFAULT 12;
  ALTER TABLE "_pages_v_blocks_archive" ADD COLUMN "grid_position_row_start" numeric DEFAULT 1;
  ALTER TABLE "_pages_v_blocks_archive" ADD COLUMN "grid_position_row_span" numeric DEFAULT 1;
  ALTER TABLE "_pages_v_blocks_form_block" ADD COLUMN "grid_position_col_start" numeric DEFAULT 1;
  ALTER TABLE "_pages_v_blocks_form_block" ADD COLUMN "grid_position_col_span" numeric DEFAULT 12;
  ALTER TABLE "_pages_v_blocks_form_block" ADD COLUMN "grid_position_row_start" numeric DEFAULT 1;
  ALTER TABLE "_pages_v_blocks_form_block" ADD COLUMN "grid_position_row_span" numeric DEFAULT 1;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_cta" DROP COLUMN "grid_position_col_start";
  ALTER TABLE "pages_blocks_cta" DROP COLUMN "grid_position_col_span";
  ALTER TABLE "pages_blocks_cta" DROP COLUMN "grid_position_row_start";
  ALTER TABLE "pages_blocks_cta" DROP COLUMN "grid_position_row_span";
  ALTER TABLE "pages_blocks_content" DROP COLUMN "grid_position_col_start";
  ALTER TABLE "pages_blocks_content" DROP COLUMN "grid_position_col_span";
  ALTER TABLE "pages_blocks_content" DROP COLUMN "grid_position_row_start";
  ALTER TABLE "pages_blocks_content" DROP COLUMN "grid_position_row_span";
  ALTER TABLE "pages_blocks_media_block" DROP COLUMN "grid_position_col_start";
  ALTER TABLE "pages_blocks_media_block" DROP COLUMN "grid_position_col_span";
  ALTER TABLE "pages_blocks_media_block" DROP COLUMN "grid_position_row_start";
  ALTER TABLE "pages_blocks_media_block" DROP COLUMN "grid_position_row_span";
  ALTER TABLE "pages_blocks_archive" DROP COLUMN "grid_position_col_start";
  ALTER TABLE "pages_blocks_archive" DROP COLUMN "grid_position_col_span";
  ALTER TABLE "pages_blocks_archive" DROP COLUMN "grid_position_row_start";
  ALTER TABLE "pages_blocks_archive" DROP COLUMN "grid_position_row_span";
  ALTER TABLE "pages_blocks_form_block" DROP COLUMN "grid_position_col_start";
  ALTER TABLE "pages_blocks_form_block" DROP COLUMN "grid_position_col_span";
  ALTER TABLE "pages_blocks_form_block" DROP COLUMN "grid_position_row_start";
  ALTER TABLE "pages_blocks_form_block" DROP COLUMN "grid_position_row_span";
  ALTER TABLE "_pages_v_blocks_cta" DROP COLUMN "grid_position_col_start";
  ALTER TABLE "_pages_v_blocks_cta" DROP COLUMN "grid_position_col_span";
  ALTER TABLE "_pages_v_blocks_cta" DROP COLUMN "grid_position_row_start";
  ALTER TABLE "_pages_v_blocks_cta" DROP COLUMN "grid_position_row_span";
  ALTER TABLE "_pages_v_blocks_content" DROP COLUMN "grid_position_col_start";
  ALTER TABLE "_pages_v_blocks_content" DROP COLUMN "grid_position_col_span";
  ALTER TABLE "_pages_v_blocks_content" DROP COLUMN "grid_position_row_start";
  ALTER TABLE "_pages_v_blocks_content" DROP COLUMN "grid_position_row_span";
  ALTER TABLE "_pages_v_blocks_media_block" DROP COLUMN "grid_position_col_start";
  ALTER TABLE "_pages_v_blocks_media_block" DROP COLUMN "grid_position_col_span";
  ALTER TABLE "_pages_v_blocks_media_block" DROP COLUMN "grid_position_row_start";
  ALTER TABLE "_pages_v_blocks_media_block" DROP COLUMN "grid_position_row_span";
  ALTER TABLE "_pages_v_blocks_archive" DROP COLUMN "grid_position_col_start";
  ALTER TABLE "_pages_v_blocks_archive" DROP COLUMN "grid_position_col_span";
  ALTER TABLE "_pages_v_blocks_archive" DROP COLUMN "grid_position_row_start";
  ALTER TABLE "_pages_v_blocks_archive" DROP COLUMN "grid_position_row_span";
  ALTER TABLE "_pages_v_blocks_form_block" DROP COLUMN "grid_position_col_start";
  ALTER TABLE "_pages_v_blocks_form_block" DROP COLUMN "grid_position_col_span";
  ALTER TABLE "_pages_v_blocks_form_block" DROP COLUMN "grid_position_row_start";
  ALTER TABLE "_pages_v_blocks_form_block" DROP COLUMN "grid_position_row_span";`)
}

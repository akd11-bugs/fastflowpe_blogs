import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_feature_slides_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar
  );

  CREATE TABLE "pages_blocks_feature_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'What FastFlowPe Does',
  	"description" varchar,
  	"grid_position_col_start" numeric DEFAULT 1,
  	"grid_position_col_span" numeric DEFAULT 12,
  	"grid_position_row_start" numeric DEFAULT 1,
  	"grid_position_row_span" numeric DEFAULT 1,
  	"block_name" varchar
  );

  CREATE TABLE "_pages_v_blocks_feature_slides_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );

  CREATE TABLE "_pages_v_blocks_feature_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'What FastFlowPe Does',
  	"description" varchar,
  	"grid_position_col_start" numeric DEFAULT 1,
  	"grid_position_col_span" numeric DEFAULT 12,
  	"grid_position_row_start" numeric DEFAULT 1,
  	"grid_position_row_span" numeric DEFAULT 1,
  	"_uuid" varchar,
  	"block_name" varchar
  );

  ALTER TABLE "pages_blocks_feature_slides_items" ADD CONSTRAINT "pages_blocks_feature_slides_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_feature_slides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_slides" ADD CONSTRAINT "pages_blocks_feature_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_slides_items" ADD CONSTRAINT "_pages_v_blocks_feature_slides_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_feature_slides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_slides" ADD CONSTRAINT "_pages_v_blocks_feature_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_feature_slides_items_order_idx" ON "pages_blocks_feature_slides_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_feature_slides_items_parent_id_idx" ON "pages_blocks_feature_slides_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_feature_slides_order_idx" ON "pages_blocks_feature_slides" USING btree ("_order");
  CREATE INDEX "pages_blocks_feature_slides_parent_id_idx" ON "pages_blocks_feature_slides" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_feature_slides_path_idx" ON "pages_blocks_feature_slides" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_feature_slides_items_order_idx" ON "_pages_v_blocks_feature_slides_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_feature_slides_items_parent_id_idx" ON "_pages_v_blocks_feature_slides_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_feature_slides_order_idx" ON "_pages_v_blocks_feature_slides" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_feature_slides_parent_id_idx" ON "_pages_v_blocks_feature_slides" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_feature_slides_path_idx" ON "_pages_v_blocks_feature_slides" USING btree ("_path");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_feature_slides_items" CASCADE;
  DROP TABLE "pages_blocks_feature_slides" CASCADE;
  DROP TABLE "_pages_v_blocks_feature_slides_items" CASCADE;
  DROP TABLE "_pages_v_blocks_feature_slides" CASCADE;`)
}

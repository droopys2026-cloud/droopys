CREATE TABLE "product_colors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"hex" text NOT NULL,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
DROP INDEX "product_variants_product_size_key";--> statement-breakpoint
ALTER TABLE "product_images" ADD COLUMN "color_id" uuid;--> statement-breakpoint
ALTER TABLE "product_variants" ADD COLUMN "color_id" uuid;--> statement-breakpoint
ALTER TABLE "product_variants" ADD COLUMN "price_cents" integer;--> statement-breakpoint
ALTER TABLE "order_lines" ADD COLUMN "color" text;--> statement-breakpoint
ALTER TABLE "product_colors" ADD CONSTRAINT "product_colors_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "product_colors_product_slug_key" ON "product_colors" USING btree ("product_id","slug");--> statement-breakpoint
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_color_id_product_colors_id_fk" FOREIGN KEY ("color_id") REFERENCES "public"."product_colors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_color_id_product_colors_id_fk" FOREIGN KEY ("color_id") REFERENCES "public"."product_colors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_product_color_size_key" UNIQUE NULLS NOT DISTINCT("product_id","color_id","size");--> statement-breakpoint
-- Fermée dès sa création : Supabase expose le schéma public en API REST (voir scripts/secure.mts).
ALTER TABLE "product_colors" ENABLE ROW LEVEL SECURITY;

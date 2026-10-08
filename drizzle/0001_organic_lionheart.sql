CREATE TABLE "subcategories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_id" uuid NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"intro" text,
	"image_url" text,
	"image_class_name" text,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "subcategories" ADD CONSTRAINT "subcategories_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "subcategories_category_slug_key" ON "subcategories" USING btree ("category_id","slug");--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "subcategory";
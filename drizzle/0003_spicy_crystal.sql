CREATE TABLE "product_placements" (
	"product_id" uuid NOT NULL,
	"subcategory_id" uuid NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "product_placements_product_id_subcategory_id_pk" PRIMARY KEY("product_id","subcategory_id")
);
--> statement-breakpoint
ALTER TABLE "product_placements" ADD CONSTRAINT "product_placements_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_placements" ADD CONSTRAINT "product_placements_subcategory_id_subcategories_id_fk" FOREIGN KEY ("subcategory_id") REFERENCES "public"."subcategories"("id") ON DELETE cascade ON UPDATE no action;
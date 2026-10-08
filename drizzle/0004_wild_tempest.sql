CREATE TABLE "nav_columns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"section_id" uuid NOT NULL,
	"title" text NOT NULL,
	"all_label" text,
	"all_href" text,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "nav_features" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"section_id" uuid NOT NULL,
	"subcategory_id" uuid,
	"brand_id" uuid,
	"position" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "nav_features_one_target" CHECK (("nav_features"."subcategory_id" is not null)::int + ("nav_features"."brand_id" is not null)::int = 1)
);
--> statement-breakpoint
CREATE TABLE "nav_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"column_id" uuid NOT NULL,
	"label" text NOT NULL,
	"href" text NOT NULL,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "nav_sections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"label" text NOT NULL,
	"href" text NOT NULL,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "nav_columns" ADD CONSTRAINT "nav_columns_section_id_nav_sections_id_fk" FOREIGN KEY ("section_id") REFERENCES "public"."nav_sections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nav_features" ADD CONSTRAINT "nav_features_section_id_nav_sections_id_fk" FOREIGN KEY ("section_id") REFERENCES "public"."nav_sections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nav_features" ADD CONSTRAINT "nav_features_subcategory_id_subcategories_id_fk" FOREIGN KEY ("subcategory_id") REFERENCES "public"."subcategories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nav_features" ADD CONSTRAINT "nav_features_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nav_links" ADD CONSTRAINT "nav_links_column_id_nav_columns_id_fk" FOREIGN KEY ("column_id") REFERENCES "public"."nav_columns"("id") ON DELETE cascade ON UPDATE no action;
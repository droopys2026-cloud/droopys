CREATE TABLE "generated_photos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"url" text NOT NULL,
	"shot" text NOT NULL,
	"brand" text DEFAULT '' NOT NULL,
	"product_name" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);

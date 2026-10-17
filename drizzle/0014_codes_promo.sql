CREATE TYPE "public"."promo_kind" AS ENUM('percent', 'amount');--> statement-breakpoint
CREATE TYPE "public"."promo_scope" AS ENUM('site', 'products');--> statement-breakpoint
CREATE TABLE "promo_code_products" (
	"promo_code_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	CONSTRAINT "promo_code_products_promo_code_id_product_id_pk" PRIMARY KEY("promo_code_id","product_id")
);
--> statement-breakpoint
CREATE TABLE "promo_codes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" text NOT NULL,
	"kind" "promo_kind" NOT NULL,
	"value" integer NOT NULL,
	"scope" "promo_scope" NOT NULL,
	"ends_at" timestamp with time zone,
	"max_uses" integer,
	"min_subtotal_cents" integer,
	"once_per_customer" boolean DEFAULT false NOT NULL,
	"uses" integer DEFAULT 0 NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"announce" boolean DEFAULT false NOT NULL,
	"announcement" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "promo_code" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "discount_cents" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "promo_code_products" ADD CONSTRAINT "promo_code_products_promo_code_id_promo_codes_id_fk" FOREIGN KEY ("promo_code_id") REFERENCES "public"."promo_codes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "promo_code_products" ADD CONSTRAINT "promo_code_products_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "promo_codes_code_key" ON "promo_codes" USING btree ("code");--> statement-breakpoint
-- Fermées dès leur création : Supabase expose le schéma public en API REST (voir scripts/secure.mts).
ALTER TABLE "promo_codes" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "promo_code_products" ENABLE ROW LEVEL SECURITY;

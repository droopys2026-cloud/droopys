CREATE TYPE "public"."delivery_method" AS ENUM('domicile', 'retrait');--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "customer_phone" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "delivery_method" "delivery_method" DEFAULT 'domicile' NOT NULL;
ALTER TYPE "public"."delivery_method" ADD VALUE 'relais';--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shipping_service" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shipping_method_id" integer;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "service_point_id" integer;
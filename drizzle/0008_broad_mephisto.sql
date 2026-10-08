ALTER TABLE "orders" ADD COLUMN "tracking_url" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "sendcloud_parcel_id" integer;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "label_created_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "label_is_test" boolean;
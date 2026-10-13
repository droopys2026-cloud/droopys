CREATE TABLE "contact_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"subject" text NOT NULL,
	"order_reference" text,
	"message" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"handled_at" timestamp with time zone
);

--> statement-breakpoint
-- Fermée dès sa création : Supabase expose le schéma public en API REST (voir scripts/secure.mts).
ALTER TABLE "contact_messages" ENABLE ROW LEVEL SECURITY;
CREATE TABLE "desktop_pairings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"secret_hash" text NOT NULL,
	"request_key" text NOT NULL,
	"confirmation_code" text NOT NULL,
	"user_id" uuid,
	"created_at" timestamp NOT NULL,
	"expires_at" timestamp NOT NULL,
	"next_poll_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "desktop_pairings" ADD CONSTRAINT "desktop_pairings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "desktop_pairings_request_key_idx" ON "desktop_pairings" USING btree ("request_key");
CREATE TABLE "blocked_sites" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"domain" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "uq_blocked_sites_user_domain" UNIQUE("user_id","domain")
);
--> statement-breakpoint
ALTER TABLE "blocked_sites" ADD CONSTRAINT "blocked_sites_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_blocked_sites_user_id" ON "blocked_sites" USING btree ("user_id");
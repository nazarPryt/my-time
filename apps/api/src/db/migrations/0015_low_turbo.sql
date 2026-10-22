CREATE TABLE "desktop_presence" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "desktop_presence" ADD CONSTRAINT "desktop_presence_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "desktop_presence_user_expiry_idx" ON "desktop_presence" USING btree ("user_id","expires_at");--> statement-breakpoint
CREATE INDEX "desktop_presence_expiry_idx" ON "desktop_presence" USING btree ("expires_at");
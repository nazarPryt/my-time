CREATE TYPE "public"."session_type" AS ENUM('work', 'break');--> statement-breakpoint
CREATE TABLE "time_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" "session_type" DEFAULT 'work' NOT NULL,
	"started_at" timestamp with time zone NOT NULL,
	"ended_at" timestamp with time zone,
	"abandoned_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "time_sessions" ADD CONSTRAINT "time_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_time_sessions_user_id" ON "time_sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_time_sessions_user_started" ON "time_sessions" USING btree ("user_id","started_at");
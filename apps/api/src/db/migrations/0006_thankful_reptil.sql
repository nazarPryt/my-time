ALTER TABLE "time_sessions" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "time_sessions" ALTER COLUMN "type" SET DEFAULT 'work'::text;--> statement-breakpoint
UPDATE "time_sessions" SET "type" = 'work' WHERE "type" = 'break';--> statement-breakpoint
DROP TYPE "public"."session_type";--> statement-breakpoint
CREATE TYPE "public"."session_type" AS ENUM('work');--> statement-breakpoint
ALTER TABLE "time_sessions" ALTER COLUMN "type" SET DEFAULT 'work'::"public"."session_type";--> statement-breakpoint
ALTER TABLE "time_sessions" ALTER COLUMN "type" SET DATA TYPE "public"."session_type" USING "type"::"public"."session_type";
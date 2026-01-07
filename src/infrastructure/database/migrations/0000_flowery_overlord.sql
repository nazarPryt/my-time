CREATE TYPE "public"."session_status" AS ENUM('completed', 'abandoned', 'interrupted');--> statement-breakpoint
CREATE TYPE "public"."session_type" AS ENUM('work', 'short_break', 'long_break');--> statement-breakpoint
CREATE TABLE "daily_aggregates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"date" date NOT NULL,
	"total_work_time" integer NOT NULL,
	"total_break_time" integer NOT NULL,
	"completed_pomodoros" integer NOT NULL,
	"abandoned_pomodoros" integer NOT NULL,
	"total_sessions" integer NOT NULL,
	"focus_score" numeric(5, 2) NOT NULL,
	"longest_streak" integer NOT NULL,
	"peak_hour" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"session_type" "session_type" NOT NULL,
	"status" "session_status" NOT NULL,
	"planned_duration" integer NOT NULL,
	"actual_duration" integer NOT NULL,
	"started_at" timestamp with time zone NOT NULL,
	"completed_at" timestamp with time zone,
	"paused_duration" integer DEFAULT 0 NOT NULL,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"notes" text,
	"pomodoro_count" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_settings" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"work_duration" integer DEFAULT 1500 NOT NULL,
	"short_break_duration" integer DEFAULT 300 NOT NULL,
	"long_break_duration" integer DEFAULT 900 NOT NULL,
	"long_break_interval" integer DEFAULT 4 NOT NULL,
	"auto_start_breaks" boolean DEFAULT false NOT NULL,
	"auto_start_pomodoros" boolean DEFAULT false NOT NULL,
	"notification_enabled" boolean DEFAULT true NOT NULL,
	"notification_sound" text DEFAULT 'default' NOT NULL,
	"daily_goal_pomodoros" integer DEFAULT 8 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

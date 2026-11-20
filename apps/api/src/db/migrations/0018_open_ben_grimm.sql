CREATE TABLE "english_quiz_sentences" (
	"id" text PRIMARY KEY NOT NULL,
	"topic_id" text NOT NULL,
	"form" text NOT NULL,
	"prompt" text NOT NULL,
	"answer" text NOT NULL,
	"accept" jsonb,
	"traps" jsonb,
	"position" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "english_quiz_topics" (
	"id" text PRIMARY KEY NOT NULL,
	"level" text NOT NULL,
	"title" text NOT NULL,
	"subtitle" text NOT NULL,
	"rule" jsonb NOT NULL,
	"position" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "english_quiz_sentences" ADD CONSTRAINT "english_quiz_sentences_topic_id_english_quiz_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."english_quiz_topics"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_english_quiz_sentences_topic_id" ON "english_quiz_sentences" USING btree ("topic_id");
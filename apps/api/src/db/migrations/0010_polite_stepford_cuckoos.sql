ALTER TABLE "permesso_subscriptions" ADD COLUMN "telegram_chat_id" text;--> statement-breakpoint
ALTER TABLE "permesso_subscriptions" ADD COLUMN "telegram_link_token" text;--> statement-breakpoint
ALTER TABLE "permesso_subscriptions" ADD CONSTRAINT "permesso_subscriptions_telegram_link_token_unique" UNIQUE("telegram_link_token");
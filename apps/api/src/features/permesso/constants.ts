export const TELEGRAM_LINK_TIMEOUT_MS = 60_000
export const TELEGRAM_LINK_HEARTBEAT_MS = 15_000
export const CHECK_CONCURRENCY = 2
export const CHECK_CRON_SCHEDULE = '0 * * * *'
export const DEFAULT_HISTORY_LIMIT = 20

export const PERMESSO_FAILURE_REASONS = {
	noPracticeNumber: 'no_practice_number',
	botNotConfigured: 'bot_not_configured',
} as const

export const PERMESSO_ERROR_MESSAGES = {
	practiceNumberRequiredForCheck: 'Set a practice number before checking',
	practiceNumberRequiredForTelegram:
		'Set a practice number before connecting Telegram',
	telegramNotConfigured:
		'Telegram notifications are not configured on this server',
} as const

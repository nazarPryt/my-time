import { API_CONFIG } from '@shared/api-config'
import { logger } from '@shared/logger'
import { API_PREFIX, PERMESSO_ROUTES } from 'contracts'
import { type Bot, webhookCallback } from 'node-telegram-bot-api'

export type TelegramWebhookHandler = (request: Request) => Promise<Response>

/** Null disables the bot; undefined means local polling has started. */
export async function configureTelegramTransport(
	bot: Bot,
): Promise<TelegramWebhookHandler | null | undefined> {
	let webhookHandler: TelegramWebhookHandler | undefined
	if (API_CONFIG.NODE_ENV === 'production') {
		if (!API_CONFIG.TELEGRAM_WEBHOOK_SECRET) {
			logger.error(
				'TELEGRAM_WEBHOOK_SECRET must be set when NODE_ENV=production — Telegram notifications disabled',
			)
			return null
		}

		const webhookPath = `${API_PREFIX}${PERMESSO_ROUTES.prefix}${PERMESSO_ROUTES.telegramWebhook}`
		const webhookUrl = new URL(webhookPath, API_CONFIG.API_URL).toString()

		try {
			webhookHandler = webhookCallback(bot, {
				secretToken: API_CONFIG.TELEGRAM_WEBHOOK_SECRET,
			})
			await bot.api.setWebhook({
				url: webhookUrl,
				secret_token: API_CONFIG.TELEGRAM_WEBHOOK_SECRET,
			})

			const info = await bot.api.getWebhookInfo()
			if (info.url !== webhookUrl) {
				logger.error(
					{ reportedUrl: info.url, expectedUrl: webhookUrl },
					'Telegram reports an unexpected webhook URL — Telegram notifications disabled',
				)
				return null
			}

			logger.info({ webhookUrl }, 'Telegram bot registered webhook')
		} catch (error) {
			// A transient Telegram outage here shouldn't take the whole API down
			// with it — log and run without Telegram notifications instead.
			logger.error({ err: error }, 'failed to register Telegram webhook')
			return null
		}
	} else {
		logger.warn(
			'NODE_ENV is not "production" — falling back to long polling for local dev/test',
		)
		bot.startPolling().catch((error) => {
			logger.error({ err: error }, 'Telegram bot polling stopped unexpectedly')
		})
		logger.info(
			{ nodeEnv: API_CONFIG.NODE_ENV },
			'Telegram bot is polling for updates',
		)
	}
	return webhookHandler
}

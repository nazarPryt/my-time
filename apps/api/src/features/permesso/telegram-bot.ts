import { API_CONFIG } from '@shared/api-config'
import { API_PREFIX, PERMESSO_ROUTES } from 'contracts'
import { Bot, TelegramApiError, webhookCallback } from 'node-telegram-bot-api'
import type { PermessoCheckResult } from './checker'
import { permessoRepository } from './repository'
import { notifyTelegramLinked } from './telegram-link-events'

let bot: Bot | undefined
let botUsername: string | undefined
let webhookHandler: ((request: Request) => Promise<Response>) | undefined

function formatCheckMessage(result: PermessoCheckResult): string {
	if (result.success) {
		return `✅ *Permesso check complete*\n\n📄 Status: ${result.status || 'No status available'}`
	}
	return `❌ *Permesso check failed*\n\n⚠️ Error: ${result.error}`
}

// Must be awaited before the server starts accepting requests — buildTelegramDeepLink()
// needs botUsername, which getMe() below resolves.
export async function startTelegramBot() {
	if (!API_CONFIG.TELEGRAM_BOT_TOKEN) {
		console.warn(
			'⚠️ TELEGRAM_BOT_TOKEN not set — Telegram notifications disabled',
		)
		return
	}

	bot = new Bot(API_CONFIG.TELEGRAM_BOT_TOKEN)

	try {
		const me = await bot.api.getMe()
		botUsername = me.username
	} catch (error) {
		console.error(
			'❌ Failed to authenticate Telegram bot — check TELEGRAM_BOT_TOKEN:',
			error,
		)
		bot = undefined
		return
	}

	bot.command('start', async (ctx) => {
		const chatId = ctx.chatId
		const token = typeof ctx.match === 'string' ? ctx.match.trim() : ''
		if (!chatId) return

		if (!token) {
			await ctx.reply(
				'Open the Permesso Status page in the app and tap "Connect Telegram" to link your account.',
			)
			return
		}

		const linked = await permessoRepository.linkTelegramChat(
			token,
			String(chatId),
		)
		if (!linked) {
			// Telegram redelivers an update if our response didn't arrive in time
			// (at-least-once delivery), and by the second delivery the link token
			// is already cleared. Tell an already-linked chat it's fine rather
			// than "expired", so a redelivered /start doesn't read as a failure.
			const alreadyLinked = await permessoRepository.getByTelegramChatId(
				String(chatId),
			)
			if (alreadyLinked) {
				await ctx.reply("✅ You're already connected!")
				return
			}

			await ctx.reply(
				'That link has expired or was already used. Go back to the Permesso Status page and tap "Connect Telegram" again.',
			)
			return
		}

		notifyTelegramLinked(linked.userId)

		await ctx.reply(
			"✅ You're connected! You'll get a message here after each check.",
		)
	})

	if (API_CONFIG.NODE_ENV === 'production') {
		if (!API_CONFIG.TELEGRAM_WEBHOOK_SECRET) {
			console.error(
				'❌ TELEGRAM_WEBHOOK_SECRET must be set when NODE_ENV=production — Telegram notifications disabled',
			)
			bot = undefined
			return
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
				console.error(
					`❌ Telegram reports webhook URL "${info.url}", expected "${webhookUrl}" — Telegram notifications disabled`,
				)
				bot = undefined
				webhookHandler = undefined
				return
			}

			console.log(`🤖 Telegram bot registered webhook at ${webhookUrl}`)
		} catch (error) {
			// A transient Telegram outage here shouldn't take the whole API down
			// with it — log and run without Telegram notifications instead.
			console.error('❌ Failed to register Telegram webhook:', error)
			bot = undefined
			webhookHandler = undefined
			return
		}
	} else {
		console.warn(
			'⚠️ NODE_ENV is not "production" — falling back to long polling for local dev/test',
		)
		bot.startPolling().catch((error) => {
			console.error('Telegram bot polling stopped unexpectedly:', error)
		})
		console.log(
			`🤖 Telegram bot is polling for updates (${API_CONFIG.NODE_ENV})`,
		)
	}
}

export function buildTelegramDeepLink(linkToken: string): string | null {
	if (!bot || !botUsername) return null
	return `https://t.me/${botUsername}?start=${linkToken}`
}

export async function sendTelegramCheckResult(
	userId: string,
	chatId: string,
	result: PermessoCheckResult,
): Promise<void> {
	if (!bot) return
	try {
		await bot.api.sendMessage({
			chat_id: Number(chatId),
			text: formatCheckMessage(result),
			parse_mode: 'Markdown',
		})
	} catch (error) {
		// 403 means the user blocked the bot (or deleted the chat) — this is
		// permanent, so without this we'd keep silently failing to send every
		// hour forever while the UI still reported "Connected".
		if (error instanceof TelegramApiError && error.errorCode === 403) {
			console.warn(
				`⚠️ Telegram chat ${chatId} blocked the bot — disconnecting user ${userId}`,
			)
			await permessoRepository.disconnectTelegram(userId)
			return
		}
		console.error('Failed to send Telegram notification:', error)
	}
}

export async function handleTelegramWebhook(
	request: Request,
): Promise<Response> {
	if (!webhookHandler) {
		return new Response('Telegram webhook not configured', { status: 503 })
	}
	return webhookHandler(request)
}

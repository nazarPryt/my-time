import { API_CONFIG } from '@shared/api-config'
import { Bot } from 'node-telegram-bot-api'
import type { PermessoCheckResult } from './checker'
import { permessoRepository } from './repository'

let bot: Bot | undefined
let botUsername: string | undefined

function formatCheckMessage(result: PermessoCheckResult): string {
	if (result.success) {
		return `✅ *Permesso check complete*\n\n📄 Status: ${result.status || 'No status available'}`
	}
	return `❌ *Permesso check failed*\n\n⚠️ Error: ${result.error}`
}

/**
 * Starts long-polling for /start deep-link updates. A no-op when
 * TELEGRAM_BOT_TOKEN isn't set — Telegram notifications are optional, same as
 * the PERMESSO_WEBSITE_URL-gated checker itself. Awaits getMe() so the bot
 * username (needed to build deep links) is resolved before the server starts
 * accepting requests.
 */
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
			await ctx.reply(
				'That link has expired or was already used. Go back to the Permesso Status page and tap "Connect Telegram" again.',
			)
			return
		}

		await ctx.reply(
			"✅ You're connected! You'll get a message here after each check.",
		)
	})

	bot.startPolling().catch((error) => {
		console.error('Telegram bot polling stopped unexpectedly:', error)
	})

	console.log('🤖 Telegram bot is polling for updates')
}

export function buildTelegramDeepLink(linkToken: string): string | null {
	if (!bot || !botUsername) return null
	return `https://t.me/${botUsername}?start=${linkToken}`
}

export async function sendTelegramCheckResult(
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
		console.error('Failed to send Telegram notification:', error)
	}
}

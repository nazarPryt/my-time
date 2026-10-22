import type { Bot } from 'node-telegram-bot-api'
import { permessoRepository } from '../repository'
import { notifyTelegramLinked } from './link-events'

export function registerTelegramCommands(bot: Bot): void {
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
}

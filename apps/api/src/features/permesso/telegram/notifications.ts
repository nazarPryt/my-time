import { logger } from '@shared/logger'
import { type Bot, TelegramApiError } from 'node-telegram-bot-api'
import { isPermessoReady } from '../lib/status'
import { permessoRepository } from '../repository'
import type { PermessoCheckResult } from '../types'
import { formatCheckMessage, TELEGRAM_EFFECT_CONFETTI } from './messages'

export async function deliverTelegramCheckResult(
	bot: Bot,
	userId: string,
	chatId: string,
	result: PermessoCheckResult,
): Promise<void> {
	const isReady = result.success && isPermessoReady(result.status)
	try {
		await bot.api.sendMessage({
			chat_id: Number(chatId),
			text: formatCheckMessage(result, isReady),
			parse_mode: 'Markdown',
			message_effect_id: isReady ? TELEGRAM_EFFECT_CONFETTI : undefined,
		})
	} catch (error) {
		// 403 means the user blocked the bot (or deleted the chat) — this is
		// permanent, so without this we'd keep silently failing to send every
		// hour forever while the UI still reported "Connected".
		if (error instanceof TelegramApiError && error.errorCode === 403) {
			logger.warn(
				{ chatId, userId },
				'Telegram chat blocked the bot — disconnecting user',
			)
			await permessoRepository.disconnectTelegram(userId)
			return
		}
		logger.error({ err: error, userId }, 'failed to send Telegram notification')
	}
}

export async function deliverTelegramUnsubscribedNotice(
	bot: Bot,
	chatId: string,
): Promise<void> {
	try {
		await bot.api.sendMessage({
			chat_id: Number(chatId),
			text: "👋 Thanks for using the permesso checker. Your data has been deleted and you're unsubscribed — you won't receive any more messages here. Reconnect anytime from the Permesso Status page.",
		})
	} catch (error) {
		logger.error(
			{ err: error, chatId },
			'failed to send Telegram unsubscribe notice',
		)
	}
}

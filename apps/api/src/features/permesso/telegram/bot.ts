import { API_CONFIG } from '@shared/api-config'
import { logger } from '@shared/logger'
import { Bot } from 'node-telegram-bot-api'
import type { PermessoCheckResult } from '../types'
import { registerTelegramCommands } from './commands'
import {
	deliverTelegramCheckResult,
	deliverTelegramUnsubscribedNotice,
} from './notifications'
import {
	configureTelegramTransport,
	type TelegramWebhookHandler,
} from './transport'

let bot: Bot | undefined
let botUsername: string | undefined
let webhookHandler: TelegramWebhookHandler | undefined

async function authenticateTelegramBot(
	client: Bot,
): Promise<string | undefined> {
	try {
		const me = await client.api.getMe()
		return me.username
	} catch (error) {
		logger.error(
			{ err: error },
			'failed to authenticate Telegram bot — check TELEGRAM_BOT_TOKEN',
		)
		return undefined
	}
}

// Await before serving requests: deep links require the authenticated username.
export async function startTelegramBot() {
	bot = new Bot(API_CONFIG.TELEGRAM_BOT_TOKEN)
	botUsername = await authenticateTelegramBot(bot)
	if (!botUsername) {
		bot = undefined
		return
	}
	registerTelegramCommands(bot)
	const transport = await configureTelegramTransport(bot)
	if (transport === null) {
		bot = undefined
		webhookHandler = undefined
		return
	}
	webhookHandler = transport
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
	await deliverTelegramCheckResult(bot, userId, chatId, result)
}

export async function sendTelegramUnsubscribedNotice(
	chatId: string,
): Promise<void> {
	if (!bot) return
	await deliverTelegramUnsubscribedNotice(bot, chatId)
}

export async function handleTelegramWebhook(
	request: Request,
): Promise<Response> {
	if (!webhookHandler) {
		return new Response('Telegram webhook not configured', { status: 503 })
	}
	return webhookHandler(request)
}

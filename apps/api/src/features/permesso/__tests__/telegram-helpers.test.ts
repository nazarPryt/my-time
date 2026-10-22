import { beforeEach, expect, mock, test } from 'bun:test'
import { type Bot, TelegramApiError } from 'node-telegram-bot-api'

const disconnect = mock(async (_userId: string) => {})
const link = mock(
	async (_token: string, _chatId: string): Promise<{ userId: string } | null> =>
		null,
)
const getLinked = mock(
	async (_chatId: string): Promise<{ userId: string } | null> => null,
)
const notifyLinked = mock((_userId: string) => {})
mock.module('../repository', () => ({
	permessoRepository: {
		disconnectTelegram: disconnect,
		linkTelegramChat: link,
		getByTelegramChatId: getLinked,
	},
}))
mock.module('../telegram/link-events', () => ({
	notifyTelegramLinked: notifyLinked,
}))
const { deliverTelegramCheckResult } = await import('../telegram/notifications')
const { registerTelegramCommands } = await import('../telegram/commands')

beforeEach(() => {
	disconnect.mockClear()
	link.mockReset()
	link.mockResolvedValue(null)
	getLinked.mockReset()
	getLinked.mockResolvedValue(null)
	notifyLinked.mockClear()
})

function fakeClient(sendMessage: ReturnType<typeof mock>): Bot {
	return { api: { sendMessage } } as unknown as Bot
}

test('ready notifications preserve the status and include confetti', async () => {
	const send = mock(async (_message: unknown) => {})
	await deliverTelegramCheckResult(fakeClient(send), 'user', '123', {
		success: true,
		status: 'Il documento è pronto per la consegna. Ritiro: ROMA',
	})
	expect(send).toHaveBeenCalledWith({
		chat_id: 123,
		text: '🎉 *Your permesso is ready!*\n\n📄 Status: Il documento è pronto per la consegna. Ritiro: ROMA',
		parse_mode: 'Markdown',
		message_effect_id: '5046509860389126442',
	})
})

test('processing notifications do not include a celebration effect', async () => {
	const send = mock(async (_message: unknown) => {})
	await deliverTelegramCheckResult(fakeClient(send), 'user', '123', {
		success: true,
		status: 'In trattazione',
	})
	expect(send).toHaveBeenCalledWith(
		expect.objectContaining({
			message_effect_id: undefined,
			text: '✅ *Permesso check complete*\n\n📄 Status: In trattazione',
		}),
	)
})

test('blocked chats are disconnected, transient failures are not', async () => {
	const blocked = mock(async () => {
		throw new TelegramApiError(403, 'Forbidden')
	})
	await deliverTelegramCheckResult(fakeClient(blocked), 'user', '123', {
		success: false,
		error: 'Portal timeout',
	})
	expect(disconnect).toHaveBeenCalledWith('user')
	disconnect.mockClear()
	const transient = mock(async () => {
		throw new Error('Network timeout')
	})
	await deliverTelegramCheckResult(fakeClient(transient), 'user', '123', {
		success: false,
		error: 'Portal timeout',
	})
	expect(disconnect).not.toHaveBeenCalled()
})

async function startCommand(token: string) {
	let handler: ((ctx: unknown) => Promise<void>) | undefined
	const client = {
		command: (_name: string, callback: typeof handler) => {
			handler = callback
		},
	} as unknown as Bot
	registerTelegramCommands(client)
	const reply = mock(async (_text: string) => {})
	await handler?.({ chatId: 123, match: token, reply })
	return reply
}

test('start without a token explains how to connect without linking', async () => {
	const reply = await startCommand('')
	expect(link).not.toHaveBeenCalled()
	expect(reply).toHaveBeenCalledWith(
		expect.stringContaining('Connect Telegram'),
	)
})

test('start trims a valid token, links the chat, and notifies waiting clients', async () => {
	link.mockResolvedValueOnce({ userId: 'user' })
	const reply = await startCommand(' token ')
	expect(link).toHaveBeenCalledWith('token', '123')
	expect(notifyLinked).toHaveBeenCalledWith('user')
	expect(reply).toHaveBeenCalledWith(
		"✅ You're connected! You'll get a message here after each check.",
	)
})

test('redelivered start acknowledges an already-linked chat', async () => {
	getLinked.mockResolvedValueOnce({ userId: 'user' })
	const reply = await startCommand('used-token')
	expect(reply).toHaveBeenCalledWith("✅ You're already connected!")
	expect(notifyLinked).not.toHaveBeenCalled()
})

test('expired token explains how to reconnect', async () => {
	const reply = await startCommand('expired-token')
	expect(reply).toHaveBeenCalledWith(
		expect.stringContaining('That link has expired'),
	)
	expect(notifyLinked).not.toHaveBeenCalled()
})

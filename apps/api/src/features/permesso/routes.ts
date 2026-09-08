import { authMacro } from '@shared/auth-macro'
import {
	PERMESSO_ROUTES,
	SetPracticeNumberRequestSchema,
	UpdateCheckHoursRequestSchema,
} from 'contracts'
import { Elysia, sse } from 'elysia'
import { permessoRepository } from './repository'
import { permessoService } from './service'
import { handleTelegramWebhook } from './telegram-bot'
import { waitForTelegramLinkOrHeartbeat } from './telegram-link-events'

const TELEGRAM_LINK_TIMEOUT_MS = 60_000
const TELEGRAM_LINK_HEARTBEAT_MS = 15_000

export const permessoPlugin = new Elysia({ prefix: PERMESSO_ROUTES.prefix })
	// No auth guard — Telegram calls this directly. Authenticated via the
	// X-Telegram-Bot-Api-Secret-Token header inside handleTelegramWebhook.
	.post(PERMESSO_ROUTES.telegramWebhook, ({ request }) =>
		handleTelegramWebhook(request),
	)
	.use(authMacro)
	.guard({ auth: true }, (app) =>
		app
			.get(PERMESSO_ROUTES.root, async ({ userId }) => {
				return permessoService.getStatus(userId)
			})
			.put(
				PERMESSO_ROUTES.root,
				async ({ userId, body }) => {
					return permessoService.setPracticeNumber(userId, body.practiceNumber)
				},
				{ body: SetPracticeNumberRequestSchema },
			)
			.put(
				PERMESSO_ROUTES.schedule,
				async ({ userId, body }) => {
					return permessoService.updateCheckHours(userId, body.checkHours)
				},
				{ body: UpdateCheckHoursRequestSchema },
			)
			.post(PERMESSO_ROUTES.check, async ({ userId, set }) => {
				const outcome = await permessoService.runCheck(userId)
				if (!outcome.ok) {
					set.status = 409
					return { message: 'Set a practice number before checking' }
				}
				return outcome.result
			})
			.get(PERMESSO_ROUTES.history, async ({ userId }) => {
				return permessoService.getHistory(userId)
			})
			.post(PERMESSO_ROUTES.telegramLink, async ({ userId, set }) => {
				const outcome = await permessoService.createTelegramLink(userId)
				if (!outcome.ok) {
					set.status = outcome.reason === 'no_practice_number' ? 409 : 503
					return {
						message:
							outcome.reason === 'no_practice_number'
								? 'Set a practice number before connecting Telegram'
								: 'Telegram notifications are not configured on this server',
					}
				}
				return outcome.link
			})
			.get(PERMESSO_ROUTES.telegramLinkEvents, async function* ({ userId }) {
				const row = await permessoRepository.getByUserId(userId)
				if (row?.telegramChatId) {
					yield sse({ event: 'connected', data: 'ok' })
					return
				}

				// Flush headers immediately — otherwise nothing (not even the
				// response headers) reaches the client until the first heartbeat.
				yield sse({ event: 'open', data: 'ok' })

				const deadline = Date.now() + TELEGRAM_LINK_TIMEOUT_MS
				while (Date.now() < deadline) {
					const outcome = await waitForTelegramLinkOrHeartbeat(
						userId,
						Math.min(TELEGRAM_LINK_HEARTBEAT_MS, deadline - Date.now()),
					)
					if (outcome === 'linked') {
						yield sse({ event: 'connected', data: 'ok' })
						return
					}
					yield sse({ event: 'ping', data: 'waiting' })
				}

				yield sse({ event: 'timeout', data: 'ok' })
			})
			.post(PERMESSO_ROUTES.telegramDisconnect, async ({ userId }) => {
				return permessoService.disconnectTelegram(userId)
			}),
	)

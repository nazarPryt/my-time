import { authMacro } from '@shared/auth-macro'
import {
	PERMESSO_ROUTES,
	SetPracticeNumberRequestSchema,
	UpdateCheckHoursRequestSchema,
} from 'contracts'
import { Elysia, sse } from 'elysia'
import { permessoService } from './service'
import { handleTelegramWebhook } from './telegram-bot'

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
					return permessoService.updateCheckHours(
						userId,
						body.checkHours,
						body.timezone,
					)
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
				for await (const evt of permessoService.streamTelegramLinkEvents(
					userId,
				)) {
					yield sse({
						event: evt.event,
						data: evt.event === 'ping' ? 'waiting' : 'ok',
					})
				}
			})
			.post(PERMESSO_ROUTES.telegramDisconnect, async ({ userId }) => {
				return permessoService.disconnectTelegram(userId)
			})
			.post(PERMESSO_ROUTES.reset, async ({ userId }) => {
				return permessoService.resetAll(userId)
			}),
	)

import { authMacro } from '@shared/auth-macro'
import {
	PERMESSO_ROUTES,
	SetPracticeNumberRequestSchema,
	UpdateCheckHoursRequestSchema,
} from 'contracts'
import { Elysia } from 'elysia'
import { permessoService } from './service'

export const permessoPlugin = new Elysia({ prefix: PERMESSO_ROUTES.prefix })
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
			.post(PERMESSO_ROUTES.telegramDisconnect, async ({ userId }) => {
				return permessoService.disconnectTelegram(userId)
			}),
	)

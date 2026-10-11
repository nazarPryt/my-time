import { authMacro } from '@shared/auth-macro'
import { StartSessionRequestSchema, TIME_TRACKER_ROUTES } from 'contracts'
import { Elysia } from 'elysia'
import { timeTrackerService } from './service'
import { createSessionStream } from './session-events'

export const timeTrackerPlugin = new Elysia({
	prefix: TIME_TRACKER_ROUTES.prefix,
})
	.use(authMacro)
	.guard({ auth: true }, (app) =>
		app
			.get(
				TIME_TRACKER_ROUTES.events,
				async ({ userId, tokenExpiresAt, request, status, server }) => {
					if (
						typeof tokenExpiresAt !== 'number' ||
						!Number.isFinite(tokenExpiresAt)
					)
						return status('Unauthorized', 'A token with an expiry is required')
					// Bun's default idle timeout is shorter than our heartbeat interval.
					server?.timeout(request, 60)
					return createSessionStream(
						userId,
						request.signal,
						tokenExpiresAt * 1000,
						request.headers.get('X-My-Time-Client') === 'web'
							? 'web'
							: request.headers
										.get('user-agent')
										?.startsWith('my-time-desktop/')
								? 'desktop'
								: undefined,
					)
				},
			)
			.get(TIME_TRACKER_ROUTES.active, async ({ userId }) => {
				return timeTrackerService.getActive(userId)
			})
			.get(TIME_TRACKER_ROUTES.today, async ({ userId }) => {
				return timeTrackerService.getToday(userId)
			})
			.get(TIME_TRACKER_ROUTES.weekly, async ({ userId }) => {
				return timeTrackerService.getWeeklySummary(userId)
			})
			.post(
				TIME_TRACKER_ROUTES.start,
				async ({ userId, body }) => {
					return timeTrackerService.startSession(userId, body.type)
				},
				{ body: StartSessionRequestSchema },
			)
			.patch(TIME_TRACKER_ROUTES.endById, async ({ userId, params }) => {
				return timeTrackerService.endSession(userId, params.id)
			})
			.delete(
				TIME_TRACKER_ROUTES.deleteById,
				async ({ userId, params, status }) => {
					const session = await timeTrackerService.abandonSession(
						userId,
						params.id,
					)
					if (!session) {
						return status('Not Found', {
							message: 'Session not found or already ended',
						})
					}
					return session
				},
			),
	)

import { authMacro } from '@shared/auth-macro'
import { StartSessionRequestSchema, TIME_TRACKER_ROUTES } from 'contracts'
import { Elysia } from 'elysia'
import { timeTrackerService } from './service'

export const timeTrackerPlugin = new Elysia({
	prefix: TIME_TRACKER_ROUTES.prefix,
})
	.use(authMacro)
	.guard({ auth: true }, (app) =>
		app
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
				async ({ userId, params, set }) => {
					const session = await timeTrackerService.abandonSession(
						userId,
						params.id,
					)
					if (!session) {
						set.status = 404
						return { message: 'Session not found or already ended' }
					}
					return session
				},
			),
	)

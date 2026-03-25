import { authMacro } from '@shared/auth-macro'
import { StartSessionRequestSchema } from 'contracts'
import { Elysia } from 'elysia'
import { timeTrackerService } from './service'

export const timeTrackerPlugin = new Elysia({ prefix: '/time-tracker' })
	.use(authMacro)
	.guard({ auth: true }, (app) =>
		app
			.get('/active', async ({ userId }) => {
				return timeTrackerService.getActive(userId)
			})
			.get('/today', async ({ userId }) => {
				return timeTrackerService.getToday(userId)
			})
			.get('/weekly', async ({ userId }) => {
				return timeTrackerService.getWeeklySummary(userId)
			})
			.post(
				'/start',
				async ({ userId, body }) => {
					return timeTrackerService.startSession(userId, body.type)
				},
				{ body: StartSessionRequestSchema },
			)
			.patch('/:id/end', async ({ userId, params }) => {
				return timeTrackerService.endSession(userId, params.id)
			}),
	)

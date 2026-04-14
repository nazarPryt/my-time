import { authMacro } from '@shared/auth-macro'
import {
	CreateSetRequestSchema,
	ExerciseTypeSchema,
	ProgressQuerySchema,
	UpdateGoalRequestSchema,
	WORKOUT_ROUTES,
} from 'contracts'
import { Elysia } from 'elysia'
import { z } from 'zod'
import { workoutService } from './service'

const exerciseTypeQuery = z.object({
	exerciseType: ExerciseTypeSchema.default('pushups'),
})

export const workoutPlugin = new Elysia({ prefix: WORKOUT_ROUTES.prefix })
	.use(authMacro)
	.guard({ auth: true }, (app) =>
		app
			.get(
				WORKOUT_ROUTES.today,
				async ({ userId, query }) => {
					return workoutService.getToday(userId, query.exerciseType)
				},
				{ query: exerciseTypeQuery },
			)
			.post(
				WORKOUT_ROUTES.sets,
				async ({ userId, body }) => {
					return workoutService.addSet(userId, body.exerciseType, body.reps)
				},
				{ body: CreateSetRequestSchema },
			)
			.delete(WORKOUT_ROUTES.setById, async ({ userId, params }) => {
				await workoutService.deleteSet(userId, params.id)
			})
			.delete(
				WORKOUT_ROUTES.sets,
				async ({ userId, query }) => {
					await workoutService.resetToday(userId, query.exerciseType)
				},
				{ query: exerciseTypeQuery },
			)
			.put(
				WORKOUT_ROUTES.goal,
				async ({ userId, body }) => {
					return workoutService.updateGoal(
						userId,
						body.exerciseType,
						body.targetReps,
					)
				},
				{ body: UpdateGoalRequestSchema },
			)
			.get(
				WORKOUT_ROUTES.progress,
				async ({ userId, query }) => {
					return workoutService.getProgress(
						userId,
						query.exerciseType,
						query.year,
						query.month,
					)
				},
				{ query: ProgressQuerySchema },
			),
	)

import { authMacro } from '@shared/auth-macro'
import {
	CreateSetRequestSchema,
	ExerciseTypeQuerySchema,
	GoalResponseSchema,
	ProgressQuerySchema,
	ProgressResponseSchema,
	SetResponseSchema,
	TodayResponseSchema,
	UpdateGoalRequestSchema,
	WORKOUT_ROUTES,
} from 'contracts'
import { Elysia } from 'elysia'
import { workoutService } from './service'

export const workoutPlugin = new Elysia({ prefix: WORKOUT_ROUTES.prefix })
	.use(authMacro)
	.guard({ auth: true }, (app) =>
		app
			.get(
				WORKOUT_ROUTES.today,
				async ({ userId, query }) => {
					return workoutService.getToday(userId, query.exerciseType)
				},
				{
					query: ExerciseTypeQuerySchema,
					response: { 200: TodayResponseSchema },
				},
			)
			.post(
				WORKOUT_ROUTES.sets,
				async ({ userId, body }) => {
					return workoutService.addSet(userId, body.exerciseType, body.reps)
				},
				{ body: CreateSetRequestSchema, response: { 200: SetResponseSchema } },
			)
			.delete(WORKOUT_ROUTES.setById, async ({ userId, params }) => {
				await workoutService.deleteSet(userId, params.id)
			})
			.delete(
				WORKOUT_ROUTES.sets,
				async ({ userId, query }) => {
					await workoutService.resetToday(userId, query.exerciseType)
				},
				{ query: ExerciseTypeQuerySchema },
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
				{
					body: UpdateGoalRequestSchema,
					response: { 200: GoalResponseSchema },
				},
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
				{
					query: ProgressQuerySchema,
					response: { 200: ProgressResponseSchema },
				},
			),
	)

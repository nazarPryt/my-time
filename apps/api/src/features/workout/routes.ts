import { authMacro } from '@shared/auth-macro'
import {
	CreateSetRequestSchema,
	ExerciseTypeSchema,
	UpdateGoalRequestSchema,
} from 'contracts'
import { Elysia } from 'elysia'
import { z } from 'zod'
import { workoutService } from './service'

const exerciseTypeQuery = z.object({
	exerciseType: ExerciseTypeSchema.default('pushups'),
})

export const workoutPlugin = new Elysia({ prefix: '/workout' })
	.use(authMacro)
	.guard({ auth: true }, (app) =>
		app
			.get(
				'/today',
				async ({ userId, query }) => {
					return workoutService.getToday(userId, query.exerciseType)
				},
				{ query: exerciseTypeQuery },
			)
			.post(
				'/sets',
				async ({ userId, body }) => {
					return workoutService.addSet(userId, body.exerciseType, body.reps)
				},
				{ body: CreateSetRequestSchema },
			)
			.delete(
				'/sets',
				async ({ userId, query }) => {
					await workoutService.resetToday(userId, query.exerciseType)
				},
				{ query: exerciseTypeQuery },
			)
			.put(
				'/goal',
				async ({ userId, body }) => {
					return workoutService.updateGoal(
						userId,
						body.exerciseType,
						body.targetReps,
					)
				},
				{ body: UpdateGoalRequestSchema },
			),
	)

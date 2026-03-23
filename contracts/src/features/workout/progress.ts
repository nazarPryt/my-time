import { z } from 'zod'
import { ExerciseTypeSchema } from './exercise-type'
import { GoalResponseSchema } from './goal'

export const ProgressDaySchema = z.object({
	date: z.string(), // "YYYY-MM-DD"
	total: z.number(),
})
export type ProgressDay = z.infer<typeof ProgressDaySchema>

export const ProgressQuerySchema = z.object({
	exerciseType: ExerciseTypeSchema.default('pushups'),
	year: z.coerce.number().int().min(2020).max(2100),
	month: z.coerce.number().int().min(1).max(12),
})
export type ProgressQuery = z.infer<typeof ProgressQuerySchema>

export const ProgressResponseSchema = z.object({
	days: z.array(ProgressDaySchema),
	goal: GoalResponseSchema,
})
export type ProgressResponse = z.infer<typeof ProgressResponseSchema>

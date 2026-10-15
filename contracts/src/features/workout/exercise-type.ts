import { z } from 'zod'

export const ExerciseTypeSchema = z.enum(['pushups'])
export type ExerciseType = z.infer<typeof ExerciseTypeSchema>

export const DEFAULT_EXERCISE_TYPE: ExerciseType = 'pushups'

export const ExerciseTypeQuerySchema = z.object({
	exerciseType: ExerciseTypeSchema.default(DEFAULT_EXERCISE_TYPE),
})
export type ExerciseTypeQuery = z.infer<typeof ExerciseTypeQuerySchema>

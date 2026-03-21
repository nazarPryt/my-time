import { z } from 'zod'

export const ExerciseTypeSchema = z.enum(['pushups'])
export type ExerciseType = z.infer<typeof ExerciseTypeSchema>

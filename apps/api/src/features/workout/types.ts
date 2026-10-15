import type { workoutGoals, workoutSets } from '@db/schema'

export type WorkoutSetRecord = typeof workoutSets.$inferSelect
export type WorkoutGoalRecord = typeof workoutGoals.$inferSelect
export type WorkoutProgressSet = Pick<WorkoutSetRecord, 'createdAt' | 'reps'>

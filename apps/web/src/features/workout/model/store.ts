import { createWorkoutStore } from '@my-time/client-features/workout'
import { workoutApi } from '../api/api'

export type { ChartEntry } from '@my-time/client-features/workout'
export const useWorkoutStore = createWorkoutStore(workoutApi)

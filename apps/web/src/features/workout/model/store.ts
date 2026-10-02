import { createWorkoutStore } from 'features/workout'
import { workoutApi } from '../api/api'

export type { ChartEntry } from 'features/workout'
export const useWorkoutStore = createWorkoutStore(workoutApi)

import { createWorkoutStore } from 'features/workout'
import { workoutApi } from './api'

export type { ChartEntry } from 'features/workout'
export const useWorkoutStore = createWorkoutStore(workoutApi)

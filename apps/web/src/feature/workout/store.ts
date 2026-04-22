import { createWorkoutStore } from 'features/workout'
import { workoutApi } from './api'

export { ChartEntry } from 'features/workout'
export const useWorkoutStore = createWorkoutStore(workoutApi)

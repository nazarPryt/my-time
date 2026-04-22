import { createWorkoutApi, createWorkoutStore } from 'features/workout'
import { api } from '@/shared/lib/api-client'

export { ChartEntry } from 'features/workout'
export const useWorkoutStore = createWorkoutStore(createWorkoutApi(api))

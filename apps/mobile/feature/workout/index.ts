import { createWorkoutApi, createWorkoutStore } from 'features'
import { api } from '@/shared/lib/api-client'

export { ChartEntry } from 'features'
export const useWorkoutStore = createWorkoutStore(createWorkoutApi(api))

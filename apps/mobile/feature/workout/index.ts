import { createWorkoutApi, createWorkoutStore } from '@my-time/client-features'
import { api } from '@/shared/lib/api-client'

export { ChartEntry } from '@my-time/client-features'
export const useWorkoutStore = createWorkoutStore(createWorkoutApi(api))

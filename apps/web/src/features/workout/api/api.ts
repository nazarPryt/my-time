import { createWorkoutApi } from '@my-time/client-features/workout'
import { api } from '@/shared/lib/api'

export const workoutApi = createWorkoutApi(api)

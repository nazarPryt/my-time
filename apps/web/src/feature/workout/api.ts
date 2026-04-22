import { createWorkoutApi } from 'features/workout'
import { api } from '@/shared/lib/api'

export const workoutApi = createWorkoutApi(api)

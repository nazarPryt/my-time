import type { treaty } from '@elysiajs/eden'
import type { ExerciseType } from 'contracts'
import type { App } from 'api'

type ApiClient = ReturnType<typeof treaty<App>>['api']['v1']

export function createWorkoutApi(api: ApiClient) {
  return {
    fetchTodayWorkout(exerciseType: ExerciseType, signal?: AbortSignal) {
      return api.workout.today.get({ query: { exerciseType }, fetch: { signal } })
    },
    addSet(exerciseType: ExerciseType, reps: number) {
      return api.workout.sets.post({ exerciseType, reps })
    },
    deleteSet(id: string) {
      return api.workout.sets({ id }).delete()
    },
    clearSets(exerciseType: ExerciseType) {
      return api.workout.sets.delete({}, { query: { exerciseType } })
    },
    updateGoal(exerciseType: ExerciseType, targetReps: number) {
      return api.workout.goal.put({ exerciseType, targetReps })
    },
    fetchWorkoutProgress(exerciseType: ExerciseType, year: number, month: number) {
      return api.workout.progress.get({ query: { exerciseType, year, month } })
    },
  }
}

export type WorkoutApiActions = ReturnType<typeof createWorkoutApi>

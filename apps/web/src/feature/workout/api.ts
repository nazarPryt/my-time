import type { ExerciseType } from 'contracts'
import { api } from '@/shared/lib/api'

export async function fetchTodayWorkout(
	exerciseType: ExerciseType,
	signal?: AbortSignal,
) {
	return api.workout.today.get({
		query: { exerciseType },
		fetch: { signal },
	})
}

export async function addSet(exerciseType: ExerciseType, reps: number) {
	return api.workout.sets.post({ exerciseType, reps })
}

export async function deleteSet(id: string) {
	return api.workout.sets({ id }).delete()
}

export async function clearSets(exerciseType: ExerciseType) {
	return api.workout.sets.delete({}, { query: { exerciseType } })
}

export async function updateGoal(
	exerciseType: ExerciseType,
	targetReps: number,
) {
	return api.workout.goal.put({ exerciseType, targetReps })
}

export async function fetchWorkoutProgress(
	exerciseType: ExerciseType,
	year: number,
	month: number,
) {
	return api.workout.progress.get({ query: { exerciseType, year, month } })
}

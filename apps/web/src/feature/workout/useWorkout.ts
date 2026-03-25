import type { ExerciseType, SetResponse, TodayResponse } from 'contracts'
import { useCallback, useEffect, useState } from 'react'
import { api } from '@/shared/lib/api'

export function useWorkout(exerciseType: ExerciseType = 'pushups') {
	const [data, setData] = useState<TodayResponse | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [submitting, setSubmitting] = useState(false)

	const fetchData = useCallback(
		async (signal?: AbortSignal) => {
			const { data: result, error: err } = await api.workout.today.get({
				query: { exerciseType },
				fetch: { signal },
			})
			if (signal?.aborted) return
			if (err) {
				setError('Failed to load workout data')
				console.error(err)
			} else {
				setData(result)
				setError(null)
			}
			setLoading(false)
		},
		[exerciseType],
	)

	useEffect(() => {
		const controller = new AbortController()
		void fetchData(controller.signal)
		return () => controller.abort()
	}, [fetchData])

	const addSet = useCallback(
		async (reps: number) => {
			if (!data || submitting) return
			setSubmitting(true)
			const tempId = crypto.randomUUID()
			const optimistic: SetResponse = {
				id: tempId,
				exerciseType,
				reps,
				createdAt: new Date().toISOString(),
			}
			setData((prev) => {
				if (!prev) return prev
				return {
					...prev,
					sets: [...prev.sets, optimistic],
					total: prev.total + reps,
				}
			})
			const { data: created, error: err } = await api.workout.sets.post({
				exerciseType,
				reps,
			})
			if (err || !created) {
				setData((prev) => {
					if (!prev) return prev
					return {
						...prev,
						sets: prev.sets.filter((s) => s.id !== tempId),
						total: prev.total - reps,
					}
				})
				setError('Failed to add set')
				console.error(err)
			} else {
				setData((prev) => {
					if (!prev) return prev
					return {
						...prev,
						sets: prev.sets.map((s) => (s.id === tempId ? created : s)),
					}
				})
			}
			setSubmitting(false)
		},
		[data, submitting, exerciseType],
	)

	const deleteSet = useCallback(
		async (id: string) => {
			if (!data || submitting) return
			setSubmitting(true)
			const deletedSet = data.sets.find((s) => s.id === id)
			setData((prev) => {
				if (!prev) return prev
				return {
					...prev,
					sets: prev.sets.filter((s) => s.id !== id),
					total: prev.total - (deletedSet?.reps ?? 0),
				}
			})
			const { error: err } = await api.workout.sets({ id }).delete()
			if (err) {
				setData((prev) => {
					if (!prev || !deletedSet) return prev
					return {
						...prev,
						sets: [...prev.sets, deletedSet],
						total: prev.total + deletedSet.reps,
					}
				})
				setError('Failed to delete set')
				console.error(err)
			}
			setSubmitting(false)
		},
		[data, submitting],
	)

	const resetDay = useCallback(async () => {
		const { error: err } = await api.workout.sets.delete(
			{},
			{ query: { exerciseType } },
		)
		if (err) {
			console.error(err)
		}
		await fetchData()
	}, [fetchData, exerciseType])

	const updateGoal = useCallback(
		async (targetReps: number) => {
			setData((prev) => {
				if (!prev) return prev
				return { ...prev, goal: { ...prev.goal, targetReps } }
			})
			const { error: err } = await api.workout.goal.put({
				exerciseType,
				targetReps,
			})
			if (err) {
				console.error(err)
				await fetchData()
			}
		},
		[fetchData, exerciseType],
	)

	return {
		data,
		loading,
		error,
		submitting,
		addSet,
		deleteSet,
		resetDay,
		updateGoal,
	}
}

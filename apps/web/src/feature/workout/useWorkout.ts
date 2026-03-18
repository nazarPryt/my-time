import { useCallback, useEffect, useState } from 'react'
import { api } from '@/shared/lib/api'

interface SetEntry {
	id: string
	exerciseType: string
	reps: number
	createdAt: string
}

interface GoalEntry {
	exerciseType: string
	targetReps: number
}

interface WorkoutData {
	sets: SetEntry[]
	goal: GoalEntry
	total: number
}

export function useWorkout() {
	const [data, setData] = useState<WorkoutData | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const fetchData = useCallback(async (signal?: AbortSignal) => {
		const { data: result, error: err } = await api.workout.today.get({
			query: { exerciseType: 'pushups' },
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
	}, [])

	useEffect(() => {
		const controller = new AbortController()
		fetchData(controller.signal)
		return () => controller.abort()
	}, [fetchData])

	const addSet = useCallback(
		async (reps: number) => {
			if (!data) return
			const optimistic: SetEntry = {
				id: crypto.randomUUID(),
				exerciseType: 'pushups',
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
			const { error: err } = await api.workout.sets.post({
				exerciseType: 'pushups',
				reps,
			})
			if (err) {
				console.error(err)
				await fetchData()
			}
		},
		[data, fetchData],
	)

	const resetDay = useCallback(async () => {
		const { error: err } = await api.workout.sets.delete(
			{},
			{ query: { exerciseType: 'pushups' } },
		)
		if (err) {
			console.error(err)
		}
		await fetchData()
	}, [fetchData])

	const updateGoal = useCallback(
		async (targetReps: number) => {
			setData((prev) => {
				if (!prev) return prev
				return { ...prev, goal: { ...prev.goal, targetReps } }
			})
			const { error: err } = await api.workout.goal.put({
				exerciseType: 'pushups',
				targetReps,
			})
			if (err) {
				console.error(err)
				await fetchData()
			}
		},
		[fetchData],
	)

	return { data, loading, error, addSet, resetDay, updateGoal }
}

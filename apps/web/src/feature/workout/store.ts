import type { ExerciseType, SetResponse, TodayResponse } from 'contracts'
import { format, subMonths } from 'date-fns'
import { create } from 'zustand'
import {
	clearSets,
	addSet as dalAddSet,
	deleteSet as dalDeleteSet,
	updateGoal as dalUpdateGoal,
	fetchTodayWorkout,
	fetchWorkoutProgress,
} from './api'

// ChartEntry is a view-model derived from ProgressDay — not duplicated from contracts.
export type ChartEntry = { day: string; total: number; date: string }

// Eden Treaty may deserialize ISO date strings to Date objects at runtime — normalize either.
function toDateStr(value: unknown): string {
	return value instanceof Date
		? format(value, 'yyyy-MM-dd')
		: String(value).slice(0, 10)
}

interface WorkoutState {
	// Today workout
	data: TodayResponse | null
	loading: boolean
	error: string | null
	submitting: boolean
	exerciseType: ExerciseType
	// Actions
	load: (signal?: AbortSignal) => Promise<void>
	addSet: (reps: number) => Promise<void>
	deleteSet: (id: string) => Promise<void>
	resetDay: () => Promise<void>
	updateGoal: (targetReps: number) => Promise<void>
	// Progress
	progressData: ChartEntry[]
	progressLoading: boolean
	goalReps: number
	cursor: Date
	prevMonth: () => void
	nextMonth: () => void
	loadProgress: (year: number, month: number) => Promise<void>
}

export const useWorkoutStore = create<WorkoutState>((set, get) => ({
	// Today workout initial state
	data: null,
	loading: true,
	error: null,
	submitting: false,
	exerciseType: 'pushups',

	load: async (signal) => {
		const { data: result, error: err } = await fetchTodayWorkout(
			get().exerciseType,
			signal,
		)
		if (signal?.aborted) return
		if (err) {
			set({ error: 'Failed to load workout data', loading: false })
			console.error(err)
		} else {
			set({ data: result, error: null, loading: false })
		}
	},

	addSet: async (reps) => {
		const { data, submitting, exerciseType } = get()
		if (!data || submitting) return
		set({ submitting: true })
		const tempId = crypto.randomUUID()
		const optimistic: SetResponse = {
			id: tempId,
			exerciseType,
			reps,
			createdAt: new Date().toISOString(),
		}
		set((s) => ({
			data: s.data
				? {
						...s.data,
						sets: [...s.data.sets, optimistic],
						total: s.data.total + reps,
					}
				: s.data,
		}))
		const { data: created, error: err } = await dalAddSet(exerciseType, reps)
		if (err || !created) {
			set((s) => ({
				submitting: false,
				error: 'Failed to add set',
				data: s.data
					? {
							...s.data,
							sets: s.data.sets.filter((s) => s.id !== tempId),
							total: s.data.total - reps,
						}
					: s.data,
			}))
			console.error(err)
		} else {
			set((s) => ({
				submitting: false,
				data: s.data
					? {
							...s.data,
							sets: s.data.sets.map((s) => (s.id === tempId ? created : s)),
						}
					: s.data,
			}))
		}
	},

	deleteSet: async (id) => {
		const { data, submitting } = get()
		if (!data || submitting) return
		set({ submitting: true })
		const deletedSet = data.sets.find((s) => s.id === id)
		set((s) => ({
			data: s.data
				? {
						...s.data,
						sets: s.data.sets.filter((s) => s.id !== id),
						total: s.data.total - (deletedSet?.reps ?? 0),
					}
				: s.data,
		}))
		const { error: err } = await dalDeleteSet(id)
		if (err) {
			set((s) => ({
				submitting: false,
				error: 'Failed to delete set',
				data:
					s.data && deletedSet
						? {
								...s.data,
								sets: [...s.data.sets, deletedSet],
								total: s.data.total + deletedSet.reps,
							}
						: s.data,
			}))
			console.error(err)
		} else {
			set({ submitting: false })
		}
	},

	resetDay: async () => {
		const { exerciseType } = get()
		const { error: err } = await clearSets(exerciseType)
		if (err) {
			console.error(err)
		}
		await get().load()
	},

	updateGoal: async (targetReps) => {
		const { exerciseType } = get()
		set((s) => ({
			data: s.data
				? { ...s.data, goal: { ...s.data.goal, targetReps } }
				: s.data,
		}))
		const { error: err } = await dalUpdateGoal(exerciseType, targetReps)
		if (err) {
			console.error(err)
			await get().load()
		}
	},

	// Progress initial state
	progressData: [],
	progressLoading: true,
	goalReps: 100,
	cursor: new Date(),

	prevMonth: () => set((s) => ({ cursor: subMonths(s.cursor, 1) })),
	nextMonth: () => set((s) => ({ cursor: subMonths(s.cursor, -1) })),

	loadProgress: async (year, month) => {
		set({ progressLoading: true })
		const { data: res } = await fetchWorkoutProgress('pushups', year, month)
		if (!res) {
			set({ progressLoading: false })
			return
		}
		set({
			progressData: res.days.map((d) => {
				const date = toDateStr(d.date)
				return {
					date,
					total: d.total,
					day: String(parseInt(date.split('-')[2], 10)),
				}
			}),
			goalReps: res.goal.targetReps,
			progressLoading: false,
		})
	},
}))

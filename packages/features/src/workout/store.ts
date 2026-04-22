import type { ExerciseType, SetResponse, TodayResponse } from 'contracts'
import { format, subMonths } from 'date-fns'
import { create } from 'zustand'
import type { WorkoutApiActions } from './api'

export type ChartEntry = { day: string; total: number; date: string }

function toDateStr(value: unknown): string {
  return value instanceof Date
    ? format(value, 'yyyy-MM-dd')
    : String(value).slice(0, 10)
}

interface WorkoutState {
  data: TodayResponse | null
  loading: boolean
  error: string | null
  submitting: boolean
  exerciseType: ExerciseType
  load: (signal?: AbortSignal) => Promise<void>
  addSet: (reps: number) => Promise<void>
  deleteSet: (id: string) => Promise<void>
  resetDay: () => Promise<void>
  updateGoal: (targetReps: number) => Promise<void>
  progressData: ChartEntry[]
  progressLoading: boolean
  goalReps: number
  cursor: Date
  prevMonth: () => void
  nextMonth: () => void
  loadProgress: (year: number, month: number) => Promise<void>
}

export function createWorkoutStore(workoutApi: WorkoutApiActions) {
  return create<WorkoutState>((set, get) => ({
    data: null,
    loading: true,
    error: null,
    submitting: false,
    exerciseType: 'pushups',

    load: async (signal) => {
      const { data: result, error: err } = await workoutApi.fetchTodayWorkout(
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
          ? { ...s.data, sets: [...s.data.sets, optimistic], total: s.data.total + reps }
          : s.data,
      }))
      const { data: created, error: err } = await workoutApi.addSet(exerciseType, reps)
      if (err || !created) {
        set((s) => ({
          submitting: false,
          error: 'Failed to add set',
          data: s.data
            ? { ...s.data, sets: s.data.sets.filter((item) => item.id !== tempId), total: s.data.total - reps }
            : s.data,
        }))
        console.error(err)
      } else {
        set((s) => ({
          submitting: false,
          data: s.data
            ? { ...s.data, sets: s.data.sets.map((item) => (item.id === tempId ? created : item)) }
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
          ? { ...s.data, sets: s.data.sets.filter((item) => item.id !== id), total: s.data.total - (deletedSet?.reps ?? 0) }
          : s.data,
      }))
      const { error: err } = await workoutApi.deleteSet(id)
      if (err) {
        set((s) => ({
          submitting: false,
          error: 'Failed to delete set',
          data: s.data && deletedSet
            ? { ...s.data, sets: [...s.data.sets, deletedSet], total: s.data.total + deletedSet.reps }
            : s.data,
        }))
        console.error(err)
      } else {
        set({ submitting: false })
      }
    },

    resetDay: async () => {
      const { exerciseType } = get()
      const { error: err } = await workoutApi.clearSets(exerciseType)
      if (err) console.error(err)
      await get().load()
    },

    updateGoal: async (targetReps) => {
      const { exerciseType } = get()
      set((s) => ({
        data: s.data ? { ...s.data, goal: { ...s.data.goal, targetReps } } : s.data,
      }))
      const { error: err } = await workoutApi.updateGoal(exerciseType, targetReps)
      if (err) {
        console.error(err)
        await get().load()
      }
    },

    progressData: [],
    progressLoading: true,
    goalReps: 100,
    cursor: new Date(),

    prevMonth: () => set((s) => ({ cursor: subMonths(s.cursor, 1) })),
    nextMonth: () => set((s) => ({ cursor: subMonths(s.cursor, -1) })),

    loadProgress: async (year, month) => {
      set({ progressLoading: true })
      const { data: res } = await workoutApi.fetchWorkoutProgress(get().exerciseType, year, month)
      if (!res) {
        set({ progressLoading: false })
        return
      }
      set({
        progressData: res.days.map((d) => {
          const date = toDateStr(d.date)
          return { date, total: d.total, day: String(parseInt(date.split('-')[2], 10)) }
        }),
        goalReps: res.goal.targetReps,
        progressLoading: false,
      })
    },
  }))
}

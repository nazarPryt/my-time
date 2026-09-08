import type {
	PermessoCheckHistoryResponse,
	PermessoStatusResponse,
} from 'contracts'
import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'
import {
	fetchPermessoHistory,
	fetchPermessoStatus,
	runPermessoCheck,
	setPermessoPracticeNumber,
	updatePermessoCheckHours,
} from './api'

interface PermessoState {
	status: PermessoStatusResponse | null
	history: PermessoCheckHistoryResponse
	loading: boolean
	submitting: boolean
	checking: boolean
	updatingSchedule: boolean
	error: string | null
	load: () => Promise<void>
	savePracticeNumber: (practiceNumber: string) => Promise<void>
	updateCheckHours: (checkHours: number[]) => Promise<void>
	check: () => Promise<void>
}

export const usePermessoStore = create<PermessoState>((set, get) => ({
	status: null,
	history: [],
	loading: true,
	submitting: false,
	checking: false,
	updatingSchedule: false,
	error: null,

	load: async () => {
		set({ loading: true, error: null })
		const [statusRes, historyRes] = await Promise.all([
			fetchPermessoStatus(),
			fetchPermessoHistory(),
		])
		if (statusRes.error || historyRes.error) {
			set({ loading: false, error: 'Failed to load permesso status' })
			return
		}
		set({
			status: statusRes.data ?? null,
			history: historyRes.data ?? [],
			loading: false,
		})
	},

	savePracticeNumber: async (practiceNumber) => {
		if (get().submitting) return
		set({ submitting: true, error: null })
		const { data, error } = await setPermessoPracticeNumber(practiceNumber)
		if (error || !data) {
			set({ submitting: false, error: 'Invalid practice number' })
		} else {
			set({ submitting: false, status: data })
		}
	},

	updateCheckHours: async (checkHours) => {
		if (get().updatingSchedule) return
		set({ updatingSchedule: true, error: null })
		const { data, error } = await updatePermessoCheckHours(checkHours)
		if (error || !data) {
			set({ updatingSchedule: false, error: 'Failed to update schedule' })
		} else {
			set({ updatingSchedule: false, status: data })
		}
	},

	check: async () => {
		if (get().checking) return
		set({ checking: true, error: null })
		const { error } = await runPermessoCheck()
		if (error) {
			set({ checking: false, error: 'Check failed — try again shortly' })
			return
		}
		const [statusRes, historyRes] = await Promise.all([
			fetchPermessoStatus(),
			fetchPermessoHistory(),
		])
		set({
			checking: false,
			status: statusRes.data ?? get().status,
			history: historyRes.data ?? get().history,
		})
	},
}))

export const usePermessoState = () =>
	usePermessoStore(
		useShallow((s) => ({
			status: s.status,
			history: s.history,
			loading: s.loading,
			submitting: s.submitting,
			checking: s.checking,
			updatingSchedule: s.updatingSchedule,
			error: s.error,
		})),
	)

export const usePermessoActions = () =>
	usePermessoStore(
		useShallow((s) => ({
			load: s.load,
			savePracticeNumber: s.savePracticeNumber,
			updateCheckHours: s.updateCheckHours,
			check: s.check,
		})),
	)

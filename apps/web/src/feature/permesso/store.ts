import type {
	PermessoCheckHistoryResponse,
	PermessoStatusResponse,
} from 'contracts'
import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'
import {
	createPermessoTelegramLink,
	disconnectPermessoTelegram,
	fetchPermessoHistory,
	fetchPermessoStatus,
	runPermessoCheck,
	setPermessoPracticeNumber,
	updatePermessoCheckHours,
} from './api'

const TELEGRAM_POLL_INTERVAL_MS = 2000
const TELEGRAM_POLL_TIMEOUT_MS = 60_000

interface PermessoState {
	status: PermessoStatusResponse | null
	history: PermessoCheckHistoryResponse
	loading: boolean
	submitting: boolean
	checking: boolean
	updatingSchedule: boolean
	connectingTelegram: boolean
	disconnectingTelegram: boolean
	error: string | null
	telegramError: string | null
	load: () => Promise<void>
	savePracticeNumber: (practiceNumber: string) => Promise<void>
	updateCheckHours: (checkHours: number[]) => Promise<void>
	check: () => Promise<void>
	connectTelegram: () => Promise<void>
	disconnectTelegram: () => Promise<void>
}

export const usePermessoStore = create<PermessoState>((set, get) => ({
	status: null,
	history: [],
	loading: true,
	submitting: false,
	checking: false,
	updatingSchedule: false,
	connectingTelegram: false,
	disconnectingTelegram: false,
	error: null,
	telegramError: null,

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

	connectTelegram: async () => {
		if (get().connectingTelegram) return
		set({ connectingTelegram: true, telegramError: null })

		const { data, error } = await createPermessoTelegramLink()
		if (error || !data || 'message' in data) {
			set({
				connectingTelegram: false,
				telegramError:
					'Could not start Telegram connection — try again shortly',
			})
			return
		}

		window.open(data.deepLink, '_blank', 'noopener,noreferrer')

		const deadline = Date.now() + TELEGRAM_POLL_TIMEOUT_MS
		while (Date.now() < deadline) {
			await new Promise((resolve) =>
				setTimeout(resolve, TELEGRAM_POLL_INTERVAL_MS),
			)
			const { data: statusData } = await fetchPermessoStatus()
			if (statusData?.telegramConnected) {
				set({ connectingTelegram: false, status: statusData })
				return
			}
		}

		set({ connectingTelegram: false })
	},

	disconnectTelegram: async () => {
		if (get().disconnectingTelegram) return
		set({ disconnectingTelegram: true, telegramError: null })
		const { data, error } = await disconnectPermessoTelegram()
		if (error || !data) {
			set({
				disconnectingTelegram: false,
				telegramError: 'Failed to disconnect Telegram',
			})
			return
		}
		set({ disconnectingTelegram: false, status: data })
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
			connectingTelegram: s.connectingTelegram,
			disconnectingTelegram: s.disconnectingTelegram,
			error: s.error,
			telegramError: s.telegramError,
		})),
	)

export const usePermessoActions = () =>
	usePermessoStore(
		useShallow((s) => ({
			load: s.load,
			savePracticeNumber: s.savePracticeNumber,
			updateCheckHours: s.updateCheckHours,
			check: s.check,
			connectTelegram: s.connectTelegram,
			disconnectTelegram: s.disconnectTelegram,
		})),
	)

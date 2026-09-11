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
import { watchTelegramLink } from './telegram-link-stream'

const TELEGRAM_LINK_ABORT_MS = 70_000

interface PermessoState {
	status: PermessoStatusResponse | null
	history: PermessoCheckHistoryResponse
	loading: boolean
	submitting: boolean
	checking: boolean
	updatingSchedule: boolean
	pendingCheckHour: number | null
	connectingTelegram: boolean
	disconnectingTelegram: boolean
	error: string | null
	telegramError: string | null
	load: () => Promise<void>
	savePracticeNumber: (practiceNumber: string) => Promise<void>
	updateCheckHours: (checkHours: number[], hour: number) => Promise<void>
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
	pendingCheckHour: null,
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

	updateCheckHours: async (checkHours, hour) => {
		if (get().updatingSchedule) return
		set({ updatingSchedule: true, pendingCheckHour: hour, error: null })
		const { data, error } = await updatePermessoCheckHours(checkHours)
		if (error || !data) {
			set({
				updatingSchedule: false,
				pendingCheckHour: null,
				error: 'Failed to update schedule',
			})
		} else {
			set({ updatingSchedule: false, pendingCheckHour: null, status: data })
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

		const controller = new AbortController()
		const abortTimer = setTimeout(
			() => controller.abort(),
			TELEGRAM_LINK_ABORT_MS,
		)

		try {
			const outcome = await watchTelegramLink(controller.signal)
			if (outcome === 'connected') {
				const { data: statusData } = await fetchPermessoStatus()
				set({ connectingTelegram: false, status: statusData ?? get().status })
				return
			}
		} catch {
			// aborted or dropped connection — fall through and give up quietly,
			// same as a timeout
		} finally {
			clearTimeout(abortTimer)
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
			pendingCheckHour: s.pendingCheckHour,
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

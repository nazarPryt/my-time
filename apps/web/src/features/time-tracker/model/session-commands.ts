import type { SessionSyncState, SyncCheckpoint } from '@my-time/session-sync'
import type { SessionResponse } from 'contracts'
import {
	deleteSession,
	endSession,
	fetchActiveSession,
	startSession,
} from '../api/api'
import type { SetTrackerState, TimeTrackerState } from './types'

interface CommandResult {
	activeSession: SessionResponse | null
	changed: boolean
}

export function createSessionCommands(
	set: SetTrackerState,
	get: () => TimeTrackerState,
	sync: SessionSyncState,
	confirm: (session: SessionResponse | null) => void,
): Pick<TimeTrackerState, 'startWork' | 'stopWork' | 'abandonSession'> {
	async function run(
		action: (checkpoint: SyncCheckpoint) => Promise<CommandResult | undefined>,
		failureMessage: string,
	): Promise<void> {
		if (get().submitting) return
		sync.invalidate()
		const checkpoint = sync.checkpoint()
		set({ submitting: true, error: null })
		let changed = false
		try {
			const result = await action(checkpoint)
			if (!result || !sync.isSameLifetime(checkpoint)) return
			changed = result.changed
			if (sync.isCurrent(checkpoint)) confirm(result.activeSession)
		} catch {
			if (sync.isSameLifetime(checkpoint)) set({ error: failureMessage })
		} finally {
			if (sync.isSameLifetime(checkpoint)) {
				set({ submitting: false })
				if (changed && !sync.connected) void get().refreshSummary()
			}
		}
	}

	async function start(
		checkpoint: SyncCheckpoint,
	): Promise<CommandResult | undefined> {
		const active = await sync.currentSession(
			() => get().activeSession,
			fetchActiveSession,
		)
		if (!sync.isSameLifetime(checkpoint)) return
		if (active) return { activeSession: active, changed: false }
		const { data, error } = await startSession('work')
		if (error || !data) throw new Error('Start failed')
		return { activeSession: data, changed: true }
	}

	async function stop(
		checkpoint: SyncCheckpoint,
	): Promise<CommandResult | undefined> {
		const active = await sync.currentSession(
			() => get().activeSession,
			fetchActiveSession,
		)
		if (!sync.isSameLifetime(checkpoint)) return
		if (active) {
			const { error } = await endSession(active.id)
			if (error) throw new Error('Stop failed')
		}
		return { activeSession: null, changed: true }
	}

	async function abandon(id: string): Promise<CommandResult> {
		const { error } = await deleteSession(id)
		if (error) throw new Error('Delete failed')
		// Deleting another session must not clear the currently running one.
		const active = get().activeSession
		return { activeSession: active?.id === id ? null : active, changed: true }
	}

	return {
		startWork: () =>
			run(start, 'Unable to start work. Check your connection and try again.'),
		stopWork: () =>
			run(
				stop,
				'Unable to stop work. Your last confirmed session is still shown; please try again.',
			),
		abandonSession: (id) =>
			run(
				() => abandon(id),
				'Unable to delete this session. Please try again.',
			),
	}
}

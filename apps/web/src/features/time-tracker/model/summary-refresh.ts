import type { SessionSyncState } from '@my-time/session-sync'
import { fetchTodaySummary } from '../api/api'
import type { SetTrackerState } from './types'

/** Coalesce changes, discard stale reads, and keep each mount's work isolated. */
export function createSummaryRefresh(
	sync: SessionSyncState,
	set: SetTrackerState,
): (signal?: AbortSignal) => Promise<void> {
	const owner = sync.checkpoint()
	let pending = false
	let running: Promise<void> | undefined

	async function readSummary(signal?: AbortSignal): Promise<void> {
		const checkpoint = sync.checkpoint()
		try {
			const { data, error } = await fetchTodaySummary(signal)
			if (signal?.aborted || !sync.isSameLifetime(checkpoint)) return
			if (!sync.isCurrent(checkpoint)) {
				pending = true
				return
			}
			if (error || !data) throw new Error('Summary unavailable')
			set({ todaySummary: data })
		} catch {
			if (!signal?.aborted && sync.isCurrent(checkpoint)) {
				set({
					error:
						'Unable to refresh today’s statistics. Your last confirmed session is still shown.',
				})
			}
		}
	}

	async function drain(signal?: AbortSignal): Promise<void> {
		while (pending && !signal?.aborted && sync.isSameLifetime(owner)) {
			pending = false
			await readSummary(signal)
		}
	}

	return async (signal) => {
		if (signal?.aborted || !sync.isSameLifetime(owner)) return
		pending = true
		do {
			running ??= drain(signal).finally(() => {
				running = undefined
			})
			await running
		} while (pending && !signal?.aborted && sync.isSameLifetime(owner))
	}
}

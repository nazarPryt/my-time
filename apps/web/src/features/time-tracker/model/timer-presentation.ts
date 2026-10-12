import { createClockCheck, TimerDisplay } from '@my-time/session-sync'
import type { TimerSnapshot } from 'contracts'
import { differenceInSeconds } from 'date-fns'
import type { SetTrackerState, TimeTrackerState } from './types'

/** Own local display ticks; server snapshots own accounting. */
export function createTimerPresentation(
	set: SetTrackerState,
	get: () => TimeTrackerState,
) {
	let display: TimerDisplay | null = null
	let tick: ReturnType<typeof setInterval> | undefined
	const checkClock = createClockCheck(
		() => performance.now(),
		() => {
			void get().refreshSummary()
		},
	)

	function render(): void {
		checkClock()
		const active = get().activeSession
		set({
			elapsed: display
				? display.sessionSeconds()
				: active
					? Math.max(0, differenceInSeconds(new Date(), active.startedAt))
					: 0,
			dailySeconds: display?.dailySeconds() ?? null,
		})
	}

	function accept(timer: TimerSnapshot): void {
		display = new TimerDisplay(timer)
		render()
	}

	function clear(): void {
		clearInterval(tick)
		tick = undefined
		display = null
	}

	function confirm(timer?: TimerSnapshot): void {
		clear()
		if (timer) accept(timer)
		else render()
		tick = setInterval(render, 1000)
	}

	return { accept, confirm, clear }
}

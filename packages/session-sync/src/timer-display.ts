import { TZDate } from '@date-fns/tz'
import type { TimerSnapshot } from 'contracts'
import { addMilliseconds, differenceInMilliseconds, startOfDay } from 'date-fns'

/** Projects a server total for presentation; never aggregates client session history. */
export class TimerDisplay {
	readonly snapshot: TimerSnapshot
	private receivedAt: number
	constructor(snapshot: TimerSnapshot, receivedAt = Date.now()) {
		this.snapshot = snapshot
		this.receivedAt = receivedAt
	}

	private elapsed(now: number): number {
		return Math.max(0, now - this.receivedAt)
	}

	serverNow(now = Date.now()): Date {
		return addMilliseconds(this.snapshot.asOf, this.elapsed(now))
	}

	sessionSeconds(now = Date.now()): number {
		if (!this.snapshot.running) return 0
		return Math.floor(
			this.snapshot.sessionWorkSeconds + this.elapsed(now) / 1000,
		)
	}

	dailySeconds(now = Date.now()): number {
		const serverNow = this.serverNow(now)
		if (differenceInMilliseconds(serverNow, this.snapshot.nextDayAt) >= 0) {
			if (!this.snapshot.running) return 0
			const midnight = startOfDay(new TZDate(serverNow, this.snapshot.timeZone))
			return Math.floor(
				Math.max(0, differenceInMilliseconds(serverNow, midnight)) / 1000,
			)
		}
		const elapsed = this.snapshot.running ? this.elapsed(now) / 1000 : 0
		return Math.floor(this.snapshot.dailyWorkSeconds + elapsed)
	}
}

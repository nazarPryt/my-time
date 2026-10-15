import type { ProgressDay } from 'contracts'
import { format, getDaysInMonth } from 'date-fns'
import type { WorkoutProgressSet } from '../types'

export function sumRepsByDay(sets: WorkoutProgressSet[]) {
	const totals = new Map<string, number>()
	for (const s of sets) {
		const day = format(s.createdAt, 'yyyy-MM-dd')
		totals.set(day, (totals.get(day) ?? 0) + s.reps)
	}
	return totals
}

export function buildMonthDays(
	firstDay: Date,
	year: number,
	month: number,
	totals: Map<string, number>,
): ProgressDay[] {
	return Array.from({ length: getDaysInMonth(firstDay) }, (_, i) => {
		const date = format(new Date(year, month - 1, i + 1), 'yyyy-MM-dd')
		return { date, total: totals.get(date) ?? 0 }
	})
}

import { format, subMonths } from 'date-fns'
import { useEffect, useState } from 'react'
import { api } from '@/shared/lib/api'

export type ChartEntry = { day: string; total: number; date: string }

// Eden Treaty may deserialize ISO date strings to Date objects at runtime — normalize either.
function toDateStr(value: unknown): string {
	return value instanceof Date
		? format(value, 'yyyy-MM-dd')
		: String(value).slice(0, 10)
}

export function useWorkoutProgress() {
	const now = new Date()
	const [cursor, setCursor] = useState(now)
	const [data, setData] = useState<ChartEntry[]>([])
	const [goalReps, setGoalReps] = useState(100)
	const [loading, setLoading] = useState(true)

	const year = cursor.getFullYear()
	const month = cursor.getMonth() + 1

	useEffect(() => {
		let cancelled = false
		setLoading(true)
		api.workout.progress
			.get({ query: { exerciseType: 'pushups', year, month } })
			.then(({ data: res }) => {
				if (cancelled || !res) return
				setData(
					res.days.map((d) => {
						const date = toDateStr(d.date)
						return {
							date,
							total: d.total,
							day: String(parseInt(date.split('-')[2], 10)), // 'YYYY-MM-DD' → day without leading zero
						}
					}),
				)
				setGoalReps(res.goal.targetReps)
			})
			.finally(() => {
				if (!cancelled) setLoading(false)
			})
		return () => {
			cancelled = true
		}
	}, [year, month])

	const isCurrentMonth =
		cursor.getFullYear() === now.getFullYear() &&
		cursor.getMonth() === now.getMonth()

	return {
		data,
		loading,
		goalReps,
		monthLabel: format(cursor, 'MMMM yyyy'),
		todayDay: isCurrentMonth ? String(now.getDate()) : null,
		isCurrentMonth,
		prevMonth: () => setCursor((c) => subMonths(c, 1)),
		nextMonth: () => setCursor((c) => subMonths(c, -1)),
	}
}

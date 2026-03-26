import { format } from 'date-fns'
import { useEffect, useState } from 'react'
import { api } from '@/shared/lib/api'

export type TimeChartEntry = {
	date: string
	label: string
	hours: number
	totalWorkSeconds: number
}

export function useTimeProgress() {
	const [data, setData] = useState<TimeChartEntry[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		let cancelled = false
		setLoading(true)
		api['time-tracker'].weekly
			.get()
			.then(({ data: res }) => {
				if (cancelled || !res) return
				// API returns most-recent-first; reverse for chronological display
				const sorted = [...res.days].reverse()
				setData(
					sorted.map((d) => ({
						date: format(d.date, 'yyyy-MM-dd'),
						label: format(d.date, 'MMM d'),
						hours: +(d.totalWorkSeconds / 3600).toFixed(2),
						totalWorkSeconds: d.totalWorkSeconds,
					})),
				)
			})
			.finally(() => {
				if (!cancelled) setLoading(false)
			})
		return () => {
			cancelled = true
		}
	}, [])

	return { data, loading }
}

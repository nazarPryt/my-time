import { useEffect, useState } from 'react'

const STORAGE_KEY = 'rest-timer-target'

export function useRestTimer() {
	const [startedAt, setStartedAt] = useState<number | null>(null)
	const [targetSeconds, setTargetSeconds] = useState(() => {
		const saved = localStorage.getItem(STORAGE_KEY)
		return saved ? parseInt(saved, 10) : 90
	})
	const [elapsed, setElapsed] = useState(0)

	useEffect(() => {
		if (startedAt === null) {
			setElapsed(0)
			return
		}
		const tick = () => setElapsed(Math.floor((Date.now() - startedAt) / 1000))
		tick()
		const id = setInterval(tick, 500)
		return () => clearInterval(id)
	}, [startedAt])

	const active = startedAt !== null
	const done = active && elapsed >= targetSeconds
	const progress = active ? Math.min(elapsed / targetSeconds, 1) : 0

	const start = () => setStartedAt(Date.now())

	const changeTarget = (s: number) => {
		setTargetSeconds(s)
		localStorage.setItem(STORAGE_KEY, String(s))
	}

	return { startedAt, elapsed, active, done, progress, targetSeconds, start, changeTarget }
}
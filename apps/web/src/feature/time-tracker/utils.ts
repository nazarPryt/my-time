export function formatElapsed(seconds: number): string {
	const s = Math.max(0, seconds)
	const h = Math.floor(s / 3600)
	const m = Math.floor((s % 3600) / 60)
	const sec = s % 60
	if (h > 0)
		return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
	return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}

export function formatDuration(seconds: number): string {
	if (seconds < 60) return `${seconds}s`
	const h = Math.floor(seconds / 3600)
	const m = Math.floor((seconds % 3600) / 60)
	if (h > 0) return m > 0 ? `${h}h ${m}m` : `${h}h`
	return `${m}m`
}

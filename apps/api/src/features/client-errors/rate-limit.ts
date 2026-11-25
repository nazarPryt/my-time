const WINDOW_MS = 60_000

/** Fixed-window limiter per key plus a global cap, kept in memory. */
export function createRateLimiter(perKey: number, total: number) {
	let windowStart = 0
	let totalCount = 0
	const counts = new Map<string, number>()
	return (key: string, now = Date.now()): boolean => {
		if (now - windowStart >= WINDOW_MS) {
			windowStart = now
			totalCount = 0
			counts.clear()
		}
		const count = counts.get(key) ?? 0
		if (count >= perKey || totalCount >= total) return false
		counts.set(key, count + 1)
		totalCount++
		return true
	}
}

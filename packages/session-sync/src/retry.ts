export function reconnectDelay(
	attempt: number,
	random = Math.random(),
): number {
	return Math.round(
		Math.min(30_000, 1000 * 2 ** Math.min(attempt, 5)) * (0.75 + random * 0.25),
	)
}

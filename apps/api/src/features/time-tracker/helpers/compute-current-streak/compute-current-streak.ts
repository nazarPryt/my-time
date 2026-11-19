/** Counts consecutive days with >= 1 completed session, starting from `days[0]`. */
export function computeCurrentStreak(
	days: Array<{ sessionsCompleted: number }>,
): number {
	let streak = 0
	for (const day of days) {
		if (day.sessionsCompleted === 0) break
		streak++
	}
	return streak
}

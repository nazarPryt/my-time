/** ["A2", "B1", "B2"] → "A2–B2" */
export function formatLevelRange(levels: readonly string[]): string {
	const first = levels[0]
	const last = levels.at(-1)
	if (first === undefined || last === undefined) return ''
	return first === last ? first : `${first}–${last}`
}

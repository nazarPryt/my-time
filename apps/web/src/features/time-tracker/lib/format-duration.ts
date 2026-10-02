/**
 * Formats a completed duration in a compact, human-readable form.
 *
 * Under a minute it shows seconds (`45s`); from a minute up it shows whole
 * minutes (`30m`); from an hour up it shows hours plus any remaining whole
 * minutes (`1h 30m`, or `2h` when the minutes are zero). Sub-minute remainders
 * are dropped once the total is a minute or more.
 */
export function formatDuration(seconds: number): string {
	if (seconds < 60) return `${seconds}s`
	const h = Math.floor(seconds / 3600)
	const m = Math.floor((seconds % 3600) / 60)
	if (h > 0) return m > 0 ? `${h}h ${m}m` : `${h}h`
	return `${m}m`
}

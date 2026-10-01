/**
 * Formats a running elapsed time for the live timer display.
 *
 * Negative input is clamped to 0. Renders `mm:ss` under an hour and
 * `hh:mm:ss` from one hour up, each component zero-padded to two digits
 * (hours may exceed two digits, e.g. `100:00:00`).
 */
export function formatElapsed(seconds: number): string {
	const s = Math.max(0, seconds)
	const h = Math.floor(s / 3600)
	const m = Math.floor((s % 3600) / 60)
	const sec = s % 60
	if (h > 0)
		return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
	return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}

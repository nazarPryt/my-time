/** Detect suspend/clock changes without network polling; adapters own the clock. */
export function createClockCheck(
	monotonicNow: () => number,
	onChange: () => void,
	wallNow = () => Date.now(),
): () => void {
	let wall = wallNow()
	let monotonic = monotonicNow()
	return () => {
		const nextWall = wallNow()
		const nextMonotonic = monotonicNow()
		const drift = nextWall - wall - (nextMonotonic - monotonic)
		wall = nextWall
		monotonic = nextMonotonic
		if (Math.abs(drift) > 2000) onChange()
	}
}

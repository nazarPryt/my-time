/** A source of randomness in [0, 1). Injected so tests are deterministic. */
export type RandomSource = () => number

/** Returns a shuffled copy (Fisher–Yates); the input is left untouched. */
export function shuffle<T>(items: readonly T[], random: RandomSource): T[] {
	const copy = [...items]
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(random() * (i + 1))
		;[copy[i], copy[j]] = [copy[j] as T, copy[i] as T]
	}
	return copy
}

/** Deterministic pseudo-random sequence (mulberry32), for tests. */
export function seededRandom(seed: number): RandomSource {
	let state = seed
	return () => {
		state |= 0
		state = (state + 0x6d2b79f5) | 0
		let t = Math.imul(state ^ (state >>> 15), 1 | state)
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296
	}
}

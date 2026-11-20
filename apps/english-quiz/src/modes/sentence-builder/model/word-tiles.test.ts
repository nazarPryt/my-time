import { describe, expect, test } from 'bun:test'
import { seededRandom } from 'contracts/english-quiz'
import { buildWordTiles, TILES_PER_STEP } from './word-tiles'

const WORDS = ['How', 'do', 'you', 'play']
const POOL = ['is', 'are', 'did', 'the', 'a', 'to', 'at', 'you', 'Do']

describe('buildWordTiles', () => {
	test('offers the expected word among TILES_PER_STEP unique tiles', () => {
		for (let step = 0; step < WORDS.length; step++) {
			const tiles = buildWordTiles({
				words: WORDS,
				step,
				pool: POOL,
				random: seededRandom(step + 1),
			})
			expect(tiles).toHaveLength(TILES_PER_STEP)
			const lower = tiles.map((tile) => tile.toLowerCase())
			expect(new Set(lower).size).toBe(tiles.length)
			expect(lower).toContain((WORDS[step] as string).toLowerCase())
		}
	})

	test('always includes the traps for the expected word', () => {
		const tiles = buildWordTiles({
			words: WORDS,
			step: 3,
			traps: { Play: ['played', 'plays'] },
			pool: POOL,
			random: seededRandom(5),
		})
		expect(tiles).toContain('play')
		expect(tiles).toContain('played')
		expect(tiles).toContain('plays')
	})

	test('capitalises every tile for the first word', () => {
		const tiles = buildWordTiles({
			words: WORDS,
			step: 0,
			pool: POOL,
			random: seededRandom(9),
		})
		for (const tile of tiles) {
			expect(tile.charAt(0)).toBe(tile.charAt(0).toUpperCase())
		}
	})

	test('never offers a case-variant of the expected word as a distractor', () => {
		// "Do" in the pool must not appear next to the expected "do".
		const tiles = buildWordTiles({
			words: WORDS,
			step: 1,
			pool: POOL,
			random: seededRandom(2),
		})
		expect(tiles.filter((tile) => tile.toLowerCase() === 'do')).toEqual(['do'])
	})

	test('returns no tiles once every word is picked', () => {
		expect(
			buildWordTiles({
				words: WORDS,
				step: WORDS.length,
				pool: POOL,
				random: seededRandom(1),
			}),
		).toEqual([])
	})

	test('offers every alternative word and never repeats it as a distractor', () => {
		const tiles = buildWordTiles({
			words: ["I'm", 'not', 'tired'],
			step: 0,
			alternatives: ['I'],
			traps: { I: ['Me', 'My'] },
			pool: POOL,
			random: seededRandom(7),
		})
		expect(tiles).toHaveLength(TILES_PER_STEP)
		expect(tiles).toContain("I'm")
		expect(tiles).toContain('I')
		expect(tiles).toContain('Me')
		expect(tiles).toContain('My')
		expect(tiles.filter((tile) => tile.toLowerCase() === 'i')).toEqual(['I'])
	})
})

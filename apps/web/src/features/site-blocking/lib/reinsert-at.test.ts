import { describe, expect, test } from 'bun:test'
import { reinsertAt } from './reinsert-at'

const a = { id: 'a' }
const b = { id: 'b' }
const c = { id: 'c' }

describe('reinsertAt', () => {
	test('puts the item back at its original index', () => {
		expect(reinsertAt([a, c], b, 1)).toEqual([a, b, c])
	})

	test('keeps items added while the removal was in flight', () => {
		// b was removed from [a, b]; c was appended meanwhile; b's delete failed.
		expect(reinsertAt([a, c], b, 1)).toEqual([a, b, c])
		expect(reinsertAt([a, c], b, 1)).toContain(c)
	})

	test('clamps an index past the end (list shrank meanwhile)', () => {
		expect(reinsertAt([a], c, 5)).toEqual([a, c])
	})

	test('clamps a negative index to the start', () => {
		expect(reinsertAt([b], a, -1)).toEqual([a, b])
	})

	test('does not duplicate an item that is already present', () => {
		expect(reinsertAt([a, b], b, 0)).toEqual([a, b])
	})

	test('does not mutate the input list', () => {
		const list = [a, c]
		reinsertAt(list, b, 1)
		expect(list).toEqual([a, c])
	})
})

import { describe, expect, test } from 'bun:test'
import {
	PRACTICE_CATEGORIES,
	type PracticeCategoryId,
} from '../shared/practice/practice-categories'
import { groupByCategory } from './group-by-category'

const [first, second] = PRACTICE_CATEGORIES.map((category) => category.id)
const mode = (id: string, category: PracticeCategoryId) => ({ id, category })

describe('groupByCategory', () => {
	test('follows category order, keeps mode order, skips empty categories', () => {
		if (!first || !second) throw new Error('expected two categories')
		const groups = groupByCategory([
			mode('b', second),
			mode('a1', first),
			mode('a2', first),
		])
		expect(groups.map((group) => group.category.id)).toEqual([first, second])
		expect(groups[0]?.modes.map((m) => m.id)).toEqual(['a1', 'a2'])
	})

	test('leaves out categories without modes', () => {
		if (!second) throw new Error('expected two categories')
		const groups = groupByCategory([mode('b', second)])
		expect(groups.map((group) => group.category.id)).toEqual([second])
	})
})

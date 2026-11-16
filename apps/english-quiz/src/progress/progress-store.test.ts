import { describe, expect, test } from 'bun:test'
import { ENGLISH_QUIZ_MODES } from '@my-time/mfe-contracts'
import { EMPTY_PROGRESS, withScore } from './practice-progress'
import { createStorageProgressStore } from './progress-store'

const KEY = 'test:progress'

function memoryStorage(): Storage {
	const items = new Map<string, string>()
	return {
		get length() {
			return items.size
		},
		clear: () => items.clear(),
		getItem: (key) => items.get(key) ?? null,
		key: (index) => [...items.keys()][index] ?? null,
		removeItem: (key) => void items.delete(key),
		setItem: (key, value) => void items.set(key, value),
	}
}

describe('createStorageProgressStore', () => {
	test('saves and loads progress', () => {
		const storage = memoryStorage()
		const store = createStorageProgressStore(() => storage, KEY)
		const progress = withScore(EMPTY_PROGRESS, ENGLISH_QUIZ_MODES[0], {
			correct: 1,
			total: 2,
		})

		store.save(progress)

		expect(store.load()).toEqual(progress)
	})

	test('starts empty when nothing was saved or the entry is corrupt', () => {
		const storage = memoryStorage()
		const store = createStorageProgressStore(() => storage, KEY)
		expect(store.load()).toEqual(EMPTY_PROGRESS)

		storage.setItem(KEY, '{not json')
		expect(store.load()).toEqual(EMPTY_PROGRESS)
	})

	test('survives storage that throws', () => {
		const store = createStorageProgressStore(() => {
			throw new Error('blocked')
		}, KEY)
		expect(store.load()).toEqual(EMPTY_PROGRESS)
		expect(() => store.save(EMPTY_PROGRESS)).not.toThrow()
	})
})

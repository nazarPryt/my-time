import {
	EMPTY_PROGRESS,
	type PracticeProgress,
	parseProgress,
} from './practice-progress'

/** Namespaced: localStorage is shared with the host. */
export const PROGRESS_STORAGE_KEY = 'english-quiz:progress'

export interface ProgressStore {
	load(): PracticeProgress
	save(progress: PracticeProgress): void
}

/** Storage can be missing or throw; progress is optional, so errors are ignored. */
export function createStorageProgressStore(
	getStorage: () => Storage = () => globalThis.localStorage,
	key: string = PROGRESS_STORAGE_KEY,
): ProgressStore {
	return {
		load() {
			try {
				const raw = getStorage().getItem(key)
				return raw === null ? EMPTY_PROGRESS : parseProgress(JSON.parse(raw))
			} catch {
				return EMPTY_PROGRESS
			}
		},
		save(progress) {
			try {
				getStorage().setItem(key, JSON.stringify(progress))
			} catch {
				// Progress is optional.
			}
		},
	}
}

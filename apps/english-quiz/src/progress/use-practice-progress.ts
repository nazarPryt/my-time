import type { QuizMode } from '@my-time/micro-frontends'
import { readonly, shallowRef } from 'vue'
import {
	type ModeScore,
	type PracticeProgress,
	withScore,
} from './practice-progress'
import {
	createStorageProgressStore,
	type ProgressStore,
} from './progress-store'

export function usePracticeProgress(
	store: ProgressStore = createStorageProgressStore(),
) {
	const progress = shallowRef<PracticeProgress>(store.load())

	function recordScore(mode: QuizMode, score: ModeScore) {
		progress.value = withScore(progress.value, mode, score)
		store.save(progress.value)
	}

	return { progress: readonly(progress), recordScore }
}

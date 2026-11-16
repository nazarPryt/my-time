import { QUIZ_LEVELS } from '@my-time/mfe-contracts'
import { formatLevelRange } from '../../shared/lib/format-level-range'
import { lazyModeComponent } from '../../shared/practice/lazy-mode-component'
import type { PracticeModeDefinition } from '../../shared/practice/practice-mode'
import LevelQuizSkeleton from './components/level-quiz-skeleton.vue'

export const levelQuizMode: PracticeModeDefinition = {
	title: 'Level quiz',
	description: 'Answer multiple-choice questions to check your level.',
	category: 'assessment',
	levels: formatLevelRange(QUIZ_LEVELS),
	minutes: 5,
	component: lazyModeComponent(
		() => import('./level-quiz.vue'),
		LevelQuizSkeleton,
	),
	props: ({ initialLevel, report }) => ({ initialLevel, report }),
}

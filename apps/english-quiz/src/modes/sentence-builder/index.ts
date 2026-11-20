import { formatLevelRange } from '../../shared/lib/format-level-range'
import { lazyModeComponent } from '../../shared/practice/lazy-mode-component'
import type { PracticeModeDefinition } from '../../shared/practice/practice-mode'
import SentenceBuilderSkeleton from './components/sentence-builder-skeleton.vue'
import { TOPIC_LEVEL_LABELS } from './model/group-topics'
import { TOPIC_LEVELS } from './model/types'

export const sentenceBuilderMode: PracticeModeDefinition = {
	title: 'Sentence builder',
	description: 'Translate sentences by putting English words in order.',
	category: 'grammar',
	levels: formatLevelRange(
		TOPIC_LEVELS.map((level) => TOPIC_LEVEL_LABELS[level]),
	),
	minutes: 10,
	component: lazyModeComponent(
		() => import('./sentence-builder.vue'),
		SentenceBuilderSkeleton,
	),
}

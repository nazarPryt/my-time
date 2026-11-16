import { ENGLISH_QUIZ_MODES, type QuizMode } from '@my-time/mfe-contracts'
import { levelQuizMode } from '../modes/level-quiz'
import { sentenceBuilderMode } from '../modes/sentence-builder'
import type { PracticeModeDefinition } from '../shared/practice/practice-mode'

/** Full Record: a contract mode without a definition fails the typecheck. */
const DEFINITIONS: Record<QuizMode, PracticeModeDefinition> = {
	'level-quiz': levelQuizMode,
	'sentence-builder': sentenceBuilderMode,
}

export interface PracticeMode extends PracticeModeDefinition {
	id: QuizMode
}

export const PRACTICE_MODES: readonly PracticeMode[] = ENGLISH_QUIZ_MODES.map(
	(id) => ({ id, ...DEFINITIONS[id] }),
)

export function getPracticeMode(id: QuizMode): PracticeMode {
	return { id, ...DEFINITIONS[id] }
}

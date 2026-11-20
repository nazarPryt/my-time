import { logger } from '@shared/logger'
import { englishQuizRepository } from '../repository'
import type { TopicRecord } from './define-topic'
import { ALL_TOPICS } from './index'
import { findContentProblems } from './validate-content'

export class InvalidContentError extends Error {
	constructor(readonly problems: readonly string[]) {
		super(`English quiz content is invalid:\n${problems.join('\n')}`)
		this.name = 'InvalidContentError'
	}
}

/**
 * Seeds the topic tables from the topic files: the files in git are the
 * source of truth, so this runs on every start. Invalid content is refused.
 */
export async function syncEnglishQuizContent(
	topics: readonly TopicRecord[] = ALL_TOPICS,
) {
	const problems = findContentProblems(topics)
	if (problems.length > 0) throw new InvalidContentError(problems)
	const counts = await englishQuizRepository.replaceContent(topics)
	logger.info(counts, 'english quiz content synced')
	return counts
}

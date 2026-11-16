import type { RuleSection, Sentence, Topic, TopicLevel } from '../model/types'

/** [prompt in Ukrainian, English answer, optional traps]. */
export type SentenceInput = readonly [
	prompt: string,
	answer: string,
	traps?: Sentence['traps'],
]

export interface TopicInput {
	id: string
	title: string
	subtitle: string
	/**
	 * Full rule sections, or a one-line explanation that becomes a single
	 * "usage" section illustrated with the topic's own sentences.
	 */
	rule: string | readonly RuleSection[]
	sentences: readonly SentenceInput[]
}

/**
 * Authoring helper for the hard-coded topics: turns compact tuples into the
 * same `Topic` shape the API will return, so nothing else depends on how the
 * data is written down.
 */
export function defineTopics(
	level: TopicLevel,
	inputs: readonly TopicInput[],
): Topic[] {
	return inputs.map(({ rule, sentences, ...topic }) => {
		const parsed = sentences.map(
			([prompt, answer, traps], index): Sentence => ({
				id: `${topic.id}-${index + 1}`,
				prompt,
				answer,
				...(traps ? { traps } : {}),
			}),
		)
		return {
			...topic,
			level,
			sentences: parsed,
			rule:
				typeof rule === 'string'
					? [
							{
								kind: 'usage',
								explanation: rule,
								examples: parsed.map((sentence) => ({
									text: sentence.answer,
									translation: sentence.prompt,
								})),
							},
						]
					: rule,
		}
	})
}

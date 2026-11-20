import type { RuleSection, Sentence, Topic, TopicLevel } from 'contracts'

/** How many sentences illustrate a one-line rule. */
export const SHORTHAND_RULE_EXAMPLES = 3

export interface TopicInput {
	id: string
	level: TopicLevel
	title: string
	subtitle: string
	/**
	 * Full rule sections, or a one-line explanation that becomes a single
	 * "usage" section illustrated with the topic's first sentences.
	 */
	rule: string | readonly RuleSection[]
	sentences: readonly Sentence[]
}

/** A topic with its sentence bank, as one database row set would hold it. */
export interface TopicRecord extends Topic {
	sentences: readonly Sentence[]
}

/**
 * Authoring helper for the topic files (the database seed):
 * expands the rule shorthand so everything else sees the API's shape.
 */
export function defineTopic({ rule, ...topic }: TopicInput): TopicRecord {
	return {
		...topic,
		rule:
			typeof rule === 'string'
				? [
						{
							kind: 'usage',
							explanation: rule,
							examples: topic.sentences
								.slice(0, SHORTHAND_RULE_EXAMPLES)
								.map((sentence) => ({
									text: sentence.answer,
									translation: sentence.prompt,
								})),
						},
					]
				: rule,
	}
}

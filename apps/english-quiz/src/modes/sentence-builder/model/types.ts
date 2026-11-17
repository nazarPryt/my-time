/**
 * Domain types of the sentence builder, shaped like the future API responses
 * (plain JSON, no functions). When topics move to the database, only
 * data/topic-source.ts changes.
 */

export const TOPIC_LEVELS = ['beginner', 'intermediate', 'advanced'] as const
export type TopicLevel = (typeof TOPIC_LEVELS)[number]

/** What the topic list needs: no sentences, no rule. */
export interface TopicSummary {
	id: string
	level: TopicLevel
	/** English topic name, e.g. "Present Simple". */
	title: string
	/** The topic name in the learner's language (Ukrainian). */
	subtitle: string
}

/** A topic's page: the rule, but not its sentence bank (that can be large). */
export interface Topic extends TopicSummary {
	rule: readonly RuleSection[]
}

export const SENTENCE_FORMS = ['affirmative', 'question', 'negative'] as const
export type SentenceForm = (typeof SENTENCE_FORMS)[number]

/** One sentence the learner assembles word by word. */
export interface Sentence {
	/** Permanent: progress history is keyed by it, so never reuse or renumber. */
	id: string
	form: SentenceForm
	/** The sentence in the learner's language — what they translate. */
	prompt: string
	/** The English translation, e.g. "How do you play?". */
	answer: string
	/**
	 * Hand-picked wrong forms offered as tiles for a given answer word, e.g.
	 * `{ play: ['played', 'plays'] }`. Matched case-insensitively. Other tiles
	 * are filled in from the shared word pool.
	 */
	traps?: Readonly<Record<string, readonly string[]>>
}

/** The sentences picked from a topic's bank for one attempt. */
export interface Round {
	topicId: string
	sentences: readonly Sentence[]
}

export const RULE_SECTION_KINDS = [...SENTENCE_FORMS, 'usage'] as const
export type RuleSectionKind = (typeof RULE_SECTION_KINDS)[number]

export interface RuleExample {
	text: string
	translation: string
}

export interface RuleSection {
	kind: RuleSectionKind
	explanation: string
	examples: readonly RuleExample[]
}

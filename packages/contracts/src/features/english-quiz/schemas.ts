import { z } from 'zod'

/** Paths relative to the API prefix; the remote calls them through apiFetch. */
export const ENGLISH_QUIZ_ROUTES = {
	prefix: '/english-quiz',
	topics: '/topics',
	topicById: '/topics/:id',
	round: '/topics/:id/round',
} as const

/** Sentences per attempt; a topic's bank is usually much larger. */
export const ROUND_SIZE = 10
export const MAX_ROUND_SIZE = 30

export const TOPIC_LEVELS = ['beginner', 'intermediate', 'advanced'] as const
export const TopicLevelSchema = z.enum(TOPIC_LEVELS)
export type TopicLevel = z.infer<typeof TopicLevelSchema>

export const SENTENCE_FORMS = ['affirmative', 'question', 'negative'] as const
export const SentenceFormSchema = z.enum(SENTENCE_FORMS)
export type SentenceForm = z.infer<typeof SentenceFormSchema>

export const RULE_SECTION_KINDS = [...SENTENCE_FORMS, 'usage'] as const
export const RuleSectionKindSchema = z.enum(RULE_SECTION_KINDS)
export type RuleSectionKind = z.infer<typeof RuleSectionKindSchema>

export const RuleExampleSchema = z.object({
	text: z.string(),
	translation: z.string(),
})
export type RuleExample = z.infer<typeof RuleExampleSchema>

export const RuleSectionSchema = z.object({
	kind: RuleSectionKindSchema,
	explanation: z.string(),
	examples: z.array(RuleExampleSchema).readonly(),
})
export type RuleSection = z.infer<typeof RuleSectionSchema>

/** One sentence the learner assembles word by word. */
export const SentenceSchema = z.object({
	/** Permanent: progress history is keyed by it, so never reuse or renumber. */
	id: z.string(),
	form: SentenceFormSchema,
	/** The sentence in the learner's language — what they translate. */
	prompt: z.string(),
	/** The English translation, shown as the model answer. */
	answer: z.string(),
	/**
	 * Other correct translations as patterns, expanded by expandVariants():
	 * `{a|b}` is a choice, an empty option makes words optional. Contractions
	 * are accepted automatically.
	 */
	accept: z.array(z.string()).readonly().optional(),
	/** Hand-picked wrong forms offered as tiles for an answer word. */
	traps: z
		.record(z.string(), z.array(z.string()).readonly())
		.readonly()
		.optional(),
})
export type Sentence = z.infer<typeof SentenceSchema>

/** What the topic list needs: no sentences, no rule. */
export const TopicSummarySchema = z.object({
	id: z.string(),
	level: TopicLevelSchema,
	/** English topic name, e.g. "Present Simple". */
	title: z.string(),
	/** The topic name in the learner's language (Ukrainian). */
	subtitle: z.string(),
})
export type TopicSummary = z.infer<typeof TopicSummarySchema>

/** A topic's page: the rule, but not its sentence bank. */
export const TopicSchema = TopicSummarySchema.extend({
	rule: z.array(RuleSectionSchema).readonly(),
})
export type Topic = z.infer<typeof TopicSchema>

/** The sentences picked from a topic's bank for one attempt. */
export const RoundSchema = z.object({
	topicId: z.string(),
	sentences: z.array(SentenceSchema).readonly(),
})
export type Round = z.infer<typeof RoundSchema>

export const TopicListResponseSchema = z.array(TopicSummarySchema)

export const RoundQuerySchema = z.object({
	/** Defaults to ROUND_SIZE. */
	size: z.coerce.number().int().min(1).max(MAX_ROUND_SIZE).optional(),
})

export const ENGLISH_QUIZ_ERRORS = {
	TOPIC_NOT_FOUND: {
		code: 'TOPIC_NOT_FOUND',
		message: 'Topic not found',
	},
} as const

export const EnglishQuizErrorSchema = z.object({
	code: z.literal(ENGLISH_QUIZ_ERRORS.TOPIC_NOT_FOUND.code),
	message: z.literal(ENGLISH_QUIZ_ERRORS.TOPIC_NOT_FOUND.message),
})

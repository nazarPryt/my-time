import type {
	RuleSection,
	Sentence,
	SentenceForm,
	TopicLevel,
} from '@my-time/contracts'
import { index, integer, jsonb, pgTable, text } from 'drizzle-orm/pg-core'

// Content tables: synced from the topic files on startup, never edited by hand.
export const englishQuizTopics = pgTable('english_quiz_topics', {
	id: text('id').primaryKey(),
	level: text('level').$type<TopicLevel>().notNull(),
	title: text('title').notNull(),
	subtitle: text('subtitle').notNull(),
	rule: jsonb('rule').$type<readonly RuleSection[]>().notNull(),
	position: integer('position').notNull(),
})

export const englishQuizSentences = pgTable(
	'english_quiz_sentences',
	{
		id: text('id').primaryKey(),
		topicId: text('topic_id')
			.notNull()
			.references(() => englishQuizTopics.id, { onDelete: 'cascade' }),
		form: text('form').$type<SentenceForm>().notNull(),
		prompt: text('prompt').notNull(),
		answer: text('answer').notNull(),
		accept: jsonb('accept').$type<Sentence['accept']>(),
		traps: jsonb('traps').$type<Sentence['traps']>(),
		position: integer('position').notNull(),
	},
	(table) => [index('idx_english_quiz_sentences_topic_id').on(table.topicId)],
)

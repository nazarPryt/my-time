import { db } from '@db'
import { englishQuizSentences, englishQuizTopics } from '@db/schema'
import type { Sentence, Topic, TopicSummary } from 'contracts'
import { asc, eq, notInArray, sql } from 'drizzle-orm'
import type { TopicRecord } from './content/define-topic'

// Keeps parallel API starts from syncing the content at the same time.
const SYNC_LOCK_ID = 4_210_771_563
// 8 columns per sentence stays far below Postgres's 65,535 parameters.
const SENTENCE_CHUNK = 1000

const summaryColumns = {
	id: englishQuizTopics.id,
	level: englishQuizTopics.level,
	title: englishQuizTopics.title,
	subtitle: englishQuizTopics.subtitle,
}

function withoutNulls({
	accept,
	traps,
	...sentence
}: typeof englishQuizSentences.$inferSelect): Sentence {
	return {
		id: sentence.id,
		form: sentence.form,
		prompt: sentence.prompt,
		answer: sentence.answer,
		...(accept ? { accept } : {}),
		...(traps ? { traps } : {}),
	}
}

export const englishQuizRepository = {
	listTopics: (): Promise<TopicSummary[]> =>
		db
			.select(summaryColumns)
			.from(englishQuizTopics)
			.orderBy(asc(englishQuizTopics.position)),

	findTopic: async (id: string): Promise<Topic | null> => {
		const [row] = await db
			.select({ ...summaryColumns, rule: englishQuizTopics.rule })
			.from(englishQuizTopics)
			.where(eq(englishQuizTopics.id, id))
		return row ?? null
	},

	/** The topic's whole bank; empty for an unknown topic. */
	listSentences: async (topicId: string): Promise<Sentence[]> => {
		const rows = await db
			.select()
			.from(englishQuizSentences)
			.where(eq(englishQuizSentences.topicId, topicId))
			.orderBy(asc(englishQuizSentences.position))
		return rows.map(withoutNulls)
	},

	/** Makes the tables hold exactly `topics`, in one transaction. */
	replaceContent: (topics: readonly TopicRecord[]) =>
		db.transaction(async (tx) => {
			await tx.execute(sql`select pg_advisory_xact_lock(${SYNC_LOCK_ID})`)
			const topicIds = topics.map((topic) => topic.id)
			const sentences = topics.flatMap((topic) =>
				topic.sentences.map((sentence, position) => ({
					id: sentence.id,
					topicId: topic.id,
					form: sentence.form,
					prompt: sentence.prompt,
					answer: sentence.answer,
					accept: sentence.accept ?? null,
					traps: sentence.traps ?? null,
					position,
				})),
			)

			await tx
				.delete(englishQuizTopics)
				.where(notInArray(englishQuizTopics.id, topicIds))
			await tx.delete(englishQuizSentences).where(
				notInArray(
					englishQuizSentences.id,
					sentences.map((sentence) => sentence.id),
				),
			)
			if (topics.length > 0) {
				await tx
					.insert(englishQuizTopics)
					.values(
						topics.map(({ id, level, title, subtitle, rule }, position) => ({
							id,
							level,
							title,
							subtitle,
							rule,
							position,
						})),
					)
					.onConflictDoUpdate({
						target: englishQuizTopics.id,
						set: {
							level: sql`excluded.level`,
							title: sql`excluded.title`,
							subtitle: sql`excluded.subtitle`,
							rule: sql`excluded.rule`,
							position: sql`excluded.position`,
						},
					})
			}
			for (let start = 0; start < sentences.length; start += SENTENCE_CHUNK) {
				await tx
					.insert(englishQuizSentences)
					.values(sentences.slice(start, start + SENTENCE_CHUNK))
					.onConflictDoUpdate({
						target: englishQuizSentences.id,
						set: {
							topicId: sql`excluded.topic_id`,
							form: sql`excluded.form`,
							prompt: sql`excluded.prompt`,
							answer: sql`excluded.answer`,
							accept: sql`excluded.accept`,
							traps: sql`excluded.traps`,
							position: sql`excluded.position`,
						},
					})
			}
			return { topics: topics.length, sentences: sentences.length }
		}),
}

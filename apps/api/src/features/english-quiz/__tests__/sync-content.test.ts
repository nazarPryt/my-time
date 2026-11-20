import { beforeAll, describe, expect, it } from 'bun:test'
import { db } from '@db'
import { englishQuizSentences, englishQuizTopics } from '@db/schema'
import { runMigrations } from '@/test/setup'
import { ALL_TOPICS } from '../content/index'
import {
	InvalidContentError,
	syncEnglishQuizContent,
} from '../content/sync-content'
import { englishQuizRepository } from '../repository'
import { FIXTURE_TOPICS } from './fixtures'

const [FIRST, SECOND] = FIXTURE_TOPICS

beforeAll(async () => {
	await runMigrations()
})

describe('syncEnglishQuizContent', () => {
	it('seeds every topic file', async () => {
		const counts = await syncEnglishQuizContent()
		const sentenceTotal = ALL_TOPICS.reduce(
			(total, topic) => total + topic.sentences.length,
			0,
		)
		expect(counts).toEqual({
			topics: ALL_TOPICS.length,
			sentences: sentenceTotal,
		})
		expect(await db.$count(englishQuizTopics)).toBe(ALL_TOPICS.length)
		expect(await db.$count(englishQuizSentences)).toBe(sentenceTotal)
		const listed = await englishQuizRepository.listTopics()
		expect(listed.map((topic) => topic.id)).toEqual(
			ALL_TOPICS.map((topic) => topic.id),
		)
	})

	it('removes topics and sentences that left the files', async () => {
		await syncEnglishQuizContent(FIXTURE_TOPICS)
		const shorter = { ...FIRST, sentences: FIRST.sentences.slice(0, 5) }
		await syncEnglishQuizContent([shorter])

		expect(await englishQuizRepository.listTopics()).toHaveLength(1)
		expect(await englishQuizRepository.findTopic(SECOND.id)).toBeNull()
		const bank = await englishQuizRepository.listSentences(FIRST.id)
		expect(bank).toEqual(shorter.sentences)
	})

	it('refuses invalid content and leaves the tables untouched', async () => {
		await syncEnglishQuizContent(FIXTURE_TOPICS)
		await expect(syncEnglishQuizContent([FIRST, FIRST])).rejects.toBeInstanceOf(
			InvalidContentError,
		)
		expect(await englishQuizRepository.listTopics()).toHaveLength(2)
	})
})

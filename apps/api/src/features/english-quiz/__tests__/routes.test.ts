import { beforeAll, describe, expect, it } from 'bun:test'
import { treaty } from '@elysiajs/eden'
import {
	AuthResponseSchema,
	ENGLISH_QUIZ_ERRORS,
	type RegisterRequest,
	ROUND_SIZE,
	RoundSchema,
	TopicListResponseSchema,
	TopicSchema,
} from '@my-time/contracts'
import { app } from '@/app'
import { cleanDatabase, runMigrations } from '@/test/setup'
import { syncEnglishQuizContent } from '../content/sync-content'
import { FIXTURE_TOPICS } from './fixtures'

const api = treaty(app, { parseDate: false }).api.v1
const quiz = api['english-quiz']

const USER: RegisterRequest = {
	email: 'english-quiz@example.com',
	name: 'Quiz User',
	password: 'password123',
}

const [LARGE, SMALL] = FIXTURE_TOPICS
let headers: { authorization: string }

beforeAll(async () => {
	await runMigrations()
	await cleanDatabase()
	await syncEnglishQuizContent(FIXTURE_TOPICS)
	const { data } = await api.auth.register.post(USER)
	const auth = AuthResponseSchema.parse(data)
	headers = { authorization: `Bearer ${auth.tokens.accessToken}` }
})

describe('GET /english-quiz/topics', () => {
	it('returns 401 when unauthenticated', async () => {
		const { status } = await quiz.topics.get()
		expect(status).toBe(401)
	})

	it('lists topic summaries in display order', async () => {
		const { data, status } = await quiz.topics.get({ headers })
		expect(status).toBe(200)
		expect(TopicListResponseSchema.parse(data)).toEqual(
			FIXTURE_TOPICS.map(({ id, level, title, subtitle }) => ({
				id,
				level,
				title,
				subtitle,
			})),
		)
	})
})

describe('GET /english-quiz/topics/:id', () => {
	it('returns the rule without the sentence bank', async () => {
		const { data, status } = await quiz
			.topics({ id: LARGE.id })
			.get({ headers })
		expect(status).toBe(200)
		expect(TopicSchema.parse(data).rule).toEqual(LARGE.rule)
		expect(data).not.toHaveProperty('sentences')
	})

	it('returns 404 for an unknown topic', async () => {
		const { error } = await quiz.topics({ id: 'nope' }).get({ headers })
		expect(error?.status).toBe(404)
		expect(error?.value).toEqual(ENGLISH_QUIZ_ERRORS.TOPIC_NOT_FOUND)
	})
})

describe('GET /english-quiz/topics/:id/round', () => {
	it('returns 401 when unauthenticated', async () => {
		const { status } = await quiz.topics({ id: LARGE.id }).round.get()
		expect(status).toBe(401)
	})

	it('picks a default-sized round from the topic bank', async () => {
		const { data, status } = await quiz
			.topics({ id: LARGE.id })
			.round.get({ headers })
		expect(status).toBe(200)
		const round = RoundSchema.parse(data)
		expect(round.topicId).toBe(LARGE.id)
		expect(round.sentences).toHaveLength(ROUND_SIZE)
		for (const sentence of round.sentences) {
			expect(LARGE.sentences).toContainEqual(sentence)
		}
	})

	it('honours the size and returns the whole bank when it is smaller', async () => {
		const sized = await quiz
			.topics({ id: LARGE.id })
			.round.get({ headers, query: { size: 4 } })
		expect(RoundSchema.parse(sized.data).sentences).toHaveLength(4)

		const small = await quiz
			.topics({ id: SMALL.id })
			.round.get({ headers, query: { size: 10 } })
		expect(RoundSchema.parse(small.data).sentences).toHaveLength(
			SMALL.sentences.length,
		)
	})

	it('rejects a size out of range', async () => {
		const { status } = await quiz
			.topics({ id: LARGE.id })
			.round.get({ headers, query: { size: 0 } })
		expect(status).toBe(422)
	})

	it('returns 404 for an unknown topic', async () => {
		const { error } = await quiz.topics({ id: 'nope' }).round.get({ headers })
		expect(error?.status).toBe(404)
	})
})

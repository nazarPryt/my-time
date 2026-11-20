import {
	API_PREFIX,
	ENGLISH_QUIZ_ERRORS,
	ENGLISH_QUIZ_ROUTES,
	type Round,
	type Topic,
	type TopicSummary,
} from '@my-time/contracts'
import type { Page } from '@playwright/test'

/** Every request the browser makes for the remote's files. */
export const REMOTE_ASSETS = '**/remotes/english-quiz/**'

/** Simulates the remote's server being down; undo with restoreRemote. */
export async function mockRemoteOutage(page: Page) {
	await page.route(REMOTE_ASSETS, (route) => route.fulfill({ status: 503 }))
}

export async function restoreRemote(page: Page) {
	await page.unroute(REMOTE_ASSETS)
}

const QUIZ_API = `${API_PREFIX}${ENGLISH_QUIZ_ROUTES.prefix}${ENGLISH_QUIZ_ROUTES.topics}`

/** Every sentence builder API request: the list, a topic and its round. */
export const API_ENGLISH_QUIZ_TOPICS = `**${QUIZ_API}**`

export const MOCK_TOPIC: Topic = {
	id: 'present-simple',
	level: 'beginner',
	title: 'Present Simple',
	subtitle: 'Теперішній простий час',
	rule: [
		{
			kind: 'affirmative',
			explanation: 'I/you/we/they + verb; he/she/it + verb-s.',
			examples: [{ text: 'I play tennis.', translation: 'Я граю в теніс.' }],
		},
		{
			kind: 'question',
			explanation: 'Do/Does + subject + verb?',
			examples: [
				{ text: 'Do you play tennis?', translation: 'Ти граєш у теніс?' },
			],
		},
	],
}

const { rule: _rule, ...MOCK_SUMMARY } = MOCK_TOPIC

export const MOCK_TOPICS: TopicSummary[] = [
	MOCK_SUMMARY,
	{
		id: 'past-simple',
		level: 'intermediate',
		title: 'Past Simple',
		subtitle: 'Минулий простий час',
	},
]

export const MOCK_ROUND: Round = {
	topicId: MOCK_TOPIC.id,
	sentences: [
		{
			id: 'present-simple-1',
			form: 'affirmative',
			prompt: 'Я граю в теніс.',
			answer: 'I play tennis.',
			traps: { play: ['plays'] },
		},
		{
			id: 'present-simple-2',
			form: 'question',
			prompt: 'Ти граєш у теніс?',
			answer: 'Do you play tennis?',
		},
	],
}

/** Serves the fixtures above for every topic id, like a one-topic API. */
export async function mockEnglishQuizTopics(page: Page) {
	await page.route(API_ENGLISH_QUIZ_TOPICS, (route) => {
		const { pathname } = new URL(route.request().url())
		const body = pathname.endsWith(QUIZ_API)
			? MOCK_TOPICS
			: pathname.endsWith('/round')
				? MOCK_ROUND
				: pathname.endsWith(`/${MOCK_TOPIC.id}`)
					? MOCK_TOPIC
					: null
		return route.fulfill({
			status: body ? 200 : 404,
			contentType: 'application/json',
			body: JSON.stringify(body ?? ENGLISH_QUIZ_ERRORS.TOPIC_NOT_FOUND),
		})
	})
}

import type { RemoteApiFetch } from '@my-time/mfe-contracts'
import {
	ENGLISH_QUIZ_ROUTES,
	type Round,
	type Topic,
	type TopicSummary,
} from 'contracts/english-quiz'

// Standalone dev only: a tiny stand-in for the API, so the remote runs
// without the host. Real content lives in apps/api.
const TOPIC: Topic = {
	id: 'present-simple',
	level: 'beginner',
	title: 'Present Simple',
	subtitle: 'Теперішній простий час',
	rule: [
		{
			kind: 'usage',
			explanation: 'Звички та факти: I play, she plays.',
			examples: [{ text: 'I play tennis.', translation: 'Я граю в теніс.' }],
		},
	],
}

const ROUND: Round = {
	topicId: TOPIC.id,
	sentences: [
		{
			id: 'dev-1',
			form: 'affirmative',
			prompt: 'Я граю в теніс.',
			answer: 'I play tennis.',
			traps: { play: ['plays'] },
		},
		{
			id: 'dev-2',
			form: 'question',
			prompt: 'Вона грає в теніс?',
			answer: 'Does she play tennis?',
		},
		{
			id: 'dev-3',
			form: 'negative',
			prompt: 'Ми не граємо в теніс.',
			answer: "We don't play tennis.",
		},
	],
}

const { id, level, title, subtitle } = TOPIC
const SUMMARIES: TopicSummary[] = [{ id, level, title, subtitle }]
const base = `${ENGLISH_QUIZ_ROUTES.prefix}${ENGLISH_QUIZ_ROUTES.topics}`

export const devApiFetch: RemoteApiFetch = async (path) => {
	const url = new URL(path, 'http://dev')
	const json = (body: unknown, status = 200) =>
		new Response(JSON.stringify(body), { status })
	if (url.pathname === base) return json(SUMMARIES)
	if (url.pathname === `${base}/${TOPIC.id}`) return json(TOPIC)
	if (url.pathname === `${base}/${TOPIC.id}/round`) return json(ROUND)
	return json({ code: 'TOPIC_NOT_FOUND', message: 'Topic not found' }, 404)
}

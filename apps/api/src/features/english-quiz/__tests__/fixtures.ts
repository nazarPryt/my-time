import type { SentenceForm } from 'contracts'
import { defineTopic, type TopicRecord } from '../content/define-topic'

const FORMS: SentenceForm[] = ['affirmative', 'question', 'negative']

function topicWithSentences(id: string, count: number): TopicRecord {
	return defineTopic({
		id,
		level: 'beginner',
		title: `Title ${id}`,
		subtitle: `Назва ${id}`,
		rule: 'Explanation',
		sentences: Array.from({ length: count }, (_, index) => ({
			id: `${id}-${index + 1}`,
			form: FORMS[index % FORMS.length] ?? 'affirmative',
			prompt: `Речення ${index + 1}`,
			answer: `Sentence number ${index + 1}.`,
		})),
	})
}

/** Small topics so route tests don't depend on the real content. */
export const FIXTURE_TOPICS = [
	topicWithSentences('fixture-a', 15),
	topicWithSentences('fixture-b', 3),
] as const

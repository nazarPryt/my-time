import { defineTopic } from '../../define-topic'

export const verbsWithPrepositions = defineTopic({
	id: 'verbs-with-prepositions',
	level: 'intermediate',
	title: 'Verbs with prepositions',
	subtitle: 'Дієслова з прийменниками',
	rule: 'Деякі дієслова завжди вживаються з певним прийменником: listen to, wait for.',
	sentences: [
		{
			id: 'verbs-with-prepositions-1',
			form: 'affirmative',
			prompt: 'Я слухаю музику.',
			answer: 'I am listening to music.',
			traps: {
				to: ['at', 'for', 'on'],
			},
		},
		{
			id: 'verbs-with-prepositions-2',
			form: 'affirmative',
			prompt: 'Ми чекаємо на автобус.',
			answer: 'We are waiting for the bus.',
			traps: {
				for: ['to', 'at', 'on'],
			},
		},
	],
})

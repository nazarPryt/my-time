import { defineTopic } from '../../define-topic'

export const tensesWithFutureMeaning = defineTopic({
	id: 'tenses-with-future-meaning',
	level: 'advanced',
	title: 'Tenses with future meaning',
	subtitle: 'Часи для вираження майбутнього',
	rule: 'Майбутнє виражають will, be going to, Present Continuous і Present Simple (розклади).',
	sentences: [
		{
			id: 'tenses-with-future-meaning-1',
			form: 'affirmative',
			prompt: 'Я подзвоню тобі пізніше.',
			answer: 'I will call you later.',
		},
		{
			id: 'tenses-with-future-meaning-2',
			form: 'affirmative',
			prompt: 'Ми збираємося купити будинок.',
			answer: 'We are going to buy a house.',
		},
	],
})

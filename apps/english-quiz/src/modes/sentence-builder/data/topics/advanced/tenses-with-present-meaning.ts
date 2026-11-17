import { defineTopic } from '../../define-topic'

export const tensesWithPresentMeaning = defineTopic({
	id: 'tenses-with-present-meaning',
	level: 'advanced',
	title: 'Tenses with Present meaning',
	subtitle: 'Часи для вираження теперішнього',
	rule: 'Теперішнє виражають Present Simple, Continuous, Perfect і Perfect Continuous.',
	sentences: [
		{
			id: 'tenses-with-present-meaning-1',
			form: 'affirmative',
			prompt: "Я живу тут уже п'ять років.",
			answer: 'I have lived here for five years.',
		},
		{
			id: 'tenses-with-present-meaning-2',
			form: 'affirmative',
			prompt: 'Вона зараз розмовляє по телефону.',
			answer: 'She is talking on the phone now.',
		},
	],
})

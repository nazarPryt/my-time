import { defineTopic } from '../../define-topic'

export const tensesWithPastMeaning = defineTopic({
	id: 'tenses-with-past-meaning',
	level: 'advanced',
	title: 'Tenses with Past meaning',
	subtitle: 'Часи для вираження минулого',
	rule: 'Минуле виражають Past Simple, Continuous, Perfect і Perfect Continuous.',
	sentences: [
		{
			id: 'tenses-with-past-meaning-1',
			form: 'affirmative',
			prompt: 'Учора я ходив у театр.',
			answer: 'Yesterday I went to the theatre.',
			traps: {
				went: ['go', 'gone', 'goed'],
			},
		},
		{
			id: 'tenses-with-past-meaning-2',
			form: 'affirmative',
			prompt: 'Я спав, коли ти подзвонив.',
			answer: 'I was sleeping when you called.',
		},
	],
})

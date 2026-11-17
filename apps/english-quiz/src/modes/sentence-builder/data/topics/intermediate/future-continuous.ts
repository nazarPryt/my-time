import { defineTopic } from '../../define-topic'

export const futureContinuous = defineTopic({
	id: 'future-continuous',
	level: 'intermediate',
	title: 'Future Continuous',
	subtitle: 'Майбутній тривалий час',
	rule: 'will be + -ing — дія триватиме в певний момент у майбутньому.',
	sentences: [
		{
			id: 'future-continuous-1',
			form: 'affirmative',
			prompt: 'Завтра о восьмій я працюватиму.',
			answer: 'I will be working at eight tomorrow.',
		},
		{
			id: 'future-continuous-2',
			form: 'question',
			prompt: 'Ти користуватимешся машиною?',
			answer: 'Will you be using the car?',
			traps: {
				using: ['use', 'used', 'uses'],
			},
		},
	],
})

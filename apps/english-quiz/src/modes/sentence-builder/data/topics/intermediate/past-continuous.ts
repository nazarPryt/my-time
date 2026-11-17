import { defineTopic } from '../../define-topic'

export const pastContinuous = defineTopic({
	id: 'past-continuous',
	level: 'intermediate',
	title: 'Past Continuous',
	subtitle: 'Минулий тривалий час',
	rule: 'was/were + -ing — дія тривала в певний момент у минулому.',
	sentences: [
		{
			id: 'past-continuous-1',
			form: 'affirmative',
			prompt: 'О десятій я спав.',
			answer: 'I was sleeping at ten.',
			traps: {
				was: ['were', 'am', 'is'],
			},
		},
		{
			id: 'past-continuous-2',
			form: 'question',
			prompt: 'Що ви робили вчора ввечері?',
			answer: 'What were you doing last night?',
			traps: {
				were: ['was', 'did', 'are'],
			},
		},
	],
})

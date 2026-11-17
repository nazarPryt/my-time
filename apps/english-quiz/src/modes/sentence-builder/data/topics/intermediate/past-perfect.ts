import { defineTopic } from '../../define-topic'

export const pastPerfect = defineTopic({
	id: 'past-perfect',
	level: 'intermediate',
	title: 'Past Perfect',
	subtitle: 'Минулий доконаний час',
	rule: 'had + третя форма — дія завершилася раніше за іншу дію в минулому.',
	sentences: [
		{
			id: 'past-perfect-1',
			form: 'affirmative',
			prompt: 'Потяг уже поїхав.',
			answer: 'The train had already left.',
			traps: {
				left: ['leaved', 'leave', 'leaves'],
			},
		},
		{
			id: 'past-perfect-2',
			form: 'affirmative',
			prompt: 'Вона пішла ще до того, як я прийшов.',
			answer: 'She had left before I came.',
			traps: {
				came: ['come', 'comes', 'coming'],
			},
		},
	],
})

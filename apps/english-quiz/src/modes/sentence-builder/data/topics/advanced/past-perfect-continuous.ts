import { defineTopic } from '../../define-topic'

export const pastPerfectContinuous = defineTopic({
	id: 'past-perfect-continuous',
	level: 'advanced',
	title: 'Past Perfect Continuous',
	subtitle: 'Минулий доконано-тривалий час',
	rule: 'had been + -ing — дія тривала до певного моменту в минулому.',
	sentences: [
		{
			id: 'past-perfect-continuous-1',
			form: 'affirmative',
			prompt: 'Коли він прийшов, я чекав уже дві години.',
			answer: 'I had been waiting for two hours when he came.',
		},
		{
			id: 'past-perfect-continuous-2',
			form: 'affirmative',
			prompt: 'Вона була втомлена, бо працювала весь день.',
			answer: 'She was tired because she had been working all day.',
		},
	],
})

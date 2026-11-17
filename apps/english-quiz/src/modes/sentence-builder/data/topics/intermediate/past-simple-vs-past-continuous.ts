import { defineTopic } from '../../define-topic'

export const pastSimpleVsPastContinuous = defineTopic({
	id: 'past-simple-vs-past-continuous',
	level: 'intermediate',
	title: 'Past Simple vs Past Continuous',
	subtitle: 'Минулий простий і минулий тривалий час',
	rule: 'Past Continuous — тривала дія; Past Simple — коротка дія, що її перервала.',
	sentences: [
		{
			id: 'past-simple-vs-past-continuous-1',
			form: 'affirmative',
			prompt: 'Я читав, коли він подзвонив.',
			answer: 'I was reading when he called.',
		},
		{
			id: 'past-simple-vs-past-continuous-2',
			form: 'affirmative',
			prompt: 'Ми вечеряли, коли згасло світло.',
			answer: 'We were having dinner when the lights went out.',
		},
	],
})

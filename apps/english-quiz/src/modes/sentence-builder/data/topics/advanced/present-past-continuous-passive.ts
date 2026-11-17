import { defineTopic } from '../../define-topic'

export const presentPastContinuousPassive = defineTopic({
	id: 'present-past-continuous-passive',
	level: 'advanced',
	title: 'Present/Past Continuous Passive',
	subtitle: 'Теперішній і минулий тривалий час (пасив)',
	rule: 'am/is/are/was/were being + третя форма — дію над предметом виконують зараз або виконували тоді.',
	sentences: [
		{
			id: 'present-past-continuous-passive-1',
			form: 'affirmative',
			prompt: 'Мою машину зараз ремонтують.',
			answer: 'My car is being repaired now.',
			traps: {
				being: ['been', 'be', 'is'],
			},
		},
		{
			id: 'present-past-continuous-passive-2',
			form: 'affirmative',
			prompt: 'Коли ми приїхали, будинок фарбували.',
			answer: 'The house was being painted when we arrived.',
		},
	],
})

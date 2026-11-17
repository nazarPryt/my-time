import { defineTopic } from '../../define-topic'

export const presentContinuous = defineTopic({
	id: 'present-continuous',
	level: 'beginner',
	title: 'Present Continuous',
	subtitle: 'Теперішній тривалий час',
	rule: 'am/is/are + -ing — дія відбувається зараз або в цей період.',
	sentences: [
		{
			id: 'present-continuous-1',
			form: 'question',
			prompt: 'Що ти робиш?',
			answer: 'What are you doing?',
			traps: {
				doing: ['do', 'does', 'done'],
			},
		},
		{
			id: 'present-continuous-2',
			form: 'negative',
			prompt: 'Вони зараз не працюють.',
			answer: "They aren't working now.",
			traps: {
				"aren't": ["isn't", "don't", "doesn't"],
			},
		},
	],
})

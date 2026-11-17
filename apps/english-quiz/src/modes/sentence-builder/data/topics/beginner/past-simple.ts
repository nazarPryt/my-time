import { defineTopic } from '../../define-topic'

export const pastSimple = defineTopic({
	id: 'past-simple',
	level: 'beginner',
	title: 'Past Simple',
	subtitle: 'Минулий простий час',
	rule: 'Past Simple — завершена дія в минулому: worked, went. Питання й заперечення — з did.',
	sentences: [
		{
			id: 'past-simple-1',
			form: 'affirmative',
			prompt: 'Я бачив його вчора.',
			answer: 'I saw him yesterday.',
			traps: {
				saw: ['see', 'seen', 'seed'],
			},
		},
		{
			id: 'past-simple-2',
			form: 'negative',
			prompt: 'Ми не ходили в кіно.',
			answer: "We didn't go to the cinema.",
			traps: {
				go: ['went', 'gone', 'goes'],
			},
		},
	],
})

import { defineTopic } from '../../define-topic'

export const presentPerfectContinuous = defineTopic({
	id: 'present-perfect-continuous',
	level: 'intermediate',
	title: 'Present Perfect Continuous',
	subtitle: 'Теперішній доконано-тривалий час',
	rule: 'have/has been + -ing — дія почалася в минулому й триває досі.',
	sentences: [
		{
			id: 'present-perfect-continuous-1',
			form: 'affirmative',
			prompt: 'Я чекаю вже годину.',
			answer: 'I have been waiting for an hour.',
			traps: {
				waiting: ['wait', 'waited', 'waits'],
			},
		},
		{
			id: 'present-perfect-continuous-2',
			form: 'affirmative',
			prompt: 'Вона вчить англійську вже два роки.',
			answer: 'She has been learning English for two years.',
			traps: {
				has: ['have', 'is', 'was'],
			},
		},
	],
})

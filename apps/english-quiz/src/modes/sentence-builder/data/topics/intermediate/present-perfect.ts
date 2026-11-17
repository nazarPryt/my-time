import { defineTopic } from '../../define-topic'

export const presentPerfect = defineTopic({
	id: 'present-perfect',
	level: 'intermediate',
	title: 'Present Perfect',
	subtitle: 'Теперішній доконаний час',
	rule: 'have/has + третя форма дієслова — результат дії важливий зараз.',
	sentences: [
		{
			id: 'present-perfect-1',
			form: 'affirmative',
			prompt: 'Я вже поїв.',
			answer: 'I have already eaten.',
			traps: {
				eaten: ['ate', 'eat', 'eated'],
			},
		},
		{
			id: 'present-perfect-2',
			form: 'question',
			prompt: 'Ти коли-небудь був у Лондоні?',
			answer: 'Have you ever been to London?',
			traps: {
				been: ['was', 'be', 'gone'],
			},
		},
	],
})

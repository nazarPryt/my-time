import { defineTopic } from '../../define-topic'

export const toBeGoingTo = defineTopic({
	id: 'to-be-going-to',
	level: 'beginner',
	title: 'To be going to',
	subtitle: 'Конструкція to be going to',
	rule: 'am/is/are going to + дієслово — заплановані дії та очевидні прогнози.',
	sentences: [
		{
			id: 'to-be-going-to-1',
			form: 'affirmative',
			prompt: 'Я збираюся вчити англійську.',
			answer: 'I am going to learn English.',
			traps: {
				going: ['go', 'gone', 'went'],
			},
		},
		{
			id: 'to-be-going-to-2',
			form: 'affirmative',
			prompt: 'Збирається на дощ.',
			answer: 'It is going to rain.',
		},
	],
})

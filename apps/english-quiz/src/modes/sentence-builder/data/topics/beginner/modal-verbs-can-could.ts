import { defineTopic } from '../../define-topic'

export const modalVerbsCanCould = defineTopic({
	id: 'modal-verbs-can-could',
	level: 'beginner',
	title: 'Modal verbs (Can/Could)',
	subtitle: 'Модальні дієслова can/could',
	rule: 'can — можу, вмію зараз; could — міг у минулому або ввічливе прохання.',
	sentences: [
		{
			id: 'modal-verbs-can-could-1',
			form: 'affirmative',
			prompt: 'Я вмію плавати.',
			answer: 'I can swim.',
			traps: {
				swim: ['swims', 'swimming', 'swam'],
			},
		},
		{
			id: 'modal-verbs-can-could-2',
			form: 'question',
			prompt: 'Чи не могли б ви мені допомогти?',
			answer: 'Could you help me?',
			traps: {
				Could: ['Would', 'Should', 'Did'],
			},
		},
	],
})

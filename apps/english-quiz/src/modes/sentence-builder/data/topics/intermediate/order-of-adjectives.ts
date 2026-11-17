import { defineTopic } from '../../define-topic'

export const orderOfAdjectives = defineTopic({
	id: 'order-of-adjectives',
	level: 'intermediate',
	title: 'Order of adjectives',
	subtitle: 'Порядок прикметників',
	rule: 'Порядок: думка → розмір → вік → форма → колір → походження → матеріал.',
	sentences: [
		{
			id: 'order-of-adjectives-1',
			form: 'affirmative',
			prompt: 'У неї гарна маленька собака.',
			answer: 'She has a nice little dog.',
		},
		{
			id: 'order-of-adjectives-2',
			form: 'affirmative',
			prompt: 'Він купив стару червону машину.',
			answer: 'He bought an old red car.',
			traps: {
				an: ['a', 'the'],
			},
		},
	],
})

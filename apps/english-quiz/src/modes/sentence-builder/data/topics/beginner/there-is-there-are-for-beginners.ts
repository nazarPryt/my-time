import { defineTopic } from '../../define-topic'

export const thereIsThereAreForBeginners = defineTopic({
	id: 'there-is-there-are-for-beginners',
	level: 'beginner',
	title: 'There is / There are for beginners',
	subtitle: 'Конструкція There is / There are для початківців',
	rule: 'There is — коли предмет один, there are — коли їх кілька.',
	sentences: [
		{
			id: 'there-is-there-are-for-beginners-1',
			form: 'affirmative',
			prompt: 'На столі є яблуко.',
			answer: 'There is an apple on the table.',
			traps: {
				is: ['are', 'am', 'be'],
			},
		},
		{
			id: 'there-is-there-are-for-beginners-2',
			form: 'affirmative',
			prompt: 'У парку є діти.',
			answer: 'There are children in the park.',
			traps: {
				are: ['is', 'am', 'be'],
			},
		},
	],
})

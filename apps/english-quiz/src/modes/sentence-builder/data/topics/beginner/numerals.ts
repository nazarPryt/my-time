import { defineTopic } from '../../define-topic'

export const numerals = defineTopic({
	id: 'numerals',
	level: 'beginner',
	title: 'Numerals',
	subtitle: 'Числівники',
	rule: 'Кількісні числівники відповідають на питання «скільки?»: one, two, twenty-one.',
	sentences: [
		{
			id: 'numerals-1',
			form: 'affirmative',
			prompt: 'У мене два брати.',
			answer: 'I have two brothers.',
			traps: {
				two: ['second', 'twice', 'too'],
			},
		},
		{
			id: 'numerals-2',
			form: 'affirmative',
			prompt: 'Їй двадцять років.',
			answer: 'She is twenty years old.',
			traps: {
				twenty: ['twelve', 'twentieth'],
			},
		},
	],
})

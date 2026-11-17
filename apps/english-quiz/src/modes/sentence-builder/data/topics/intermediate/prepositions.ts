import { defineTopic } from '../../define-topic'

export const prepositions = defineTopic({
	id: 'prepositions',
	level: 'intermediate',
	title: 'Prepositions',
	subtitle: 'Прийменники',
	rule: 'in — всередині, on — на поверхні, at — у точці або місці події.',
	sentences: [
		{
			id: 'prepositions-1',
			form: 'affirmative',
			prompt: 'Ключі на столі.',
			answer: 'The keys are on the table.',
			traps: {
				on: ['in', 'at', 'under'],
			},
		},
		{
			id: 'prepositions-2',
			form: 'affirmative',
			prompt: 'Я народився в травні.',
			answer: 'I was born in May.',
			traps: {
				in: ['on', 'at', 'by'],
			},
		},
	],
})

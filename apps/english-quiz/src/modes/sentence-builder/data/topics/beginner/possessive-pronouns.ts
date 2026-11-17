import { defineTopic } from '../../define-topic'

export const possessivePronouns = defineTopic({
	id: 'possessive-pronouns',
	level: 'beginner',
	title: 'Possessive pronouns',
	subtitle: 'Присвійні займенники',
	rule: 'my, your, his, her, its, our, their — перед іменником; mine, yours, ours… — без нього.',
	sentences: [
		{
			id: 'possessive-pronouns-1',
			form: 'affirmative',
			prompt: 'Це моя сумка.',
			answer: 'This is my bag.',
			traps: {
				my: ['me', 'mine', 'I'],
			},
		},
		{
			id: 'possessive-pronouns-2',
			form: 'affirmative',
			prompt: 'Ця книжка твоя.',
			answer: 'This book is yours.',
			traps: {
				yours: ['your', 'you'],
			},
		},
	],
})

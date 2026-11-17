import { defineTopic } from '../../define-topic'

export const sequenceOfTenses = defineTopic({
	id: 'sequence-of-tenses',
	level: 'advanced',
	title: 'Sequence of tenses',
	subtitle: 'Узгодження часів',
	rule: 'Якщо головне речення в минулому, час підрядного теж зсувається в минуле: is → was.',
	sentences: [
		{
			id: 'sequence-of-tenses-1',
			form: 'affirmative',
			prompt: 'Він сказав, що втомився.',
			answer: 'He said he was tired.',
			traps: {
				was: ['is', 'be', 'been'],
			},
		},
		{
			id: 'sequence-of-tenses-2',
			form: 'affirmative',
			prompt: 'Я думав, що ти знаєш.',
			answer: 'I thought you knew.',
			traps: {
				knew: ['know', 'knows', 'knowed'],
			},
		},
	],
})

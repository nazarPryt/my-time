import { defineTopic } from '../../define-topic'

export const personalPronouns = defineTopic({
	id: 'personal-pronouns',
	level: 'beginner',
	title: 'Personal pronouns',
	subtitle: 'Особові займенники',
	rule: 'I, you, he, she, it, we, they — підмет; me, him, her, us, them — додаток.',
	sentences: [
		{
			id: 'personal-pronouns-1',
			form: 'affirmative',
			prompt: 'Вона мене знає.',
			answer: 'She knows me.',
			traps: {
				me: ['I', 'my', 'mine'],
			},
		},
		{
			id: 'personal-pronouns-2',
			form: 'affirmative',
			prompt: 'Ми бачили їх.',
			answer: 'We saw them.',
			traps: {
				them: ['they', 'their', 'theirs'],
			},
		},
	],
})

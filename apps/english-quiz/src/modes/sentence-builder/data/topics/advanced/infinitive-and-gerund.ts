import { defineTopic } from '../../define-topic'

export const infinitiveAndGerund = defineTopic({
	id: 'infinitive-and-gerund',
	level: 'advanced',
	title: 'Infinitive and Gerund',
	subtitle: 'Інфінітив і герундій',
	rule: 'Після одних дієслів іде інфінітив (want to go), після інших — герундій (enjoy going).',
	sentences: [
		{
			id: 'infinitive-and-gerund-1',
			form: 'affirmative',
			prompt: 'Я хочу піти.',
			answer: 'I want to go.',
			traps: {
				to: ['going', 'for', 'at'],
			},
		},
		{
			id: 'infinitive-and-gerund-2',
			form: 'affirmative',
			prompt: 'Їй подобається читати.',
			answer: 'She enjoys reading.',
			traps: {
				reading: ['read', 'reads', 'to'],
			},
		},
	],
})

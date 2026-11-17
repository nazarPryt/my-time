import { defineTopic } from '../../define-topic'

export const conditionalClauses = defineTopic({
	id: 'conditional-clauses',
	level: 'advanced',
	title: 'Conditional Clauses',
	subtitle: 'Умовні речення',
	rule: 'if + Present Simple → will (реальна умова); if + Past Simple → would (уявна умова).',
	sentences: [
		{
			id: 'conditional-clauses-1',
			form: 'affirmative',
			prompt: 'Якщо піде дощ, ми залишимося вдома.',
			answer: 'If it rains, we will stay at home.',
		},
		{
			id: 'conditional-clauses-2',
			form: 'affirmative',
			prompt: 'Якби я мав час, я б допоміг.',
			answer: 'If I had time, I would help.',
			traps: {
				would: ['will', 'had', 'did'],
			},
		},
	],
})

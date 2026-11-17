import { defineTopic } from '../../define-topic'

export const modalVerbsShallShould = defineTopic({
	id: 'modal-verbs-shall-should',
	level: 'advanced',
	title: 'Modal verbs (Shall/Should)',
	subtitle: 'Модальні дієслова shall/should',
	rule: 'shall — пропозиція (Shall we go?); should — порада (You should rest).',
	sentences: [
		{
			id: 'modal-verbs-shall-should-1',
			form: 'question',
			prompt: 'Може, підемо?',
			answer: 'Shall we go?',
		},
		{
			id: 'modal-verbs-shall-should-2',
			form: 'affirmative',
			prompt: 'Тобі слід відпочити.',
			answer: 'You should rest.',
			traps: {
				should: ['shall', 'would', 'did'],
			},
		},
	],
})

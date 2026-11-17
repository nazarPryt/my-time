import { defineTopic } from '../../define-topic'

export const modalVerbsMayMight = defineTopic({
	id: 'modal-verbs-may-might',
	level: 'intermediate',
	title: 'Modal verbs (May/Might)',
	subtitle: 'Модальні дієслова may/might',
	rule: 'may/might — можливість або дозвіл; might — менш імовірна можливість.',
	sentences: [
		{
			id: 'modal-verbs-may-might-1',
			form: 'question',
			prompt: 'Можна мені увійти?',
			answer: 'May I come in?',
		},
		{
			id: 'modal-verbs-may-might-2',
			form: 'affirmative',
			prompt: 'Можливо, сьогодні піде дощ.',
			answer: 'It might rain today.',
			traps: {
				rain: ['rains', 'raining', 'rained'],
			},
		},
	],
})

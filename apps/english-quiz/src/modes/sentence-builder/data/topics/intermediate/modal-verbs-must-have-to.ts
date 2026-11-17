import { defineTopic } from '../../define-topic'

export const modalVerbsMustHaveTo = defineTopic({
	id: 'modal-verbs-must-have-to',
	level: 'intermediate',
	title: 'Modal verbs (Must/Have to)',
	subtitle: 'Модальні дієслова must/have to',
	rule: "must — внутрішній обов'язок; have to — обов'язок через обставини.",
	sentences: [
		{
			id: 'modal-verbs-must-have-to-1',
			form: 'affirmative',
			prompt: 'Я мушу йти.',
			answer: 'I must go.',
			traps: {
				go: ['going', 'goes', 'went'],
			},
		},
		{
			id: 'modal-verbs-must-have-to-2',
			form: 'affirmative',
			prompt: 'Їй доводиться рано вставати.',
			answer: 'She has to get up early.',
			traps: {
				has: ['have', 'must', 'is'],
			},
		},
	],
})

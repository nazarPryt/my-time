import { defineTopic } from '../../define-topic'

export const whQuestions = defineTopic({
	id: 'wh-questions',
	level: 'intermediate',
	title: 'Wh-questions',
	subtitle: 'Спеціальні питання',
	rule: 'Спеціальні питання починаються з who, what, where, when, why або how.',
	sentences: [
		{
			id: 'wh-questions-1',
			form: 'question',
			prompt: 'Де ти живеш?',
			answer: 'Where do you live?',
			traps: {
				Where: ['What', 'When', 'Who'],
			},
		},
		{
			id: 'wh-questions-2',
			form: 'question',
			prompt: 'Чому вона плаче?',
			answer: 'Why is she crying?',
			traps: {
				Why: ['What', 'Who', 'Which'],
			},
		},
	],
})

import { defineTopic } from '../../define-topic'

export const generalQuestions = defineTopic({
	id: 'general-questions',
	level: 'beginner',
	title: 'General questions',
	subtitle: 'Загальні питання',
	rule: 'Загальні питання починаються з допоміжного дієслова й мають відповідь «так» або «ні».',
	sentences: [
		{
			id: 'general-questions-1',
			form: 'question',
			prompt: 'Ти любиш чай?',
			answer: 'Do you like tea?',
			traps: {
				Do: ['Does', 'Are', 'Is'],
			},
		},
		{
			id: 'general-questions-2',
			form: 'question',
			prompt: 'Вона вдома?',
			answer: 'Is she at home?',
			traps: {
				Is: ['Are', 'Does', 'Do'],
			},
		},
	],
})

import { defineTopic } from '../../define-topic'

export const participles = defineTopic({
	id: 'participles',
	level: 'advanced',
	title: 'Participles',
	subtitle: 'Дієприкметники',
	rule: 'Participle I (-ing) — активна дія; Participle II (третя форма) — пасивний результат.',
	sentences: [
		{
			id: 'participles-1',
			form: 'affirmative',
			prompt: 'Дівчинка, що сміється, — моя сестра.',
			answer: 'The laughing girl is my sister.',
			traps: {
				laughing: ['laughed', 'laughs', 'laugh'],
			},
		},
		{
			id: 'participles-2',
			form: 'affirmative',
			prompt: 'Розбите вікно потребує ремонту.',
			answer: 'The broken window needs repair.',
			traps: {
				broken: ['breaking', 'broke', 'break'],
			},
		},
	],
})

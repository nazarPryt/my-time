import { defineTopic } from '../../define-topic'

export const imperativeMood = defineTopic({
	id: 'imperative-mood',
	level: 'beginner',
	title: 'Imperative mood',
	subtitle: 'Наказовий спосіб',
	rule: "Наказовий спосіб — дієслово без підмета: Open the door. Заперечення — Don't.",
	sentences: [
		{
			id: 'imperative-mood-1',
			form: 'affirmative',
			prompt: 'Відчини вікно.',
			answer: 'Open the window.',
			traps: {
				Open: ['Opens', 'Opened', 'Opening'],
			},
		},
		{
			id: 'imperative-mood-2',
			form: 'negative',
			prompt: 'Не запізнюйся.',
			answer: "Don't be late.",
			traps: {
				"Don't": ["Doesn't", 'Not', 'No'],
			},
		},
	],
})

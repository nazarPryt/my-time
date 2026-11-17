import { defineTopic } from '../../define-topic'

export const futureSimple = defineTopic({
	id: 'future-simple',
	level: 'beginner',
	title: 'Future Simple',
	subtitle: 'Майбутній простий час',
	rule: "will + дієслово — обіцянки, прогнози, спонтанні рішення. Заперечення — won't.",
	sentences: [
		{
			id: 'future-simple-1',
			form: 'affirmative',
			prompt: 'Я допоможу тобі.',
			answer: 'I will help you.',
			traps: {
				help: ['helps', 'helped', 'helping'],
			},
		},
		{
			id: 'future-simple-2',
			form: 'negative',
			prompt: 'Вона не запізниться.',
			answer: "She won't be late.",
			traps: {
				"won't": ["don't", "isn't", "wasn't"],
			},
		},
	],
})

import { defineTopic } from '../../define-topic'

export const futurePerfect = defineTopic({
	id: 'future-perfect',
	level: 'intermediate',
	title: 'Future Perfect',
	subtitle: 'Майбутній доконаний час',
	rule: 'will have + третя форма — дія завершиться до певного моменту в майбутньому.',
	sentences: [
		{
			id: 'future-perfect-1',
			form: 'affirmative',
			prompt: "До п'ятниці я закінчу.",
			answer: 'I will have finished by Friday.',
		},
		{
			id: 'future-perfect-2',
			form: 'affirmative',
			prompt: 'Коли ми приїдемо, вони вже поїдуть.',
			answer: 'They will have left by the time we arrive.',
		},
	],
})

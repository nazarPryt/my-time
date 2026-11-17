import { defineTopic } from '../../define-topic'

export const phrasalVerbs = defineTopic({
	id: 'phrasal-verbs',
	level: 'intermediate',
	title: 'Phrasal verbs',
	subtitle: 'Фразові дієслова',
	rule: 'Фразове дієслово = дієслово + частка, і значення часто змінюється: give up — здаватися.',
	sentences: [
		{
			id: 'phrasal-verbs-1',
			form: 'negative',
			prompt: 'Не здавайся.',
			answer: "Don't give up.",
			traps: {
				up: ['in', 'on', 'off'],
			},
		},
		{
			id: 'phrasal-verbs-2',
			form: 'affirmative',
			prompt: 'Я шукаю свої ключі.',
			answer: 'I am looking for my keys.',
			traps: {
				for: ['at', 'after', 'up'],
			},
		},
	],
})
